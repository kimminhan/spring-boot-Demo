/***********************************************************************************
 * PROJECT      : JRDT
 * PROGRAM ID   : payment.js
 * PROGRAM NAME : 
 * DESCRIPTION  : payment 관련 스크립트
 * AUTHOR       : tour-m05
 * CREATED DATE : 2018.07.04.
 * HISTORY
 * =================================================================================
 *     DATE     NAME   DESCRIPTION
 * ---------------------------------------------------------------------------------
 * 
 ***********************************************************************************/
$(function(){
	
	$("#payment_Clear").click(function(){
		if ($("#payment_currency").val().trim() != paymentCurrency) {
			$("#payment_currency option[value=" + paymentCurrency + "]").prop("selected", true);
			$(".sel_currency").change();
		}
		$("#payment_amount").val("");
		$("#payment_cardNo1").val("");
		$("#payment_cardNo2").val("");
		$("#payment_cardNo3").val("");
		$("#payment_cardNo4").val("");
		$("#payment_cvc").val("");
		$("#payment_expDate").val("");
		$("#payment_extPay").val("");
		$("#payment_holderName").val("");
		$("#payment_krw").prop("checked",false);
		$("#payment_radio1").prop("checked",true);
		$("#payment_radio2").prop("checked",false);
	});

	$("#payment_Approval").click(function(){
		var pnrNo = $.cookie("PNR");
		
		if (pnrNo == null) {
			if (!confirm("Pnr이 조회되지 않았습니다. 계속 진행하시겠습니까?")) {
				return;
			}
		}
		
		var param = new Object();
		param.currency = $("#payment_currency").val().trim();
		param.amount = $("#payment_amount").val();
		param.cardNo = $("#payment_cardNo1").val() + $("#payment_cardNo2").val() + $("#payment_cardNo3").val() + $("#payment_cardNo4").val();
		param.cvc = $("#payment_cvc").val();
		param.expDate = $("#payment_expDate").val();
		param.extendPayment = $("#payment_extPay").val();
		param.isKRW = $("#payment_krw").prop("checked") ? "true" : "false";
		param.cardHolderName = $("#payment_holderName").val();
		param.isARS = $("#payment_radio1").prop("checked") ? "true" : "false";
		param.pnrNo = pnrNo;
		param.numericPnrNo = $.cookie("numericPNR") == null ? "" : $.cookie("numericPNR");
		
		if (param.currency == "") {
			alert("Currency를 입력하세요.");
			return;
		}
		if (param.amount == "") {
			alert("Amount를 입력하세요.");
			return;
		}
		if (param.cardNo.length < 16) {
			alert("Card Number를 입력하세요.");
			return;
		}
		if (param.expDate == "") {
			alert("Exp.Date를 입력하세요.");
			return;
		}
		if (param.extendPayment == "") {
			alert("Extended Payment를 입력하세요.");
			return;
		}
		if ("KRW" != param.currency && "JPY" != param.currency
				&& param.cardHolderName == "") {
			alert("Card Holder Name를 입력하세요.");
			return;
		}
		if ("JPY" == param.currency && param.cvc == "") {
			alert("CVC를 입력하세요.");
			return;
		}
		
		$("#payment_view").children().remove();
		ajaxCall("/payment.do", JSON.stringify(param), paymentCallBack, true, true, errorNotice, null, null);

		$(".paymentHistory").click(function(e) {
			var $this = $(this);
			var $sub = $this.children(".paymentHistoryText");
			var $subStatus = $this.children(".paymentHistoryStatus");
			if ($sub.is(":hidden")) {
				$sub.show();
				$subStatus.text("  ▲");
			} else {
				$sub.hide();
				$subStatus.text("  ▼");
			}
		});
	});
});

var paymentHistoryList = [];
/*
 * SRT Search 조회된 데이터로 rows 를 생성 (Callback 함수)
 */
var clipboard;

function paymentCallBack(data) {
	if (data.Result.code == "0000") {
		var rowsHtml = getResultMsg(data.Result.data);

		$("#payment_view").append(rowsHtml);
		$("#payment_side").children().remove();
		
		var date = new Date;
		var paymentHistoryRowsHtml = "<dl class='paymentHistory'>Approval Date/Time : " + (date.getFullYear() + (date.getMonth() + 1).zf(2) + date.getDate() + date.getHours().zf(2) + date.getMinutes().zf(2) + date.getSeconds().zf(2)).dateFormat('YYYY-MM-DDTHH:mm:ss') + "<span class=paymentHistoryStatus>  ▼</span>";
		paymentHistoryRowsHtml += rowsHtml;
		paymentHistoryList.push(paymentHistoryRowsHtml);
		var startIdx = paymentHistoryList.length > 5 ? paymentHistoryList.length - 5 : 0;
		for (var i = paymentHistoryList.length - 1; i >= startIdx; --i) {
			$("#payment_side").append(paymentHistoryList[i]);
		}
		$("#payment_side").children(".paymentHistory").children(".paymentHistoryText").hide();

		if (clipboard != null) {
			clipboard.destroy();
		}
		clipboard = new ClipboardJS(".copy");
		clipboard.on('success', function(e) {
			alert("FOP DATA가 복사되었습니다.");
		});
		clipboard.on('error', function(e) {
			alert("FOP DATA가 복사가 실패하였습니다.");
		});
	} else {
		errorNotice(data.Result.message);
	}
}

/*
 * Common Notice 함수
 */
function errorNotice(sMsg) {
	if (sMsg == null || sMsg == "") {
		sMsg = "에러가 발생하였습니다.";
	}
	$(".col-1.notice").text(sMsg);
	$("#transparentLayer").show();
}

function getResultMsg(data) {
	var fopData = "CC" + data.cardCode + data.cardNo + "/A" + data.approvalNo + "/X" + data.expiryDate;
	var rowsHtml = "";
	rowsHtml += "  <dt class='paymentHistoryText'>FOP TYPE : CC</dt>";
	rowsHtml += "  <dd class='paymentHistoryText'>";
	rowsHtml += "    <ul>";
	rowsHtml += "      <li>Credit Card Code : " + data.cardCode + "</li>";
	rowsHtml += "      <li>Credit Card Number : " + data.cardNo + "</li>";
	rowsHtml += "      <li>Approval Code : " + data.approvalNo + "</li>";
	rowsHtml += "      <li>Approval Date : " + data.approvalDate + "</li>";
	rowsHtml += "      <li>Expire Date : " + data.expiryDate + "/" + data.extendedPayment + "</li>";
	rowsHtml += "      <li>CVC Code : " + data.cvcCode + "</li>";
	rowsHtml += "      <li>FOP DATA : " + fopData + "&nbsp;<a class='copy' data-clipboard-text=" + fopData + ">Copy</a></li>";
	rowsHtml += "      <li>Amount : " + data.requestAmount + data.currency + "</li>";
	rowsHtml += "      <li>Real Amount : " + data.amount + data.currency + "</li>";
	rowsHtml += "    </ul>";
	rowsHtml += "  </dd>";
	rowsHtml += "</dl>";

	return rowsHtml;
}
