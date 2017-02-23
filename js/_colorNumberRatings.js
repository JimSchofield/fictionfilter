$(".ratingsList").children().each(function(index) {
  var $this = $(this);
  var rating = $this.html();
  var ratingNumber = rating.match(/\d+$/);
  
  console.log(ratingNumber);
  
  //apply CSS according to ratingNumber
  $this.addClass("color" + Math.round(ratingNumber));
  
});