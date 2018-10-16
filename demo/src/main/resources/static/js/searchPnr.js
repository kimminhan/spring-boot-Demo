$(document).ready(function() {
	
	$("#flightDate_pax").datepicker({
		showOn : "button",
		buttonImage : "/images/btn_diary.gif",
		buttonImageOnly : true,
		dateFormat : "ddMy",
		maxDate : "+1y",
		monthNamesShort: ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"],
		onSelect: function(dateText, inst){
			$("#flightDate_pax").css("color","#444");
		}
	});

	$("#flightDate_ml").datepicker({
		showOn : "button",
		buttonImage : "/images/btn_diary.gif",
		buttonImageOnly : true,
		dateFormat : "ddMy",
		maxDate : "+1y",
		monthNamesShort: ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"],
		onSelect: function(dateText, inst){
			$("#flightDate_ml").css("color","#444");
		}
	});
	
	var type = $('input[type=radio][name=target]:checked').val();
    if ( type == 'PNR' ) {
        $('#divPnr').show();
        $('#divPax').hide();
        $('#divMl').hide();
        $('#pnrlist_view_pax').hide();
        $('#pnrlist_view_ml').hide();
    } else if ( type == 'PAX' ) {
        $('#divPnr').hide();
        $('#divPax').show();
        $('#divMl').hide();
        $('#pnrlist_view_pax').show();
        $('#pnrlist_view_ml').hide();
    } else if ( type == 'ML' ) {
        $('#divPnr').hide();
        $('#divPax').hide();
        $('#divMl').show();
        $('#pnrlist_view_pax').hide();
        $('#pnrlist_view_ml').show();
    }
});

$(function(){
	
    $('input[type=radio][name=target]').change(function(){
        if ( $(this).val() == 'PNR' ) {
            $('#divPnr').show();
            $('#divPax').hide();
            $('#divMl').hide();
            $('#pnrlist_view_pax').hide();
            $('#pnrlist_view_ml').hide();
        } else if ( $(this).val() == 'PAX' ) {
            $('#divPnr').hide();
            $('#divPax').show();
            $('#divMl').hide();
            $('#pnrlist_view_pax').show();
            $('#pnrlist_view_ml').hide();
        } else if ( $(this).val() == 'ML' ) {
            $('#divPnr').hide();
            $('#divPax').hide();
            $('#divMl').show();
            $('#pnrlist_view_pax').hide();
            $('#pnrlist_view_ml').show();
        }
    });

});

function searchPnr(){
    if($('input[type=radio][name=target]:checked').val() == "PNR") {
	    if($("#pnr").val() == ""){
	        alert("PNR를 입력해주세요.");
	        return;
	    }else{          
	    	linkPnr($("#pnr").val());    
	    }
    } else if($('input[type=radio][name=target]:checked').val() == "PAX") {
    	searchPnrFlightPassenger();
    } else if($('input[type=radio][name=target]:checked').val() == "ML") {
    	searchPnrML();
    }
}

function searchPnrFlightPassenger() {

	if ($("#name").val() == "") {
		alert("성 혹은 그룹명을 입력해주세요.");
		return;
	}

	if ($("#flightNo_pax").val() == "") {
		alert("편명을 입력해주세요.");
		return;
	}

	if ($("#flightDate_pax").val() == "") {
		alert("출발날짜를 입력해주세요.");
		return;
	}else if(!(/^[0-9]{2}[A-Za-z/]{3}[0-9]{2}$/).test($("#flightDate_pax").val())) {
		alert("Flight Date의 날짜형식이 틀립니다.");
	    return;        			
	}

	ajaxCall("/searchPNR.do" // call url
	, JSON.stringify({ 
		"type" : "PAX",
		"name" : $("#name").val(),
		"flightNo" : $("#flightNo_pax").val(),
		"flightDate" : chDate($("#flightDate_pax").val())
	}) // ajax 호출값
	, function(data) { // success시 callBack함수

		console.log(data);
		if(data && data.Result && data.Result.code == "0000") {
			var pnr = data.Result.data.pnr;
			if (pnr != null) {
				linkPnr(pnr);
				return;
			}
	
			var flightInfo = data.Result.data.flightInfo;
			var errorMsg = data.Result.data.errorMsg;
			var pnrSearchInfoList = data.Result.data.pnrSearchInfoList;
	
			if (errorMsg != null) {
				alert(errorMsg + "\n조회된 데이터가 없습니다.");
				$("#pnrList").html("");
				$("#flightInfo").html("");
				return;
			}
	
			$("#pnrlist_view_pax").show();
			
			$("#flightInfo_pax").html(flightInfo);
	
			var pnrList = "";
			pnrSearchInfoList.forEach(function(value, index, array) {
	
				pnrList += "<tr>" + "<td>" + array[index].no.replace(/(^0+)/, "")
						+ "</td><td>" // No
						+ array[index].name + "</td><td>" // Name
						+ "<a href='javascript:void(0)' onClick=linkPnr('" + array[index].pnr
						+ "')>" + array[index].pnr + "</a></td><td>" // PNR
						+ array[index].seatClass + "</td><td>" // Class
						+ array[index].statusCode + "</td><td>" // Status Code
						+ array[index].office + "</td><td>" // Office
						+ array[index].creationDate + "</td>" // Creation Date
						+ "</tr>";
	
			});
			$("#pnrList").html(pnrList);
		} else {
			$("#noticeText").text("");
			if(data && data.Result && data.Result.message) {
				$("#noticeText").text(data.Result.message);
			} else {
				$("#noticeText").text("error!");
			}
			$(".noticelayer").show();
		}
	}, true // 로딩바 사용여부
	);

}

function linkPnr(pnr) {

	location.href = "/pnr.do?pnr=" + pnr;

}


function searchPnrML() {

	if ($("#flightNo_ml").val() == "") {
		alert("편명을 입력해주세요.");
		return;
	}

	if ($("#flightDate_ml").val() == "") {
		alert("출발날짜를 입력해주세요.");
		return;
	}else if(!(/^[0-9]{2}[A-Za-z/]{3}[0-9]{2}$/).test($("#flightDate_ml").val())) {
		alert("Flight Date의 날짜형식이 틀립니다.");
	    return;        			
	}
	
    var flightDate = $("#flightDate_ml").val().substring(0,5);
			
	if ($("#option1").val() == "ticket") {

		$("#display1").show();
		$("#display2").hide();
		$("#office").val("");
		$("#searchNum").val("");

	} else if ($("#option1").val() == "group") {

		$("#display1").hide();
		$("#display2").show();
		$("#office").val("");
		$("#searchNum").val("");

	} else if ($("#option1").val() == "status") {

		$("#display1").hide();
		$("#display2").show();
		$("#office").val("");
		$("#searchNum").val("");

	} else if ($("#option1").val() == "office") {

		if ($("#office").val() == "") {
			alert("Office를 입력해주세요.");
			return;
		}

		$("#display1").hide();
		$("#display2").show();
		$("#searchNum").val("");

	} else if ($("#option1").val() == "lb") {

		if ($("#searchNum").val() == "") {
			alert("조회할 숫자를 입력해주세요.");
			return;
		}

		$("#display1").hide();
		$("#display2").show();
		$("#office").val("");

	}

	ajaxCall("/searchPNR.do" // call url
	, JSON.stringify({
		"type" : "ML",
		"flightNo" : $("#flightNo_ml").val(),
		"flightDate" : flightDate,
		"option1" : $("#option1").val(),
		"option2" : $("#option2").val(),
		"option3" : $("#option3").val(),
		"option4" : $("#option4").val(),
		"office" : $("#office").val(),
		"searchNum" : $("#searchNum").val()

	}) // ajax 호출값
	, function(data) { // success시 callBack함수

		console.log(data);		

		if(data && data.Result && data.Result.code == "0000") {

			var flightInfo = data.Result.data.flightInfo;
			var totalCnt = data.Result.data.totalCnt;
			var pnrSearchInfoList = data.Result.data.pnrSearchInfoList;
	
	
			$("#flightInfo").html(flightInfo);
	
			if (totalCnt > 0) {
				$("#totalCnt").html("Total " + totalCnt);
			} else {
				$("#totalCnt").html("");
			}
	
			var pnrList = "";
			pnrSearchInfoList.forEach(function(value, index, array) {
	
				if ($("#option1").val() == "ticket") {
	
					pnrList += "<tr>" + "<td>"
							+ array[index].no.replace(/(^0+)/, "") + "</td><td>" // No
							+ array[index].name + "</td><td>" // Name
							+ "<a href='javascript:void(0)' onClick=linkPnr('" + array[index].pnr
							+ "')>" + array[index].pnr + "</a></td><td>" // PNR
							+ array[index].seatClass + "</td><td>" // Class
							+ array[index].statusCode + "</td><td>" // Status Code
							+ "<a href='javascript:void(0)' onClick=linkTicket('"
							+ array[index].ticketNumber + "')>"
							+ (array[index].infantInd != '' ? 'I/' : '') + array[index].ticketNumber + "</a></td><td>" // Ticket
																			// Number
							+ array[index].status + "</td>" // Status
							+ "</tr>";
				} else {
	
					pnrList += "<tr>" + "<td>"
							+ array[index].no.replace(/(^0+)/, "") + "</td><td>" // No
							+ array[index].name + "</td><td>" // Name
							+ "<a href='javascript:void(0)' onClick=linkPnr('" + array[index].pnr
							+ "')>" + array[index].pnr + "</a></td><td>" // PNR
							+ array[index].seatClass + "</td><td>" // Class
							+ array[index].statusCode + "</td><td>" // Status Code
							+ array[index].office + "</td><td>" // Office
							+ array[index].creationDate + "</td><td>" // Creation
																		// Date
							+ array[index].indicator + "</td>" // Indicator
							+ "</tr>";
	
				}
	
			});
	
			if ($("#option1").val() == "ticket") {
				$("#pnrList1").html(pnrList);
			} else {
				$("#pnrList2").html(pnrList);
			}
		} else {
			$("#noticeText").text("");
			if(data && data.Result && data.Result.message) {
				$("#noticeText").text(data.Result.message);
			} else {
				$("#noticeText").text("error!");
			}
			$(".noticelayer").show();
		}
	}, true // 로딩바 사용여부
	);

}

function linkPnr(pnr) {

	location.href = "/pnr.do?pnr=" + pnr;

}

function linkTicket(ticket) {

	location.href = "/ticketDetails.do?val=" + ticket;

}