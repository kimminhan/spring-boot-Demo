function renderAirItinerary(){
	var airItinerary = getAirItineraryObject(responseData.Result.data);
	
	var html = "";
	html += "<div class='con-l'>"
		+ "<table>";
	
	if(airItinerary){
		airItinerary.forEach(function(value, index, array){
			html += "<tr>";
			html += "<td><input type='radio' id='seg" + value.RPH +"' name='seg' data-segRPH='" + value.RPH + "' data-seg='" + JSON.stringify(value) + "' data-bundletype='" + value.bundleType + "'>";
			html += "<label for='seg" + value.RPH +"'>&nbsp;"+ value.airline + value.flightNo + "&nbsp;" + value.bookingClass + "&nbsp;" + parseDDMMMYY(nullCheck(value.depDate)) + "&nbsp;" + value.depStn + "&nbsp;" + value.arrStn + "</label>";
			html += "</td>"
				+ "</tr>";
		});
	}
	
	html += "</table>"
	+ "</div>";
	
	return html;
}

function renderAirTraveler(){
	var airTraveler = getNamesObject(responseData.Result.data);
	
	var html = "";
	html += "<div class='con-r'>"
	+ "<table>"
	+ "<colgroup>"
	+ "<col>"
	+ "<col>"
	+ "<col style='width:120px;'>"
	+ "</colgroup>";
	
	if(airTraveler){
		var selected = $("#addServiceTypeList option:selected").val();
		
		airTraveler.forEach(function(value, index, array){
			html += "</tr>"
				+ "<tr>";
			if(selected == "XBAG"){
				html += "<td><input type='checkbox' id='pax" + value.RPH +"' name='pax' data-paxRPH='" + value.RPH + "' data-pax='" + JSON.stringify(value) + "'>";
				html += "<label for='pax" + value.RPH +"'>&nbsp;" + value.lastName + "/" + value.firstName + "</label>";
			}else{
				html += "<td><input type='radio' id='pax" + value.RPH +"' name='pax' data-paxRPH='" + value.RPH + "' data-pax='" + JSON.stringify(value) + "'>";
				html += "<label for='pax" + value.RPH +"'>&nbsp;" + value.lastName + "/" + value.firstName + "</label>";
			}
			html += "</td>";
			
			if(selected == "NSST"){
				html += "<td><input id='seatNo" + value.RPH +"' name='seatNo' class='w40' value='' type='text' readonly></td>";
				html += "<td class='align-right seatcharge' id='seatCharge" + value.RPH +"' data-seatcharge=''></td>";
			}else if(selected == "MEAL"){
				html += "<td><input id='mealCode" + value.RPH +"' name='mealCode' class='w40' value='' type='text' readonly></td>";
				html += "<td class='align-right mealcharge' id='mealCharge" + value.RPH +"' data-mealcharge=''></td>";
			}else{
				//html += "<td><input id='xbagCode" + value.RPH +"' name='xbagCode' class='w40' value='' type='text' readonly></td>";
				//html += "<td class='align-right xbagcharge' id='xbagCharge" + value.RPH +"' data-xbagcharge=''></td>";
			}
			
			html += "</tr>";
		});
	}	
	
	html += "<tr>"
	+ "<td></td>"
	+ "<td></td>";
	if(selected == "NSST" || selected == "MEAL"){
		html += "<td class='align-right total' id='total'></td>";
	}else{
		html += "<td class='align-right'></td>";
	}
	html += "</tr>"
	+ "</table>"
	+ "</div>";
	
	return html;
}

function renderSeatCount(data){
	var html = "";
	var seatMapResponse = data.seatMapResponses.seatMapResponse;

	html += "<div id='seatMap' class='seat-map2'>";

	
	seatMapResponse.forEach(function(response, index, seatMapResponseArray){
		response.seatMapDetails.forEach(function(seatMapDetails, seatMapDetailsIndex, seatMapDetailsArray){
			
			seatMapDetails.cabinClass.forEach(function(cabinClass, cabinClassIndex, seatMapDetailsArray){				
				var max = Math.max.apply(Math, cabinClass.airRows.airRow.map(function(r){
					return r.maxNumberOfSeats;;
				}));
				
				html += "<ul class='t_line'>";
				html += "<li>A</li>";
				html += "<li>B</li>";
				html += "<li>C</li>";
				html += "<li>&nbsp;</li>";
				html += "<li>D</li>";
				html += "<li>E</li>";
				html += "<li>F</li>";
				html += "</ul>";
				
				var airRowLength = cabinClass.airRows.airRow.length;
				
				cabinClass.airRows.airRow.forEach(function(airRow, airRowIndex, airRowsArray){
					var rowNumber = airRow.rowNumber;
					var maxNumberOfSeats = airRow.maxNumberOfSeats;

//					if(airRowIndex == 0){
//						html += "<ul class='n_line'>";
//					}else if((airRowLength - 1) == airRowIndex){
					if((airRowLength - 1) == airRowIndex){
						html += "<ul class='1_line'>";
					}else{
						html += "<ul class='s_line'>";
					}
					
					var airSeatLength = airRow.airSeats.airSeat.length;
					
					airRow.airSeats.airSeat.forEach(function(airSeat, airSeatIndex, airSeatArray){
						if(airSeatIndex != 0 && (airSeatIndex % 3 == 0)){
							html += "<li class='aisle'>" + rowNumber + "</li>";
						}
						
						if(airSeat.seatAvailability == "1"){
							html += "<li id='" + rowNumber + airSeat.seatNumber + "' data-seatmaprph=''>" + rowNumber + airSeat.seatNumber + "</li>";
						}else{
							html += "<li id='" + rowNumber + airSeat.seatNumber + "' class='selected' data-seatmaprph=''>" + rowNumber + airSeat.seatNumber + "</li>";
						}
					});
					
					html += "</ul>";

				});
			});
		});
	});
	
	$("#seatMapCount").html(html);
	$("#seatMapCount").show();
}

function renderSeatMap(){
	var html = "";
	html += "<div id='NSST' class='tab-contents'>"
	+ "<div class='add_content01'>";
	
	html += renderAirItinerary();
	
	html += renderAirTraveler();
	
	html += "<div id='seatMapCount' class='con-view' style='display: none;'></div>";
	
	$("#addServiceBoby").html(html);
}

function setMealChargeListCallBack(data){
	if(data
			&& data.Result
			&& data.Result.code == "0000"
			&& data.Result.data){
		renderMealChargeList(data.Result.data);
	} else if(responseData.Result.code == "0101") {
        $(".reactNoticLayer").show();
        return false;
   	} else if(responseData.Result.code == "0102") {
        $(".foundNotPageLayer").show();
        return false;
    } else {
        $('#noticeAndBackText').text(responseData.Result.message);
        $('.noticeAndHistoryBackLayer').show();
    }
}

function renderMealChargeList(data){
	var html = "<table id='mealList'>";
	
	if(data && data.length > 0){
		//{"paxRPH":null,"segRPH":null,"mealCode":"VOML","mealName":"오색비빔밥","currency":"KRW","amount":"15000.00","maxCount":"15"}
		data.forEach(function(meal, index, array){
			if(index%2 == 0){
				html += "<tr>";
			}

			html += "<td><input name='meal' type='radio' id='" + meal.mealCode + index + "' value='' data-meal='" + JSON.stringify(meal) + "'>";
			html += "<label for='" + meal.mealCode + index + "'>" + meal.mealName + " (" + meal.mealCode + ", " + addComma(meal.amount) +")</label></td>";

			if(index%2 == 1){
				html += "</tr>";
			}
		});
	}else{
		html += "<tr><td>Meal 부가서비스 정보 조회 결과가 없습니다. 해당 서비스 지원 유무를 확인해 주세요.</td></tr>";
	}
	
	html += "</table>";
	
	$("#mealContent").html(html);
	$("#mealContent").show();
}

function renderMeal(){
	var html = "";
	html += "<div id='Meal' class='tab-contents'>"
	+ "<div class='add_content02'>";
	
	html += renderAirItinerary();
	
	html += renderAirTraveler();
	
	html += "<div id='mealContent' class='con-view' style='display: none;'>" + "</div>";
	
	$("#addServiceBoby").html(html);
}

function renderXBAG(){
	var html = "";
	html += "<div id='XBAG' class='tab-contents'>"
	+ "<div class='add_content03'>";
	
	html += renderAirItinerary();
	
	html += renderAirTraveler();
	
	html += "<div id='xbagContent' class='con-view' style='display: none;'>" + "</div>";
	
	$("#addServiceBoby").html(html);
}

function setData(seg, pax){
	var data = null;
	if(seg && pax){
		data = {
			"PNR": $("#PNR").val(),
			"seg" : seg.data("seg"),
			"pax" : pax.data("pax"),
			"routeType": responseData.Result.data.routeType
		};
	}else if(seg && !pax){
		data = {
			"PNR": $("#PNR").val(),
			"seg" : seg.data("seg"),
			"routeType": responseData.Result.data.routeType
		};
	}else if(!seg && pax){
		data = {
			"PNR": $("#PNR").val(),
			"pax" : pax.data("pax"),
			"routeType": responseData.Result.data.routeType
		};			
	}
	
	return data;
}

function renderSeatCharge(data, selectedSeat){
	var pax = $("#addServiceBoby").find(".con-r").find("input[type='radio']:checked");
	var paxIndex = pax.data("paxrph");
	$("#seatNo" + paxIndex).val($.trim(data[0].seatNo));

	var bundleType = $("#addServiceBoby").find(".con-l").find("input[type='radio']:checked").data("bundletype");
	var amount = "P" == bundleType ? data[0].bundleAmount : data[0].amount;
	
	$("#seatCharge" + paxIndex).text(data[0].currency + " " + addComma(amount));
	$("#seatCharge" + paxIndex).data("seatcharge", amount);
	var total = 0;
	
	$(":data(seatcharge)").each(function(){
		total = total + parseInt($(this).data("seatcharge"));
	});
		
	responseCurrency = data[0].currency;
	
	$("#total").text("Total " + data[0].currency + " " + addComma(total));
	
	selectedSeat.data("seatmaprph", paxIndex);
	selectedSeat.toggleClass("select");
}

function calculatTotalAmount(){
	var total = 0;
	var currency = "";
	
	var excessBaggage = $("input[name=excessBaggage]");
	excessBaggage.each(function(){
		var id = $(this).attr("id");
		var idx = id.replace("excessBaggage", "");
		
		currency = $("#btnPlus"+idx).data("xbag").currency;
		
		if(!$(this).val()){
			$(this).val("1");
		}
		total = total + (parseInt($(this).val()) * parseInt($("#btnPlus"+idx).data("xbag").amount));
	});
	
	$("#total").text("Total " + currency + " " + total);
}

function renderXBAGCharge(data){
	var html = "";
	
	if(data && data.length > 0){
		html += "<table class='add_xbag' id='xbagList'>"
			+ "<colgroup>"
			+ "<col style='width:190px'>"
			+ "<col style='width:120px'>"
			+ "<col>"
			+ "</colgroup>";

		var paxObj = $("#addServiceBoby").find(".con-r").find("input[type='checkbox']:checked")
		paxObj.each(function(idx, value){
			var pax = $(this).data("pax");
			var lastName = pax.lastName;
			var firstName = pax.firstName;
			
			data.forEach(function(xbag, index, array){
				html += "<tr>"
				+ "<td colspan='3'><strong>" + lastName + "/" + firstName + "</strong></td>"
				+ "</tr>"
				+ "<tr>"
				+ "<td><label>Free Baggage</label></td>";
				html += "<td colspan='2' class='freebag_inpt'>";
				html += "<input id='freeBag" + index + "' name='freeBag' type='text' class='w20 required' value='' data-freebagpax='" + JSON.stringify(pax) + "'>개</td>";
				
				html += "</tr>"
				+ "<tr>";
				html += "<td><label>Excess Baggage " + xbag.weight + "kg" + "</label></td>";
				html += "<td>"
				+ "<input type='button' id='btnMinus" + index + "' value='' class='btn_minus' data-xbag='" + JSON.stringify(xbag) + "'>";
				
				html += "<input id='excessBaggage" + index + "' name='excessBaggage' type='text' class='w20 ip_cnt' value='1' data-excessbaggagepax='" + JSON.stringify(pax) + "'/>개";			
				html += "<input type='button' id='btnPlus" + index + "' name='btnPlus' class='btn_plus' data-xbag='" + JSON.stringify(xbag) + "'>";
				html += "</td>"
				+ "<td class='align-right' id='xbagCharge" + index + "' data-xbagcharge='" + parseInt(xbag.amount) + "'>" + xbag.currency + " " + addComma(xbag.amount) + "</td>"
				+ "</tr>"
				+ "<tr>"
				+ "<td colspan='3'><hr></td>"
				+ "</tr>";
			});
		});
		
		html += "<tr>"
			+ "<td colspan='3' class='align-right total' id='total'></td>"
			+ "</tr>"
			+ "</tr>";
	}
	
	html += "</table>";
	
	$("#xbagContent").html(html);
	$("#xbagContent").show();
	calculatTotalAmount();
}

function seatChargeCallBack(data, selectedSeat){
	if(data
			&& data.Result
			&& data.Result.code == "0000"
			&& data.Result.data){
		if(data.Result.data.length == 0) {
	        alert("해당 좌석의 운임이 존재하지 않아 선택이 불가합니다.");
	        return false;
		}
		renderSeatCharge(data.Result.data, selectedSeat);
	} else if(responseData.Result.code == "0101") {
        $(".reactNoticLayer").show();
        return false;
   	} else if(responseData.Result.code == "0102") {
        $(".foundNotPageLayer").show();
        return false;
    } else {
        $('#noticeAndBackText').text(responseData.Result.message);
        $('.noticeAndHistoryBackLayer').show();
        return false;
    }
}

function seatMapCallBack(data){
	if(data
			&& data.Result
			&& data.Result.code == "0000"
			&& data.Result.data){
		renderSeatCount(data.Result.data);
	} else if(responseData.Result.code == "0101") {
        $(".reactNoticLayer").show();
        return false;
   	} else if(responseData.Result.code == "0102") {
        $(".foundNotPageLayer").show();
        return false;
    } else {
        $('#noticeAndBackText').text(responseData.Result.message);
        $('.noticeAndHistoryBackLayer').show();
    }
}

function resetNSSTData(){
	$("input[name='pax']").prop("checked", false);
	$("input[name='seatNo']").val("");
	$(".seatcharge").text("");
	$.removeData("seatcharge");
	$("#total").text("");
}

function resetMealData(){
	$("input[name='meal']").prop("checked", false);
	$("input[name='pax']").prop("checked", false);
	$("input[name='mealCode']").val("");
	$(".mealcharge").text("");
	$.removeData("mealcharge");
	$("#total").text("");
}

function resetXBAGData(){
	$("input[name='excessBaggage']").val("1");
	$("input[name='freeBag']").val("");
	calculatTotalAmount();
}

function selectSeatMapList(seg, pax){
	var data = setData(seg, pax);
	
	if(data){
		ajaxCall("/selectSeatMap.do" //call url
			, JSON.stringify(data)				
			, seatMapCallBack
			, true //로딩사용여부
			, true //동기화옵션
			, function () { //error시 callBack함수
				$('#noticeText').text("error!");
				$('.noticelayer').css("display",'block');
			}
			, null //subData
		);
	}
}

function setMealChargeByPax(){
	/*
	var mealData = $("input[name=meal]:checked").data("meal");
	if(mealData){
		var paxIndex = $("input[name=pax]:checked").data("paxrph");
		
		$("#mealCode" + paxIndex).val(mealData.mealCode);
		$("#mealCharge" + paxIndex).text(mealData.currency + " " + addComma(mealData.amount));
		$("#mealCharge" + paxIndex).data("mealcharge", mealData.amount);
		
		var total = 0;
		
		$(":data(mealcharge)").each(function(){
			total = total + parseInt($(this).data("mealcharge"));
		});
			
		$("#total").text("Total " + mealData.currency + " " + addComma(total));
	}
	*/
	$("input[name=meal]").prop("checked", false);
}

function getMealChargeList(seg, pax, currency){
	var data = setData(seg, pax);
	
	if(data){
		data["currency"] = currency;
		
		ajaxCall("/selectMealChargeList.do" //call url
			, JSON.stringify(data)				
			, setMealChargeListCallBack
			, true //로딩사용여부
			, true //동기화옵션
			, function () { //error시 callBack함수
				$('#noticeText').text("error!");
				$('.noticelayer').css("display",'block');
			}
			, null //subData
		);
	}
}

function renderMealCharge(selectedMeal){
	var pax = $("#addServiceBoby").find(".con-r").find("input[type='radio']:checked");
	if(pax.length < 1){
		alert("승객을 선택해 주세요.");
		$("input[name=meal]").prop("checked", false);
		return false;
	}
	
	var paxIndex = pax.data("paxrph");
	
	var checkedMeal = $("input[name=meal]:checked");
	if(checkedMeal && checkedMeal.length > 0){
		var mealData = checkedMeal.data("meal");
		
		$("#mealCode" + paxIndex).val(mealData.mealCode);
		$("#mealCharge" + paxIndex).text(mealData.currency + " " + addComma(mealData.amount));
		$("#mealCharge" + paxIndex).data("mealcharge", mealData.amount);
		
	}else{
		$("#mealCode" + paxIndex).val(selectedMeal.mealCode);
		$("#mealCharge" + paxIndex).text(selectedMeal.currency + " " + addComma(selectedMeal.amount));
		$("#mealCharge" + paxIndex).data("mealcharge", selectedMeal.amount);	
	}
	
	var total = 0;
	
	$(":data(mealcharge)").each(function(){
		total = total + parseInt($(this).data("mealcharge"));
	});
		
	$("#total").text("Total " + selectedMeal.currency + " " + addComma(total));
}

function xbagChargeCallBack(data){
	if(data
			&& data.Result
			&& data.Result.code == "0000"
			&& data.Result.data){
		renderXBAGCharge(data.Result.data);
	} else if(responseData.Result.code == "0101") {
        $(".reactNoticLayer").show();
        return false;
   	} else if(responseData.Result.code == "0102") {
        $(".foundNotPageLayer").show();
        return false;
    } else if(data.Result.data == null){
    	if(responseData.routeType == "D"){
    		alert("국내선인경우 부가서비스를 판매하지 않습니다.");
    		return false;
    	}else{
    		alert("사전좌석 조회 결과가가 존재하지 않습니다. 해당 서비스가 이 여정애서 지원되는지 확인하세요.");
    		return false;
    	}
    } else {
        $('#noticeAndBackText').text(responseData.Result.message);
        $('.noticeAndHistoryBackLayer').show();
    }
}

function getXBAGChargeList(seg, pax){
	var data = setData(seg, pax);
	data["currency"] = officeInfo.currency;
	
	if(data){
		ajaxCall("/selectXBAGChargeList.do" //call url
			, JSON.stringify(data)				
			, xbagChargeCallBack
			, true //로딩사용여부
			, true //동기화옵션
			, function () { //error시 callBack함수
				$('#noticeText').text("XBAG 조회 결과가 없습니다. 이 여정에서 XBAG 서비스 제공 유무를 확인해주세요.");
				$('.noticelayer').css("display",'block');
			}
			, null //subData
		);
	}
}

function freebagCount(val){
	var freebagCount = 0;
	$("input[name=freeBag]").each(function(index, value){
		if(val.RPH == $(this).data("freebagpax").RPH){
			freebagCount = $(this).val();
		}	
	});
	return freebagCount;
}

function excessbaggageCount(val){
	var excessbaggage = 1;
	$("input[name=excessBaggage]").each(function(index, value){
		if(val.RPH == $(this).data("excessbaggagepax").RPH){
			excessbaggage = $(this).val();
		}	
	});
	return excessbaggage;
}

function setNSSTData(selected){
	var seg = $("#addServiceBoby").find(".con-l").find("input[type='radio']:checked");
	var paxArr = new Array();
	
	var typeCheck = $("#addServiceBoby").find(".con-r").find("input").attr("type");
	
	var seatList = $("input[name=seatNo]").filter(function(){
		return (this.value != null && this.value.length > 0);
	});
	
	if(seatList && seatList.length > 0){
		seatList.each(function(index, val){
			var seatNumberId = $(this).attr("id");
			var idx = seatNumberId.replace("seatNo", "");
			var seatNumber = $("#"+seatNumberId).val();
			
			var pax = $("#pax" + idx).data("pax");
			
			var paxOnSeatData = {
				"pax" : pax,
				"seatNo" : seatNumber
			};

			paxArr.push(paxOnSeatData);
		});
	}else{
		alert("좌석을 선택해 주세요");
		return false;
	}
	
	var bookingStatus = "";
	var segArr = new Array();
	if(seg){
		seg.each(function(index, val){
			if ($(this).prop("checked")) {
				bookingStatus = $(this).data("seg").bookingStatus
				segArr.push($(this).data("seg"));
			}
		});
	}
	
	var newAddtionalService = null;

	//부가서비스 nsst 을 구입한 승객 수만큼 화면에 출력해야 함
	//부가서비스 nsst 선택 데이터  수집용 객체
	//renderring 시 resetting 함
	newAddtionalService = {
		"code" : selected,
		"addServiceDesc" : $("#addServiceTypeList option:selected").data("comment"),
		"addServiceCode" : $("#addServiceTypeList option:selected").data("addServiceCode"),
		"paxArr" : paxArr,
		"segArr" : segArr,
		"bookingStatus" : bookingStatus
	};
	
	return newAddtionalService;
}

function setMEALData(selected){
	var seg = $("#addServiceBoby").find(".con-l").find("input[type='radio']:checked");
	
	var paxArr = new Array();
	
	//부가서비스 기내식을 선택한 승객 목록을 가져옵니다.
	var mealCodeList = $("input[name=mealCode]").filter(function(){
		return (this.value != null && this.value.length > 0);
	});
	
	if(mealCodeList && mealCodeList.length > 0){
		mealCodeList.each(function(index, val){
			var idx = $(this).attr("id").replace("mealCode", "");
			var pax = $("#pax" + idx).data("pax");
			var mealCode = $(this).val();
			
			var mealData = $("input[name=meal]").filter(function(){
				return $(this).data("meal").mealCode == mealCode;
			});
			
			var meal;
			
			if(mealData && mealData.length > 0){
				mealData.each(function(index, val){
					meal = $(this).data("meal");
				});
			}
			
			var paxBtMeal = {
				"pax" : pax,
				"meal" : meal
			};
			
			paxArr.push(paxBtMeal);
		});
	}else{
		alert("좌석을 선택해 주세요");
		return false;
	}
	
	var bookingStatus = "";
	var segArr = new Array();
	if(seg){
		seg.each(function(index, val){
			if ($(this).prop("checked")) {
				bookingStatus = $(this).data("seg").bookingStatus
				segArr.push($(this).data("seg"));
			}
		});
	}
	
	var newAddtionalService = null;
	
	//부가서비스 meal을 구입한 승객 수만큼 화면에 출력해야 함
	//부가서비스 meal 선택 데이터  수집용 객체
	//renderring 시 resetting 함
	newAddtionalService = {
		"code" : selected,
		"addServiceDesc" : selected,//selectedMeal.mealEngName + "(" + selectedMeal.mealName + ")",
		"addServiceCode" : selected,//selectedMeal.mealCode,
		"paxArr" : paxArr,
		"segArr" : segArr,
		"mealDesc" : selected, //selectedMeal.mealEngName,
		"bookingStatus" : bookingStatus
	};
	
	return newAddtionalService;
}

function setXBAGData(selected){
	var seg = $("#addServiceBoby").find(".con-l").find("input[type='radio']:checked");
	var pax;	
	
	var typeCheck = $("#addServiceBoby").find(".con-r").find("input").attr("type");
	
	if(typeCheck == "checkbox"){
		pax = $("#addServiceBoby").find(".con-r").find("input[type='checkbox']:checked");
	}else{
		pax = $("#addServiceBoby").find(".con-r").find("input[type='radio']:checked");
	}
	
	var paxArr = new Array();
	if(pax){
		pax.each(function(index, val){
			if ($(this).prop("checked")) {
				paxArr.push($(this).data("pax"));
			}
		});
	}
	
	var bookingStatus = "";
	var segArr = new Array();
	if(seg){
		seg.each(function(index, val){
			if ($(this).prop("checked")) {
				bookingStatus = $(this).data("seg").bookingStatus
				segArr.push($(this).data("seg"));
			}
		});
	}
	
	var newAddtionalService = null;
	
	var xbagArray = new Array();
	
	paxArr.forEach(function(val, idxPax, arrPax){
		var xbag = {
			"RPH" : val.RPH,
			"freebag" : freebagCount(val),
			"excessbaggage" : excessbaggageCount(val)
		};
		
		xbagArray.push(xbag);
	});
	
	//부가서비스 xbag 을 구입한 승객 수만큼 화면에 출력해야 함
	//부가서비스 xbag 선택 데이터  수집용 객체
	//renderring 시 resetting 함	
	newAddtionalService = {
		"code" : selected,
		"addServiceDesc" : $("#addServiceTypeList option:selected").data("comment"),
		"addServiceCode" : $("#addServiceTypeList option:selected").data("addServiceCode"),
		"paxArr" : paxArr,
		"segArr" : segArr,
		"bookingStatus" : bookingStatus,
		"xbagArr": xbagArray
	};
	
	return newAddtionalService;
}

function setNewAddtionalService(selected){
	var newAddtionalService = null;
	if(selected == "NSST"){
		newAddtionalService = setNSSTData(selected);
		
		if(newAddtionalService){
			newAddtionalService.paxArr.forEach(function(value, index, array){
				var max = Math.max.apply(Math, $(".delete_btn2").map(function(){
					return $(this).data("rph");
				}));				
				
				if(isNaN(max) || !isFinite(max)){
					max = 0;
				}
				
				var newRPH = max + 1;
				var tempRPH = newRPH;
				
				var pax = [value.pax];
				
				var newNSST = {
					"code" : newAddtionalService.code,//selected
					"addServiceDesc" : newAddtionalService.addServiceDesc,
					"addServiceCode" : newAddtionalService.addServiceCode,
					"paxArr" : pax,
					"segArr" : newAddtionalService.segArr,
					"bookingStatus" : value.bookingStatus,
					"seatNo" : value.seatNo
				};
				appendNewAddtionalService(selected, newNSST, newRPH, tempRPH);
			});
		}
	}else if(selected == "MEAL"){
		newAddtionalService = setMEALData(selected);
		
		if(newAddtionalService){
			newAddtionalService.paxArr.forEach(function(value, index, array){
				var max = Math.max.apply(Math, $(".delete_btn2").map(function(){
					return $(this).data("rph");
				}));				
				
				if(isNaN(max) || !isFinite(max)){
					max = 0;
				}
				
				var newRPH = max + 1;
				var tempRPH = newRPH;
				
				var pax = [value.pax];
				var newMEAL = {
					"code" : selected,
					"addServiceDesc" : value.meal.mealEngName + "(" + value.meal.mealName + ")",
					"addServiceCode" : value.meal.mealCode,
					"paxArr" : pax,
					"segArr" : newAddtionalService.segArr,
					"mealDesc" : value.meal.mealEngName,
					"bookingStatus" : value.bookingStatus
				};
				
				appendNewAddtionalService(selected, newMEAL, newRPH, tempRPH);
			});
		}
	}else{
		newAddtionalService = setXBAGData(selected);
		
		newAddtionalService.paxArr.forEach(function(value, index, array){
			var newXBAG;
			var pax = [value];
			
			newAddtionalService.xbagArr.forEach(function(val, idx, arr){
				if(value.RPH == val.RPH){
					var max = Math.max.apply(Math, $(".delete_btn2").map(function(){
						return $(this).data("rph");
					}));
					
					
					if(isNaN(max) || !isFinite(max)){
						max = 0;
					}
					
					var newRPH = max + 1;
					var tempRPH = newRPH;
					
					newXBAG = {
						"code" : newAddtionalService.code,//selected
						"addServiceDesc" : newAddtionalService.addServiceDesc,
						"addServiceCode" : newAddtionalService.addServiceCode,
						"paxArr" : pax,
						"segArr" : newAddtionalService.segArr,
						"bookingStatus" : newAddtionalService.bookingStatus,
						"xbagArr": val
					};
					appendNewAddtionalService(selected, newXBAG, newRPH, tempRPH);
				}
			});
		});
	}
}

function appendNewAddtionalService(selected, newAddtionalService, newRPH, tempRPH){
	var addtionalServiceObject;
	var addtionalServiceList = "";

	addtionalServiceList += "<tr>";
	
	if(selected == "NSST"){
		addtionalServiceList += "<td class='rph'>" + newAddtionalService.code + "</td>"
							+ "<td>" + newAddtionalService.addServiceDesc + "</td>";
	}else if(selected == "MEAL"){
		addtionalServiceList += "<td class='rph'>" + newAddtionalService.addServiceCode + "</td>"
		+ "<td>" + newAddtionalService.addServiceDesc + "</td>";
	}else{
		addtionalServiceList += "<td class='rph'>" + newAddtionalService.code + "</td>"
		+ "<td>" + newAddtionalService.addServiceDesc + "</td>";
	}
	
	var arrayPaxRPH = new Array();
	if(newAddtionalService.paxArr && newAddtionalService.paxArr.length > 0){
		newAddtionalService.paxArr.forEach(function(value, index, array){
			arrayPaxRPH.push(value.RPH);
		});
	}
	
	addtionalServiceList += "<td>";
	if(newAddtionalService.paxArr && newAddtionalService.paxArr.length > 0){
		newAddtionalService.paxArr.forEach(function(value, index, array){
			addtionalServiceList += "&nbsp;" + value.RPH + ". " + value.lastName + "/" + value.firstName;
		});
	}
	addtionalServiceList += "</td>";
	//end of pax
	
	//start of seg
	var arraySegRPH = new Array();
	if(newAddtionalService.segArr && Array.isArray(newAddtionalService.segArr) && newAddtionalService.segArr.length > 0){
		newAddtionalService.segArr.forEach(function(segVal, segIdx, segArr){
			arraySegRPH.push(segVal.RPH);
		});
	}
	
	var airline = "";
	var bookingStatus = "";

	if(newAddtionalService.segArr && Array.isArray(newAddtionalService.segArr) && newAddtionalService.segArr.length > 0){
		newAddtionalService.segArr.forEach(function(segVal, segIdx, segArr){
			addtionalServiceList += "<td>" + segVal.depStn + " " + segVal.arrStn + "</td>";			
			addtionalServiceList += "<td>" + "&nbsp;" + nullCheck(segVal.flightNo) + "</td>";
			addtionalServiceList += "<td>" + parseDDMMMYY(nullCheck(segVal.depDate)) + "</td>";
			addtionalServiceList += "<td>" + segVal.airline + "</td>";
			addtionalServiceList += "<td>" + segVal.bookingStatus + "</td>";
			
			airline = segVal.airline;
			bookingStatus = segVal.bookingStatus;
		});
	}
	
	if(selected == "NSST"){
		addtionalServiceList += "<td>" + newAddtionalService.seatNo + "</td>";
		
		addtionalServiceObject = {
			"RPH":"1",
			"refSegRPH": arraySegRPH,
			"refPaxRPH": arrayPaxRPH,
			"ssrCode": newAddtionalService.code,
			"addServiceCode": newAddtionalService.addServiceCode,
			"addServiceDesc": newAddtionalService.addServiceDesc,
			"seatNo": newAddtionalService.seatNo,
			"airline" : airline
		};
	}else if(selected == "MEAL"){
		//Detail 항목 출력하지 않음. MEAL은 SUITA에 Text 부분이 없음
		//addtionalServiceList += "<td>" + newAddtionalService.mealDesc + "</td>";
		if(newAddtionalService.addServiceCode == "SPML"){
			addtionalServiceList += "<td>"+newAddtionalService.mealDesc+"</td>";
		}else{
			addtionalServiceList += "<td></td>";
		}

		addtionalServiceObject = {
			"RPH":"1",
			"refSegRPH": arraySegRPH,
			"refPaxRPH": arrayPaxRPH,
			"ssrCode": newAddtionalService.code,
			"addServiceCode": newAddtionalService.addServiceCode,
			"addServiceDesc": newAddtionalService.addServiceDesc,
			"mealDesc": newAddtionalService.mealDesc,
			"airline" : airline,
			"bookingStatus" : bookingStatus
		};
	}else{
		var freebag = "";
		var excessbaggage = "";
		var xbagDesc = "";
		
		if(newAddtionalService.xbagArr.freebag){
			freebag = "FREE " + newAddtionalService.xbagArr.freebag + "PC";
		}
		
		if(newAddtionalService.xbagArr.excessbaggage){
			excessbaggage = "PAID" + newAddtionalService.xbagArr.excessbaggage + "PC";
		}
		
		//FREE 1PC PAID1PC
		if(freebag.length > 0 && excessbaggage.length > 0){
			addtionalServiceList += "<td>" + freebag + " " + excessbaggage + "</td>";
			xbagDesc = freebag + " " + excessbaggage;
		}else{
			addtionalServiceList += "<td>" + freebag + excessbaggage + "</td>";
			xbagDesc = freebag + excessbaggage;
		}
		
		addtionalServiceObject = {
			"RPH":"1",
			"refSegRPH": arraySegRPH,
			"refPaxRPH": arrayPaxRPH,
			"ssrCode": newAddtionalService.code,
			"addServiceCode": newAddtionalService.addServiceCode,
			"addServiceDesc": newAddtionalService.addServiceDesc,
			"xbagDesc": xbagDesc,
			"airline" : airline,
			"bookingStatus" : bookingStatus
		};
	}
	
	addtionalServiceList += "<td class='bo-left'><input name='btnRemove' class='delete_btn2' type='button' data-rph='" + tempRPH + "' data-addserviceobject='" + JSON.stringify(addtionalServiceObject) + "' value=''></td>";
		
	addtionalServiceList += "</tr>";
	
	var handleList = "<input class='rph' name='addserviceRPH' type='hidden' data-handle='add' data-rph='" + tempRPH + "' data-addserviceobject='" + JSON.stringify(addtionalServiceObject) + "' >";
	$("#handleData").append(handleList);
	
	$("#additionalServiceList").append(addtionalServiceList);
}

function resetRenderAddServiceType(selected){
	switch(selected){
	case "NSST" :
		renderSeatMap();
		break;
	case "MEAL" :
		renderMeal();
		break;
	case "XBAG" :
		renderXBAG();
		break;
	}
}

function checkAddServiceTimeout(selected, segInfo){
	var timecheck = segInfo.data("seg");
	var now = moment(new Date());
	var end = moment(convertDateFormater(timecheck.depDate, "YYYYMMDDHHmmss", "YYYY-MM-DDTHH:mm:ss", "YYYY-MM-DDTHH:mm:ss"));
	
	if(selected == "NSST" || selected == "XBAG"){
		if(end.diff(now, 'hours') < 24){
			var text = "";
			if(selected == "NSST" ){
				text = "좌석 지정은 출발 24시간 전까지 가능합니다.";
			}else if(selected == "XBAG" ){
				text = "사전 수하물 구매는 출발 24시간 전까지 가능합니다.";
			}
			
			$('#noticeText').text(text);
	        $('.noticelayer').show();
	        return false;
		}
	}else{
		if(end.diff(now, 'day') < 4){
			var text = "기내식 구매는 출발 4일 전까지 가능합니다.";
			
			$('#noticeText').text(text);
	        $('.noticelayer').show();
	        return false;
		}
	}
	return true;
}