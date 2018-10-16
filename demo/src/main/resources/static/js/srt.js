/***********************************************************************************
 * PROJECT      : JRDT
 * PROGRAM ID   : srt.js
 * PROGRAM NAME : 
 * DESCRIPTION  : SRT 관련 스크립트
 * AUTHOR       : 유영민 차장
 * CREATED DATE : 2018.06.28.
 * HISTORY
 * =================================================================================
 *     DATE     NAME   DESCRIPTION
 * ---------------------------------------------------------------------------------
 * 
 ***********************************************************************************/
$(function(){
	/*
	 * 'Date' 필드 datepicker 적용
	 */
	$("#txtDateSrt").datepicker({
		showOn: "button",
		buttonImage: "/images/btn_diary.gif",
		buttonImageOnly: true,
		dateFormat : "ddMy",
		monthNamesShort: ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"]
	});
	
	/*
	 * 'Date' 필드 오늘 날짜 지정
	 */
	$("#txtDateSrt").val(new Date().dateFormat("DDMMMYY"));
	
	/*
	 * 'Flight Number', 'Date', 'SSR Code' 필드 Enter 키 입력 시 처리
	 */
	$("#txtFlightNumberSrt, #txtDateSrt, #txtSsrCode").keyup(function(e){
		if (e.keyCode == 13) {
			$("#btnSearchSrt").trigger("click"); // click 이벤트 발생
		} else {
			if (e.keyCode != 9 && e.keyCode != 16) { // NOT Tab, Shift KEY
				$(this).val($(this).val().replace(/[^(0-9a-zA-Z)]/g, "")); // 숫자+영문자만
				$(this).val($(this).val().toUpperCase()); // 대문자로 변환
			}
		}
	});

	/*
	 * SRT 'Search' 버튼 클릭 시 처리
	 */
	$("#btnSearchSrt").click(function(){
		var sFlightNumber = $("#txtFlightNumberSrt").val();
		if (sFlightNumber == "") {
			alert("편명을 입력하세요.");
			$("#txtFlightNumberSrt").focus();
			return;
		}
		
		var sDate = $("#txtDateSrt").val();
		if (sDate == "") {
			alert("날짜를 입력하세요.");
			$("#txtDateSrt").focus();
			return;
		}
		
		if (isValidDateEn(sDate) == false) {
			$("#txtDateSrt").focus();
			return;
		}
		
		var sSsrCode = $("#txtSsrCode").val();
		if (sSsrCode == "") {
			alert("SSR Code 를 입력하세요.");
			$("#txtSsrCode").focus();
			return;
		}
		
		var param = new Object();
		param.flightNumber = sFlightNumber;
		param.dateEn = sDate;
		param.date = chDate(sDate);
		param.ssrCode = sSsrCode;
		
		$("#tbdSrt").html("");
		
		var url              = "/searchSrt.do";
		var callData         = JSON.stringify(param);
		var callBack         = searchSrtCb;
		var roading          = true;
		var isAsync          = true;
		var errorCallBack    = commonNotice;
		var completeCallBack = null;
		var subData          = null;

		ajaxCall(url, callData, callBack, roading, isAsync, errorCallBack, completeCallBack, subData);
	});
});

/*
 * SRT Search 데이터로 rows 를 생성 (Callback 함수)
 */
function searchSrtCb(data) {
	if (data.Result.code == "0000") {
		var rs = data.Result.data;
		if (rs.length > 0) {
			var sRowsHtml = "";
			
			$.each(rs, function(index, item){
				sRowsHtml += "<tr>";
				sRowsHtml += "  <th>" + item.itemNm + "</th>";
				sRowsHtml += "  <td>" + item.itemVal + "</td>";
				sRowsHtml += "</tr>";
			});
			
			$("#tbdSrt").append(sRowsHtml);
		}
	}
}
