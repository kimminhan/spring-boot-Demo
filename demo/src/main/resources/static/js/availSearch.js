	var searchType = ''; //조회버튼 선택 시 조회타입 (FareAvail or Avail)
	var routeType = 'D';
	var isFareFamily = false;
	var segmentSize = 2; //현재. 구간의 최대개수는 2개가 최대
	var selectedAvailObjects;
	var searchDataTmp = [];
	var airportTarget = "";
	var today = new Date();
	var maxAvailDate = new Date();

	var fareAjaxXHR; //FarePrice Ajax 제어를위한 요청객체
	var availAjaxXHR = []; //Avail, Fare+Avail Ajax 제어를위한 요청객체 배열

	maxAvailDate.setDate(today.getDate() + 329);

	$(function() {

		////////////////////////검색영역 이벤트////////////////////////

		//다구간일경우 Fare + Avail 조회 불가
		$('input[type=radio][name=tripType]').change(function() {

			if ($(this).val() == 'RT') {
				$('[name=depStn2]').val($('[name=arrStn1]').val());
				$('[name=arrStn2]').val($('[name=depStn1]').val());

				$('#fareAvailBtn').show();

				$('#returnSearchTr').show();
				segmentSize = 2;
			} else if ($(this).val() == 'OW') {
				$('#fareAvailBtn').show();

				$('#returnSearchTr').hide();
				segmentSize = 1;
			} else {
				$('#fareAvailBtn').hide();

				$('#returnSearchTr').show();
				segmentSize = 2;
			}

		});

		// 'From', 'To' 필드 키 입력 시 처리
		$(
				'input[name=depStn1], input[name="depStn2"], input[name=arrStn1], input[name=arrStn2]')
				.keyup(
						function(e) {
							if (e.keyCode != 9 && e.keyCode != 16) { // NOT Tab, Shift KEY
								$(this).val($.trim($(this).val())); // trim 적용
								$(this).val(
										$(this).val().replace(/[^(a-zA-Z)]/g, "")); // 영문자만
								$(this).val($(this).val().toUpperCase()); // 대문자로 변환
	
								//왕복일경우 여정1, 2의 출/도착지 자동입력 처리
								if ($('input[type=radio][name=tripType]:checked')
										.val() == 'RT') {
									var thisNm = $(this).attr('name');
	
									var changeTarget = thisNm.indexOf("depStn") != -1 ? thisNm
											.replace("depStn", "arrStn")
											: thisNm.replace("arrStn", "depStn");
									changeTarget = changeTarget.indexOf("1") != -1 ? changeTarget
											.replace("1", "2")
											: changeTarget.replace("2", "1");
	
									$('input[name=' + changeTarget + ']').val(
											$(this).val());
								}
							}
						});

		//Age Calulator popup
		$('#AgeCalulatorBtn').click(function() {
			$('.agelayer').css("display", 'block');
		});

		//탑승객 유형 계산 버튼 Event
		$('#ageCalculateBtn')
				.click(
						function() {
							var birthDay = $(
									'#ageCalculatorBirthY option:selected')
									.val()
									+ $('#ageCalculatorBirthM option:selected')
											.val()
									+ $('#ageCalculatorBirthD option:selected')
											.val();
							var depDate = $(
									'#ageCalculatorDepDateY option:selected')
									.val()
									+ '-'
									+ $(
											'#ageCalculatorDepDateM option:selected')
											.val()
									+ '-'
									+ $(
											'#ageCalculatorDepDateD option:selected')
											.val();

							checkAgeCalculatorRst(birthDay, depDate);
						});

		//Airport Search
		$(".CitySearchBtn").click(function() {

			airportTarget = $(this).attr('id');
			if ($('#airportList').text().trim() == "") {
				searchAirport();
			} else {
				$('.codelayer').css("display", 'block');
			}

		});

		//Airport 타입 선택 이벤트 (한글, 영문)
		$('input[name=airportType]').click(function() {
			$('.airportNm').hide();
			$('.' + $(this).val() + 'AirportNm').show();

		});

		//Fare + Avail 버튼 이벤트
		$('#fareAvailBtn').click(function() {
			btnSearchFareAndAvail();
		});

		//Avail 버튼 이벤트
		$('#availBtn').click(function() {
			btnSearchAvail();	
			
		});
		////////////////////////검색영역 이벤트 끝////////////////////////

		////////////////////////조회 후 Segment 요소들 이벤트////////////////////////

		//각 여정 상단 날짜변경시 이벤트. 여정 재조회
		$(document).on('change', '.segmentDateInput', function() {
			var depDate = $(this).val().dateFormat('YYYY-MM-DD');

			changeDateInSegment($(this).attr('segmentNumber'), depDate);
		});

		//각 여정 상단 날짜변경 버튼 이벤트 (이전일자)
		$(document).on('click', '.btnPreDay', function() {
			var dateInputEl = $(this).closest('div').find('.segmentDateInput');

			if (dateInputEl.val() == today.dateFormat('DDMMMYY')) {
				alert('오늘보다 이전날짜로는 조회 하실수 없습니다.');
				return false;
			}

			var dateFormatDepDate = new Date(dateInputEl.val().dateFormat('YYYY-MM-DD'));
			dateFormatDepDate.setDate(dateFormatDepDate.getDate() - 1);
			$(this).closest('div').find('.segmentDateInput').val(dateFormatDepDate.dateFormat('DDMMMYY'));
			dateInputEl.trigger('change');
		});

		//각 여정 상단 날짜변경 버튼 이벤트 (다음일자)
		$(document).on('click', '.btnNextDay', function() {
			var dateInputEl = $(this).closest('div').find('.segmentDateInput');

			if (dateInputEl.val() == maxAvailDate.dateFormat('DDMMMYY')) {
				return false;
			}

			var dateFormatDepDate = new Date(dateInputEl.val().dateFormat('YYYY-MM-DD'));
			dateFormatDepDate.setDate(dateFormatDepDate.getDate() + 1);
			$(this).closest('div').find('.segmentDateInput').val(dateFormatDepDate.dateFormat('DDMMMYY'));
			dateInputEl.trigger('change');
		});

		//여정의 운임 및 클래스 선택 이벤트
		$(document).on('click', '.selectAvail', function() {

			if ($(this).hasClass('current'))
				return false;

			if (typeof (fareAjaxXHR) != 'undefined') {
				fareAjaxXHR.abort(); //priceFare.do 요청 취소
			}
			
			$(this).closest('tbody').find('.current')
					.removeClass('current').addClass(
							'selectAvail');

			if (isFareFamily) { //FareFamily 검색 결과는 클래스:운임이 1:n이라 bundleType도 추가
				$(
						'.selectNo_'
								+ $(this).attr('segNumber')
								+ '_'
								+ $(this).attr('flightSeq')
								+ '_'
								+ $(this).attr('flightClass')
								+ '_'
								+ $(this).attr('bundleType'))
						.addClass('current').removeClass(
								'selectAvail');
			} else {
				$(
						'.selectNo_'
								+ $(this).attr('segNumber')
								+ '_'
								+ $(this).attr('flightSeq')
								+ '_'
								+ $(this).attr('flightClass'))
						.addClass('current').removeClass(
								'selectAvail');
			}

			var selectedSegmentNum = $(this).attr('segNumber');

			//선택시 이미 Itenerary선택이 구간개수와 동일하다면 수정으로 간주, fare테이블을 삭제
			if ($('#itineraryTable tbody tr').length == segmentSize) {
				$('.fareTable tbody').empty();
				$('div[id^=fareDiv]').hide();
			}

			var selectedAvail = $('#availListTable'
					+ selectedSegmentNum + ' #avail_'
					+ $(this).attr('flightSeq'));

			createItineraryTbl(selectedAvail,
					selectedSegmentNum, $(this));

			if ($('#itineraryTable tbody tr').length == segmentSize) {
				$('#fareSellBtnDiv').show();
			}

		});

		//Fare 버튼 이벤트
		$('#fareSearchBtn').click(function() {
			if (searchDataTmp.tripType != 'OW' && searchDataTmp.depDate1.dateFormat('YYYYMMDD') > searchDataTmp.depDate2.dateFormat('YYYYMMDD')) {
				alert("도착일이 출발일보다 빠릅니다. 날짜를 확인해 주세요.");
				return false;
			} 

			searchFare();
		});

		//Sell 버튼 이벤트
		$('#sellBtn').click(function() {
			if (searchDataTmp.tripType != 'OW' && searchDataTmp.depDate1.dateFormat('YYYYMMDD') > searchDataTmp.depDate2.dateFormat('YYYYMMDD')) {
				alert("도착일이 출발일보다 빠릅니다. 날짜를 확인해 주세요.");
				return false;
			} 
			sell();
		});

		$(document).on('change', $('.ItineraryBundleType'), function() {
			$('.fare_view').hide();
		});
	}); //end $(function()

	
	function btnSearchFareAndAvail() {
		$(availAjaxXHR).each(function(index, ajaxXHR) {
			if (typeof (ajaxXHR) != 'undefined') {
				ajaxXHR.abort();
			}
		});

		if (validate('availSearchForm')) {
			if (availValidate()) {

				$('div[id^=segment_div]').hide();

				selectedAvailObjects = [];

				searchFareAvail(1, '');
				if ($('input[type=radio][name=tripType]:checked').val() != 'OW') {
					searchFareAvail(2, '');
				}

				$('#itineraryTable tbody').empty();
			}
		}
	}

	function btnSearchAvail() {
		$(availAjaxXHR).each(function(index, ajaxXHR) {
			if (typeof (ajaxXHR) != 'undefined') {
				ajaxXHR.abort();
			}
		});
		if (validate('availSearchForm')) {
			if (availValidate()) {

				$('div[id^=segment_div]').hide();

				selectedAvailObjects = [];

				searchAvail(1, '');
				if ($('input[type=radio][name=tripType]:checked').val() != 'OW') {
					searchAvail(2, '');
				}

				$('#itineraryTable tbody').empty();
			}
		}
	}

	//Fare+Avail, Avail 검색조건 Validation
	function availValidate() {

		if ($('input[type=radio][name=tripType]:checked').val() != 'OW') {
			var depDate1 = $('input[name=depDate1]').val().dateFormat(
					'YYYYMMDD');
			var depDate2 = $('input[name=depDate2]').val().dateFormat(
					'YYYYMMDD');

			if (depDate1 > depDate2) {
				commonNotice("도착일이 출발일보다 빠릅니다. 날짜를 확인하세요.");
				return false;
			}

		}

		var adtCnt = $('input[name=adtCnt]').val();
		var chdCnt = $('input[name=chdCnt]').val();

		if (Number(adtCnt) + Number(chdCnt) <= 0) {
			commonNotice("탑승객 수를 입력하세요");
			return false;
		}
		
		if ((Number($('input[name=adtCnt]').val()) + Number($('input[name=chdCnt]').val())) >= 10 
				&& !$('input:checkbox[name=isGroup]').is(':checked')) {
			alert('10명 이상 예약 진행 할 수 없습니다.');
			return false;
		}
		
		if ( Number($('input[name=adtCnt]').val()) < Number($('input[name=infCnt]').val()) ) {
			alert('성인1명에 유아1명만 예약할 수 있으며, 나머지 유아는 소아로 예약해야 합니다.');
			return false;
		}
		
		if ( $('input[name=depStn1]').val() == $('input[name=arrStn1]').val() 
				|| ( $('input[name=depStn2]').val() == $('input[name=arrStn2]').val() && $('input[type=radio][name=tripType]:checked').val() != 'OW') ) {
			alert('출발지, 도착지가 같습니다. 공항코드를 확인해 주세요.');
			return false;
		}

		return true;

	}

	//공항검색
	function searchAirport() {

		ajaxCall(
				"/searchAirportCode.do",
				JSON.stringify({
					NationCode : ""
				}),
				function(data) {
					var airportHtml = '';

					$
							.each(
									data.Result.data,
									function(index, airportData) {
										airportHtml += '<tr><td><span class="korAirportNm airportNm">'
												+ airportData.AIRPORTNAMEKR
												+ '</span><span class="engAirportNm airportNm" style="display:none;">'
												+ airportData.AIRPORTNAMEEN
												+ '</span></td>';
										airportHtml += '<td><a href="javascript:selectAirport(\''
												+ airportData.AIRPORTCODE
												+ '\', \''
												+ airportData.NATIONCODE.trim()
												+ '\');">'
												+ airportData.AIRPORTCODE
												+ '</a></td>';
										airportHtml += '<td>'
												+ airportData.NATIONCODE
												+ '</td></tr>';
									});

					$('#airportList').html(airportHtml);

					$('.codelayer').css("display", 'block');

				});

	}

	//공항 선택시 검색조건에 입력
	function selectAirport(airportCode, nationCode) {
		$('input[name=' + airportTarget + ']').val(airportCode);
		$('input[name=' + airportTarget + ']').attr('nationCode', nationCode);
		$('.codelayer').css("display", 'none');

		$('input[name=' + airportTarget + ']').trigger("keyup");
	}

	///////////////////////////////////////////////////// Fare + Avail /////////////////////////////////////////////////////

	//Fare+Avail 조회 Action
	function searchFareAvail(segNumber, depDateFromSegment) {

		$('#fareSellBtnDiv').hide();
		$('#itineraryTable tbody #itnNumber' + segNumber).remove();
		$('div[id^=fareDiv]').hide();

		$('.segment_view').show();
		$('.availLoading').eq(segNumber - 1).show();
		$('table[id^=availListTable]').removeClass('row2');

		searchType = 'FareAvail';

		var segType = segNumber == 1 ? "DEP" : "RET";

		var searchData = new Object();

		if (depDateFromSegment != '') { //화살표로 날짜 이동시
			searchData.depDate = depDateFromSegment;
			searchData.tripType = searchDataTmp.tripType;
			searchData.segType = segType;
			searchData.depStn = searchDataTmp['depStn' + segNumber];
			searchData.arrStn = searchDataTmp['arrStn' + segNumber];
			searchData.adultPaxCnt = searchDataTmp.adultPaxCnt;
			searchData.childPaxCnt = searchDataTmp.childPaxCnt;
			searchData.infantPaxCnt = searchDataTmp.infantPaxCnt;
			searchData.isGroup = searchDataTmp.isGroup;
			searchData.officeInfo = searchDataTmp.officeInfo;
			searchData.routeType = routeType;

			searchDataTmp['depDate' + segNumber] = depDateFromSegment;
		} else {

			var depDate = $('input[name=depDate' + segNumber + ']').val();
			searchData.depDate = depDate.dateFormat('YYYY-MM-DD');

			searchData.tripType = $('input[name=tripType]:checked').val();
			searchData.segType = segType;
			searchData.depStn = $('input[name=depStn' + segNumber + ']').val();
			searchData.arrStn = $('input[name=arrStn' + segNumber + ']').val();
			searchData.adultPaxCnt = $('input[name=adtCnt]').val();
			searchData.childPaxCnt = $('input[name=chdCnt]').val();
			searchData.infantPaxCnt = $('input[name=infCnt]').val();
			searchData.isGroup = $('input:checkbox[name=isGroup]').is(
					':checked') ? "Y" : "N";
			searchData.officeInfo = parent.officeList[$(
					'select[name=officeList] option:selected').attr(
					'officeIndex')];
			searchData.routeType = routeType;

			searchDataTmp.tripType = $('input[name=tripType]:checked').val();
			searchDataTmp.segType = segType;
			searchDataTmp['depStn' + segNumber] = $(
					'input[name=depStn' + segNumber + ']').val();
			searchDataTmp['arrStn' + segNumber] = $(
					'input[name=arrStn' + segNumber + ']').val();
			searchDataTmp['depDate' + segNumber] = $(
					'input[name=depDate' + segNumber + ']').val();
			searchDataTmp['time' + segNumber] = $(
					'input[name=time' + segNumber + ']').val();
			searchDataTmp.adultPaxCnt = $('input[name=adtCnt]').val();
			searchDataTmp.childPaxCnt = $('input[name=chdCnt]').val();
			searchDataTmp.infantPaxCnt = $('input[name=infCnt]').val();
			searchDataTmp.isGroup = $('input:checkbox[name=isGroup]').is(
					':checked') ? "Y" : "N";
			searchDataTmp.officeInfo = parent.officeList[$(
					'select[name=officeList] option:selected').attr(
					'officeIndex')];

		}

		var searchDataToJsonStr = JSON.stringify(searchData);

		availAjaxXHR[segNumber] = ajaxCall("/searchAvailnFare.do",
				searchDataToJsonStr, function(data) {

					if (data.Result.length != 0) {
						createSegmentTopInfo(segNumber); //segment 상단 구성
					}

					if (data.Result.code == '0000') {
						routeType = data.Result.data.routeType;
						isFareFamily = data.Result.data.isFareFamily;
					}
					if (data.Result.data == null) {
						createFareAvailSegmentTbl(data.Result, segNumber);
					} else {
						if (data.Result.data.isFareFamily) {
							createFamilyFareAvailSegmentTbl(data.Result,
									segNumber);
						} else {
							createFareAvailSegmentTbl(data.Result, segNumber);
						}
					}

					$('#segment_div' + segNumber + ' .board').show();
					$('#segment_div' + segNumber).show();
					$('#itinerarySubTit').show();

				}, null, null, null, function() {
					$('.availLoading').eq(segNumber - 1).hide();
				}, null, true);

	}

	//Fare + Avail 조회결과 리스트 (FareFamily)
	function createFamilyFareAvailSegmentTbl(availData, segNumber) {

		$('#bundleTH, #bundleCol').show();

		$('#availListTable' + segNumber + ' tbody').empty();

		$('.domSegmentTableHead').eq(segNumber - 1).show();
		$('.intSegmentTableHead').eq(segNumber - 1).hide();
		$('.availSegmentTableHead').eq(segNumber - 1).hide();

		$('#availListTable' + segNumber + ' colgroup').html(
				'<col style="width:8%;">');
		$('#availListTable' + segNumber + ' colgroup').append('<col>');
		$('#availListTable' + segNumber + ' colgroup').append(
				'<col style="width:10%;">');
		$('#availListTable' + segNumber + ' colgroup').append(
				'<col style="width:10%;">');
		$('#availListTable' + segNumber + ' colgroup').append(
				'<col style="width:10%;">');
		$('#availListTable' + segNumber + ' colgroup').append(
				'<col style="width:150px;">');
		$('#availListTable' + segNumber + ' colgroup').append(
				'<col style="width:150px">');
		$('#availListTable' + segNumber + ' colgroup').append(
				'<col style="width:150px">');

		//여정테이블 생성
		var availListHtml = '';

		var selectCls;

		if (availData.data == null)
			availData.data = [];
		if (availData.data.availnFareInfoList == null) {
			if (availData.message == "NO ROUTINGS") {
				message = "예약 가능한 운항편이 존재하지 않습니다.";
			} else if (availData.code == '1001') {
				message = "조회된 정보가 없습니다.";
			} else {

				if (availData.message == null) {
					message = "errorCode: " + availData.code;
				} else if (availData.message.trim() == "") {
					message = "여정 조회중 오류 발생";
				} else {
					message = availData.message;
				}
			}
			availListHtml += '<tr><td colspan="8">' + message + '</td><tr>';
		} else {
			$(availData.data.availnFareInfoList)
					.each(
							function(index, avail) {

								//출발시간 검색조건 체크
								if (searchDataTmp['time' + segNumber] > avail.depTime
										.replace(":", "").substr(0, 4)) {
									if (index == (availData.data.availnFareInfoList.length - 1)) { //마지막 여정이 시간지난 여정이면 가능한여정 없음.
										availListHtml += '<tr><td colspan="8">예약 가능한 운항편이 존재하지 않습니다.</td><tr>';
									}
									return true;
								}

								availListHtml += '<tr id="avail_' + (index)
										+ '">';
								availListHtml += '<td>' + (index + 1) + '</td>';
								availListHtml += '<td class="flight">'
										+ avail.carrier + avail.fltNo + '</td>';
								availListHtml += '<td class="from" depDate="'+avail.depDate+'"><span class="depStn">'
										+ avail.depStn
										+ '</span><span class="time">'
										+ avail.depTime.substr(0, 2)
										+ ":"
										+ avail.depTime.substr(2)
										+ '</span></td>';
								availListHtml += '<td class="to" arrDate="'+avail.arrDate+'"><span class="arrStn">'
										+ avail.arrStn
										+ '</span><span class="time">'
										+ avail.arrTime.substr(0, 2)
										+ ":"
										+ avail.arrTime.substr(2)
										+ '</span></td>';
								availListHtml += '<td>'
										+ (avail.normalSeatCount == "0" ? "0"
												: avail.normalRBD
														+ avail.normalSeatCount)
										+ '</td>';

								if (avail.specialEquivFare == null
										|| avail.specialEquivFare.trim() == ""
										|| avail.specialEquivFare.trim() == "0"
										|| avail.normalSeatCount == "0") {
									availListHtml += '<td>-</td>';
								} else {
									availListHtml += '<td class="align-right selectAvail selectNo_'+segNumber+'_'+index+'_'+avail.normalRBD+'_" segNumber = "'+segNumber+'" flightSeq="'+index+'" flightClass="'+avail.normalRBD+'" fareBasis="'+avail.normalEquivFareBasis+'" bundleType=""><div class="tooltip">';
									availListHtml += '<span class="price off">'
											+ avail.currency + ' '
											+ addComma(avail.specialEquivFare)
											+ '</span>';
									availListHtml += '<span class="tooltiptext tooltip-bottom">고객센터에서 판매할 수 없는 운임입니다.</span></div></td>';
								}

								if (avail.discountEquivFare == null
										|| avail.discountEquivFare.trim() == ""
										|| avail.discountEquivFare.trim() == "0"
										|| avail.normalSeatCount == "0") {
									availListHtml += '<td>-</td>';
								} else {
									availListHtml += '<td class="selectAvail selectNo_'+segNumber+'_'+index+'_'+avail.normalRBD+'_V" segNumber = "'+segNumber+'" flightSeq="'+index+'" flightClass="'+avail.normalRBD+'" fareBasis="'+avail.normalEquivFareBasis+'" bundleType="V">'
											+ avail.currency
											+ ' '
											+ addComma(avail.discountEquivFare)
											+ '</td>';
								}

								if (avail.normalEquivFare == null
										|| avail.normalEquivFare.trim() == ""
										|| avail.normalEquivFare.trim() == "0"
										|| avail.normalSeatCount == "0") {
									availListHtml += '<td>-</td>';
								} else {
									availListHtml += '<td class="selectAvail selectNo_'+segNumber+'_'+index+'_'+avail.normalRBD+'_P" segNumber = "'+segNumber+'" flightSeq="'+index+'" flightClass="'+avail.normalRBD+'" fareBasis="'+avail.normalEquivFareBasis+'" bundleType="P">'
											+ avail.currency
											+ ' '
											+ addComma(avail.normalEquivFare)
											+ '</td>';
								}

								availListHtml += '</tr>';
							});
		}

		$('#availListTable' + segNumber + ' tbody').append(availListHtml);
	}

	//Fare + Avail 조회결과 리스트
	function createFareAvailSegmentTbl(availData, segNumber) {

		$('#bundleTH, #bundleCol').hide();
		$('#availListTable' + segNumber + ' tbody').empty();

		$('.intSegmentTableHead').eq(segNumber - 1).show();
		$('.domSegmentTableHead').eq(segNumber - 1).hide();
		$('.availSegmentTableHead').eq(segNumber - 1).hide();

		$('#availListTable' + segNumber + ' colgroup').html(
				'<col style="width:8%;">');
		$('#availListTable' + segNumber + ' colgroup').append('<col>');
		$('#availListTable' + segNumber + ' colgroup').append(
				'<col style="width:13%;">');
		$('#availListTable' + segNumber + ' colgroup').append(
				'<col style="width:13%;">');
		$('#availListTable' + segNumber + ' colgroup').append(
				'<col style="width:9%;">');
		$('#availListTable' + segNumber + ' colgroup').append(
				'<col style="width:9%;">');
		$('#availListTable' + segNumber + ' colgroup').append(
				'<col style="width:9%;">');
		$('#availListTable' + segNumber + ' colgroup').append(
				'<col style="width:9%;">');
		$('#availListTable' + segNumber + ' colgroup').append(
				'<col style="width:9%;">');
		$('#availListTable' + segNumber + ' colgroup').append(
				'<col style="width:9%;">');

		//여정테이블 생성
		var availListHtml = '';

		var selectClsNor;
		var selectClsDis;
		var selectClsSpe;

		var norClsShow;
		var disClsShow;
		var speClsShow;

		var normalEquivFare;
		var discountEquivFare
		var specialEquivFare;

		if (availData.data == null)
			availData.data = [];
		if (availData.data.availnFareInfoList == null) {
			if (availData.message == "NO ROUTINGS") {
				message = "예약 가능한 운항편이 존재하지 않습니다.";
			} else if (availData.code == '1001') {
				message = "조회된 정보가 없습니다.";
			} else {
				if (availData.message.trim() == "") {
					message = "여정 조회중 오류 발생";
				} else {
					message = availData.message;
				}
			}
			availListHtml += '<tr><td colspan="10">' + message + '</td><tr>';
		} else {
			$(availData.data.availnFareInfoList)
					.each(
							function(index, avail) {

								//출발시간 검색조건 체크
								if (searchDataTmp['time' + segNumber] > avail.depTime
										.replace(":", "").substr(0, 4)) {
									if (index == (availData.data.availnFareInfoList.length - 1)) { //마지막 여정이 시간지난 여정이면 가능한여정 없음.
										availListHtml += '<tr><td colspan="10">예약 가능한 운항편이 존재하지 않습니다.</td><tr>';
									}
									return true;
								}

								availListHtml += '<tr id="avail_' + (index)
										+ '">';
								availListHtml += '<td>' + (index + 1) + '</td>';
								availListHtml += '<td class="flight">'
										+ avail.carrier + avail.fltNo + '</td>';
								availListHtml += '<td class="from" depDate="'+avail.depDate+'"><span class="depStn">'
										+ avail.depStn
										+ '</span><span class="time">'
										+ avail.depTime.substr(0, 2)
										+ ":"
										+ avail.depTime.substr(2)
										+ '</span></td>';
										
								var overDate = moment(avail.arrDate, 'YYYY-MM-DD').diff(avail.depDate, "days");
								
								availListHtml += '<td class="to" arrDate="'+avail.arrDate+'"><span class="arrStn">'
										+ avail.arrStn
										+ '</span><span class="time">'
										+ avail.arrTime.substr(0, 2)
										+ ":"
										+ avail.arrTime.substr(2) + (overDate == '0' ? '' : ' + ' + overDate)
										+ '</span></td>';

								if (avail.specialSeatCount == '')
									avail.specialSeatCount = '0';
								if (avail.discountSeatCount == '')
									avail.discountSeatCount = '0';
								if (avail.normalSeatCount == '')
									avail.normalSeatCount = '0';

								selectClsSpe = avail.specialSeatCount == "0" ? ""
										: 'selectAvail selectNo_' + segNumber
												+ '_' + index + '_'
												+ avail.specialRBD;
								selectClsDis = avail.discountSeatCount == "0" ? ""
										: 'selectAvail selectNo_' + segNumber
												+ '_' + index + '_'
												+ avail.discountRBD;
								selectClsNor = avail.normalSeatCount == "0" ? ""
										: 'selectAvail selectNo_' + segNumber
												+ '_' + index + '_'
												+ avail.normalRBD;

								speClsShow = avail.specialSeatCount == "0" ? "0"
										: avail.specialRBD
												+ avail.specialSeatCount;
								disClsShow = avail.discountSeatCount == "0" ? "0"
										: avail.discountRBD
												+ avail.discountSeatCount;
								norClsShow = avail.normalSeatCount == "0" ? "0"
										: avail.normalRBD
												+ avail.normalSeatCount;

								specialEquivFare = avail.specialEquivFare == "0"
										|| avail.specialEquivFare == "" ? "0"
										: addComma(avail.specialEquivFare);
								discountEquivFare = avail.discountEquivFare == "0"
										|| avail.discountEquivFare == "" ? "0"
										: addComma(avail.discountEquivFare);
								normalEquivFare = avail.normalEquivFare == "0"
										|| avail.normalEquivFare == "" ? "0"
										: addComma(avail.normalEquivFare);

								availListHtml += '<td class="'+selectClsSpe+'" segNumber = "'+segNumber+'" flightSeq="'+index+'" flightClass="'+avail.specialRBD+'" fareBasis="'+avail.specialEquivFareBasis+'">'
										+ speClsShow + '</td>';
								availListHtml += '<td class="'+selectClsDis+'" segNumber = "'+segNumber+'" flightSeq="'+index+'" flightClass="'+avail.discountRBD+'" fareBasis="'+avail.discountEquivFareBasis+'">'
										+ disClsShow + '</td>';
								availListHtml += '<td class="'+selectClsNor+'" segNumber = "'+segNumber+'" flightSeq="'+index+'" flightClass="'+avail.normalRBD+'" fareBasis="'+avail.normalEquivFareBasis+'">'
										+ norClsShow + '</td>';

								availListHtml += '<td class="align-right '+selectClsSpe+'" segNumber = "'+segNumber+'" flightSeq="'+index+'" flightClass="'+avail.specialRBD+'" fareBasis="'+avail.specialEquivFareBasis+'">'
										+ avail.currency
										+ ' '
										+ specialEquivFare + '</td>';
								availListHtml += '<td class="align-right '+selectClsDis+'" segNumber = "'+segNumber+'" flightSeq="'+index+'" flightClass="'+avail.discountRBD+'" fareBasis="'+avail.discountEquivFareBasis+'">'
										+ avail.currency
										+ ' '
										+ discountEquivFare + '</td>';
								availListHtml += '<td class="align-right '+selectClsNor+'" segNumber = "'+segNumber+'" flightSeq="'+index+'" flightClass="'+avail.normalRBD+'" fareBasis="'+avail.normalEquivFareBasis+'">'
										+ avail.currency
										+ ' '
										+ normalEquivFare + '</td>';
								availListHtml += '</tr>';
							});
		}

		$('#availListTable' + segNumber + ' tbody').append(availListHtml);
	}
	///////////////////////////////////////////////////// Fare + Avail End /////////////////////////////////////////////////////

	///////////////////////////////////////////////////// Avail /////////////////////////////////////////////////////
	//Avail 조회 Action
	function searchAvail(segNumber, depDateFromSegment) {

		$('#fareSellBtnDiv').hide();
		$('#itineraryTable tbody #itnNumber' + segNumber).remove();
		$('div[id^=fareDiv]').hide();
		$('.segment_view').show();
		$('table[id^=availListTable]').addClass('row2');
		$('.availLoading').eq(segNumber - 1).show();

		searchType = 'Avail';

		var searchData = new Object();

		if (depDateFromSegment != '') { //segment내에 화살표, 달력으로 조회할경우
			searchData.depDate = depDateFromSegment;
			searchData.depStn = searchDataTmp['depStn' + segNumber];
			searchData.arrStn = searchDataTmp['arrStn' + segNumber];
			searchData.officeInfo = searchDataTmp.officeInfo;
			searchData.isGroup = searchDataTmp.isGroup;

			searchDataTmp['depDate' + segNumber] = depDateFromSegment;
		} else {

			var depDate = $('input[name=depDate' + segNumber + ']').val();
			searchData.depDate = depDate.dateFormat('YYYY-MM-DD');
			searchData.depStn = $('input[name=depStn' + segNumber + ']').val();
			searchData.arrStn = $('input[name=arrStn' + segNumber + ']').val();
			searchData.officeInfo = parent.officeList[$(
					'select[name=officeList] option:selected').attr(
					'officeIndex')];

			searchDataTmp['time' + segNumber] = $(
					'input[name=time' + segNumber + ']').val();

			searchDataTmp['depDate' + segNumber] = $(
					'input[name=depDate' + segNumber + ']').val();
			searchDataTmp['depStn' + segNumber] = $(
					'input[name=depStn' + segNumber + ']').val();
			searchDataTmp['arrStn' + segNumber] = $(
					'input[name=arrStn' + segNumber + ']').val();
			searchDataTmp.adultPaxCnt = $('input[name=adtCnt]').val();
			searchDataTmp.childPaxCnt = $('input[name=chdCnt]').val();
			searchDataTmp.infantPaxCnt = $('input[name=infCnt]').val();
			searchDataTmp.officeInfo = parent.officeList[$(
					'select[name=officeList] option:selected').attr(
					'officeIndex')];
			searchDataTmp.isGroup = $('input:checkbox[name=isGroup]').is(
					':checked') ? "Y" : "N";
			searchDataTmp.tripType = $(
					'input[type=radio][name=tripType]:checked').val();
		}

		var searchDataToJsonStr = JSON.stringify(searchData);

		availAjaxXHR[segNumber] = ajaxCall('/searchAvail.do',
				searchDataToJsonStr, function(data) {
					if (data.Result.length != 0) {
						createSegmentTopInfo(segNumber); //segment 상단 구성
					}

					if (data.Result.code == '0000') {
						routeType = data.Result.data.routeType;
						isFareFamily = data.Result.data.isFareFamily;
					}

					createAvailSegmentTbl(data.Result, segNumber);

					$('#segment_div' + segNumber + ' .board').show();
					$('#segment_div' + segNumber).show();
					$('#itinerarySubTit').show();

				}, null, null, null, function() {
					$('.availLoading').eq(segNumber - 1).hide();
				}, null, true);

	}

	//Avail 조회결과 리스트 생성
	function createAvailSegmentTbl(availData, segNumber) {

		if (routeType != 'D') {
			$('#bundleTH').hide();
			$('#bundleCol').hide();
		} else {
			$('#bundleTH').show();
			$('#bundleCol').show();
		}
		$('#availListTable' + segNumber + ' tbody').empty();

		$('.availSegmentTableHead').show();
		$('.domSegmentTableHead').hide();
		$('.intSegmentTableHead').hide();

		$('#availListTable' + segNumber + ' colgroup').html(
				'<col style="width:6%;">');
		$('#availListTable' + segNumber + ' colgroup').append('<col>');
		$('#availListTable' + segNumber + ' colgroup').append('<col>');
		$('#availListTable' + segNumber + ' colgroup').append('<col>');
		$('#availListTable' + segNumber + ' colgroup').append(
				'<col style="width:5%;">');
		$('#availListTable' + segNumber + ' colgroup').append(
				'<col style="width:5%;">');
		$('#availListTable' + segNumber + ' colgroup').append(
				'<col style="width:5%;">');
		$('#availListTable' + segNumber + ' colgroup').append(
				'<col style="width:5%;">');
		$('#availListTable' + segNumber + ' colgroup').append(
				'<col style="width:5%;">');
		$('#availListTable' + segNumber + ' colgroup').append(
				'<col style="width:5%;">');
		$('#availListTable' + segNumber + ' colgroup').append(
				'<col style="width:5%;">');
		$('#availListTable' + segNumber + ' colgroup').append(
				'<col style="width:5%;">');
		$('#availListTable' + segNumber + ' colgroup').append(
				'<col style="width:5%;">');
		$('#availListTable' + segNumber + ' colgroup').append(
				'<col style="width:5%;">');
		$('#availListTable' + segNumber + ' colgroup').append(
				'<col style="width:5%;">');
		$('#availListTable' + segNumber + ' colgroup').append(
				'<col style="width:5%;">');
		$('#availListTable' + segNumber + ' colgroup').append(
				'<col style="width:5%;">');

		//여정테이블 생성

		var availListHtml = '';

		if (availData.data == null)
			availData.data = [];
		if (availData.data.availnFareInfoList == null) {
			var message = "";

			if (availData.message == "NO ROUTINGS") {
				message = "예약 가능한 운항편이 존재하지 않습니다.";
			} else {
				if (availData.message.trim() == "") {
					message = "여정 조회중 오류 발생";
				} else {
					message = availData.message;
				}
			}
			availListHtml += '<tr><td colspan="17">' + message + '</td><tr>';
		} else {

			var no = 1;
			$(availData.data.availnFareInfoList)
					.each(
							function(index, flightSegment) {

								var depTime = flightSegment.depTime;
								var arrTime = flightSegment.arrTime;

								//출발시간 검색조건 체크
								if (searchDataTmp['time' + segNumber] > depTime.replace(":", "").substr(0, 4)
										|| (new Date().dateFormat('YYMMDDHHmm') > (flightSegment.depDate+depTime).dateFormat('YYMMDDHHmm') )) {
									if (index == (availData.data.availnFareInfoList.length - 1)) { //마지막 여정이 시간지난 여정이면 가능한여정 없음.
										availListHtml += '<tr><td colspan="17">예약 가능한 운항편이 존재하지 않습니다.</td><tr>';
									}
									return true;
								}

								availListHtml += '<tr id="avail_' + (index)
										+ '">';

								var seatLength = flightSegment.seatDataList.length;
								var rowspanValue = 1;

								if (seatLength > 13) {
									rowspanValue = Math.ceil(seatLength / 13);
								}

								availListHtml += '<td rowspan="'+rowspanValue+'">'
										+ no + '</td>';
								no++;
								availListHtml += '<td rowspan="'+rowspanValue+'" class="flight">'
										+ flightSegment.carrier
										+ flightSegment.fltNo + '</td>';
								availListHtml += '<td rowspan="'+rowspanValue+'" class="from" depDate="'+flightSegment.depDate+'"><span class="depStn">'
										+ flightSegment.depStn
										+ '</span><span class="time">'
										+ depTime + '</td>';
										
								var overDate = moment(flightSegment.arrDate, 'YYYY-MM-DD').diff(flightSegment.depDate, "days");
								
								availListHtml += '<td rowspan="'+rowspanValue+'" class="to" arrDate="'+flightSegment.arrDate+'"><span class="arrStn">'
										+ flightSegment.arrStn
										+ '</span><span class="time">'
										+ arrTime + (overDate == '0' ? '' : ' + ' + overDate) + '</td>';

								var selectCls;
								$(flightSegment.seatDataList)
										.each(
												function(bcIndex, avail) {

													selectCls = "selectAvail selectNo_"
															+ segNumber
															+ "_"
															+ index
															+ "_"
															+ avail.rbd;

													availListHtml += '<td class="'+selectCls+'" segNumber = "'+segNumber+'" flightSeq="'+index+'" flightClass="'+avail.rbd+'">'
															+ avail.rbd
															+ avail.seatCount
															+ '</td>';

													if ((bcIndex + 1) % 13 != 0) {

														if (seatLength == (bcIndex + 1)) {
															for (i = 1; i <= 13 - seatLength % 13; i++) {
																availListHtml += '<td></td>';
															}
														}

													} else {
														availListHtml += "</tr><tr>";
													}
												});
								availListHtml += '</tr>';
							});

			availListHtml += '</tr>';
		}

		$('#availListTable' + segNumber).append(availListHtml);
	}

	///////////////////////////////////////////////////// Avail End /////////////////////////////////////////////////////

	//여정 조회결과 상단에 출/도착지, Date Inputbox, 소아/유아 생년월일 구성
	function createSegmentTopInfo(segNumber) {

		var departureDate = searchDataTmp['depDate' + segNumber];
		var nowDateMUT = today.dateFormat('DDMMMYY');

		//segment 여정 텍스트 생성
		var segmentInfoHtml = 'Segment ' + segNumber + " : "
				+ searchDataTmp['depStn' + segNumber] + " "
				+ searchDataTmp['arrStn' + segNumber];
		$('#segment_div' + segNumber + ' .segment').html(segmentInfoHtml);

		$('#segment_div' + segNumber + ' .segmentDateInput').val(
				departureDate.dateFormat('DDMMMYY'));

		if (routeType == 'D') { //국내선은 각여정의 출발일 기준

			var kidBirthArray = getBirthForKid(departureDate
					.dateFormat('YYYY-MM-DD'), "D", 'DDMMMYY');

			var kidsBirthInfoHtml = '<strong>CHD :</strong> '
					+ kidBirthArray[0] + '~' + kidBirthArray[1]
					+ ' 출생, <strong>INF :</strong> ' + kidBirthArray[2] + '~'
					+ nowDateMUT + ' 출생';
			$('#segment_div' + segNumber + ' .birth').html(kidsBirthInfoHtml);

		} else if (routeType == 'I') { //국제선은 최초 출발여정의 출발일 기준

			var dateForCompare = '';
			if (segNumber == 1) {
				dateForCompare = departureDate;

				var kidBirthArray = getBirthForKid(dateForCompare
						.dateFormat('YYYY-MM-DD'), "I", 'DDMMMYY');

				var kidsBirthInfoHtml = '<strong>CHD :</strong> '
						+ kidBirthArray[0] + '~' + kidBirthArray[1]
						+ ' 출생, <strong>INF :</strong> ' + kidBirthArray[2]
						+ '~' + nowDateMUT + ' 출생';

				$('.segment_div .birth').html(kidsBirthInfoHtml);
			}
		}

	}

	//조회 후 날짜 변경시 이벤트
	function changeDateInSegment(segNumber, depDate) {
		
		//실행중이던 여정조회 cancel
		if (typeof (availAjaxXHR[segNumber]) != 'undefined') {
			availAjaxXHR[segNumber].abort();
		}
	
		
		$('#segment_div' + segNumber + ' .board').hide();

		if (searchType == 'FareAvail') {
			searchFareAvail(segNumber, depDate);
		} else {
			searchAvail(segNumber, depDate);
		}
		
	}

	//Itinerary 테이블 생성/수정, 선택한 좌석데이터 selectedAvailObjects에 추가
	function createItineraryTbl(selectedAvail, selectedSegmentNum,
			selectedAvailClassEl) {

		var depDate = selectedAvail.find('.from').attr('depDate').dateFormat(
				'YYYY-MM-DD');
		var arrDate = selectedAvail.find('.to').attr('arrDate').dateFormat(
				'YYYY-MM-DD');
		var RPH = selectedSegmentNum;
		var depStn = selectedAvail.find('.from .depStn').text();
		var arrStn = selectedAvail.find('.to .arrStn').text();
		var depTime = selectedAvail.find('.from .time').text().replace(':', '');
		var arrTime = selectedAvail.find('.to .time').text().replace(':', '');
		var airLineCode = selectedAvail.find('.flight').text().substr(0, 2);
		var flightNumber = selectedAvail.find('.flight').text().substr(2);
		var fareBasis = selectedAvailClassEl.attr('fareBasis');
		var resBookDesigCode = selectedAvailClassEl.attr('flightClass');
		var bundleType = selectedAvailClassEl.attr('bundleType');

		var seqNumber = RPH - 1;
		//Fare, Sell시에 쓰일 데이터, 전역변수.
		selectedAvailObjects[seqNumber] = new Object();
		selectedAvailObjects[seqNumber].depDate = depDate
				.dateFormat('YYYYMMDD');
		selectedAvailObjects[seqNumber].arrDate = arrDate
				.dateFormat('YYYYMMDD');
		selectedAvailObjects[seqNumber].depTime = depTime;
		selectedAvailObjects[seqNumber].arrTime = arrTime;

		selectedAvailObjects[seqNumber].numberInParty = Number(searchDataTmp.adultPaxCnt)
				+ Number(searchDataTmp.childPaxCnt);
		selectedAvailObjects[seqNumber].RPH = RPH;
		selectedAvailObjects[seqNumber].depStn = depStn;
		selectedAvailObjects[seqNumber].arrStn = arrStn;
		selectedAvailObjects[seqNumber].airLineCode = airLineCode;
		selectedAvailObjects[seqNumber].flightNumber = flightNumber;
		selectedAvailObjects[seqNumber].resBookDesigCode = resBookDesigCode;
		selectedAvailObjects[seqNumber].fareBasis = fareBasis;
		selectedAvailObjects[seqNumber].bundleType = bundleType;

		var beforeElementId = null; //추가하려는 여정보다 segment순서가 후의 여정정보가 이미 있는경우 before 메서드로 앞에 tr추가하기 위함
		var isExist = false;

		if ($('tr[id^=itnNumber]:gt(' + (seqNumber) + ')').length != 0) {
			isExist = true;
			beforeElementId = $('tr[id^=itnNumber]:gt(' + (seqNumber) + ')')[0].id; //현재 선택여정보다 후의 여정정보중 맨 처음 element id
		}

		$('#itnNumber' + RPH).remove();

		//Itinerary 생성
		var ItineraryListHtml = '';

		ItineraryListHtml += '<tr id="itnNumber'+RPH+'"> <td>' + RPH + '</td>';
		ItineraryListHtml += '<td class="itFlight">' + airLineCode
				+ flightNumber + '</td>';
		ItineraryListHtml += '<td class="itClass">' + resBookDesigCode
				+ '</td>';
		ItineraryListHtml += '<td class="itDate">' + depDate.dateFormat('DDMMMYY') + '</td>';
		ItineraryListHtml += '<td class="itDay">' + depDate.dateFormat('ddd')
				+ '</td>';
		ItineraryListHtml += '<td class="itFrom">' + depStn + '</td>';
		ItineraryListHtml += '<td class="itTo">' + arrStn + '</td>';
		ItineraryListHtml += '<td class="itDepTime">'
				+ selectedAvail.find('.from .time').text() + '</td>';
		ItineraryListHtml += '<td class="itArrTime">'
				+ selectedAvail.find('.to .time').text() + '</td>';

		if (routeType == 'D') {
			var bundleNames = {
				'' : 'Fly',
				'V' : 'Fly Bag',
				'P' : 'Fly Bag+'
			};

			if (searchType == 'Avail') {
				ItineraryListHtml += '<td><select class="ItineraryBundleType"><option value="V">Fly Bag</option> <option value="P">Fly Bag+</option> </select></td>';
			} else if (isFareFamily) {
				ItineraryListHtml += '<td>' + bundleNames[bundleType] + '</td>';
			}

		}

		if (searchDataTmp.isGroup == "Y") {
			ItineraryListHtml += '<td> <select class="ItineraryStatus"> <option value=ON selected>ON</option></select> </td></tr>';
		} else {
			ItineraryListHtml += '<td> <select class="ItineraryStatus"> <option selected value="NN">NN</option> <option value="ON">ON</option> <option value="SA">SA</option> </select> </td></tr>';
		}

		//현재 Itinerary 테이블 tr과 추가할 tr을 취합해서 sort하여 append함
		var rows = $('#itineraryTable tbody tr').get();
		rows.push(ItineraryListHtml);

		rows.sort(function(a, b) {
			var compare1 = $(a).children('td').eq(0).text();
			var compare2 = $(b).children('td').eq(0).text();

			return compare1 - compare2;
		})

		$.each(rows, function(index, row) {
			$('#itineraryTable tbody').append(row);
		});

	}

	//Fare 조회
	function searchFare() {

		$('div[id^=fareDiv]').hide();

		var fareSearchData = new Object();

		fareSearchData.paxType = 'ADT';
		fareSearchData.officeInfo = searchDataTmp.officeInfo;
		fareSearchData.issueDate = today.dateFormat('YYYYMMDD');
		fareSearchData.isAvailSearch = 'Y';

		fareSearchData.passengerInfo = new Array();
		fareSearchData.segmentInfo = new Array();

		var RPHIndex = 1;
		if (searchDataTmp.adultPaxCnt != 0) {
			fareSearchData.passengerInfo[RPHIndex - 1] = {
				RPH : RPHIndex,
				type : 'ADT'
			};
			RPHIndex++;
		}

		if (searchDataTmp.childPaxCnt != 0) {
			fareSearchData.passengerInfo[RPHIndex - 1] = {
				RPH : RPHIndex,
				type : 'CHD'
			};
			RPHIndex++;
		}

		if (searchDataTmp.infantPaxCnt != 0 && routeType == 'I') {
			fareSearchData.passengerInfo[RPHIndex - 1] = {
				RPH : RPHIndex,
				type : 'INF'
			};
		}

		$(selectedAvailObjects)
				.each(
						function(index, selectedAvailObject) {

							fareSearchData.segmentInfo[index] = new Object();

							fareSearchData.segmentInfo[index].RPH = index + 1;
							fareSearchData.segmentInfo[index].depStn = selectedAvailObject.depStn;
							fareSearchData.segmentInfo[index].arrStn = selectedAvailObject.arrStn;
							fareSearchData.segmentInfo[index].flightNo = selectedAvailObject.flightNumber
							fareSearchData.segmentInfo[index].depDate = selectedAvailObject.depDate+selectedAvailObject.depTime;
							//fareSearchData.segmentInfo[index].depTime = selectedAvailObject.depTime;
							fareSearchData.segmentInfo[index].arrDate = selectedAvailObject.arrDate+selectedAvailObject.arrTime;
							//fareSearchData.segmentInfo[index].arrTime = selectedAvailObject.arrTime;
							fareSearchData.segmentInfo[index].bookingClass = selectedAvailObject.resBookDesigCode;
							//fareSearchData.segmentInfo[index].fareBasis = selectedAvailObject.fareBasis;
							fareSearchData.segmentInfo[index].bundleType = typeof (selectedAvailObject.bundleType) != 'undefined' ? selectedAvailObject.bundleType
									: $('.ItineraryBundleType').eq(index).val();

						});

		searchFareAjax(fareSearchData);

	}

	function searchFareAjax(fareSearchData) {

		$('#fareLoading').show();

		searchDataToJsonStr = JSON.stringify(fareSearchData);

		fareAjaxXHR = ajaxCall("/priceFare.do", searchDataToJsonStr, function(
				data) {

			if (data.Result.data == null) {
				commonNotice('조회된 Fare 데이터가 존재하지않습니다.');
			} else {
				
				$('.warningMsg').text('');
				$('.warningMsg').hide();
				
				if (isFareFamily || (routeType == 'D' && searchType == 'Avail')) {
					createFareFamilyFareTbl(data.Result);
				} else {
					createFareTbl(data.Result);
				}
			}

		}, null, null, null, function() {
			$('#fareLoading').hide();
		}, null);
	}

	//Fare 리스트 생성
	function createFareFamilyFareTbl(fareData) {
		var fareHtml = '';

		var fareHtmlADT = '';
		var fareHtmlCHD = '';
		var fareHtmlINF = '';
		var totalLength = fareData.data.farePricingInfo.length;
		var bundleInfos = fareData.data.bundleInfo;

		var totalFare = 0;
		
		$(fareData.data.farePricingInfo)
				.each(
						function(index, farePricingInfo) {

							var fareHtml = '';
							var paxCnt;
							var totalAmount = Number(farePricingInfo.totalFare
									* searchDataTmp.adultPaxCnt)
									+ Number(farePricingInfo.totalFare
											* searchDataTmp.childPaxCnt);

							var bundleInfo = null;

							$(bundleInfos)
									.each(
											function(bundleIndex, bundle) {
												if (bundle != null) {
													if (farePricingInfo.segRPH == bundle.segRPH) {
														bundleInfo = bundle;
														return false;
													}
												}
											});
							if (farePricingInfo.paxTypeCode == 'ADT') {
								paxCnt = searchDataTmp.adultPaxCnt;
							} else if (farePricingInfo.paxTypeCode == 'CHD') {
								paxCnt = searchDataTmp.childPaxCnt;
							} else {
								paxCnt = searchDataTmp.infantPaxCnt;
							}

							fareHtml += '<tr>';
							if (farePricingInfo.segRPH == 1) {
								fareHtml += '<td rowspan="'+segmentSize+'">'
										+ farePricingInfo.paxTypeCode; + '</td>';
							}

							var bundleNames = {
								'' : 'Fly',
								'V' : 'Fly Bag',
								'P' : 'Fly Bag+'
							};

							if (farePricingInfo.bundleType == null)
								farePricingInfo.bundleType = '';

							fareHtml += '<td><div class="tooltip typetip">';
							fareHtml += '<span class="price">'
									+ bundleNames[farePricingInfo.bundleType]
									+ '</span>';

							var bundleText;
							if (farePricingInfo.bundleType == 'V') {
								bundleText = '위탁수하물 15kg';
							} else if (farePricingInfo.bundleType == 'P') {
								bundleText = '위탁수하물 20kg,<br> 일반좌석지정, <br>빠른 짐찾기,<br> 우선탑승,<br> 출발일 예약변경';
							}

							if (farePricingInfo.bundleType != '') {
								fareHtml += '<span class="tooltiptext tooltip-bottom">'
										+ bundleText + '</span>';
							}
							fareHtml += '</div></td>';

							fareHtml += '<td class="layerclick"><a href="javascript:searchRule(\''
									+ fareData.data.ruleNos
									+ '\', \''
									+ farePricingInfo.baseFare
									+ '\', \''
									+ farePricingInfo.baseFareCurrency
									+ '\')">'
									+ farePricingInfo.fareBasis
									+ '</a></td>';
							fareHtml += '<td>'
									+ selectedAvailObjects[farePricingInfo.segRPH - 1].depStn
									+ ' '
									+ selectedAvailObjects[farePricingInfo.segRPH - 1].arrStn
									+ '</td>';
							fareHtml += '<td class="align-right">'
									+ farePricingInfo.baseFareCurrency + ' '
									+ addComma(farePricingInfo.baseFare)
									+ '</td>';

							if (bundleInfo != null) {
								if (bundleInfo.bundleFare == null)
									bundleInfo.bundleFare = 0;
								fareHtml += '<td class="align-right"><div class="tooltip typetip"><span class="price">'
										+ farePricingInfo.baseFareCurrency
										+ ' '
										+ addComma(bundleInfo.bundleFare)
										+ '</span>';

								if (farePricingInfo.bundleType != '') {
									fareHtml += '<span class="tooltiptext tooltip-bottom">'
											+ bundleText + '</span>';
								}

								fareHtml += '</div></td>';
							} else {
								fareHtml += '<td class="align-center">-</td>';
							}

							fareHtml += '<td class="align-right">';
							fareHtml += '<div class="tooltip">';
							fareHtml += '<span class="price">'
									+ farePricingInfo.totalFareCurrency + ' '
									+ addComma(farePricingInfo.taxAmount)
									+ '</span>';
							fareHtml += '<span class="tooltiptext tooltip-bottom">';
							$(farePricingInfo.fareTaxInfoList)
									.each(
											function(index, fareTaxInfo) {
												fareHtml += index == 0 ? ""
														: " ";
												fareHtml += fareTaxInfo.taxCurrency
														+ ' '
														+ addComma(fareTaxInfo.taxAmount)
														+ fareTaxInfo.taxCode;

											});
							fareHtml += '</span></div></td>';

							var subTotalFare = farePricingInfo.totalFare;
							
							if (bundleInfo != null) {
								if (bundleInfo.bundleFare != null) {
									subTotalFare = Number(subTotalFare) + Number(bundleInfo.bundleFare); 
								}
							}		
							fareHtml += '<td class="align-right">'
									+ farePricingInfo.totalFareCurrency + ' '
									+ addComma(subTotalFare)
									+ '</td>';
							if (farePricingInfo.segRPH == 1) {
								fareHtml += '<td rowspan="'+segmentSize+'">'
										+ paxCnt + '</td>';
							}
							if (index == 0) {
								fareHtml += '<td rowspan="'+totalLength+'" class="align-right"><strong>'
										+ '***FareTotal***'
										+ '</strong></td>';
							}
							fareHtml += '</tr>';

							switch (farePricingInfo.paxTypeCode) {
							case 'ADT':
								fareHtmlADT += fareHtml;
								break;
							case 'CHD':
								fareHtmlCHD += fareHtml;
								break;
							case 'INF':
								fareHtmlINF += fareHtml;
								break;
							}
							
							totalFare = Number(totalFare) + Number(subTotalFare * paxCnt);

						});
		
		fareHtmlADT = fareHtmlADT.replace('***FareTotal***', fareData.data.farePricingInfo[0].totalFareCurrency + ' ' + addComma(totalFare));
		fareHtmlCHD = fareHtmlCHD.replace('***FareTotal***', fareData.data.farePricingInfo[0].totalFareCurrency + ' ' + addComma(totalFare));
		fareHtmlINF = fareHtmlINF.replace('***FareTotal***', fareData.data.farePricingInfo[0].totalFareCurrency + ' ' + addComma(totalFare));

		if (fareData.data.warningMsg) {
			$('.warningMsg').text(fareData.data.warningMsg);
			$('.warningMsg').show();
		}

		$('#fareDiv_FareFamily .fareTable tbody').empty();
		$('#fareDiv_FareFamily .fareTable tbody').append(fareHtmlADT);
		$('#fareDiv_FareFamily .fareTable tbody').append(fareHtmlCHD);
		$('#fareDiv_FareFamily .fareTable tbody').append(fareHtmlINF);

		$('#fareDiv_FareFamily').show();

	}

	function createFareTbl(fareData) {
		var fareHtml = '';

		var fareHtmlADT = '';
		var fareHtmlCHD = '';
		var fareHtmlINF = '';
		var totalLength = fareData.data.farePricingInfo.length;
		
		var totalFare = 0;

		$(fareData.data.farePricingInfo)
				.each(
						function(index, farePricingInfo) {

							var fareHtml = '';
							var paxCnt;
							var totalAmount = Number(farePricingInfo.totalFare
									* searchDataTmp.adultPaxCnt)
									+ Number(farePricingInfo.totalFare
											* searchDataTmp.childPaxCnt);

							if (farePricingInfo.paxTypeCode == 'ADT') {
								paxCnt = searchDataTmp.adultPaxCnt;
							} else if (farePricingInfo.paxTypeCode == 'CHD') {
								paxCnt = searchDataTmp.childPaxCnt;
							} else {
								paxCnt = searchDataTmp.infantPaxCnt;
							}

							fareHtml += '<tr>';

							if (farePricingInfo.segRPH == 1) {
								fareHtml += '<td rowspan="'+segmentSize+'">'
										+ farePricingInfo.paxTypeCode + '</td>';
							} else if (farePricingInfo.segRPH == null
									|| farePricingInfo.segRPH == "") {
								fareHtml += '<td>'
										+ farePricingInfo.paxTypeCode + '</td>';
							}

							fareHtml += '<td class="layerclick"><a href="javascript:searchRule(\''
									+ fareData.data.ruleNos
									+ '\', \''
									+ farePricingInfo.baseFare
									+ '\', \''
									+ farePricingInfo.baseFareCurrency
									+ '\')">'
									+ farePricingInfo.fareBasis
									+ '</a></td>';
							fareHtml += '<td class="align-right">'
									+ farePricingInfo.baseFareCurrency + ' '
									+ addComma(farePricingInfo.baseFare)
									+ '</td>';
							if (farePricingInfo.equivFare != null
									&& farePricingInfo.equivFare != '') {
								fareHtml += '<td class="align-right">'
										+ farePricingInfo.equivFareCurrency
										+ ' '
										+ addComma(farePricingInfo.equivFare)
										+ '</td>';

								$('.equivFareTh').show();
								$('.equivFareCol').show();
							} else {
								$('.equivFareTh').hide();
								$('.equivFareCol').hide();
							}

							fareHtml += '<td class="align-right"><div class="tooltip">';
							fareHtml += '<span class="price">'
									+ farePricingInfo.totalFareCurrency + ' '
									+ addComma(farePricingInfo.taxAmount)
									+ '</span>';
							if (farePricingInfo.fareTaxInfoList != null) {
								fareHtml += '<span class="tooltiptext tooltip-bottom">';
								$(farePricingInfo.fareTaxInfoList)
										.each(
												function(index, fareTaxInfo) {
													fareHtml += index == 0 ? ""
															: " ";
													fareHtml += fareTaxInfo.taxCurrency
															+ ' '
															+ addComma(fareTaxInfo.taxAmount)
															+ fareTaxInfo.taxCode;

												});

								fareHtml += '</span>';
							}
							fareHtml += '</div></td>';
							fareHtml += '<td class="align-right">'
									+ farePricingInfo.totalFareCurrency + ' '
									+ addComma(farePricingInfo.totalFare)
									+ '</td>';

							if (farePricingInfo.segRPH == 1) {
								fareHtml += '<td rowspan="'+segmentSize+'">'
										+ paxCnt + '</td>';
							} else if (farePricingInfo.segRPH == null
									|| farePricingInfo.segRPH == "") {
								fareHtml += '<td>' + paxCnt + '</td>';
							}

							if (index == 0) {
								fareHtml += '<td rowspan="'+totalLength+'" class="align-right"><strong>'
								+ '***FareTotal***'
								+ '</strong></td>';
							}
							fareHtml += '</tr>';

							switch (farePricingInfo.paxTypeCode) {
							case 'ADT':
								fareHtmlADT += fareHtml;
								break;
							case 'CHD':
								fareHtmlCHD += fareHtml;
								break;
							case 'INF':
								fareHtmlINF += fareHtml;
								break;
							}
							
							totalFare = Number(totalFare) + Number(farePricingInfo.totalFare * paxCnt);
						});


		fareHtmlADT = fareHtmlADT.replace('***FareTotal***', fareData.data.farePricingInfo[0].totalFareCurrency + ' ' + addComma(totalFare));
		fareHtmlCHD = fareHtmlCHD.replace('***FareTotal***', fareData.data.farePricingInfo[0].totalFareCurrency + ' ' + addComma(totalFare));
		fareHtmlINF = fareHtmlINF.replace('***FareTotal***', fareData.data.farePricingInfo[0].totalFareCurrency + ' ' + addComma(totalFare));

		if (fareData.data.warningMsg) {
			$('.warningMsg').text(fareData.data.warningMsg);
			$('.warningMsg').show();
		}

		$('#fareDiv .fareTable').find('tbody').empty();
		$('#fareDiv .fareTable').find('tbody').append(fareHtmlADT);
		$('#fareDiv .fareTable').find('tbody').append(fareHtmlCHD);
		$('#fareDiv .fareTable').find('tbody').append(fareHtmlINF);

		$('#fareDiv').show();

	}

	//운임규정 조회
	function searchRule(ruleNumber, baseFare, currency) {

		var searchDataToJsonStr = JSON.stringify({
			ruleNo : ruleNumber,
			language : 'KR',
			routeType : routeType
		});

		ajaxCall("getFareRule.do", searchDataToJsonStr, function(data) {

			createRuleLayer(data.Result.data, baseFare, currency);
			$('.farelayer').show();

		})
	}

	function createRuleLayer(ruleData, baseFare, currency) {

		$('.layerBody .rule_view').empty();

		var ruleHtml = '';

		if (routeType == "I") {
			if (typeof (ruleData.length) != 'undefined') {
				var discountTitle = "";

				var feeRuleTitle = {
					"intFeeRule4Step1" : "~ 출발 91일전 : ",
					"intFeeRule4Step2" : "출발 90일 ~ 61일전 : ",
					"intFeeRule4Step3" : "출발 60일 ~ 31일전 : ",
					"intFeeRule4Step4" : "출발 30일 ~ 출발 당일 : ",
					"intFeeRule2Step1" : "~ 출발 91일전 : ",
					"intFeeRule2Step2" : "출발 90일 ~ 출발 당일 : "
				};

				$(ruleData)
						.each(
								function(segmentNo, ruleBySegment) {

									ruleHtml += '<h4>Seg ' + (segmentNo + 1)
											+ '</h4>';
									ruleHtml += '<ul class="cal-ul">';

									$(ruleBySegment)
											.each(
													function(index, ruleRow) {
														var jsFeeArr = ruleRow.FDRULEITEMDESC
																.split(";");
														var jsFeeArrCnt = jsFeeArr.length;

														if (jsFeeArrCnt == 1) {
															// 기존 로직

															if (index == 1
																	|| index == 2) {
																ruleHtml += '<li><i class="bl02"></i>'
																		+ ruleRow.FDRULEITEMCODE
																		+ ': 구매 다음날 ~ 출발 당일 '
																		+ ruleRow.FDRULEITEMDESC
																		+ '</li>';
															} else {
																ruleHtml += '<li><i class="bl02"></i>'
																		+ ruleRow.FDRULEITEMCODE
																		+ ': '
																		+ ruleRow.FDRULEITEMDESC
																		+ '</li>';
															}

														} else {
															// 출발일 기준 수수료 차등 적용

															if (index == 1
																	|| index == 2) {
																// 1:변경수수료, 2:취소수수료
																ruleHtml += '<li><i class="bl02"></i>'
																		+ ruleRow.FDRULEITEMCODE
																		+ ': ';
																for (var jsFeeIdx = 0; jsFeeIdx < jsFeeArrCnt; jsFeeIdx++) {
																	var jsFeeTitle = "intFeeRule"
																			+ jsFeeArrCnt
																			+ "Step"
																			+ (jsFeeIdx + 1);
																	ruleHtml += feeRuleTitle[jsFeeTitle]
																			+ jsFeeArr[jsFeeIdx];

																	if (jsFeeIdx + 1 != jsFeeArrCnt)
																		ruleHtml += '<br/>';
																}
																ruleHtml += '</li>';
															} else {
																ruleHtml += ruleRow.FDRULEITEMDESC
																		+ "|";
															}
														}
													});

									ruleHtml += '<hr>';

									// 대양주 노선인 경우
									if (searchDataTmp.depStn1 == "GUM"
											|| searchDataTmp.arrStn1 == "GUM"
											|| searchDataTmp.depStn1 == "SPN"
											|| searchDataTmp.arrStn1 == "SPN") {
										ruleHtml += '<li><i class="bl02"></i>'
												+ "2개, 각 23 kg 이하 (유아 10KG)"
												+ '</li>';
									}

									if ((segmentNo + 1) == ruleData.length) {
										ruleHtml += '<li><i class="bl02"></i>적립예정 리프레시 포인트: '
												+ fn_calcCurrency(baseFare,
														currency) + 'P</li>';
									}

									ruleHtml += '</ul>';

								});
			}
		} else {

			var bundleArray = [ "Fly", "FlyBag", "FlyBag+" ];

			$(ruleData)
					.each(
							function(segmentNo, ruleBySegment) {
								ruleHtml += '<h4>Seg ' + (segmentNo + 1)
										+ '</h4>';
								ruleHtml += '<ul class="cal-ul">';

								ruleHtml += '<li><i class="bl02"></i>'
								$(ruleBySegment)
										.each(
												function(index, ruleRow) {
													ruleHtml += ruleRow.DESCDETAIL
															+ ": "
															+ addComma(ruleRow.TICKETFEE);
													if (ruleRow + 1 != ruleBySegment.length)
														ruleHtml += '<br/>';
												});
								ruleHtml += '</li>';
								ruleHtml += '</ul>';

								ruleHtml += '<hr>';

								if ((segmentNo + 1) == ruleData.length) {
									ruleHtml += '<li><i class="bl02"></i>적립예정 리프레시 포인트: '
											+ fn_calcCurrency(baseFare,
													currency) + 'P</li>';
								}

							});
			// 2018.FareFamily (국내선인 경우 문구 변경)

		}

		$('.layerBody .rule_view').append(ruleHtml);

	}

	//Sell Action
	function sell() {

		var sellFlag = true;
		var sellData = new Object();
		/*
		sellData.officeInfo = new Object();
		sellData.officeInfo.officeLu = searchDataTmp.officeElement.val();
		sellData.officeInfo.officeCode = searchDataTmp.officeElement.attr('officeCode');
		sellData.officeInfo.iataNo = searchDataTmp.officeElement.attr('iataNo');
		sellData.officeInfo.officeName = searchDataTmp.officeElement.attr('officeName');
		sellData.officeInfo.cityCode = searchDataTmp.officeElement.attr('cityCode');
		sellData.officeInfo.country2c = searchDataTmp.officeElement.attr('country2c');
		sellData.officeInfo.departmentCd = searchDataTmp.officeElement.attr('departmentCd');
		sellData.officeInfo.currency = searchDataTmp.officeElement.attr('currency');
		sellData.officeInfo.routeType = searchDataTmp.officeElement.attr('routeType');
		sellData.officeInfo.officeType = searchDataTmp.officeElement.attr('officeType');
		 */
		sellData.officeInfo = searchDataTmp.officeInfo;
		sellData.segmentInfo = [];

		var bundleTypes = [];

		$(selectedAvailObjects)
				.each(
						function(index, selectedAvailObject) {

							if (searchType == "FareAvail") {
								bundleTypes
										.push(selectedAvailObject.bundleType);
							}
							if (selectedAvailObject.bundleType == ""
									|| $('.ItineraryBundleType').eq(index)
											.val() == "") {
								commonNotice("고객센터에서 판매할 수 없는 운임입니다.");
								sellFlag = false;
								return false;
							}
							var segmentInfo = new Object();
							segmentInfo.depDate = (selectedAvailObject.depDate
									+ selectedAvailObject.depTime + '00');
							segmentInfo.arrDate = (selectedAvailObject.arrDate
									+ selectedAvailObject.arrTime + '00');
							segmentInfo.paxCount = selectedAvailObject.numberInParty;
							segmentInfo.RPH = selectedAvailObject.RPH;
							segmentInfo.depStn = selectedAvailObject.depStn;
							segmentInfo.arrStn = selectedAvailObject.arrStn;
							segmentInfo.airline = selectedAvailObject.airLineCode;
							segmentInfo.flightNo = selectedAvailObject.flightNumber;
							segmentInfo.bookingClass = selectedAvailObject.resBookDesigCode;
							segmentInfo.bookingStatus = $('.ItineraryStatus')
									.eq(index).val();

							sellData.segmentInfo.push(segmentInfo);

						});

		if (searchType == "Avail") {
			$.each($('.ItineraryBundleType'), function() {
				bundleTypes.push($(this).val());
			});
		}

		if (!sellFlag)
			return false;

		var sellDataToJsonStr = JSON.stringify(sellData);

		ajaxCall(
				"/sell.do" //call url
				,
				sellDataToJsonStr //ajax 호출값
				,
				function(data) { //success시 callBack함수

					var submitData = JSON.stringify({
						'pid' : data.Result.data.pid,
						'adtPaxCnt' : Number(searchDataTmp.adultPaxCnt),
						'chdPaxCnt' : Number(searchDataTmp.childPaxCnt),
						'infPaxCnt' : Number(searchDataTmp.infantPaxCnt),
						'routeType' : routeType,
						'bundleTypes' : bundleTypes,
						'officeCode' : searchDataTmp.officeInfo.officeCode,
						'isGroup' : searchDataTmp.isGroup
					});

					$("<input name='submitData' type='hidden' value='"+submitData+"'>").appendTo('#sellResultForm');

					var airportList = '';
					$.each(data.Result.data.segmentInfo, function(idx, segment) {
						if (idx != 0) airportList += ',';
						airportList += segment.depStn;
						airportList += ',';
						airportList += segment.arrStn;
						
						var overDate = moment(segment.arrDate.substring(0,8), 'YYYYMMDD').diff(segment.depDate.substring(0,8), "days")
						
						data.Result.data.segmentInfo[idx].overDate = overDate;
					});
					
					$("<input name='segmentInfo' type='hidden' value='"+ JSON.stringify(data.Result.data.segmentInfo)+ "'>").appendTo('#sellResultForm');

					$("<input name='airportList' type='hidden' value='"+airportList+"'>").appendTo('#sellResultForm');

					$('#sellResultForm').submit();

				}, true);

	}

	function checkAgeCalculatorRst(birthDay, depDate) {
		var birthArrayD = getBirthForKid(depDate, "D", "YYYYMMDD");
		var birthArrayI = getBirthForKid(depDate, "I", "YYYYMMDD");

		var resultD = "성인";
		var resultI = "성인";

		if (birthDay >= birthArrayD[0] && birthDay <= birthArrayD[1]) {
			resultD = "소아";
		} else if (birthDay > birthArrayD[2]) {
			resultD = "유아";
		}

		if (birthDay >= birthArrayI[0] && birthDay <= birthArrayI[1]) {
			resultI = "소아";
		} else if (birthDay > birthArrayI[2]) {
			resultI = "유아";
		}

		$('.ageCalulatorDate').text(depDate);
		$('#ageCalulatorRstD').text(resultD);
		$('#ageCalulatorRstI').text(resultI);

		$('#ageResultDiv').show();
	}