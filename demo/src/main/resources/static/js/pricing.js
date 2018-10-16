/* layer popup */
$(function() {
  $(".dim40 .btn_close").click(function(){$(".dim40").hide();});
	
  $(".dim40 .buttons button").click(function(){$(this).parent().parent().parent().parent().parent().hide();});
	
  $(".repricing").click(function(){$(".repricinglayer").show();return false;});
  $(".manual").click(function(){$(".manuallayer").show();return false;});
});