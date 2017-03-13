
// RETURN FORMATTED DATE
function returnFormattedDate(mongooseDate) {
	var date = new Date(mongooseDate);
	var d = date.getDate();
	var m = date.getMonth()+1;
	var y = date.getFullYear();
	var monthNames = ["January", "February", "March", "April", "May", "June",
		  "July", "August", "September", "October", "November", "December"
	];
	return monthNames[m] + " " + d + ", " + y;
}

// takes user comment array and returns the average rate object for bookmodel
function averageUserComments(userCommentArray) {
	var averageRatings = {
		substances: null,
		sex: null,
		violence: null,
		language: null,
		abuse: null,
		hate: null,
		immorality: null,
		occult: null,
	}
	var numberOfComments = userCommentArray.length;

	for (category in averageRatings) {
		var catTotal = null;
		for (var i = 0; i < numberOfComments; i++) {
			catTotal += userCommentArray[i].ratings[category].rating
		}
		var catAverage = catTotal / numberOfComments;
		averageRatings[category] = catAverage;
	}

	return averageRatings
}


module.exports.returnFormattedDate = returnFormattedDate;
module.exports.averageUserComments = averageUserComments;