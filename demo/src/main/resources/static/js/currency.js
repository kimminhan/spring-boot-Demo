//Currency Conversion datepicket
$(function(){

var today=new Date();

	$(".cu").datepicker({
		showOn : "button",
		buttonImage : "/images/btn_diary.gif",
		buttonImageOnly : true,
		dateFormat : "ddMy",
		monthNamesShort: ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"],
		maxDate : 0
	}).datepicker("setDate", today.dateFormat('DDMY'));

});

//Currency Conversion AjaxCall
function schAjax(){
		var today= new Date();
		var rateDate = $('#RateDate').val().dateFormat('YYYYMMDD');
 		var searchData= new Object();
     		searchData.FromCurrency =  $("#sel_fromcurrcy").val();
 			searchData.ToCurrency =  $("#sel_tocurrcy").val();
 			searchData.Amount =  $("#Amount").val();
 			searchData.RateDate =  rateDate;
  		var searchDataToJsonStr = JSON.stringify(searchData);
	
  		
  		
  		
		if($("#Amount").val()==0 || $("#RateDate").val() ==0 || $("#FromCurrency").val()==0 || $("#ToCurrency").val()==0){
			alert("필수값을 입력해주세요.");
			return false;
		}
			if($("#sel_fromcurrcy").val()==$("#sel_tocurrcy").val()){
				alert("Currency From 과 To가 같습니다.");
				return false;
			}else{
	 		
	 		$.ajax({
	 			url: "/calculateCurrency.do",
	 			data : searchDataToJsonStr,
				async: false,
				type: "post",
				datatype: "json",
				contentType:"application/json",
				success: function(data){
						var currencyInfo ='';
						var successAndwarinings=data.Result.data.successAndWarningsAndCurrencyRQInfo[1];
						if(successAndwarinings.warning != null ){
							alert(successAndwarinings.warning[0].value);
							$.each(data,function(){
								currencyInfo += successAndwarinings.warning[0].value;
							});
						}else{
							$.each(data,function(){
								currencyInfo += successAndwarinings.amount+'    '+successAndwarinings.fromCurrency+'     '+
								'<i class="bl04"></i>' +successAndwarinings.toCurrency+  '</span>'
								;
							});
						}
						$('#rsData').html(currencyInfo);
					var currencyHtml = "";
					var roundUpToHtml="";
					var currencyRQInfo=data.Result.data.successAndWarningsAndCurrencyRQInfo[2];
					if(successAndwarinings.warning != null ){
						$('#rsDate').html(currencyHtml);
						roundUpToHtml += "";
						$('#roundUpto').html(roundUpToHtml);
					}else{
						$.each(data,function(){
							currencyHtml += '<td>'+$('#RateDate').val()+'</td>';
							currencyHtml += '<td>'+currencyRQInfo.exchangeRateDetail.rateOfExchange+'</td>';
							currencyHtml += '<td>'+currencyRQInfo.fareAmountTruncated+'</td>';
							currencyHtml += '<td>'+currencyRQInfo.fareAmount+'</td>';
							currencyHtml += '<td>'+currencyRQInfo.taxAmount+'</td>';
						});
							$('#rsDate').html(currencyHtml);
							roundUpToHtml += '<li>Fare - '+currencyRQInfo.exchangeRateDetail.internationalRounding.roundingMethod+' '+currencyRQInfo.exchangeRateDetail.internationalRounding.roundingUnit +'</li>'
							roundUpToHtml += '<li>Tax  - '+currencyRQInfo.exchangeRateDetail.internationalTaxRounding.roundingMethod+' '+currencyRQInfo.exchangeRateDetail.internationalTaxRounding.roundingUnit +'</li>'
							$('#roundUpto').html(roundUpToHtml);
					}
				}
			});
		}
	}
