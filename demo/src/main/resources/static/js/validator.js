/*
 * 화면 호출시 체크 이벤트 (해당 JS파일 jquery include 및에 위치 필요)
 * 2018.05.23 YSW
 */
$(function(){
	
	//숫자만 입력
	$(document).on('keyup', '.numberOnly', function (e){
		if (e.keyCode != 9 && e.keyCode != 16) { // NOT Tab, Shift KEY
			$(this).val($(this).val().replace(/[^0-9]/g, ""));
		}
	});
	
	//문자만 입력
	$(document).on('keyup', '.charOnly', function (e){
		if (e.keyCode != 9 && e.keyCode != 16) { // NOT Tab, Shift KEY
			var reg  = /[^(ㄱ-힣a-zA-Z\s)]/g;
			if ( reg.test( $(this).val() ) )  {
				$(this).val($(this).val().replace(/[^(ㄱ-힣a-zA-Z\s)]/g, ""));
			}
		}
	});
	
	//영문만 입력
	$(document).on('keyup', '.engCharOnly', function (e){
		if (e.keyCode != 9 && e.keyCode != 16) { // NOT Tab, Shift KEY
			$(this).val($(this).val().replace(/[^(a-zA-Z\s)]/g, ""));
		}
	});
	
	//숫자와 하이픈, 띄어쓰기만 입력 (전화번호 형식)
	$(document).on('keyup', '.phoneVDT', function (e){
		if (e.keyCode != 9 && e.keyCode != 16) { // NOT Tab, Shift KEY
			$(this).val($(this).val().replace(/[^0-9\-\s]/g, ""));
		}
	});
});

/*
 * validateFormId : 필수값 체크할 element가 속한 <form>의 Id값
 * * 각 form내에 'validate' class가 존재하는 element들을 체크.
 * element의 title값을 기준으로 alert메시지. 없을경우 기본 alert메시지.
 * display none인 element 제외, disabled인 element 제외
 */
function validate(validateFormId) {
	
	var result = true;
	
	$('#'+validateFormId + ' .validate:visible:not([disabled])').each(function () {
		if ( $(this).val() == "") {
			
			var titleValue = $(this).attr('title');
			var message = "";
			
			if (titleValue == undefined) {
				message = "필수입력값을 확인해 주세요.";
				
			} else {
				message = titleValue + "을(를) 입력해 주세요.";
			}
			
			alert( message );
			
			$(this).focus();
			
			result = false;
			
			return false;
		}
		
		if ($(this).hasClass('phoneVDT')) {
			//전화번호 체크
			if(! ( /^[0-9]{1,}-|\s[0-9]{1,}-|\s[0-9]{1,}$/.test($(this).val()) ) ) {
				alert('전화번호 형식을 확인해 주세요.');
				$(this).focus();
				result = false;
				return false;
			}
		}
		
		if ($(this).hasClass('emailVDT')) {
			//이메일 체크
			if(! ( /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/.test($(this).val()) ) ) {
				alert('이메일 형식을 확인해 주세요.');
				$(this).focus();
				result = false;
				return false;
			}
		}
		
	});
	
	return result;
};
