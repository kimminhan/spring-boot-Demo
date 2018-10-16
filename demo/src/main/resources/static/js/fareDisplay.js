/***********************************************************************************
 * PROJECT      : JRDT
 * PROGRAM ID   : fareDisplay.js
 * PROGRAM NAME : 
 * DESCRIPTION  : Fare Display 관련 스크립트
 * AUTHOR       : 유영민 차장
 * CREATED DATE : 2018.06.28.
 * HISTORY
 * =================================================================================
 *     DATE     NAME   DESCRIPTION
 * ---------------------------------------------------------------------------------
 * 
 ***********************************************************************************/
var airportTarget = "";

$(function(){
	$.each(officeList, function(index, item){
		var sHtml = "<option value=\"" + item.officeLU + "\">" + item.officeName + " (" + item.officeCode + ")</option>";
		$("#selOfficeFd").append(sHtml);
	});
	
	/*
	 * 'From', 'To', 'Class' 필드 키 입력 시 처리
	 */
	$("#txtDepStnFd, #txtArrStnFd, #txtClass1Fd, #txtClass2Fd, #txtClass3Fd, #txtClass4Fd, #txtClass5Fd").keyup(function(e){
		if (e.keyCode != 9 && e.keyCode != 16) { // NOT Tab, Shift KEY
			$(this).val($(this).val().replace(/[^(a-zA-Z)]/g, "")); // 영문자만
			$(this).val($(this).val().toUpperCase()); // 대문자로 변환
		}
	});
	
	/*
	 * Airport Search
	 */
	$(".CitySearchBtn").click(function(){
		airportTarget = $(this).attr('id');
		if ( $('#airportList').text().trim() == "" ) {
			searchAirport();
		} else{
			$('.codelayer').css("display",'block');
		}
	});
	
	/*
	 * Airport 타입 선택 이벤트 (한글, 영문)
	 */
	$('input[name=airportType]').click(function(){
		$('.airportNm').hide();
		$('.' +$(this).val()+ 'AirportNm').show();
	});

	/*
     * 'Date' 필드 키 입력 시 처리
     */
    $("#txtSegDateFd, #txtTicketingDateFd").keyup(function(e){
    	if (e.keyCode != 9 && e.keyCode != 16) { // NOT Tab, Shift KEY
    		$(this).val($(this).val().replace(/[^(0-9a-zA-Z)]/g, "")); // 숫자+영문자만
    		$(this).val($(this).val().toUpperCase()); // 대문자로 변환
    	}
    });

	/*
	 * 'Date', 'Ticketing Date' 필드 datepicker 적용
	 */
	$("#txtSegDateFd, #txtTicketingDateFd").datepicker({
		showOn: "button",
		buttonImage: "/images/btn_diary.gif",
		buttonImageOnly: true,
		dateFormat : "ddMy",
		monthNamesShort: ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"]
	});
	
	/*
	 * 'Date', 'Ticketing Date' 필드 오늘 날짜 지정
	 */
	$("#txtSegDateFd").val(new Date().dateFormat("DDMMMYY"));
	
	/*
	 * 'From', 'To', 'Date', 'Ticketing Date', 'Class' 필드 Enter 키 입력 시 처리
	 */
	$("#txtDepStnFd, #txtArrStnFd, #txtSegDateFd, #txtTicketingDateFd, #txtClass1Fd, #txtClass2Fd, #txtClass3Fd, #txtClass4Fd, #txtClass5Fd").keyup(function(e){
		if (e.keyCode == 13) {
			$("#btnSearchFd").trigger("click"); // click 이벤트 발생
		}
	});

	/*
	 * Fare Display 'Search' 버튼 클릭 시 처리
	 */
	$("#btnSearchFd").click(function(){
		
		var index = $("#selOfficeFd option").index($("#selOfficeFd option:selected"));
		var sSegType = $(":radio[name=rdoTripFd]:checked").val();
		var sDepStn = $("#txtDepStnFd").val();
		var sArrStn = $("#txtArrStnFd").val();
		var sDepDate = $("#txtSegDateFd").val();
		var sIssueDate = $("#txtTicketingDateFd").val();
		var sPaxType = $("#selPaxTypeFd option:selected").val();
		var sCurrencyConversionCode = $("#selCurrencyConversionCodeFd option:selected").val();
		var sDcCode = $("#txtDcCodeFd").val();
		var sBookingClass = "";
		if ($("#txtClass1Fd").val() != "") {
			sBookingClass += $("#txtClass1Fd").val() + ",";
		}
		if ($("#txtClass2Fd").val() != "") {
			sBookingClass += $("#txtClass2Fd").val() + ",";
		}
		if ($("#txtClass3Fd").val() != "") {
			sBookingClass += $("#txtClass3Fd").val() + ",";
		}
		if ($("#txtClass4Fd").val() != "") {
			sBookingClass += $("#txtClass4Fd").val() + ",";
		}
		if ($("#txtClass5Fd").val() != "") {
			sBookingClass += $("#txtClass5Fd").val() + ",";
		}
		if (sBookingClass.length > 0) {
			sBookingClass = sBookingClass.substring(0, sBookingClass.lastIndexOf(","));
		}
		
		if (sDepStn == "") {
			alert("출발지를 입력하세요.");
			$("#txtDepStnFd").focus();
			return;
		}
		
		if (sArrStn == "") {
			alert("도착지를 입력하세요.");
			$("#txtArrStnFd").focus();
			return;
		}
		
		if (sDepDate == "") {
			alert("날짜를 입력하세요.");
			$("#txtSegDateFd").focus();
			return;
		}

		if (isValidDateEn(sDepDate) == false) {
			$("#txtSegDateFd").focus();
			return;
		}
		
		if (sIssueDate != "") {
			if (isValidDateEn(sIssueDate) == false) {
				$("#txtTicketingDateFd").focus();
				return;
			}
			sIssueDate = chDate(sIssueDate);
		}

		$("#liNuc").html("&nbsp;"); // 초기화

		var sRowsHtml = "";
		
		sRowsHtml += "<tr>";
		sRowsHtml += "  <th>Line</th>";
		sRowsHtml += "  <th>Fare Basis</th>";
		if (sSegType == "OW") {
			sRowsHtml += "  <th>One Way</th>";
		} else if (sSegType == "RT") {
			sRowsHtml += "  <th>Round Trip</th>";
		} else if (sSegType == "HR") {
			sRowsHtml += "  <th>Half RT</th>";
		}
		sRowsHtml += "  <th>Class</th>";
		sRowsHtml += "  <th>Min/Max Stay</th>";
		sRowsHtml += "</tr>";

		$("#tbdFd").html(sRowsHtml); // 초기화

		var param = new Object();
		param.officeInfo = officeList[index];
		param.segType = sSegType;
		param.depStn = sDepStn;
		param.arrStn = sArrStn;
		param.depDate = chDate(sDepDate);
		param.issueDate = sIssueDate;
		param.bookingClass = sBookingClass;
		param.paxType = sPaxType;
		param.dcCode = sDcCode;
		param.currencyConversionCode = sCurrencyConversionCode;
		
		var url              = "/searchFare.do";
		var callData         = JSON.stringify(param);
		var callBack         = searchFareCb;
		var roading          = true;
		var isAsync          = true;
		var errorCallBack    = commonNotice;
		var completeCallBack = null;
		var subData          = null;

		ajaxCall(url, callData, callBack, roading, isAsync, errorCallBack, completeCallBack, subData);
	});
	

	$('.dcSearch').click(function() {
		var sPaxType= $("#selPaxTypeFd option:selected").val();
		var target = $(this).attr('target');
		//소아는 DCCODE 끝자리 'C'로 구분되나, 성인은 'C' or 'CH10'이 아닌 DCCODE로 구분해야함
		if (sPaxType == 'CNN') {
			$('#tbdDcCodeFd tr').hide();
			$('#tbdDcCodeFd tr[dcCode=CH10], #tbdDcCodeFd tr[dcType=C]').show();
		} else if (sPaxType == 'ADT'){
			$('#tbdDcCodeFd tr').show();
			$('#tbdDcCodeFd tr[dcType=C]').hide();
			$('#tbdDcCodeFd tr[dcCode=CH10]').hide();
		} else {
			$('#tbdDcCodeFd tr').show();
		}
		$(".discountlayer").show().attr('target', target);
	});
});

/*
 * 공항검색
 */
function searchAirport() {
	ajaxCall(
		"/searchAirportCode.do", 
		JSON.stringify({ NationCode: ""}), 
		function(data){
			if (data.Result.code == '0000') {
				var airportHtml = '';
				
				$.each(data.Result.data, function(index, airportData){
					airportHtml += '<tr><td><span class="korAirportNm airportNm">'+airportData.AIRPORTNAMEKR+'</span><span class="engAirportNm airportNm" style="display:none;">'+airportData.AIRPORTNAMEEN+'</span></td>';
					airportHtml += '<td><a href="javascript:selectAirport(\''+airportData.AIRPORTCODE+'\', \''+airportData.NATIONCODE.trim()+'\');">'+airportData.AIRPORTCODE+'</a></td>';
					airportHtml += '<td>'+airportData.NATIONCODE+'</td></tr>';
				});
				
				$('#airportList').html(airportHtml);
				$('.codelayer').css("display",'block');
			}
		}
	);
}

/*
 * 공항 선택시 검색조건에 입력
 */
function selectAirport(airportCode, nationCode) {
	$('#txt' + airportTarget).val(airportCode);
	$('#txt' + airportTarget).attr('nationCode', nationCode);
	$('.codelayer').css("display",'none');
}

/*
 * Fare Display Search 데이터로 rows 를 생성 (Callback 함수)
 */
function searchFareCb(data) {
	if (data.Result.code == "0000") {
		var rs = data.Result.data;
		var nucCurrency = rs.nucCurrency;
		var nucRate = rs.nucRate;
		var roundingMethod = rs.roundingMethod;
		var roundingUnit = rs.roundingUnit;
		var fdList = rs.fareDisplayInfoList;
		
		var str = "1 NUC = " + nucRate + " " + nucCurrency + " " + roundingMethod + " " + roundingUnit + " " + nucCurrency;
		$("#liNuc").html(str);
		
		var sRowsHtml = "";

		if (fdList.length > 0) {
			$.each(fdList, function(index, item){
				var fareText = addComma(item.baseFare);
				if (item.beforeBaseFare) {
					fareText = '<span class="through red">' + addComma(item.beforeBaseFare) + '</span>' + addComma(item.baseFare);
				}
				sRowsHtml += "<tr>";
				sRowsHtml += "  <td>" + (index + 1) + "</td>";
				sRowsHtml += "  <td>" + item.fareBasis + "</td>";
				sRowsHtml += "  <td>" + fareText + "</td>";
				sRowsHtml += "  <td>" + item.fareClass + "</td>";
				sRowsHtml += "  <td>" + nullCheck(item.maxStay) + "</td>";
				sRowsHtml += "</tr>";
			});
			
			$("#tbdFd").append(sRowsHtml);
		}
	} else if (data.Result.code == "3101") {
		commonNotice(data.Result.message);
	} else {
		commonNotice();
	}
}

function selectDcCode(dcCode, dcComment) {
	$('input[name='+$(".discountlayer").attr('target')+']').val(dcCode);
	$('.discountlayer').hide();
}
