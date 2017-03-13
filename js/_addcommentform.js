$("#addReviewForm").submit(function(e) {
	if (checkAllDropdowns()) {
		return true;
	} else {
		if (!$(this).next().is('br')) {
			$(this).after("<br>Make sure to fill out every category with a number");
		}
		return false;
	}
});

function checkAllDropdowns() {
	var isFilled = true;
	$("select").each(function() {
		if ($(this).val() === "na") {
			isFilled = false;
			return false
		}
	});
	return isFilled;
}