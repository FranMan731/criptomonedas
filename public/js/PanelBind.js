$(function() {
    var funcionPanel = {};
    

    if (sessionStorage.getItem('token') === null) {
        swal({
            title: "Error",
            text: "Debes ingresar a su cuenta de usuario o registrarse.",
            type: "error"
        }, function() {
            window.location = "https://app-criptomonedas.herokuapp.com/";
        });
    }

    (function(app) {
        app.prototype = new Panel();

        app.init = function() {
            //Ventas
            app.prototype.getVentasEnProceso();
            app.prototype.getVentas();

            //Compras
            app.prototype.getComprasEnProceso();
            app.prototype.getComprasExito();

            app.bindings();
        };

        app.bindings = function() {
            //Panel de Opciones
            /**
            *       VENTAS
            */
            // Click en el boton de Ventas
            $("#btnVenta").on('click', function() {
                $('#section-compra').hide();
                $('#section-venta').show();

                $("#btnCompra").removeClass('active');
                $(this).addClass('active');
            });

            //Click en los botones de Info de tipos de ventas.
            $("#btnInfoProceso").on('click', function() {
                $('#btnInfoProceso').popover('show')
            });
            $("#btnInfoEspera").on('click', function() {
                $('#btnInfoEspera').popover('show')
            });

            //Click en Transferir Bitcoin de Venta
            $("#tblVentaEnProceso tbody").on('click', '#btnTransferir', function() {
                
            });

            //Click en eliminar Venta en espera
            $("#tblVentaEnEspera tbody").on('click', '#btnEliminarVentaEnEspera', function() {
                var id = $(this).data('id');

                swal({
                    title: "¿Estas seguro?",
                    text: "Una vez eliminado, no hay vuelta atrás.",
                    type: "warning",
                    showCancelButton: true,
                    cancelButtonText: "Cancelar",
                    confirmButtonText: "Si, ¡eliminalo!",
                    closeOnConfirm: false
                }, function() {
                    app.prototype.eliminarVentaEnEspera(id);
                });
            });

            /**
            *       COMPRAS
            */
            //Click en el boton de Compras
            $("#btnCompra").on('click', function() {
                $('#section-venta').hide();
                $('#section-compra').show();

                $("#btnVenta").removeClass('active');
                $(this).addClass('active');
            });

            //Click en los botones de Info de tipos de ventas.
            $("#btnInfoCompraExito").on('click', function() {
                $('#btnInfoCompraExito').popover('show')
            });
            $("#btnInfoCompraEnProceso").on('click', function() {
                $('#btnInfoCompraEnProceso').popover('show')
            });

            //Click en cancelar la compra
            $("#tblCompraEnProceso tbody").on('click', '#btnEliminarCompraEnProceso', function() {
                var id = $(this).data('id_publicacion');

                swal({
                    title: "¿Estas seguro?",
                    text: "Una vez cancelado, no hay vuelta atrás.",
                    type: "warning",
                    showCancelButton: true,
                    cancelButtonText: "Cancelar",
                    confirmButtonText: "Si, ¡cancelalo!",
                    closeOnConfirm: false
                }, function() {
                    app.prototype.cancelarCompra(id);
                });
            });
        };

        app.init();
    })(funcionPanel);
});