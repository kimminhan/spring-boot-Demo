/***********************************************************************************
 * PROJECT      : JRDT
 * PROGRAM ID   : dcCode.js
 * PROGRAM NAME : 
 * DESCRIPTION  : 할인코드 조회 관련 스크립트
 * AUTHOR       : 유영민 차장
 * CREATED DATE : 2018.07.31.
 * HISTORY
 * =================================================================================
 *     DATE     NAME   DESCRIPTION
 * ---------------------------------------------------------------------------------
 * 
 ***********************************************************************************/
$(function(){
	var param = new Object();
	
	var url              = "/selectDcCode.do";
	var callData         = JSON.stringify(param);
	var callBack         = selectDcCodeCb;
	var roading          = true;
	var isAsync          = true;
	var errorCallBack    = commonNotice;
	var completeCallBack = null;
	var subData          = null;

	ajaxCall(url, callData, callBack, roading, isAsync, errorCallBack, completeCallBack, subData);
});
/*
 * 할인코드 조회 데이터로 rows 를 생성 (Callback 함수)
 */
function selectDcCodeCb(data) {
	var sRowsHtml = "";
	var sFdRowsHtml = "";
	sRowsHtml += "  <tr>";
	sRowsHtml += "    <th>할인코드</th>";
	sRowsHtml += "    <th>할인율/액</th>";
	sRowsHtml += "    <th>공항세할인여부</th>";
	sRowsHtml += "    <th>적용대상 Class</th>";
	sRowsHtml += "    <th>할인코드명</th>";
	sRowsHtml += "  </tr>";
	sFdRowsHtml = sRowsHtml;
	if (data.Result.code == "0000") {
		var rs = data.Result.data;
		if (rs.length > 0) {
			$.each(rs, function(index, item){
				sRowsHtml += "  <tr dcCode=" + item.CODE + " dcType=" + item.CODE.lastChar() + " >";
				sRowsHtml += "    <td>" + item.CODE + "</td>";
				sRowsHtml += "    <td>" + item.RATE + "</td>";
				sRowsHtml += "    <td>" + item.IS_DA_DISCOUNT + "</td>";
				sRowsHtml += "    <td>" + item.CLASS + "</td>";
				sRowsHtml += "    <td>" + item.COMMENT + "</td>";
				sRowsHtml += "  </tr>";
				sFdRowsHtml += "  <tr dcCode=" + item.CODE + " dcType=" + item.CODE.lastChar() + " >";
				sFdRowsHtml += "    <td><a href=\"javascript:selectDcCode('" + item.CODE + "', '" + item.COMMENT + "');\">" + item.CODE + "</td>";
				sFdRowsHtml += "    <td>" + item.RATE + "</td>";
				sFdRowsHtml += "    <td>" + item.IS_DA_DISCOUNT + "</td>";
				sFdRowsHtml += "    <td>" + item.CLASS + "</td>";
				sFdRowsHtml += "    <td>" + item.COMMENT + "</td>";
				sFdRowsHtml += "  </tr>";
			});
		}
	}
	$("#tbdDcCode").append(sRowsHtml);
	$("#tbdDcCodeFd").append(sFdRowsHtml);
}
