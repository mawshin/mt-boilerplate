$( document ).ready(function() {

    // Added class for disabled <a> element
	$('body').on('click', 'a.is-disable', function(event) {
	    event.preventDefault();
	});

});