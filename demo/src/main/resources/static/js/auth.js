/***********************************************************************************
 * PROJECT      : JRDT
 * PROGRAM ID   : auth.js
 * PROGRAM NAME : 
 * DESCRIPTION  : Auth 관련 스크립트
 * AUTHOR       : 유영민 차장
 * CREATED DATE : 2018.06.22.
 * HISTORY
 * =================================================================================
 *     DATE     NAME   DESCRIPTION
 * ---------------------------------------------------------------------------------
 * 
 ***********************************************************************************/
var oAuth = new Object();

$(function(){
	/*
	 * 'Auth Number' 필드 Enter 키 입력 시 처리
	 */
	$("#txtAuthNo").keyup(function(e){
		if (e.keyCode == 13) {
			$("#btnSearchAuth").trigger("click"); // click 이벤트 발생
		} else {
			if (e.keyCode != 9 && e.keyCode != 16) { // NOT Tab, Shift KEY
				$(this).val($(this).val().replace(/[^(0-9a-zA-Z)]/g, "")); // 숫자+영문자만
				$(this).val($(this).val().toUpperCase()); // 대문자로 변환
			}
		}
	});
	
	/*
	 * Auth 조회 'Search' 버튼 클릭 시 처리
	 */
	$("#btnSearchAuth").click(function(){
		var sAuthNo = $("#txtAuthNo").val();
		if (sAuthNo == "") {
			alert("Auth Number를 입력하세요.");
			$("#txtAuthNo").focus();
			return;
		} else if (sAuthNo.length > 14) {
			alert("Auth Number를 14자리 이하로 입력하세요.");
			$("#txtAuthNo").focus(); // maxlength="14"
			return;
		} else {
			var sHeaderHtml = "";
			sHeaderHtml += "<tr>";
			sHeaderHtml += "  <th>Auth Number</th>";
			sHeaderHtml += "  <th>Issue Date</th>";
			sHeaderHtml += "</tr>";
			$("#tbdAuth").html(sHeaderHtml); // TABLE ROWS 초기화
			$("#ulAuth").html(""); // Auth Detail Information 초기화
			$("#btnChangeAuthStatus").text("Auth 사용확인"); // 버튼 텍스트 초기화
			oAuth = null; // Auth 상세정보 초기화
			
			var url              = "/searchAuth.do";
			var callData         = JSON.stringify({"authNo" : sAuthNo});
			var callBack         = searchAuthCb;
			var roading          = true;
			var isAsync          = true;
			var errorCallBack    = commonNotice;
			var completeCallBack = null;
			var subData          = null;

			ajaxCall(url, callData, callBack, roading, isAsync, errorCallBack, completeCallBack, subData);
		}
	});
	
	/*
	 * 'Auth 사용확인' 버튼 클릭 시 처리
	 */
	$("#btnChangeAuthStatus").click(function(){
		var oResData = $("iframe[name=content-area]").get(0).contentWindow.responseData;
		if (oResData == null) {
			commonNotice("PNR 정보가 필요합니다.");
		} else {
			if (oResData.Result.code == "0000") {
				if (oAuth != null && oAuth.authNo != null) {
					if (oAuth.authNo == "") {
						commonNotice("Auth 정보를 찾을 수 없습니다.");
						return;
					}
					
					var sUseAuth = "";
					if (oAuth.useYn == "Y") {
						// AUTH 사용취소
						sUseAuth = "N";
						if (!confirm("Auth 사용취소 하십니까?")) {
							return;
						}
					} else if (oAuth.useYn == "N" && oAuth.paxName == "") {
						// AUTH 사용불가
						commonNotice("사용 불가한 Auth 입니다.");
						return;
					} else {
						// AUTH 사용확인
						sUseAuth = "Y";
						if (!confirm("Auth 사용확인 하십니까?")) {
							return;
						}
					}
					
					var oPnr = oResData.Result.data;
					
					var sPnrNo = oPnr.bookingInfo.PNR;
					var sDepStn = oPnr.itinerary[0].depStn;
					var sArrStn = oPnr.itinerary[0].arrStn;
					var sDepDate = oPnr.itinerary[0].depDate;
					var sFlightNo = oPnr.itinerary[0].flightNo;
					
					var oJson = {
						"authNo" : oAuth.authNo,
						"useAuth" : sUseAuth,
						"pnrNo" : sPnrNo,
						"depStn" : sDepStn,
						"arrStn" : sArrStn,
						"fltdate" : sDepDate,
						"fltNo" : sFlightNo
					};
					
					var url              = "/changeAuthStatus.do";
					var callData         = JSON.stringify(oJson);
					var callBack         = updateAuthCb;
					var roading          = true;
					var isAsync          = true;
					var errorCallBack    = commonNotice;
					var completeCallBack = null;
					var subData          = null;

					ajaxCall(url, callData, callBack, roading, isAsync, errorCallBack, completeCallBack, subData);
				} else {
					commonNotice("Auth 를 선택하세요.");
				}
			} else {
				commonNotice("PNR 정보가 필요합니다.");
			}
		}
	});
});

/*
 * Auth Search 데이터로 rows 를 생성 (Callback 함수)
 */
function searchAuthCb(data) {
	if (data.Result.code == "0000") {
		var rs = data.Result.data;
		if (rs.length > 0) {
			var sRowsHtml = "";
			
			$.each(rs, function(index, item){
				var sRegDate = item.REGDATE;
				if (sRegDate.length > 8) {
					sRegDate = sRegDate.substring(0, 4) + "-" + sRegDate.substring(4, 6) + "-" + sRegDate.substring(6, 8);
				}
				
				sRowsHtml += "<tr onclick=\"javascript:showAuthDetail('" + item.AUTHNO + "', '" + item.AUTHTYPE + "')\">";
				sRowsHtml += "  <td><a href=\"#\" class=\"link_info\">" + item.AUTHNO + "</a></td>";
				sRowsHtml += "  <td><a href=\"#\" class=\"link_info\">" + sRegDate + "</a></td>";
				sRowsHtml += "</tr>";
			});
			
			$("#tbdAuth").append(sRowsHtml);
			
			// 동적으로 생성된 HTML 에 이벤트 다시 적용
			$(".board-content .link_info","#sidebar").click(function(e){
				var $this = $(this);
				
				$this.parent().parent().parent().find("tr").removeClass("active");
				$this.parent().parent().addClass("active");
				
				e.preventDefault();
			});
			
			$(".board-content .link_info").first().trigger("click"); // 첫번째 항목 선택 (이하 동일 표현)
			//$(".board-content .link_info:first").trigger("click");
			//$(".board-content .link_info:eq(0)").trigger("click");
			//$(".board-content .link_info:lt(1)").trigger("click");
		} else {
			var sMsg = "<li>Auth 정보를 찾을 수 없습니다.</li>";
			$("#ulAuth").html(sMsg);
		}
	}
}

/*
 * Auth 상세 정보를 표시
 */
function showAuthDetail(authNo, authType) {
	var url              = "/searchAuthDetail.do";
	var callData         = JSON.stringify({"authNo" : authNo, "authType" : authType});
	var callBack         = showAuthDetailCb;
	var roading          = true;
	var isAsync          = true;
	var errorCallBack    = commonNotice;
	var completeCallBack = null;
	var subData          = null;

	ajaxCall(url, callData, callBack, roading, isAsync, errorCallBack, completeCallBack, subData);
}

/*
 * Auth Detail Information 표시 (Callback 함수)
 */
function showAuthDetailCb(data) {
	if (data.Result.code == "0000") {
		$("#ulAuth").html(data.Result.data.authDetailInfo);
		
		var authDetail = data.Result.data.authDetailVO;
		
		oAuth = new Object();
		oAuth.authNo = authDetail.authNo;
		oAuth.authType = authDetail.authType;
		oAuth.useYn = authDetail.useYn;
		oAuth.paxName = authDetail.paxName;
		
		if (oAuth.useYn == "Y") {
			$("#btnChangeAuthStatus").text("Auth 사용취소");
		} else if (oAuth.useYn == "N" && oAuth.paxName == "") {
			$("#btnChangeAuthStatus").text("Auth 사용불가");
		} else {
			$("#btnChangeAuthStatus").text("Auth 사용확인");
		}
	}
}

/*
 * Auth 사용확인, 사용취소 (Callback 함수)
 */
function updateAuthCb() {
	$("#txtAuthNo").val(oAuth.authNo);
	$("#btnSearchAuth").trigger("click"); // click 이벤트 발생
}
