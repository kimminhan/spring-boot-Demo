/***********************************************************************************
 * PROJECT      : JRDT
 * PROGRAM ID   : common.js
 * PROGRAM NAME : 
 * DESCRIPTION  : 모든 화면에서 공통으로 사용될 스크립트 ex) BackSpace 뒤로가기 막기, 마우스 오른쪽 버튼 막기 등
 * AUTHOR       : 유영민 차장
 * CREATED DATE : 2018.08.09.
 * HISTORY
 * =================================================================================
 *     DATE     NAME   DESCRIPTION
 * ---------------------------------------------------------------------------------
 * 
 ***********************************************************************************/

/*
 * 키보드 BackSpace 입력시, 화면 뒤로가기 막기
 */
$(document).keydown(function(e){
	if (e.target.nodeName != "INPUT" && e.target.nodeName != "TEXTAREA") {
		if (e.keyCode == 8) {
			return false;
		}
	}
});

/*
 * readonly 텍스트박스에서 BackSpace 입력시, 화면 뒤로가기 막기
 */
$("input[readonly]").on("keydown", function(e){
	if (e.keyCode == 8) {
		e.preventDefault();
	}
});

//document.oncontextmenu = function() {return false;} // 마우스 오른쪽 버튼 막기
//document.onselectstart = function() {return false;} // 마우스 선택 방지
//document.ondragstart = function() {return false;} // 마우스 드래그 방지
