function Panel() {
    var _token = sessionStorage.getItem('token');

    /**
     *   -----------------------------------------
     *              FUNCIONES DE VENTAS
     *   -----------------------------------------
     **/
    this.getVentas = function() {
        var settings = {
            "url": "https://app-criptomonedas.herokuapp.com/api/v1/usuario/publicacion",
            "method": "GET",
            "headers": {
                "Authorization": _token
            }
        }

        $.ajax(settings).done(function(response) {
            if (response.status) {
                mostrarVentas(response.publicaciones);
            }
        });
    }

    this.getVentasEnProceso = function() {
        var settings = {
            "url": "https://app-criptomonedas.herokuapp.com/api/v1/usuario/publicacion/en-proceso",
            "method": "GET",
            "headers": {
                "Authorization": _token
            }
        }

        $.ajax(settings).done(function(response) {
            if (response.status) {
                mostrarVentasEnProceso(response.publicaciones);
            }
        });
    }

    function mostrarVentas(publicaciones) {
        var html = "";
        var fecha = "";


        $.each(publicaciones, function(key, publicacion) {

            fecha = calcularTiempo(publicacion.fecha);

            html += "<tr>" +
                "<td>" + publicacion.tipo + "</td>" +
                "<td>" + publicacion.cantidad + "</td>" +
                "<td>" + publicacion.valor + " USD</td>" +
                "<td>" + fecha + "</td>" +
                "<td>" +
                " <button id='btnEliminarVentaEnEspera' data-id='" + publicacion._id + "' type='button' class='btn btn-danger btn-fila' title='Eliminar'><i class='fa fa-ban' aria-hidden='true'></i></button>" +
                "</td>" +
                "</tr>";
        });

        $("#tbodyEnEspera").html(html);
    }

    function mostrarVentasEnProceso(publicaciones) {
        var html = "";
        var fecha = "";

        $.each(publicaciones, function(key, publicacion) {
            fecha = calcularTiempo(publicacion.fecha);

            html += "<tr>" +
                "<td>" + publicacion.tipo + "</td>" +
                "<td>" + publicacion.cantidad + "</td>" +
                "<td>" + publicacion.valor + " USD</td>" +
                "<td>" + fecha + "</td>" +
                "<td>" +
                "<button id='btnTransferir' data-id='" + publicacion._id + "' type='button' class='btn btn-success btn-fila' title='Transferir'><i class='fa fa-location-arrow' aria-hidden='true'></i></button> " +
                " <button id='btnEliminarVentaEnProceso' data-id='" + publicacion._id + "' type='button' class='btn btn-danger btn-fila' title='Cancelar'><i class='fa fa-times' aria-hidden='true'></i></button>" +
                "</td>" +
                "</tr>";
        });


        $("#tbodyEnProceso").html(html);
    }

    this.eliminarVentaEnEspera = function(id) {
        var settings = {
            "url": "https://app-criptomonedas.herokuapp.com/api/v1/publicacion/" + id,
            "method": "DELETE",
            "headers": {
                "Authorization": _token
            }
        }

        $.ajax(settings).done(function(response) {
            if (response.status) {
                swal({
                    title: "Eliminado",
                    text: response.message,
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
        });
    }

    /**
     *   -----------------------------------------
     *              FUNCIONES DE COMPRAS
     *   -----------------------------------------
     **/
    this.getComprasEnProceso = function() {
        var settings = {
            "url": "https://app-criptomonedas.herokuapp.com/api/v1/comprador/compras/en-proceso",
            "method": "GET",
            "headers": {
                "Authorization": _token
            }
        }

        $.ajax(settings).done(function(response) {
            if (response.status) {
                mostrarComprasEnProceso(response.publicaciones);
            }
        });
    }

    this.getComprasExito = function() {

    }

    function mostrarComprasEnProceso(publicaciones) {
        var html = "";
        var fecha = "";

        $.each(publicaciones, function(key, publicacion) {
            fecha = calcularTiempo(publicacion.fecha);

            html += "<tr>" +
                "<td>" + publicacion.id_publicacion.tipo + "</td>" +
                "<td>" + publicacion.id_publicacion.cantidad + "</td>" +
                "<td>" + publicacion.id_publicacion.valor + " USD</td>" +
                "<td>" + fecha + "</td>" +
                "<td>" +
                "<button id='btnEliminarCompraEnProceso' data-id_publicacion='"+publicacion.id_publicacion._id+"' data-id='" + publicacion._id + "' type='button' class='btn btn-danger btn-fila' title='Cancelar'><i class='fa fa-times' aria-hidden='true'></i></button>" +
                "</td>" +
                "</tr>";
        });


        $("#tbodyCompraEnProceso").html(html);
    }

    function mostrarComprasExito() {

    }

    this.cancelarCompra = function(id) {
        var data = {
            "id_publicacion": id
        };

        console.log(data);

        var settings = {
            "url": "https://app-criptomonedas.herokuapp.com/api/v1/comprador/cancelar",
            "method": "DELETE",
            "headers": {
                "Authorization": _token,
                "Content-Type": "application/json"
            },
            "data": JSON.stringify(data)
        }

        $.ajax(settings).done(function(response) {
            if (response.status) {
                swal({
                    title: "Cancelado",
                    text: response.message,
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
        });
    }
    /**
     *   -----------------------------------------
     *              FUNCIONES GENERALES
     *   -----------------------------------------
     */
    function calcularTiempo(dato) {
        var minutos = 1000 * 60;
        var dia = 60 * 24;

        var d = new Date();
        var hoy = d.getTime();

        var fecha = Date.parse(dato);

        var result = hoy - fecha;

        var diferencia = Math.round(result / minutos);

        var respuesta = "";

        if (diferencia < 60) {
            respuesta = "Hace " + diferencia + " min";

        } else if (diferencia >= 60 && diferencia < dia) {
            diferencia = Math.round(diferencia / 60);
            if (diferencia > 1) {
                respuesta = "Hace " + diferencia + " horas";
            } else {
                respuesta = "Hace " + diferencia + " hora";
            }
        } else if (diferencia >= dia) {
            diferencia = Math.round(diferencia / dia);
            if (diferencia > 1) {
                respuesta = "Hace " + diferencia + " días";
            } else {
                respuesta = "Hace " + diferencia + " día";
            }
        } else {
            respuesta = "No definido";
        }

        return respuesta;
    }
}