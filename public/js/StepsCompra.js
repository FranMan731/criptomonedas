$(function() {
    var token = sessionStorage.getItem('token');

    var tipo = "";
    var cantidad = "";
    var precio = "";
    var usuario = "";
    var billetera = "";
    var cuenta_paypal = "";

    var id_publicacion = "";

    $("#compraCriptomoneda").steps({
        headerTag: "h3",
        bodyTag: "section",
        /* Templates */
        titleTemplate: '<span class="number">#index#</span> #title#',
        transitionEffect: "slideLeft",
        transitionEffectSpeed: 300,
        autoFocus: true,
        /*Labels*/
        labels: {
            cancel: "Cancelar",
            current: "Paso actual:",
            pagination: "Paginación",
            finish: "Finalizar",
            next: "Siguiente",
            previous: "Anterior",
            loading: "Cargando ..."
        },
        onStepChanging: function(event, currentIndex, newIndex) {
            if (currentIndex == 0) {
                var table = $("#tblCompras").DataTable();

                if (table.rows('.selected').any()) {
                    var data = table.rows({ selected: true }).data();

                    tipo = data[0].tipo;
                    cantidad = data[0].cantidad;
                    precio = data[0].valor;
                    usuario = data[0].usuario;
                    id_publicacion = data[0].id;

                    if (token === null) {
                        swal({
                            title: "Ingresar a cuenta",
                            message: "Debe ingresar a su cuenta para seguir con la compra.",
                            type: "error"
                        }, function() {
                            $("#mdlIngresar").modal('show');
                            return false;
                        });
                    } else {
                        return true;
                    }
                } else {
                    $("#alertErrorTabla").text("Debes seleccionar un item de ventas.");
                    $("#alertErrorTabla").css('display', '');

                    return false;
                }
            }

            if (currentIndex == 1) {
                billetera = $("#txtBilleteraCompra").val();
                cuenta_paypal = $("#txtPaypalCompra").val();

                if (billetera === "") {
                    $("#alertErrorCompra").text("Debe ingresar dirección de una billetera.");
                    $("#alertErrorCompra").css('display', '');

                    return false;
                }

                if (cuenta_paypal === "") {
                    $("#alertErrorCompra").text("Debe ingresar correo de paypal.");
                    $("#alertErrorCompra").css('display', '');

                    return false;
                }

                return true;
            }


        },
        onStepChanged: function(event, currentIndex, priorIndex) {
            if (currentIndex == 2) {
                var html = "";

                html += '<br><span class="titulo-confirmar">Cantidad: </span><span class="valor-confirmar">' + cantidad + ' ' + tipo + '</span><br>' +
                    '<span class="titulo-confirmar">Precio: </span><span class="valor-confirmar">' + precio + ' USD.</span><br>' +
                    '<span class="titulo-confirmar">Recibiras a la billetera: </span><span class="valor-confirmar">' + billetera + '</span><br>';
                $("#confirmarCompra").html(html);

                $('a[href$="finish"]').css({
                    'background': '#eee',
                    'cursor': 'no-drop'
                });

                compraMercadoPago();
                compraPaypal();
            }
        },
        onFinishing: function(event, currentIndex) {
            if (sessionStorage.getItem('token') === null) {
                swal({
                    title: 'Error',
                    text: "Debe ingresar a su cuenta o registrarse.",
                    type: 'error'
                }, function() {
                    $("#mdlIngresar").modal('show');
                    return false;
                });
            }


            /*crearVentaPaypal(venta);*/
        },
        onFinished: function(event, currentIndex) {
            alert("Finalizado");
        }
    });

    function compraMercadoPago() {
        var mercadopagoButton = "";
        
        var cripto = {
            "id": id_publicacion,
            "nombre": tipo,
            "cantidad": cantidad,
            "precio": precio
        };

        var settings = {
            "url": "https://app-criptomonedas.herokuapp.com/api/v1/pago/mp",
            "method": "POST",
            "headers": {
                "Authorization": token,
                "Content-Type": "application/json"
            },
            "data": JSON.stringify(cripto)
        }

        $.ajax(settings).done(function(response) {
            if(response.status) {
                mercadopagoButton += "<a class='btn btn-primary btn-mp' target='_blank' href='"+response.result+"'>Mercado Pago</a><br>";

                $("#mercadopago-button").html(mercadopagoButton);
            }
        });
    }

    function compraPaypal() {
        var subtotal = Number.parseFloat(precio);
        var tax = (subtotal * 0.2) / 100;

        var total = tax + subtotal;

        var datos = {
            "id_publicacion": id_publicacion,
            "paypal": cuenta_paypal,
            "billetera": billetera
        };

        var settings = {
            "url": "https://app-criptomonedas.herokuapp.com/api/v1/comprador/crear",
            "method": "POST",
            "headers": {
                "Authorization": token,
                "Content-Type": "application/json"
            },
            "data": JSON.stringify(datos)
        };

        paypal.Button.render({
            env: 'sandbox', // Or 'sandbox'
            client: {
                sandbox: 'AaqDw6kaXjhKLSI2MWqbzu_Oaedee3MbKa7ENj_Evem5WvInRAYI6aCs0atBU2APeb0D-tjApsxhWIWS',
                production: 'ARG3DOVVdUmB3G_DzfqL1VXjXZKnyrqpD0iLpWueMIZ2xMDyhgq-hPyUDbykva5X_LhSoBzncyxiPvVW'
            },
            commit: true, // Show a 'Pay Now' button

            payment: function(data, actions) {
                $.when(
                    $.ajax(settings).done(function(response) {
                        if (response.status) {
                            return { status: true }
                        } else {
                            return { status: false }
                        }
                    }).fail(function() {
                        swal({
                            title: "Ha ocurrido un error",
                            text: "Vuelve a intentarlo mas tarde..",
                            type: "error",
                        }, function() {
                            return { status: false };
                        });
                    })
                ).done(function(status) {
                    if (status) {
                        return actions.payment.create({
                            payment: {
                                intent: 'sale',
                                payer: {
                                    payment_method: 'paypal'
                                },
                                transactions: [{
                                    amount: {
                                        total: total,
                                        currency: 'USD',
                                        details: {
                                            subtotal: subtotal,
                                            tax: tax
                                        }
                                    },
                                    item_list: {
                                        items: [{
                                            quantity: '1',
                                            name: tipo,
                                            price: subtotal,
                                            currency: 'USD',
                                            description: 'La compra de ' + cantidad + ' ' + tipo + '.',
                                            tax: tax
                                        }]
                                    },
                                    description: 'La compra de ' + cantidad + ' ' + tipo + '.',
                                    custom: 'Criptomonedas Web'
                                }]
                            }
                        });
                    } else {
                        swal({
                            title: "Tarde..",
                            text: "Otro usuario ya lo ha comprado."
                        }, function() {
                            location.reload();
                        });
                    }
                });
            },

            onAuthorize: function(data, actions) {
                return actions.payment.execute().then(function(payment) {
                    swal({
                        title: "¡Éxito!",
                        text: "Se ha pagado con éxito",
                        type: "success"
                    }, function() {
                        location.reload();
                    });
                });
            },
            onCancel: function(data, actions) {
                var id = {
                    "id_publicacion": id_publicacion
                };

                var settingsCancel = {
                    "url": "https://app-criptomonedas.herokuapp.com/api/v1/comprador/cancelar",
                    "method": "DELETE",
                    "headers": {
                        "Authorization": token,
                        "Content-Type": "application/json"
                    },
                    "data": JSON.stringify(id)
                }

                $.ajax(settingsCancel).done(function(response) {
                    if (response.status) {
                        swal({
                            title: "Cancelado",
                            text: "Se ha cancelado el pago de la compra",
                            type: "error"
                        }, function() {
                            location.reload();
                        });
                    }
                });
            },

            onError: function(err) {
                var id = {
                    "id_publicacion": id_publicacion
                };

                var settingsCancel = {
                    "url": "https://app-criptomonedas.herokuapp.com/api/v1/comprador/cancelar",
                    "method": "DELETE",
                    "headers": {
                        "Authorization": token,
                        "Content-Type": "application/json"
                    },
                    "data": JSON.stringify(id)
                }

                $.ajax(settingsCancel).done(function(response) {
                    if (response.status) {
                        swal({
                            title: "Error",
                            text: "Hubo un error en el pago de la compra.",
                            type: "error"
                        }, function() {
                            location.reload();
                        });
                    }
                });
            }
        }, '#paypal-button');
    }
});