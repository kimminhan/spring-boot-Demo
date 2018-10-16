/**
 * jquery 공통 utils.
 * jquery 내용으로 구성된 함수들로, jquery import보다 하단에 해당 js파일 import하여 사용
 * 2018.06.22 YSW
 */

/**
 * ajax 호출 공통함수
 * 
 * -Mandatory Value-
 * url: 호출할 url
 * callData: ajax 요청에 사용될 요청값
 * callBack: ajax호출 후 success시에 호출할 동작 메서드 *파라미터는 success시 받아올 data 하나로만, 혹은 subData까지 두개로만 구성 ex.function(data){} function(data, subData){})
 * 
 * -Optional Value-
 * roading: 화면전체 로딩바 사용 여부 *boolean값 (optional)
 * isAsync: ajax call 동기화 옵션 *boolean값, true=비동기, false=동기 (optional)
 * errorCallBack: ajax호출 후 error시에 호출할 동작 메서드 (optional)
 * completeCallBack: ajax호출 후 complete시에 호출할 동작 메서드 (optional)
 * subData: ajax호출 후 callBack함수에 넘겨주는등 해당메서드 사용시 추가로 사용될값 (optional)
 * isNotUseErrMsg: API 응답코드 0000(정상코드) 아닐 시에, 에러메시지 사용여부 (optional) 
 */
function ajaxCall(url, callData, callBack, roading, async, errorCallBack, completeCallBack, subData, isNotUseErrMsg) {
	
	if(async == null) async = true; //기본적으로 비동기
	
	if(roading) {
		if ( $('html .backgroundLoadingDiv').length <=0 ) {
			var loadingDiv = '<div id="transparentLayer" class="backgroundLoadingDiv dim40">';
			loadingDiv += '<div class="loading" style="margin:300px auto; position:relative;"><img src="/images/loading.gif"></div></div>';
			$('html').append(loadingDiv);
		}
		$('.backgroundLoadingDiv').show();
		
	}
	
	return $.ajax({
		
		async : async,
		type : "post",
		dataType : "json",
		url : url,
		data : callData,
		contentType:"application/json",
		success : function(data) {
			if(data && data.Result && data.Result.code && data.Result.code == 'XXXX') {
				alert(data.Result.message);
				top.window.location.replace("/main.do");
			} else if (data.Result.code != '0000' && !isNotUseErrMsg){
				commonNotice(data.Result.message);
			} else {
				callBack(data, subData);
			}
		},
		error : function(error) {
			if (errorCallBack) {
				errorCallBack();
			} else {
				if (error.statusText != 'abort') { //사용자 임의로 중단시엔 에러띄우지않음
					alert("error");	
				}
			}
			$('.backgroundLoadingDiv').hide();
		},
		complete : function(data) {
			if(roading) $('.backgroundLoadingDiv').hide();
			if(completeCallBack) completeCallBack(data);
		}
	});	
	
}

/*
 * Common Notice 함수
 */
function commonNotice(sMsg) {
	if (sMsg == null || sMsg == "") {
		sMsg = "에러가 발생하였습니다.";
	}
	
	if ($("#noticeText").length > 0) {
		$("#noticeText").html(sMsg);
		$(".noticelayer").show();
	} else if ($("#noticeText", parent.document).length > 0) {
		$("#noticeText", parent.document).html(sMsg);
		$(".noticelayer", parent.document).show();
	} else {
		alert(sMsg);
	}
}
