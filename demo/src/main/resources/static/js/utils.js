/**
 * 객체 복사
 * @param obj
 * @returns
 */
function copy(obj){
	var copy = Object.create(Object.getPrototypeOf(obj));
	var propNames = Object.getOwnPropertyNames(obj);
	
	propNames.forEach(function(name){
		var desc = Object.getOwnPropertyDescriptor(obj, name);
		Object.defineProperty(copy, name, desc);
	});
	
	return copy;
}

/**
 * Response Type 확인. 문자열이면 Json parse
 * @param obj
 * @returns JSON Type
 */
function isPlainObject(obj){
	return jQuery.isPlainObject(obj) ? obj : jQuery.parseJSON(obj);
}

/**
 * Response 성공 여부 확인
 * @param obj
 * @returns boolean
 */
function hasSuccessProperty(obj){
	return obj.hasOwnProperty("Success") ? true : false;
}

function hasOwnProperty(obj, name){
	return obj.hasOwnProperty(name) ? true : false;
}

/**
 * Array, DOM 등 iteraor 가능한 객체의 property를 출력합니다.
 * @param obj
 */
function log(obj){
	for(var key in responseData){
		console.log("key : " + key + " value: " + responseData[key]);
	}
}

/**
 * "2018-07-17T20:05:00" format을 "17JUL18" format 으로 변환합니다.
 * convert ISO 8601 format to RFC 2822 date time format
 * @returns String
 */
function parseDDMMMYY(dateTime){
	return moment(dateTime, ["YYYY-MM-DDTHH:mm:ss", "DDMMMYY"], "en").format("DDMMMYY").toUpperCase();
}

/**
 * "2018-07-17T20:05:00" format에서 해당 일자에 의 요일(TU format)을 가져옵니다.
 * @returns String
 */
function parseDayOfTheWeek(dateTime){
	return moment(dateTime, ["YYYY-MM-DDTHH:mm:ss", "dd"], "en").format("dd").toUpperCase();
}

/**
 * "2018-07-17T20:05:00" format에서 해당 일자에 의 시간, 분 정보(2005 format)를 가져옵니다.
 * @returns String
 */
function parseHourMinute(dateTime){
	return moment(dateTime, ["YYYY-MM-DDTHH:mm:ss", "DDMMMYY dd HHmm"], "en").format("HHmm").toUpperCase();
}

function parseHourColonMinute(dateTime){
	return moment(dateTime, ["YYYYMMDDTHHmmss", "YYYYMMDDHH:mm:ss"], "en").format("HH:mm").toUpperCase();
}

function parseYYYYMMDD(dateTime){
	return moment(dateTime, ["DDMMMYY", "YYYY-MM-DD"], "en").format("YYYY-MM-DD").toUpperCase();
}

function parseYMD(dateTime){
	return moment(dateTime, ["DDMMMYY", "YYYYMMDDHH:mm:ss"], "en").format("YYYYMMDD").toUpperCase();
}

/*
 * dateTime  inFormat   outFormat           format
 * dateTime, "DDMMMYY", "YYYYMMDDHH:mm:ss", "YYYYMMDD"
 */
function convertDateFormater(dateTime, inFormat, outFormat, format){
	return moment(dateTime, [inFormat, outFormat], "en").format(format).toUpperCase();
}
/**
	탑승일, 오늘날짜 기준 소아,유아 필요 출생일 return
	-Input-
	fltDateStr = 출발일자
	routeType = 국내/국제 구분값
	format = 날짜포맷
	
	-Output-
	birthArray[0] = 소아출생일 start
	birthArray[1] = 소아출생일 end
	birthArray[2] = 유아출생일 start
*/
function getBirthForKid(fltDateStr, routeType, format) {
	
	var fltDate = new Date(fltDateStr);
	
	var birthArray = [];
	var chdBirthStart = new Date(fltDate);
	var chdBirthEnd = new Date(fltDate);
	var infBirthStart = new Date(fltDate);

	var chdAge = 13;
	if (routeType == "I") chdAge = 12;
	
	chdBirthStart.setFullYear( fltDate.getFullYear() - chdAge);
	chdBirthStart.setDate(chdBirthStart.getDate() + 1);
	birthArray[0] = chdBirthStart.dateFormat(format);
	
	chdBirthEnd.setFullYear( fltDate.getFullYear() - 2);
	birthArray[1] = chdBirthEnd.dateFormat(format);
	
	infBirthStart.setFullYear( fltDate.getFullYear() - 2);
	infBirthStart.setDate(infBirthStart.getDate() + 1);
	birthArray[2] = infBirthStart.dateFormat(format);

	return birthArray;
}

function addComma(val) {
	var returnValue;
	if(val == null) {
		returnValue =  '-';
	}
	else {
		val = Number(val);
		returnValue = val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	}
	return returnValue;
}

/**
 * date 포맷 변경함수
 * inputType = Date
 * returnType = String

Date.prototype.dateFormat = function(f) {
    if (!this.valueOf()) return " ";
    
    var weekName = ["SU", "MO", "TU", "WE", "TH", "FR", "ST"];
	var monthName = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    var d = this;
     
    return f.replace(/(yyyy|yy|MM|dd|E|hh|mm|ss|a\/p|MUTC)/gi, function($1) {
        switch ($1) {
            case "yyyy": return d.getFullYear();
            case "yy": return (d.getFullYear() % 1000).zf(2);
            case "MM": return (d.getMonth() + 1).zf(2);
            case "dd": return d.getDate().zf(2);
            case "E": return weekName[d.getDay()];
			case "MUTC": return monthName[d.getMonth()];
            case "HH": return d.getHours().zf(2);
            case "hh": return ((h = d.getHours() % 12) ? h : 12).zf(2);
            case "mm": return d.getMinutes().zf(2);
            case "ss": return d.getSeconds().zf(2);
            case "a/p": return d.getHours() < 12 ? "오전" : "오후";
            default: return $1;
        }
    });
}
 */

Date.prototype.dateFormat = function(f) {
	var inputFormat = ['YYYY-MM-DDTHH:mm:ss', 'YYYY-MM-DD', 'DDMMMYY', 'YYYYMMDDHHmmss', 'YYYYMMDDHHmm', 'YYYYMMDD'];
	return moment(this, inputFormat, "en").format(f).toUpperCase();
}

String.prototype.dateFormat = function(f) {
	var inputFormat = ['YYYY-MM-DDTHH:mm:ss', 'YYYY-MM-DD', 'DDMMMYY', 'YYYYMMDDHHmmss', 'YYYYMMDDHHmm', 'YYYYMMDD'];
	
	return moment(String(this), inputFormat, "en").format(f).toUpperCase();
}

String.prototype.startsWith = function(str) {
	if (this.length < str.length) {return false;}
	return this.indexOf(str) == 0;
}

String.prototype.lastChar = function() {
	if (this.length <= 0) {return "";}
	return this.substr(this.length - 1, 1);
}

String.prototype.string = function(len){var s = '', i = 0; while (i++ < len) { s += this; } return s;};
String.prototype.zf = function(len){return "0".string(len - this.length) + this;};
Number.prototype.zf = function(len){return this.toString().zf(len);};

String.prototype.replaceAll = function(beforeStr, afterStr) {
	return String(this).split(beforeStr).join(afterStr);
}

//날짜포맷 변경
//05JAN18 -> 2018-01-05
function chDate(str) {
	var year = str.substr(5,2);
	var month = str.substr(2,3);
	var day= str.substr(0,2);
	
	var months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN','JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
	var iIdx = 0;
	
	for (var i = 0; i < months.length; i++) {
		if (months[i] == month) {
			iIdx = i + 1;
			break;
		}
	}
	
	if (iIdx < 10) {
		iIdx = "0" + iIdx;
	}
	
	var formatddate = "20" + year + '-' + iIdx  + '-' + day;
	return formatddate;
}

function nullCheck(value){
	return value === null ? "" : value;
}

function undefinedCheck(value){
	return value === undefined ? "" : value;
}

/**
* <form> 값을 JsonObject형식으로 변환
*/
function formToJsonObj (form) {
	var obj = {};
	var arr = form.serializeArray();
	for(var key in arr) {
		var eName = arr[key]['name'];
		if(obj[eName]) {
			if(!obj[eName].push) {
				obj[eName] = [obj[eName]];
			}
			obj[eName].push(arr[key]['value'] || '');
		
		}else {
			obj[eName] = arr[key]['value'] || '';
		}
	};
	return obj;
}

/**
 * yyyymmdd 형식의 날짜값을 입력받아서 유효한 날짜인지 체크
 * @param sDate
 * @returns
 */
function isValidDate(sDate) {
	sDate = sDate.replace(/-/gi, ""); // '-' 문자 제거
	
	var yyyy = sDate.substring(0, 4); // 년
	var mm = sDate.substring(4, 6); // 월
	var dd = sDate.substring(6, 8); // 일
	
	var oDate = new Date();
	oDate.setFullYear(yyyy);
	oDate.setMonth(mm - 1);
	oDate.setDate(dd);

	var bFlag = true;
	if (oDate.getFullYear() != yyyy || oDate.getMonth() + 1 != mm || oDate.getDate() != dd) {
		bFlag = false;
		alert("날짜 형식이 올바르지 않습니다.");
	}
	
	return bFlag;
}

/**
 * ddmmmyy (ex. 03JUL18) 형식의 날짜값을 입력받아서 유효한 날짜인지 체크
 * @param sDate
 * @returns
 */
function isValidDateEn(sDate) {
	return isValidDate(chDate(sDate));
}

/**
 * 상단메뉴 선택
 * @param param : H / A / P / T / E
 * @returns
 */
function focusTopNav(param) {
	// clear all
	$("#liH", parent.document).removeClass("current"); // Home
	$("#liA", parent.document).removeClass("current"); // Availability
	$("#liP", parent.document).removeClass("current"); // PNR
	$("#liT", parent.document).removeClass("current"); // Ticket
	$("#liE", parent.document).removeClass("current"); // EMD
	
	// setting one
	$("#li" + param, parent.document).addClass("current");
}

/**
 * 최근 조회한 PNR 을 쿠키에 저장
 * @returns
 */
function setRecentPnr(pnr) {
	var sPnrInfo = "";
	if(pnr.groupName && nullCheck(pnr.groupName) != "") {
		sPnrInfo = nullCheck(pnr.bookingInfo.PNR) + " " + nullCheck(pnr.groupName)
	} else {
		sPnrInfo = nullCheck(pnr.bookingInfo.PNR) + " " + nullCheck(pnr.names[0].lastName) + "/" + nullCheck(pnr.names[0].firstName);
	}
	
    var oJsonNew = [{"pnrInfo" : sPnrInfo}];
    //var sJsonStr = $.cookie("recent_pnr_json");
    var sJsonStr = top.window.sRecentPnrJson;
    var oJsonOld = (sJsonStr == null) ? {} : JSON.parse(sJsonStr);
    //console.log("oJsonOld:" + JSON.stringify(oJsonOld));
    
    if (oJsonOld.length != null && oJsonOld.length > 0) {
        var sPnrLinkPrev = oJsonOld[0].pnrInfo;
        if (sPnrInfo == sPnrLinkPrev) {
            oJsonNew = oJsonOld;
        } else {
            $.merge(oJsonNew, oJsonOld);
        }
    }
    
    //console.log("oJsonNew:" + JSON.stringify(oJsonNew));
    //$.cookie("recent_pnr_json", JSON.stringify(oJsonNew), {expires : 7}); // 7일
    //$.cookie("recent_pnr_json", JSON.stringify(oJsonNew)); // 브라우저가 열려 있는 동안만 유지
    top.window.sRecentPnrJson = JSON.stringify(oJsonNew);
	
	showRecentPnrAll();
}

/**
 * 화면 오른편 '최근 조회한 PNR' 영역에 최근 조회한 PNR 모두를 표시
 * @returns
 */
function showRecentPnrAll() {
    //var sJsonStr = $.cookie("recent_pnr_json");
    var sJsonStr = top.window.sRecentPnrJson;
    var oJson = (sJsonStr == null) ? {} : JSON.parse(sJsonStr);
    if (oJson.length != null && oJson.length > 0) {
    	var sRowsHtml = "";
    	$.each(oJson, function(index, item){
    		var sPnrInfo = item.pnrInfo;
    		var sArrItem = sPnrInfo.split(" ");
    		sRowsHtml += "<li><a href=\"javascript:goPnrViewFromJrdt('" + sArrItem[0] + "')\">" + sArrItem[0] + " " + sArrItem[1] + "</a></li>";
    	});
    	$("#ulRecentPnrAll", parent.document).html(sRowsHtml);
    }
}

/**
 * 화면 오른편 '최근 조회한 PNR' 영역에서 PNR 선택시 처리
 * @param sPnr
 * @returns
 */
function goPnrViewFromJrdt(sPnr) {
	focusTopNav("P");
	var sUrl = "/pnr.do?pnr=" + sPnr;
	$("#iframe1").attr("src", sUrl);
}

// 환율별 적립 예상 포인트 계산
function fn_calcCurrency(fareAmount, currency) {
    
    var finalAmount;
    
    if(currency == "KRW") {
        finalAmount = fareAmount*1*5/100;
    }
    else if(currency == "JPY") {
        finalAmount = fareAmount*10*5/100;
    }
    else if(currency == "CNY") {
        finalAmount = fareAmount*163*5/100;
    }
    else if(currency == "HKD") {
        finalAmount = fareAmount*135*5/100;
    }
    else if(currency == "THB") {
        finalAmount = fareAmount*32*5/100;
    }
    else if(currency == "USD") {
        finalAmount = fareAmount*1000*5/100;
    }
    else if(currency == "TWD") {
        finalAmount = fareAmount*35*5/100;
    }
    else if(currency == "MOP") {
        finalAmount = fareAmount*135*5/100;
    }
    else if(currency == "MYR") {
        finalAmount = fareAmount*300*5/100;
    }
    else if(currency == "EUR") {
        finalAmount = fareAmount*1100*5/100;
    }
    
    return addComma(finalAmount);
        
}

/*
 * 화면전체 로딩바 표시
 */
function roading() {
    if ( $('html .backgroundLoadingDiv').length <=0 ) {
        var loadingDiv = '<div id="transparentLayer" class="backgroundLoadingDiv dim40">';
        loadingDiv += '<div class="loading" style="margin:300px auto; position:relative;"><img src="/images/loading.gif"></div></div>';
        $('html').append(loadingDiv);
    }
    $('.backgroundLoadingDiv').show();
}

function getCurrencyFormat(value){
	if(!isNaN(parseInt(value))){
		return new Intl.NumberFormat('ko-KR', {maxumumSugnificantDigits:3}).format(value)
	}
	
	return null;
}