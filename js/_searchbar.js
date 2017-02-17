var $mainSearch = $("#js-mainSearch"),
	$searchIcon = $("#js-searchIcon");

$searchIcon.on("click", function() {
	console.log($searchIcon, "clicked");
	$mainSearch.toggleClass("searchBar_inactive");
})