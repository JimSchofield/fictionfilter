$('.js-textBubble').on("click", function() {
	$(this).next().removeClass('textBubble_inactive');
});

$('.textBubble').click(function() {
	$(this).addClass('textBubble_inactive');
});