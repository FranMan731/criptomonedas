$(function() {
    /* Compruebo que este logueado a su usario*/
    if(sessionStorage.getItem('token') === null) {
        swal({
            title: "Error",
            text: "Debes ingresar a su cuenta de usuario o registrarse.",
        }, function() {
            window.location = "https://app-criptomonedas.herokuapp.com/";
        });
    }

    /* Pasos de Jquery*/
    var html = "";
    var tipo = "";
    var cantidad = "";
    var valor = "";
    var billetera = "";
    var paypal = "";

    $("#ventaCriptomoneda").steps({
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
        onStepChanging: function (event, currentIndex, newIndex) {
            if(currentIndex == 0) {
                if($("#txtCantCrip").val() === '') {
                        $("#alertError").text("Debes agregar una cantidad de criptomonedas");
                        $("#alertError").css('display', '');

                        return false;
                    } else if($("#txtDinero").val() <= 0) {
                        $("#alertError").text("La cantidad de dinero debe ser mayor a 0.");
                        $("#alertError").css('display', '');

                        return false;
                    } else {
                        tipo = $('select[id=slcTipo]').val();
                        cantidad = $("#txtCantCrip").val();
                        valor = $("#txtDinero").val();

                        return true;
                    }
            }

            if(currentIndex == 1) {
                if($("#txtBilletera").val() === '') {
                    $("#alertErrorBilletera").text("Debe ingresar una dirección de billetera");
                    $("#alertErrorBilletera").css('display', '');

                    return false;
                } else if($("#txtPaypal").val() === '') {

                } else {
                    billetera = $("#txtBilletera").val();
                    paypal = $("#txtPaypal").val();

                    return true;
                }
            }
            return true;
        },
        onStepChanged: function (event, currentIndex, priorIndex) {
            if(currentIndex == 2) {
                html += '<br><span class="titulo-confirmar">Cantidad: </span><span class="valor-confirmar">'+cantidad+' '+tipo+'</span><br>'+
                        '<span class="titulo-confirmar">De la billetera: </span><span class="valor-confirmar">'+ billetera+'</span><br>'+
                        '<span class="titulo-confirmar">Recibiras: </span><span class="valor-confirmar">'+valor+' USD.</span><br>'+
                        '<span class="titulo-confirmar">A la cuenta(Paypal): </span><span class="valor-confirmar">'+ paypal+'</span><br>'; 
                $("#confirmarVenta").html(html);
            }
        },
        onFinished: function(event, currentIndex) {
            guardarVenta(tipo, cantidad, valor, billetera, paypal);
        }
    });

    // Creo una nueva venta.
    function guardarVenta(tipo, cantidad, valor, billetera, paypal) {
        var datos = {
            tipo: tipo,
            cantidad: cantidad,
            valor: valor,
            billetera: billetera,
            paypal: paypal
        };

        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "https://app-criptomonedas.herokuapp.com/api/v1/publicar",
            "method": "POST",
            "headers": {
                "Authorization": sessionStorage.getItem('token'),
                "Content-Type": "application/json"
            },
            "processData": false,
            "data": JSON.stringify(datos)
        }

        $.ajax(settings).done(function (response) {
            if(response.status) {
                swal({
                    title: "¡Éxito!",
                    text: "La venta se ha creado satisfactoriamente.",
                    type: "success"
                }, function() {
                        location.reload();
                });
            } else {
                swal({
                    title: "Error",
                    text: response.message,
                    type: "error"
                });
            }
        }).fail(function(response) {
            swal({
                title: "Error",
                text: response.message,
                type: "error"
            });
        });
    }
});