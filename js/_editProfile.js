var $inputFields = $("#readingNow, #favoriteGenres, #favoriteBooks")

$("#editProfileButton").click(function(event) {
	event.preventDefault();
	$inputFields.each(function() {
		//Loops through three spans
		var textValue;
		var $this = $(this);
		textValue = $this.text();
		$this.empty();
		$this.append("<input type='text' value='" + textValue + "' name='" + $(this).attr('id') + "' class='textInput inline' onClick='this.select()'>");

		$("#saveProfileButton").show();
		$("#cancelProfileEdit").show();

	});
	$(this).hide();
});

$("#cancelProfileEdit").on('click', function(event) {
	event.preventDefault();
	location.reload();
});


