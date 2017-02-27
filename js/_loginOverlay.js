$('#js-login').on('click', function() {
	$('.loginOverlay').removeClass('loginOverlay_hidden');
});

$('.loginOverlay').click(function() {
	$('.loginOverlay').addClass('loginOverlay_hidden');
})

$(".loginOverlay-container").click(function(e) {
   e.stopPropagation();
});