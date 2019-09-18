$(function() {
	var funcionCompra = {};


	(function(app) {
		app.prototype = new Compra();

		app.init = function() {
			app.prototype.getVentas();
    		app.bindings();
    	};

    	app.bindings = function() {
    		$(".wizard > .actions > ul > li > a").on('click', function(e) {
    			
    		});
    		$('#tblCompras tbody').on('click', 'tr', function () {
    			
		        

		    });
    	};

    	app.init();
	})(funcionCompra);
});