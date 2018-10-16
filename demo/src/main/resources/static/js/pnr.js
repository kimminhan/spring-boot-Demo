/* 레이어 열고닫기 */
$(function() {
  $(".ownership").find("a").click(function(e){
	$('#ownership').val('');
	$('.ownershiplayer').show();
	e.preventDefault();
  });

  $(".tab_pricingAndTicketing").find("a").click(function(e){
	if(isDisabled()){
	  return false;
    }
	
	if (responseData.Result.data.etcSSR != null) {
		var matchArray = new Array();
		for (var i = 0; i < responseData.Result.data.etcSSR.length; ++i ) {
			var ssrInfo = responseData.Result.data.etcSSR[i];
			
			if ("OTHS" == ssrInfo.code && ssrInfo.text.startsWith(".PTCINFO ")) {
				var ssrInfoIdx = ssrInfo.refPaxRPH[0] + "/" + ssrInfo.refSegRPH[0];
				for (var j = 0; j < matchArray.length; ++j) {
					if (matchArray[j] == ssrInfoIdx) {
						$("#noticeText").text(ssrInfo.refPaxRPH[0] + "번 승객, " + ssrInfo.refSegRPH[0] +  "번째 여정의 PTCINFO가 중복되어 있습니다.");
						$('.noticelayer').show();
						return false;
					}
				}
				matchArray.push(ssrInfoIdx);
			}
		}
	}
	
	$(this).toggleClass('current').siblings().removeClass("current");
	
	var clss= $(this).parent().attr("class"), prefix = clss.substring(clss.indexOf("_")+1);
	$('.'+prefix+'layer').show();
	e.preventDefault();
	
	var form = document.createElement("form");
	var objs = document.createElement("input");
	objs.setAttribute("type", "hidden");
	objs.setAttribute("id", "pnrData");
	objs.setAttribute("name", "pnrData");
	objs.setAttribute("value", JSON.stringify(responseData.Result.data));
	form.appendChild(objs);
	form.setAttribute("method", "post");
	form.setAttribute("action","/pricingAndTicketing.do");
	document.body.appendChild(form);
	form.submit();
  });

  $(".tab_tkt").find("a").click(function(e){
	if(isDisabled()){
	  return false;
    }

	focusTopNav("T");
	roading();
	
    var sUrl = "/searchTKT.do?val=" + requestPnr;
    location.href = sUrl;
  });

  $(".tab_history").find("a").click(function(e){
	if(isDisabled()){
	  return false;
    }
	
	$(this).toggleClass('current').siblings().removeClass("current");
	
	var clss= $(this).parent().attr("class"), prefix = clss.substring(clss.indexOf("_")+1);
	$('.'+prefix+'layer').show();
	renderHistoryLayer();
	e.preventDefault();
  });  

  $(".tab_split").find("a").click(function(e){
	if(isDisabled()){
	  return false;
    }
	
	$(this).toggleClass('current').siblings().removeClass("current");
	
	var clss= $(this).parent().attr("class"), prefix = clss.substring(clss.indexOf("_")+1);
	$('.'+prefix+'layer').show();
	$('.tip').hide();
	renderSplitLayer(getNamesObject(responseData.Result.data));
	e.preventDefault();
  });

  $(".tab_qsend").find("a").click(function(e){
	if(isDisabled()){
	  return false;
    }
	
	$(this).toggleClass('current').siblings().removeClass("current");
	
	var clss= $(this).parent().attr("class"), prefix = clss.substring(clss.indexOf("_")+1);
	$('#officeId').val("");
	$('.'+prefix+'layer').show();
	e.preventDefault();
  });
	  
  $(".tab_cancel").find("a").click(function(e){
	if(isDisabled()){
	  return false;
    }
	
	$(this).toggleClass('current').siblings().removeClass("current");
	
	var clss= $(this).parent().attr("class"), prefix = clss.substring(clss.indexOf("_")+1);
	$('.'+prefix+'layer').show();	
	e.preventDefault();
  });

  $(".tab_receit").find("a").click(function(e){
	if(isDisabled()){
	  return false;
    }
	
	$(this).toggleClass('current').siblings().removeClass("current");
	
	var clss= $(this).parent().attr("class"), prefix = clss.substring(clss.indexOf("_")+1);
	$('.'+prefix+'layer').show();
	
	//layer popup 초기화
	$("#readReceit").text("E-TKT 발송할 탑승객을 선택하세요.");
	$("#checkall").prop("checked",false);
	
	
	//국내선일때 영수증 언어선택 disabled
	if($("#isDomestic").val() == "true"){
		$("#lang").prop("disabled",true);
	}else{
		$("#lang").prop("disabled",false);
	}
		
	renderReceitLayer();
	e.preventDefault();
  });

  //Layer Popup 의  우측 상단 x포 닫기 버튼
  $(".dim40 .btn_close").click(function(){
	$('.tablink a').removeClass("current");
	$(this).parent().parent().parent().hide();
  });

  $(".add_service .btn_close").click(function(e){
	$(this).parent().parent().hide();
	e.preventDefault();
  });
});

/**
 * close 버튼 클릭 이벤트
 */
$(function() {
  $("#historyClose").click (
	function() {
	  $('.tablink a').removeClass("current");
	  $(this).parent().parent().parent().parent().parent().hide();
	}
  );
  
  $("#splitClose").click (
	function() {
	  $('.tablink a').removeClass("current");
	  $(this).parent().parent().parent().parent().parent().hide();
	}
  );
  
  $("#cancelClose").click (
	function() {
	  $('.tablink a').removeClass("current");
	  $(this).parent().parent().parent().parent().parent().hide();
	}
  );
  
  $("#ownershipChange").click (
	function() {
	  var officeId = $.trim($("#ownership").val());

	  if(officeId && officeId.length > 0){
		  changeOwnership(officeId);
		$('.tablink a').removeClass("current");
		 $(this).parent().parent().parent().parent().parent().hide();
	  }else{
		$("#noticeText").text("Office를 입력하세요.");
		$('.noticelayer').show();
	  }
	}
  );
  $("#messageClose").click (
	function() {
	  $('.tablink a').removeClass("current");
	  $(this).parent().parent().parent().parent().parent().hide();
	}
  );

  $("#messageCloseAndBack, #messageCloseAndBackBtn").click (
	function() {
	  $('.tablink a').removeClass("current");
	  $(this).parent().parent().parent().parent().parent().hide();
	  history.go(-1);
	}
  );

  $("#foundNotPNRClose, #foundNotPNR").click (
	function() {
	  window.location.href="/PnrSearch.do";
	}
  );

  $("#receitClose").click (
	function() {
	  $('.tablink a').removeClass("current");
	  $(this).parent().parent().parent().parent().parent().hide();
	}
  );

  $("#messageCloseAndRedirect, #messageCloseAndRedirectBtn").click (
    function() {
	  $('.tablink a').removeClass("current");
	  $(this).parent().parent().parent().parent().parent().hide();
	  if("Y" == $("#isReplace").val()) {
		  window.location.replace($("#redirectUrl").val());
	  } else {
		  window.location.href=$("#redirectUrl").val();
	  }
	}
  );


});

$(function() {
  $(".modify_act").click(function(){
	$('.btn_modify').addClass("on");
	$(this).prop("disabled", true);

	$.ajax({
		async : true,
		type : "post",
		dataType : "json",
		url : '/startTransaction.do',
		contentType:"application/json",
		data: JSON.stringify({
			"PNR": pnr,
			"isDomestic": $("#isDomestic").val()
		}),
		success : function(data){
			if(data.Result.code != "0000"){
				alert("수정이 불가능한  PNT 입니다.");
			}
		}
	});
		
	return;
  });
});

//셀렉트박스에 onchange 이벤트 생성
$('.ticketArrange select').change(function(){
  j_test(this);
});

/**
 * modify 버튼을 클릭 했을 경우 btn_modify class 에 on이 추가됩니다.
 * PNR을 modify 상태로  변경합니다. 이 경우 상단 tab 메뉴 클릭 금지가 됩니다. 
 */
function isDisabled(){  
//    var arr = $('.btn_modify').attr("class").split(" ");
//    if(arr && arr.length > 1){
//    $(this).attr("disabled", "disabled");
//        return true;
//    }
    return false;
}

function reloadPNR(){
	//$.cookie("MODIFY", "");
	//$('.btn_modify').removeClass("on");
	window.location.reload();
}

$('#eot').click(function(){
	$.ajax({
		async : true,
		type : "POST",
		dataType : "json",
		url : '/eot.do',
		data : JSON.stringify({"PNR": pnr, "isRetransmission": true}),
		contentType:"application/json",
		success : function(data){
			console.log(data);
		}
	});
	
	reloadPNR();
});
$('#reCheck').click(function(){
	$('.endBookinglayer').css("display",'none');
	return false;
});
$('#ignoreCancel').click(function(){
	$('.ignorelayer').css("display",'none');
	return false;
});
$('#ignoreOK').click(function(){
	$.ajax({
		url : "/ignore.do",
		type: "POST",
		async : true,
		dataType : "json",
		contentType:"application/json",
		data: JSON.stringify({"PNR": pnr}),
		success : function(data){
			console.log("ignoreOK : " + data);
		}
	});
	
	reloadPNR();
});

function checkRowCount(rowCount, targetList){
	if(targetList && (targetList.length >= rowCount)){
		$('.tip').show();
		//$("#splitName").prop("disabled", true);
		return false;
	}
	return true;
}

$('#splitName').click(function(event){
	$("#splitName").prop("disabled", false);
	
	var targetList = $('input:checkbox[name=splitedTarget]:checked');
	
	if(!(targetList && targetList.length > 0)) {
		alert("탑승객을 1명 이상 선택하세요 ");
		return false;
	}

	var rowCount = $("#splitPNR").find("tbody > tr").length;

	if(rowCount < 2){
		alert("2명 이상의 승객인 경우에만 Split를 할 수 있습니다.");
		return false;
	}	

	
	if(!checkRowCount(rowCount, targetList)){
		$("#splitName").prop("disabled", true);
		return false;
	}
	
	splitNames(targetList);

	//reloadPNR();
});

$(document).on("change", "input[name='splitedTarget']", function(){
	var $this = $(this);
	
	var rowCount = $("#splitPNR").find("tbody > tr").length;
	var targetList = $('input:checkbox[name=splitedTarget]:checked');
	if(targetList && (targetList.length >= rowCount)){
		$('.tip').show();
		//TODO split Layer Popup의 split 버튼을 비활성화 한다.
	}else{
		$('.tip').hide();
		//TODO split Layer Popup의 split 버튼을 활성화 한다.
	}
});

$("#endBooking").click (function() {
	ajaxCall("/eot.do" //call url
		, JSON.stringify({"PNR": $("#PNR").val(), "isRetransmission": true})
		, function(data){
			if(data && data.Result.Success &&  data.Result.Success != "success"){
				$('.endBookinglayer').css("display",'block');
				  return false;
			}
		}
		, true //로딩사용여부
		, true //동기화옵션
		, function () { //error시 callBack함수
			$('#noticeText').text("error!");
			$('.noticelayer').show();
		}
		, null //subData
	);
	
	reloadPNR();	
  }
);
$("#ignore").click (
  function() {
	$('.ignorelayer').css("display",'block');
	  return false;
  }
);

$("#sendQueueOK").click (
  function() {
    var officeId = $.trim($("#officeId").val());

    if(officeId && officeId.length > 0){
    	sendQueueMessage(officeId);
	  $('.tablink a').removeClass("current");
	  $(this).parent().parent().parent().parent().parent().hide();
    }else{
	  $(".sendQueueTip").show();
    }
  }
);

/**
 * 영수증 checkbox 전체 선택 / 해제
 */
$(".all_chk").find(".ip_all_chk").click(function(){
	var $this = $(this),
		$chk = $this.parent().parent().parent().parent().parent().find("input[type='checkbox']").not($this);

	if ($this.prop("checked")) {
		$chk.prop("checked",true);
	} else {
		$chk.prop("checked",false);
	}
	
	if($("#isDomestic").val() != "true") {
		$(".etkt .all").show();		 
	}
	
});

/**
 * 영수증 checkbox 전체 선택 / 해제
 */
$("#receitList").not(".ip_all_chk").on("click", "input[type='checkbox']", function(){
	var $this = $(this),
		$chk = $(this).parent().parent().parent().parent().find("input[type='checkbox']"),
		$all = $chk.end().parent().find(".ip_all_chk");

	if ($chk.length === $chk.filter(":checked").length) {
		$all.prop("checked",true);
		
	} else {
		$all.prop("checked",false);		
	}
	
	if($("#isDomestic").val() != "true") {
		$(".etkt .all").show();		 
	}
	
});

$("#receitSend").click(function(){
	var targetList = $('input:checkbox[name=receitTarget]:checked');
	var trimEmail = $.trim($("#receitEmail").val());
	
	if(targetList.length < 1){
		$("#readReceit").text("탭승객을 1명 이상 선택하세요.");
		return false;
	}	
	
	if(trimEmail.length < 1){
		$("#readReceit").text("E-mail을 입력하세요. ");
		return false;
	}
	$("#readReceit").text("E-TKT 발송할 탑승객을 선택하세요.");
	
	sendReceit(targetList);
	
	$('.tablink a').removeClass("current");
	$(this).parent().parent().parent().parent().parent().hide();
});

function locationPNRModify(pageId, pnr, officeIndex){
	var locat = "/" + pageId + ".do";
	var form = document.createElement("form");
	var pnrObj = document.createElement("input");
	pnrObj.setAttribute("type", "hidden");
	pnrObj.setAttribute("id", "pnr");
	pnrObj.setAttribute("name", "pnr");
	pnrObj.setAttribute("value", pnr);
	form.appendChild(pnrObj);
	var officeObj = document.createElement("input");
	officeObj.setAttribute("type", "hidden");
	officeObj.setAttribute("id", "officeIndex");
	officeObj.setAttribute("name", "officeIndex");
	officeObj.setAttribute("value", officeIndex);
	form.appendChild(officeObj);
	form.setAttribute("method", "post");
	form.setAttribute("action", locat);
	document.body.appendChild(form);
	form.submit();
}