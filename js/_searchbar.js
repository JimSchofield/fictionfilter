var $mainSearch = $("#js-mainSearch"),
	$searchIcon = $("#js-searchIcon");

$searchIcon.on("click", function() {
	$mainSearch.toggleClass("searchBar_inactive");
})

$mainSearch.focusout(function() {
	console.log("blurred");
	$mainSearch.toggleClass("searchBar_inactive");
});