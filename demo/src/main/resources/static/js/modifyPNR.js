function setTicketArrangementInfo(responseData){
	var ticketArrangement = getTicketArrangementObject(responseData);	
	renderModifyTicketArrangement(ticketArrangement);
}

function renderModifyTicketArrangement(ticketArrangement){
	if(ticketArrangement){
		$("#ticketArgmt option").each(function(){
			if($(this).val() == ticketArrangement.ticketingStatus){
				$(this).attr("selected", "selected");
		        if ($(this).val() == '1') {
		            $('[name=ticketTime]').show();
		            $('[name=dateOption]').show();
		            $('[name=ticketDate]').show();
		        } else if ($(this).val() == '3') {
		            $('[name=ticketTime]').hide();
		            $('[name=dateOption]').hide();
		            $('[name=ticketDate]').hide();
		        }
			}
		});

		if(ticketArrangement.ticketTL && !isNull(ticketArrangement.ticketTL)){
			$("[name=ticketTime]").val(moment(ticketArrangement.ticketTL, ["YYYYMMDDTHHmmss", "YYYYMMDDHHmmss"], "en").format("HHmm").toUpperCase());
			$("[name=ticketDate]").val(moment(ticketArrangement.ticketTL, ["YYYYMMDDTHHmmss", "DDMMMYY"], "en").format("DDMMMYY").toUpperCase());
		}		
/*		
		$("#dateOption option").each(function(){
			if($(this).val() == ticketArrangement.dateOption){
				$(this).attr("selected", "selected");
			}
		});
*/		
		$("[name=ticketText]").val(ticketArrangement.ticketAdvisor);
/*		
		if(ticketArrangement.refPaxNum) {
			$("#passenger").val(ticketArrangement.refPaxNum.toString());
		}
*/		
	}
}

function setPassengerInfo(responseData){
	var airTraveler = getNamesObject(responseData);	
	renderModifyAirTraveler(airTraveler);
}

function renderModifyAirTraveler(airTraveler){
	if(airTraveler){
		var nameList = "";
		airTraveler.forEach(function(value, index, array){			
			nameList += "<tr>"
				   + "<td>" + value.RPH
				   + "<input type='hidden' id='RPH" + value.RPH + "' name='RPH" + value.RPH + "' value='" + value.RPH + "'>"
				   + "<input id='prefix" + value.RPH + "' name='prefix" + value.RPH + "' type='hidden' value='" + value.prefixName + "'>"
				   + "</td>"
				   + "<td><input id='lastName" + value.RPH + "' name='lastName" + value.RPH + "' type='text' value='" + value.lastName + "' class='w70p'></td>"
				   + "<td><input id='firstName" + value.RPH + "' name='firstName" + value.RPH + "' type='text' value='" + value.firstName + "' class='w70p'></td>"
				   + "<td>"
				   + "<div class='s-w80p'>"
				   + "<select id='passengerTitle" + value.RPH + "' name='passengerTitle" + value.RPH + "'>"
				   + "<option value=''>Select</option>"
				   + "<option value='MR'" + selectedNamesTitle(nullCheck(value.title), "MR") +">MR</option>"
				   + "<option value='MS'" + selectedNamesTitle(nullCheck(value.title), "MS") +">MS</option>"
				   + "<option value='MSTR'" + selectedNamesTitle(value.title, "MSTR") +">MSTR</option>"
				   + "<option value='MISS'" + selectedNamesTitle(value.title, "MISS") +">MISS</option>"
				   + "</select>"
				   + "</div>"
				   + "</td>"
				   + "<td>" + value.type + "</td>"
				   + "</tr>";
		});
		$("#names").html(nameList);
	}
}

function setItineraryInfo(responseData){
	var airItinerary = getAirItineraryObject(responseData);	
	renderModifyAirItinerary(airItinerary);
}

function renderModifyAirItinerary(airItinerary){
	if(airItinerary){
		var itineraryList = "";
		airItinerary.forEach(function(value, index, array){
			var depDate = "";
			var arrDate = "";
			var depDay = "";
			var depTime = "";
			var arrTime = "";
			
			if(nullCheck(value.depDate) != "") {
				depDate = value.depDate.dateFormat('DDMMMYY');
				depDay = value.depDate.dateFormat('ddd');
				depTime = value.depDate.dateFormat('HH:mm');
			}
			if(nullCheck(value.arrDate) != "") {
				arrDate = value.arrDate.dateFormat('DDMMMYY');
				var overDate = moment(arrDate, 'DDMMMYY').diff(moment(depDate, 'DDMMMYY'), "days");
				arrTime = value.arrDate.dateFormat('HH:mm') + (overDate == '0' ? '' : ' + ' + overDate);
			}
			
			var idx = index + 1;
			itineraryList += "<tr>"
			  + "<td><input id='RPH" + idx + "' name='RPH" + idx + "' type='hidden' class='w30' value='" + value.RPH + "'>" + value.RPH + "</td>"
			  + "<td>" + nullCheck(value.airline) + value.flightNo + "</td>"
			  + "<td>" + nullCheck(value.bookingClass) + "</td>"
			  + "<td>" + depDate + "</td>"
			  + "<td>" + depDay + "</td>"
			  + "<td>" + value.depStn + "</td>"
			  + "<td>" + value.arrStn + "</td>"
			  + "<td>" + depTime + "</td>"
			  + "<td>" + arrTime + "</td>"
			  + "<td><input id='status" + idx + "' name='status" + idx + "' type='text' class='w30' value='" + nullCheck(value.bookingStatus) + "'> " + nullCheck(value.paxCount) + "</td>"
			  /*+ "<td>" + value.comment + "</td>"*/
			  + "</tr>";
        });		
		$("#itineraryList").html(itineraryList);
	}
}

function selectedNamesTitle(title, str){
	return title == str ? "selected" : "";
}

function setContactInfo(responseData){
	var contactDetails = getContactDetailsObject(responseData);	
	renderModifyContactDetails(contactDetails);
}

function deleteRow(obj){
	$(obj).parent().parent().remove();
}

function renderModifyContactDetails(contactDetails){
	if(contactDetails){
		var contactList = "";
		contactDetails.forEach(function(value, index, array){
			var idx = index + 1;
			contactList += "<tr><td><div class='s-w80p' data-idx='" + idx + "'>";
			contactList += "<select id='contact_type" + idx + "' class='contact_type'>";
			contactList += "<option value='1'" + selectedNamesTitle(nullCheck(value.type), "PHONE") +">Phone</option>";
			contactList += "<option value='EMAIL'" + selectedNamesTitle(nullCheck(value.type), "EMAIL") +">Email</option>";
			contactList += "<option value='3'" + selectedNamesTitle(nullCheck(value.type), "FAX") +">Fax</option>";
			contactList += "</select>";
			contactList += "</div></td>";
			
			contactList += "<td>";
			if(nullCheck(value.type) == "PHONE" || nullCheck(value.type) == "FAX" || nullCheck(value.type) == "MOBILE"){
				contactList += "<input id='city" + idx + "' name='city" + idx + "' type='text' class='w70p ip_city cityInput validate' value='" + nullCheck(value.city) + "'>";
			}
			contactList += "</td>";
			
			contactList += "<td><input id='address" + idx + "' name='address" + idx + "' type='text' class='w70p ip_addr validate " + (nullCheck(value.type) == "EMAIL" ? "emailVDT" : "phoneVDT") + "' value='" + value.address +"'></td>";
			
			contactList += "<td>";
			if(nullCheck(value.type) == "PHONE" || nullCheck(value.type) == "MOBILE"){
				var name = isNull(value.lastName) && isNull(value.firstName) ? "" : nullCheck(value.lastName) + "/" + nullCheck(value.firstName);
				contactList += "<input id='passenger_name" + idx + "' name='passenger_name" + idx + "' type='text' class='w70p ip_name nameInput validate' value='" + name +"'>";
			}
			contactList += "</td>";
			
			contactList += "<td class='bo-left'>"
			contactList += "<input class='delete_btn2 btn_del_row' type='button' value='' onClick='deleteRow(this);'>"
			contactList += "</td>";
	    });
		
		$("#contactList").html(contactList);
	}
}

function getRPHBySegment(depStn, arrStn, flightNumber, airItinerary){
	var RPH = "";
	if(airItinerary){
		airItinerary.forEach(function(itVal, idx, arr){
			if(itVal.depStn == depStn
					&& itVal.arrStn == arrStn
					&& itVal.flightNo == flightNumber
			){
				RPH = itVal.RPH;
				return false;
			}
		});
	}
	return RPH;
}

function renderModifyNSSTService(seatInfo, airTraveler, airItinerary){
	if(seatInfo){
		var nsstList = "";
		var addtionalServiceObject;
		
		var tempRPH = 0;
		
		seatInfo.forEach(function(value, index, array){
			tempRPH = index + 1;
			
			var arrayPaxRPH = new Array();
			if(airTraveler){
				airTraveler.forEach(function(val, idx, arr){
					if (value.refPaxRPH == val.RPH) {
						arrayPaxRPH.push(val.RPH);
					}
				});
			}
			
			var arraySegRPH = new Array();
			if(airItinerary){
				airItinerary.forEach(function(itVal, idx, arr){
					if(itVal.flightNo == value.flightNumber){
						
						arraySegRPH.push(itVal.RPH);
					}
				});
			}
			
			addtionalServiceObject = {
				"RPH":tempRPH,
				"refSegRPH": arraySegRPH,
				"refPaxRPH": arrayPaxRPH,
				"ssrCode": "NSST",
				"addServiceDesc": "Pre Reserved Seat(사전좌석)",
				"seatNo": value.seatNumber,
				"airline" : renderingAirline(value.flightNumber, airItinerary)
			};

			airItinerary.forEach(function(seg, idx, arr){
				if(seg.depStn == value.depStn && seg.arrStn == value.arrStn && seg.flightNo == value.flightNumber) {
					nsstList += "<tr>"
						  + "<td>" + "NSST" + "</td>"
						  + "<td>" + "Pre Reserved Seat(사전좌석)" + "</td>"
						  + "<td>" + renderingTicketPaasengers(value.refPaxRPH, airTraveler) + "</td>"
						  + "<td>" + seg.RPH + " " + seg.depStn + " " + seg.arrStn + "</td>"
						  + "<td>" + value.flightNumber + "</td>"
						  + "<td>" + value.departureDate.dateFormat('DDMMMYY') + "</td>"
						  + "<td>" + renderingAirline(value.flightNumber, airItinerary)  + "</td>"
						  + "<td>" + value.status + "</td>"
						  + "<td>" + value.seatNumber + "</td>"
						  + "<td class='bo-left'>"
						  + "<input name='btnRemove' class='delete_btn2' type='button' data-rph='" + tempRPH + "' data-addserviceobject='" + JSON.stringify(addtionalServiceObject) + "' value=''>"
						  + "</td>"
						  + "</tr>";
				}
			});
		});
		
		$("#additionalServiceList").html(nsstList);
	}
}

function renderModifyAdditionalService(additionalService, airTraveler, airItinerary){
	if(additionalService){
		var additionalServiceList = "";
		var addtionalServiceObject;
		
		additionalService.forEach(function(value, index, array){
			//부가서비스가 MEAL 이면 data format을 맞추기 위해 객체에 ssrCode 속성을 추가합니다.
			var ml = /ML$/;
			if(ml.test(value.code)){
				value["ssrCode"] = "MEAL";
				value["addServiceCode"] = value.code;
			}else{
				if(value.code == "XBAG"){
					value["ssrCode"] = value.code;
					value["xbagDesc"] = value.text;
				}else{
					value["ssrCode"] = value.code;
				}				
			}
			
			if(value.refSegRPH && Array.isArray(value.refSegRPH) && value.refSegRPH.length > 0){
				value.refSegRPH.forEach(function(seggment, idx, arr){
					if(value.refPaxRPH && Array.isArray(value.refPaxRPH) && value.refPaxRPH.length > 0){
						value.refPaxRPH.forEach(function(pax, idxPax, arrPax){
							additionalServiceList += "<tr>"
								  + "<td>" + value.code + "</td>"
								  + "<td>" + value.codeDesc + "</td>"
								  + "<td>" + renderingTicketPaasengers(pax, airTraveler) + "</td>"
								  + "<td>" + renderingFromTo(seggment, airItinerary) + "</td>"
								  + "<td>" + renderingFlight(seggment, airItinerary) + "</td>"
								  + "<td>" + renderingFlightDate(seggment, airItinerary) + "</td>"
								  + "<td>" + value.airline + "</td>"
								  + "<td>" + value.status + "</td>"
								  + "<td>" + nullCheck(value.text) + "</td>"
								  + "<td class='bo-left'>"
								  + "<input name='btnRemove' class='delete_btn2' type='button' data-rph='" + value.RPH + "' data-text='" + value.text + "' data-refPaxRPH='" + value.refPaxRPH +"' data-airline='" + value.airline +"' data-addserviceobject='" + JSON.stringify(value) + "' value=''>"
								  + "</td>"
								  + "</tr>";
						});
					}else{
						additionalServiceList += "<tr>"
							  + "<td>" + value.code + "</td>"
							  + "<td>" + value.codeDesc + " <span class='kor'>(" + value.Kor + ")</span></td>"
							  + "<td>" + "" + "</td>"
							  + "<td>" + renderingFromTo(seggment, airItinerary) + "</td>"
							  + "<td>" + renderingFlight(seggment, airItinerary) + "</td>"
							  + "<td>" + renderingFlightDate(seggment, airItinerary) + "</td>"
							  + "<td>" + value.airline + "</td>"
							  + "<td>" + value.status + "</td>"
							  + "<td>" + nullCheck(value.text) + "</td>"
							  + "<td class='bo-left'>"
							  + "<input name='btnRemove' class='delete_btn2' type='button' data-rph='" + value.RPH + "' data-text='" + value.text + "' data-refPaxRPH='" + value.refPaxRPH +"' data-airline='" + value.airline +"' data-addserviceobject='" + JSON.stringify(value) + " value=''>"
							  + "</td>"
							  + "</tr>";
					}
				});
			}else if(value.refPaxRPH && Array.isArray(value.refPaxRPH) && value.refPaxRPH.length > 0){
				value.refPaxRPH.forEach(function(pax, idxPax, arrPax){
					additionalServiceList += "<tr>"
							+ "<td>" + value.code + "</td>"
						  + "<td>" + value.codeDesc + "</td>"
						  + "<td>" + renderingTicketPaasengers(pax, airTraveler) + "</td>"
						  + "<td>" + "" + "</td>"
						  + "<td>" + "" + "</td>"
						  + "<td>" + "" + "</td>"
						  + "<td>" + "" + "</td>"
						  + "<td>" + value.airline + "</td>"
						  + "<td>" + value.status + "</td>"
						  + "<td class='align-left'>" + nullCheck(value.text) + "</td>"
						  + "<td class='bo-left'>"
						  + "<input name='btnRemove' class='delete_btn2' type='button' data-rph='" + value.RPH + "' data-text='" + value.text + "' data-refPaxRPH='" + value.refPaxRPH +"' data-airline='" + value.airline +"' data-addserviceobject='" + JSON.stringify(value) + " value=''>"
						  + "</td>"
						  + "</tr>";
				});
			}else{
				additionalServiceList += "<tr>"
					  + "<td>" + value.code + "</td>"
					  + "<td>" + value.codeDesc + "</td>"
					  + "<td>" + "" + "</td>"
					  + "<td>" + "" + "</td>"
					  + "<td>" + "" + "</td>"
					  + "<td>" + "" + "</td>"
					  + "<td>" + value.airline + "</td>"
					  + "<td>" + value.status + "</td>"
					  + "<td class='align-left'>" + nullCheck(value.text) + "</td>"
					  + "<td class='bo-left'>"
					  + "<input name='btnRemove' class='delete_btn2' type='button' data-rph='" + value.RPH + "' data-text='" + value.text + "' data-refPaxRPH='" + value.refPaxRPH +"' data-airline='" + value.airline +"' data-addserviceobject='" + JSON.stringify(value) + " value=''>"
					  + "</td>"
					  + "</tr>";
			}
		});
		$("#additionalServiceList").append(additionalServiceList);
	}
}



/**
 * OSI의 refPaxRPH 를 참조 해서 PAX List를 가져옵니다. 
 * @param otherServiceInfo
 * @param airTraveler
 */
function renderModifyOtherServiceInfoObject(otherServiceInfo, airTraveler){
	if(otherServiceInfo && isArray(otherServiceInfo) && otherServiceInfo.length > 0){
		var osiList = "";
		var paxNumber = "";
		otherServiceInfo.forEach(function(value, index, array){
			paxNumber = (value.refPaxRPH ? "/P" + value.refPaxRPH : "");
			
			osiList += "<tr>"
			+ "<td class='rph'>" + value.RPH + "</td>"
			+ "<td class='align-left'>" + value.text + paxNumber + "</td>"
			+ "<td class='bo-left'>"
			+ "<input name='btnRemove' class='delete_btn2' type='button' data-rph='" + value.RPH + "' data-text='" + value.text + "' data-refPaxRPH='" + value.refPaxRPH +"' data-airline='" + value.airline +"' value=''>"
			+ "</td>"
			+ "</tr>";
		});
		
		$("#osiList").html(osiList);
	}else{
		$("#osiList").hide();
	}
}

function setAdditionalServiceInfo(responseData){
	var airTraveler = getNamesObject(responseData);
	var airItinerary = getAirItineraryObject(responseData);
	
	var seatInfo = getSeatInfoObject(responseData);
	renderModifyNSSTService(seatInfo, airTraveler, airItinerary);
	
	var additionalService = getAdditionalServiceObject(responseData);
	renderModifyAdditionalService(additionalService, airTraveler, airItinerary);
}

function renderModifyOtherServiceInfoPaxObject(airTraveler){
	if(airTraveler && isArray(airTraveler) && airTraveler.length > 0){
		var paxList = "";	
		var paxNumber = "";
		
		airTraveler.forEach(function(value, index, array){
			paxList += "<tr>";
			paxList += "<td>";
			paxList += "<input type='checkbox' id='pax" + value.RPH +"' name='pax' data-paxRPH='" + value.RPH + "' data-prefix='" + value.prefixName + "' data-paxname='"+ value.lastName + "/" + value.firstName + "'>";
			paxList += "<label for='pax" + value.RPH +"'>&nbsp;"+ value.lastName + "/" + value.firstName + "</label>";			
			paxList += "</td>";
			paxList += "</tr>";
		});
		
		$("#paxList").html(paxList);
	}
}

function showDirect(selected){
	var $direct = $(".direct");
	if(selected == "WRITE"){
		$direct.show();
	}else{
		$direct.hide();
	}
}

function setOtherServiceInfo(responseData){
	var otherServiceInfo = getOtherServiceInfoObject(responseData);	
	var airTraveler = getNamesObject(responseData);
	
	renderModifyOtherServiceInfoObject(otherServiceInfo, airTraveler);
	renderModifyOtherServiceInfoPaxObject(airTraveler);
}


function setRemarkInfo(responseData){
	var remarks = getRemarksObject(responseData);
	renderModifyRemarks(remarks);
}

function renderModifyRemarks(remarks){
	if(remarks && isArray(remarks) && remarks.length > 0){
		var remarksList = "";
		remarks.forEach(function(value, index, array){
			remarksList += "<tr>"
			+ "<td class='rph'>" + value.RPH + "</td>"
			+ "<td class='align-left'>" + value.text + "</td>"
			+ "<td class='bo-left'><input name='btnRemove' class='delete_btn2' type='button' data-rph='" + value.RPH + "' data-text='" + value.text + "' value=''></td>"
			+ "</tr>";
		});
		
		$("#remarkList").html(remarksList);
	}
}

function setSpecialRemarkInfo(responseData){
	var specialRemarks = getSpecialRemarksObject(responseData);
	renderModifySpecialRemarks(specialRemarks);
}

function renderModifySpecialRemarks(specialRemarks){
	if(specialRemarks && isArray(specialRemarks) && specialRemarks.length > 0){
		var specialRemarksList = "";
		specialRemarks.forEach(function(value, index, array){
			specialRemarksList += "<tr>"
			+ "<td>" + value.RPH + "</td>"
			+ "<td class='align-left'>" + value.text + "</td>"
			+ "<td class='bo-left'><input name='btnRemove' class='delete_btn2' type='button' data-rph='" + value.RPH + "' data-text='" + value.text + "' value=''></td>"
			+ "</tr>";
		});
		
		$("#specialRemarkList").html(specialRemarksList);
	}else{
		$("#specialRemarkList").hide();
	}
}

$(".add_service .btn_close").click(function(e){
	$(this).parent().parent().hide();
	e.preventDefault();
});

$("#foundNotPNRClose").click (
  function() {
	$("#transparentLayer").hide();
  }
);

$(".cancel").click (
  function() {
	var form = document.createElement("form");
	var objs = document.createElement("input");
	objs.setAttribute("type", "hidden");
	objs.setAttribute("id", "pnr");
	objs.setAttribute("name", "pnr");
	objs.setAttribute("value", $("#PNR").val());
	form.appendChild(objs);
	form.setAttribute("method", "post");
	form.setAttribute("action","/pnr.do");
	document.body.appendChild(form);
	form.submit();
  }
);

function locationPNRView(pnr){
	var locat = "/pnr.do";
	var form = document.createElement("form");
	var objs = document.createElement("input");
	objs.setAttribute("type", "hidden");
	objs.setAttribute("id", "pnr");
	objs.setAttribute("name", "pnr");
	objs.setAttribute("value", pnr);
	form.appendChild(objs);
	form.setAttribute("method", "post");
	form.setAttribute("action", locat);
	document.body.appendChild(form);
	form.submit();
}

function modifyCallBack(data){
	if(data
		&& data.Result
		&& data.Result.code
		&& data.Result.code == "0000"
		&& !data.Result.data.errors
	){
//		alert('수정되었습니다.');
		locationPNRView($("#PNR").val());
	}else{
		$("#noticeText").text(data.Result.data.errors.error[0].value);
		$(".noticelayer").show();
	}
}

$(document).on("click", "#checkAllPax, #checkAllSeg", function(e){
	var $this = $(this),
		$chk = $this.parent().parent().parent().parent().parent().find("input[type='checkbox']").not($this);
	
	if ($this.prop("checked")) {
		$chk.prop("checked",true);
	} else {
		$chk.prop("checked",false);
	}
});

$("#messageClose").click(function(){
	$(".noticelayer").hide();
});

$("#btnClose").click(function(){
	$(".noticelayer").hide();
});

$("#messageCloseAndBack").click (
function() {
  $('.tablink a').removeClass("current");
	  $(this).parent().parent().parent().parent().parent().hide();
	  history.go(-1);
	}
  );