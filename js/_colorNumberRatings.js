
$(".ratingsList-cat").each(function(index) {
  var $this = $(this);
  var rating = $this.text();
  var ratingNumber = parseFloat(rating.match(/[\d\.]+/)); //extract decimal number from value printed
   
  //apply CSS according to ratingNumber
  $this.addClass("color" + Math.round(ratingNumber));
  
});