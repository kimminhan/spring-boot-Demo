var responseData = null;
var currentPnr = null;
var requestPnr = null;

function checkModify(){
	//Cookie 에 PNR 상태 정보가  없으면 PNR status 저장
	var modified = $.cookie("MODIFY");
	if(isUndefined(modified) || isNull(modified)){
		$.cookie("MODIFY", "");
	}else if(modified == "on"){
		$('.btn_modify').addClass("on");
		$(this).prop("disabled", false);
	}else{
		$.cookie("MODIFY", "");
	}
}

/**
 * PNR View BookingInfo Element validation
 * @param responseData
 * @returns {Boolean}
 */
function hasBookingInfo(responseData){
	if(hasOwnProperty(responseData, "bookingInfo")
			&& responseData.bookingInfo
			&& isObject(responseData.bookingInfo)){
    	return true;    	
    }
	return false;
}

/**
 * Copy PNR View BookingInfo Object
 * @param responseData
 * @returns obj
 */
function getBookingInfoObject(responseData){	
	if(hasBookingInfo(responseData)){
		return copy(responseData.bookingInfo);
	}
	return null;
}

/**
 * PNR View Ticket Arrangement Element validation
 * @param responseData
 * @returns {Boolean}
 */
function hasTicketArrangement(responseData){
	if(hasOwnProperty(responseData, "ticketArrangement")
			&& responseData.ticketArrangement){
    	return true;    	
    }
	return false;
}

/**
 * Copy PNR View Ticket Arrangement Object
 * @param responseData
 * @returns obj
 */
function getTicketArrangementObject(responseData){	
	if(hasTicketArrangement(responseData)){
		return copy(responseData.ticketArrangement);
	}
	return null;
}


/**
 * PNR View Group Name validation
 * @param responseData
 * @returns {Boolean}
 */
function hasGroupName(responseData){
	if(hasOwnProperty(responseData, "groupName")
			&& responseData.groupName
			&& isString(responseData.groupName)
			&& responseData.groupName.length > 0){
    	return true;    	
    }
	return false;
}

/**
 * Copy PNR View Group Name Object
 * @param responseData
 * @returns String
 */
function getGroupNameString(responseData){
	if(hasGroupName(responseData)){
		return responseData.groupName;
	}
	return null;
}

/**
 * PNR View Names Element validation
 * @param responseData
 * @returns {Boolean}
 */
function hasAirTraveler(responseData){
	if(hasOwnProperty(responseData, "names")
			&& Array.isArray(responseData.names)
			&& responseData.names.length > 0){
    	return true;    	
    }
	return false;
}

/**
 * Copy PNR View Names Object
 * @param responseData
 * @returns obj
 */
function getNamesObject(responseData){	
	if(hasAirTraveler(responseData)){
		return copy(responseData.names);
	}
	return null;
}

/**
 * PNR View 승객 중 Infant 여부 조회
 * @param array
 * @returns {String}
 */
function renderingIconInfant(array){
	if(array && array.hasInfant && array.hasInfant == "Y"){
		return '<span class="emd_icon1"><em></em></span>';
	}
	return "";
}

/**
 * PNR View Contact Detail Element validation
 * @param responseData
 * @returns {Boolean}
 */
function hasContactDetails(responseData){
	if(hasOwnProperty(responseData, "contactDetails")
			&& Array.isArray(responseData.contactDetails)
			&& responseData.contactDetails.length > 0){
    	return true;    	
    }
	return false;
}

/**
 * Copy PNR View Contact Detail Object
 * @param responseData
 * @returns obj
 */
function getContactDetailsObject(responseData){	
	if(hasContactDetails(responseData)){
		return copy(responseData.contactDetails);
	}
	return null;
}

/**
 * PNR View Itinerary Element validation
 * @param responseData
 * @returns {Boolean}
 */
function hasAirItinerary(responseData){
	if(hasOwnProperty(responseData, "itinerary")
			&& Array.isArray(responseData.itinerary)
			&& responseData.itinerary.length > 0){
    	return true;    	
    }
	return false;
}

/**
 * Copy PNR View Itinerary Object
 * @param responseData
 * @returns obj
 */
function getAirItineraryObject(responseData){
	if(hasAirItinerary(responseData)){
		return copy(responseData.itinerary);
	}
	return null;
}

/**
 * PNR View Ticket Element validation
 * @param responseData
 * @returns {Boolean}
 */
function hasTicket(responseData){
	if(hasOwnProperty(responseData, "ticket")
			&& Array.isArray(responseData.ticket)
			&& responseData.ticket.length > 0){
    	return true;    	
    }
	return false;
}

/**
 * Copy PNR View Ticket Object
 * @param responseData
 * @returns obj
 */
function getTicketObject(responseData){
	if(hasTicket(responseData)){
		return copy(responseData.ticket);
	}
	return null;
}

/**
 * PNR View Ticket 승객 정보 출력
 * @param passenger
 * @returns {String}
 */
function renderingTicketPaasengers(refPaxRPH, airTraveler){
	var passenger = "";
	
	airTraveler.forEach(function(airVal, idx, arr){
		if(airVal.RPH == refPaxRPH){
			passenger = airVal.RPH + ". " + airVal.lastName + "/" + airVal.firstName + " " + nullCheck(airVal.title);
			return false;
		}
	});
	
	return passenger;
}

/**
 * PNR View 출발도착 정보 출력
 * @param refSegRPH, airItinerary
 * @returns {String}
 */
function renderingFromTo(refSegRPH, airItinerary){
	var fromTo = "";
	var fromToList = "";
	if(airItinerary){
		airItinerary.forEach(function(itVal, idx, arr){
			if(itVal.RPH == refSegRPH){
				fromTo = itVal.RPH + " " + itVal.depStn + " " + itVal.arrStn;
				return false;
			}
		});
	}
	return fromTo;
}

/**
 * PNR View Seg Number로 Flight Number 정보 출력
 * @param refSegRPH, airItinerary
 * @returns {String}
 */
function renderingFlight(refSegRPH, airItinerary){
	var flightNo = "";
	if(airItinerary){
		airItinerary.forEach(function(itVal, idx, arr){
			if(itVal.RPH == refSegRPH){
				flightNo = itVal.flightNo;
				return false;
			}
		});
	}
	return flightNo;
}

/**
 * PNR View Seg Number로 Flight Number 정보 출력
 * @param flightNo, airItinerary
 * @returns {String}
 */
function renderingAirline(flightNo, airItinerary){
	var airline = "";
	if(airItinerary){
		airItinerary.forEach(function(itVal, idx, arr){
			if(itVal.flightNo == flightNo){
				airline = itVal.airline;
				return false;
			}
		});
	}
	return airline;
}

/**
 * PNR View Flight Number 정보 출력
 * @param refSegRPH, airItinerary
 * @returns {String}
 */
function renderingFlightDate(refSegRPH, airItinerary){
	var flightDate = "";
	if(airItinerary){
		airItinerary.forEach(function(itVal, idx, arr){
			if(itVal.RPH == refSegRPH){
				flightDate = itVal.depDate.dateFormat('DDMMMYY');
				return false;
			}
		});
	}
	return flightDate;
}

//seatInfo
/**
 * PNR View Seat Info validation
 * @param responseData
 * @returns {Boolean}
 */
function hasSeatInfo(responseData){
	if(hasOwnProperty(responseData, "seatInfo")
			&& Array.isArray(responseData.seatInfo)
			&& responseData.seatInfo.length > 0){
    	return true;    	
    }
	return false;
}

/**
 * Copy PNR View Seat Info Object
 * @param responseData
 * @returns obj
 */
function getSeatInfoObject(responseData){
	if(hasSeatInfo(responseData)){
		return copy(responseData.seatInfo);
	}
	return null;
}

/**
 * PNR View Bundle) validation
 * @param responseData
 * @returns {Boolean}
 */
function hasBundle(responseData){
	if(hasOwnProperty(responseData, "bundle")
			&& Array.isArray(responseData.bundle)
			&& responseData.bundle.length > 0){
    	return true;    	
    }
	return false;
}

/**
 * Copy PNR View Bundle Object
 * @param responseData
 * @returns obj
 */
function getBundleObject(responseData){
	if(hasBundle(responseData)){
		return copy(responseData.bundle);
	}
	return null;
}

/**
 * PNR View AddintionalService(EMDA) validation
 * @param responseData
 * @returns {Boolean}
 */
function hasAdditionalService(responseData){
	if(hasOwnProperty(responseData, "EMDA")
			&& Array.isArray(responseData.EMDA)
			&& responseData.EMDA.length > 0){
    	return true;    	
    }
	return false;
}

/**
 * Copy PNR View AddintionalService(EMDA) Object
 * @param responseData
 * @returns obj
 */
function getAdditionalServiceObject(responseData){
	if(hasAdditionalService(responseData)){
		return copy(responseData.EMDA);
	}
	return null;
}

/**
 * PNR View AddintionalService(EMDA) validation
 * @param responseData
 * @returns {Boolean}
 */
function hasEMDTicket(responseData){
	if(hasOwnProperty(responseData, "EMDTicket")
			&& Array.isArray(responseData.EMDTicket)
			&& responseData.EMDTicket.length > 0){
    	return true;    	
    }
	return false;
}

/**
 * Copy PNR View AddintionalService(EMDA) Object
 * @param responseData
 * @returns obj
 */
function getEMDTicketObject(responseData){
	if(hasEMDTicket(responseData)){
		return copy(responseData.EMDTicket);
	}
	return null;
}

/**
 * PNR View EMDS(수수료 EMD 발행 내역) validation
 * @param responseData
 * @returns {Boolean}
 */
function hasEMDS(responseData){
	if(hasOwnProperty(responseData, "EMDS")
			&& Array.isArray(responseData.EMDS)
			&& responseData.EMDS.length > 0){
    	return true;    	
    }
	return false;
}

/**
 * Copy PNR View EMDS(수수료 EMD 발행 내역) Object
 * @param responseData
 * @returns obj
 */
function getEMDSObject(responseData){
	if(hasEMDS(responseData)){
		return copy(responseData.EMDS);
	}
	return null;
}

/**
 * PNR View SSR(Special Service Request) validation
 * @param responseData
 * @returns {Boolean}
 */
function hasSSR(responseData){
	if(hasOwnProperty(responseData, "etcSSR")
			&& Array.isArray(responseData.etcSSR)
			&& responseData.etcSSR.length > 0){
    	return true;    	
    }
	return false;
}

/**
 * Copy PNR View SSR(Special Service Request) Object
 * @param responseData
 * @returns obj
 */
function getSSRObject(responseData){
	if(hasSSR(responseData)){
		return copy(responseData.etcSSR);
	}
	return null;
}

/**
 * PNR View OTHS SSR validation
 * @param responseData
 * @returns {Boolean}
 */
function hasOTHSSSR(responseData){
	if(hasOwnProperty(responseData, "OTHSSSR")
			&& Array.isArray(responseData.OTHSSSR)
			&& responseData.OTHSSSR.length > 0){
    	return true;    	
    }
	return false;
}

/**
 * Copy PNR View OTHS SSR Object
 * @param responseData
 * @returns obj
 */
function getOTHSSSRObject(responseData){
	if(hasOTHSSSR(responseData)){
		return copy(responseData.OTHSSSR);
	}
	return null;
}

/**
 * PNR View Remarks validation
 * @param responseData
 * @returns {Boolean}
 */
function hasRemarks(responseData){
	if(hasOwnProperty(responseData, "remarks")
			&& Array.isArray(responseData.remarks)
			&& responseData.remarks.length > 0){
    	return true;    	
    }
	return false;
}

/**
 * Copy PNR View Remarks Object
 * @param responseData
 * @returns obj
 */
function getRemarksObject(responseData){
	if(hasRemarks(responseData)){
		return copy(responseData.remarks);
	}
	return null;
}


/**
 * PNR View OtherServiceInfo validation
 * @param responseData
 * @returns {Boolean}
 */
function hasOtherServiceInfo(responseData){
	if(hasOwnProperty(responseData, "otherServiceInfo")
			&& Array.isArray(responseData.otherServiceInfo)
			&& responseData.otherServiceInfo.length > 0){
    	return true;    	
    }
	return false;
}

/**
 * Copy PNR View OtherServiceInfo Object
 * @param responseData
 * @returns obj
 */
function getOtherServiceInfoObject(responseData){
	if(hasOtherServiceInfo(responseData)){
		return copy(responseData.otherServiceInfo);
	}
	return null;
}

/**
 * PNR View Special Remarks validation
 * @param responseData
 * @returns {Boolean}
 */
function hasSpecialRemarks(responseData){
	if(hasOwnProperty(responseData, "specialRemarks")
			&& Array.isArray(responseData.specialRemarks)
			&& responseData.specialRemarks.length > 0){
    	return true;    	
    }
	return false;
}

/**
 * Copy PNR View Special Remarks Object
 * @param responseData
 * @returns obj
 */
function getSpecialRemarksObject(responseData){
	if(hasSpecialRemarks(responseData)){
		return copy(responseData.specialRemarks);
	}
	return null;
}

function splitNumericPNRInfo (remarks){
	var str = null;
	if(remarks){
		remarks.forEach(function(value, index, array){
			if(!value.text.indexOf("NUMERICPNRINFO")){
				str = value.text.split(" ");
			}
	    });
	}
	return str;
}

function getNumericPNRInfo (numericPNRInfo){
	if(numericPNRInfo){
		return numericPNRInfo[numericPNRInfo.length - 1];
	}
}

function renderBookingInfo(bookingInfo, remarks){
	if(bookingInfo){
		var bookingInfoStr = "";       
        
//		var str = splitNumericPNRInfo(remarks);
//		var numericPNRInfo = getNumericPNRInfo(str);
		
		if(bookingInfo.PNR && !isUndefined(bookingInfo.PNR)){
			bookingInfoStr += "<li><span class='pnrNo'>PNR : " + bookingInfo.PNR;
			
			if(bookingInfo.numericPnr && !isUndefined(bookingInfo.numericPnr)){
				bookingInfoStr += " / " + bookingInfo.numericPnr;
			}
			
			bookingInfoStr += "</span></li>";
		}
		
		if(bookingInfo.createOffice && !isUndefined(bookingInfo.createOffice)){
			bookingInfoStr += "<li>Creation Office <strong>" + bookingInfo.createOffice + " </strong>&nbsp;&nbsp;Country Code " + nullCheck(bookingInfo.countryCode) + "</li>";
		}
		
		if(bookingInfo.createDate && !isUndefined(bookingInfo.createDate)){
			bookingInfoStr += "<li>Date  "+ bookingInfo.createDate.dateFormat('DDMMMYY') + "&nbsp;&nbsp;Time " + bookingInfo.createDate.dateFormat('HH:mm') + "</li>";
		}
		
//		bookingInfoStr += "<li>-E-TKT Warning-</li>";
		
		$(".booking_info").html(bookingInfoStr);	
	}
}

function renderTicketArrangement(ticketArrangement){
	if(ticketArrangement){
		var ticketArrangementStr = "<li class='tiket'><strong>Ticket Arrangement :&nbsp;</strong>";
		
		if(!isNull(ticketArrangement.ticketTL)){
			ticketArrangementStr += parseHourColonMinute(ticketArrangement.ticketTL) + ", " 
								 + moment(ticketArrangement.ticketTL, ["YYYYMMDDTHHmmss", "DDMMMYY"], "en").format("DDMMMYY").toUpperCase() + ", "
		}
		
		ticketArrangementStr += nullCheck(ticketArrangement.ticketAdvisor) + " <span class='more'><a id='ticketArrange' class='btn_modify on' href='#'>Modify</a></span></li>";
		
		$(".booking_info").append(ticketArrangementStr);
	}
}

function renderGroupName(groupName){
	if(groupName){
		var groupNameStr = "Group Name  : " + groupName;
		$("#groupName").html(groupNameStr);
	}
}

function renderAirTraveler(airTraveler){
	if(airTraveler){
		var isDom = isDomestic(responseData.Result.data.routeType);
		var header = '<div class="board">'
                   + '	<table class="board-content list">'
                   + '    <caption class="hide"> </caption>'
                   + '    <colgroup>'
                   + '    <col style="width:8%;">'
                   + '    <col>'
                   + '    <col style="width:8%;">'
                   + '    <col style="width:8%;">'
                   + (isDom ? '    <col>' : '')
                   + '    <col style="width:12%;">'
                   + '    <col style="width:8%;">'
                   + '    <col style="width:180px;">'
                   + '    </colgroup>'
                   + '    <thead>'
                   + '      <tr>'
                   + '        <th scope="col">No.</th>'
                   + '        <th scope="col">Name</th>'
                   + '        <th scope="col">Title</th>'
                   + '        <th scope="col">PTC</th>'
                   + (isDom ? '        <th scope="col">신분할인</th>' : '')
                   + '        <th scope="col">FFP</th>'
                   + '        <th scope="col">Infant</th>'
                   + '        <th scope="col">부가서비스</th>'
                   + '      </tr>'
                   + '    </thead>'
                   + '    <tbody id="names">'
                   + '    </tbody>'
                   + '  </table>'
                   + '  <table class="board-content list">'
                   + '    <tbody>'
                   + '      <tr> </tr>'
                   + '    </tbody>'
                   + '  </table>'
                   + '</div>';
		$("#namesTable").append(header);
		var nameList = "";
		
		airTraveler.forEach(function(value, index, array){
			nameList += "<tr>"
				   + "<td>" + value.RPH 
				   + "<input id='prefix" + value.RPH + "' name='prefix" + value.RPH + "' type='hidden' value='" + value.prefixName + "'>"
				   + "</td>"
				   + "<td>" + value.lastName + "/" + value.firstName + "</td>"
				   + "<td>" + nullCheck(value.title) + "</td>"
				   + "<td>" + value.type + "</td>"
				   + (isDom ? "<td>" : "")
			if(isDom && value.dcCode) {
				var dcCodeDescs = value.dcCodeDesc.split('^');
				value.dcCode.split('^').forEach(function(dcCodeVal, dcCodeIdx){
					nameList += nullCheck(dcCodeVal) + " <span class='kor'>(" + nullCheck(dcCodeDescs[dcCodeIdx]) + ")</span><br>";
				});
			}
			nameList += (isDom ? "</td>" : "")
				   + "<td>" + nullCheck(value.ffp) + "</td>"
				   + "<td>" + renderingIconInfant(value) + "</td>"				   
				   + "<td>";
				   
				   //부가서비스 icon rendering
				   var emdObj = array[index].emd;
				   if(emdObj && Array.isArray(emdObj)){
					   var iNSSTCnt = 0;
					   var iXBAGCnt = 0;
					   var iMLCnt = 0;
					   emdObj.forEach(function(emdValue, emdIndex, emdArray){
						   /*
						   if(emdArray[emdIndex] == "0AA"){
							   nameList += "<span class='emd_icon2'><em></em></span>";
						   }else if(emdArray[emdIndex] == "0B3"){
							   nameList += " <span class='emd_icon3'><em></em></span>";
						   }else if(emdArray[emdIndex] == "0B5"){
							   nameList += " <span class='emd_icon4'><em></em></span>";
						   }else{
							   nameList += "";
						   }
						    */
						   // PASSENGER > Names > 부가서비스 : 아이콘 표시 되도록 적용 (2018-08-14 유영민)
					   	   if (emdValue == "NSST") {
					   		   if (iNSSTCnt == 0) {
					   			   nameList += "<span class='emd_icon2'><em></em></span>";
					   			   iNSSTCnt++;
					   		   }
					   	   } else if (emdValue == "XBAG") {
					   		   if (iXBAGCnt == 0) {
					   			   nameList += " <span class='emd_icon3'><em></em></span>";
					   			   iXBAGCnt++;
					   		   }
						   } else if (emdValue.indexOf("ML") != -1) {
							   if (iMLCnt == 0) {
								   nameList += " <span class='emd_icon4'><em></em></span>";
								   iMLCnt++;
							   }
						   } else {
							   nameList += "";
						   }
					   });
				   }
			nameList += "</td>"
				   + "</tr>";
		});
		$("#names").html(nameList);
	}
}

function renderContactDetails(contactDetails){
	if(contactDetails){
		var contactDetailList = "";
		
		contactDetails.forEach(function(value, index, array){
			contactDetailList += "<li>";
			contactDetailList += value.type + " : " + nullCheck(value.city) + " ";

            if(value.type == "EMAIL"){
            	contactDetailList += "<a href=''>";
            }
            
            contactDetailList += value.address;;
			
            if(value.type == "EMAIL"){
            	contactDetailList += "</a>";
            }
            
            if(value.type == "PHONE" || value.type == "MOBILE"){            	
            	if(value.lastName && value.firstName){
            		contactDetailList += " " + nullCheck(value.lastName) + "/" + nullCheck(value.firstName);
            	}else{
            		contactDetailList += " " + nullCheck(value.lastName) + nullCheck(value.firstName);
            	}
            	contactDetailList += "</li>";
            }
	    });
		
		$("#contact_details").html(contactDetailList);
	}
}

function renderAirItinerary(airItinerary){
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
			
			itineraryList += "<tr>"
			  + "<td>" + value.RPH + "</td>"
			  + "<td>" + nullCheck(value.airline) + value.flightNo + "</td>"
			  + "<td>" + nullCheck(value.bookingClass) + "</td>"
			  + "<td>" + depDate + "</td>"
			  + "<td>" + depDay + "</td>"
			  + "<td>" + value.depStn + "</td>"
			  + "<td>" + value.arrStn + "</td>"
			  + "<td>" + depTime + "</td>"
			  + "<td>" + arrTime + "</td>"
			  + "<td>" + nullCheck(value.bookingStatus) + nullCheck(value.paxCount) + "</td>"
			  + "</tr>";
        });		
		$("#itineraryList").html(itineraryList);
	}
}

/**
 * Ticket 목록을 화면에 그립니다.
 * 발권된 Ticket는 Code 값이 TKNE 또는 티켓 번호가 있습니다.
 * @param ticket
 */
function renderTicket(ticket, airTraveler, airItinerary){
	if(ticket){
		var ticketList = "";
		ticket.forEach(function(value, index, array){
			if(value.refSegRPH && Array.isArray(value.refSegRPH) && value.refSegRPH.length > 0){
				value.refSegRPH.forEach(function(seggment, idx, arr){
					if(value.refPaxRPH && Array.isArray(value.refPaxRPH) && value.refPaxRPH.length > 0){
						value.refPaxRPH.forEach(function(pax, idxPax, arrPax){
							ticketList += "<tr>"
							  + "<td>" + value.code + "</td>"
							  + "<td>" + value.codeDesc + "</td>"
							  + "<td>" + renderingTicketPaasengers(pax, airTraveler) + "</td>"
							  + "<td>" + renderingFromTo(seggment, airItinerary) + "</td>"
							  + "<td>" + renderingFlight(seggment, airItinerary) + "</td>"
							  + "<td>" + renderingFlightDate(seggment, airItinerary) + "</td>"
							  + "<td>" + value.airline + "</td>"
							  + "<td>" + nullCheck(value.status) + "</td>"
							  + "<td class='align-left'>" + nullCheck(value.text) + "</td>"
							  + "</tr>";
						});
					}else{
						ticketList += "<tr>"
							  + "<td>" + value.code + "</td>"
							  + "<td>" + value.codeDesc + "</td>"
							  + "<td>" + "" + "</td>"
							  + "<td>" + "" + "</td>"
							  + "<td>" + renderingFlight(seggment, airItinerary) + "</td>"
							  + "<td>" + renderingFlightDate(seggment, airItinerary) + "</td>"
							  + "<td>" + value.airline + "</td>"
							  + "<td>" + nullCheck(value.status) + "</td>"
							  + "<td class='align-left'>" + nullCheck(value.text) + "</td>"
							  + "</tr>";
					}
				});
			}else if(value.refPaxRPH && Array.isArray(value.refPaxRPH) && value.refPaxRPH.length > 0){
				value.refPaxRPH.forEach(function(pax, idxPax, arrPax){
					ticketList += "<tr>"
						  + "<td>" + value.code + "</td>"
						  + "<td>" + value.codeDesc + "</td>"
						  + "<td>" + renderingTicketPaasengers(pax, airTraveler) + "</td>"
						  + "<td>" + "" + "</td>"
						  + "<td>" + "" + "</td>"
						  + "<td>" + "" + "</td>"
						  + "<td>" + value.airline + "</td>"
						  + "<td>" + nullCheck(value.status) + "</td>"
						  + "<td class='align-left'>" + nullCheck(value.text) + "</td>"
						  + "</tr>";
				});
			}else{
				ticketList += "<tr>"
					  + "<td>" + value.code + "</td>"
					  + "<td>" + value.codeDesc + "</td>"
					  + "<td>" + "" + "</td>"
					  + "<td>" + "" + "</td>"
					  + "<td>" + "" + "</td>"
					  + "<td>" + "" + "</td>"
					  + "<td>" + value.airline + "</td>"
					  + "<td>" + nullCheck(value.status) + "</td>"
					  + "<td class='align-left'>" + nullCheck(value.text) + "</td>"
					  + "</tr>";
			}
		});
		$("#ticket").html(ticketList);
	}
}

function renderBundle(bundle, airTraveler, airItinerary){
	if(bundle && isArray(bundle) && bundle.length > 0){
		var bundleList = "";
		
		bundle.forEach(function(value, index, array){
			bundleList += "<tr>"
			  + "<td class='rph'>" + value.code + "</td>"
			  + "<td>" + value.codeDesc + "</td>";
			
			bundleList += "<td>";
			if(value.refPaxRPH && value.refPaxRPH.length > 0){
				value.refPaxRPH.forEach(function(paxVal, paxIdx, paxArr){
					airTraveler.forEach(function(airTravelerVal, airTravelerIdx, airTravelerArr){
						if(airTravelerVal.RPH == paxVal){
							bundleList += "&nbsp;" + airTravelerVal.RPH + ". " + airTravelerVal.lastName + "/" + airTravelerVal.firstName;
						}
					});
				});
			}
			bundleList += "</td>";
			
			bundleList += "<td>";
			if(value.refSegRPH && Array.isArray(value.refSegRPH) && value.refSegRPH.length > 0){
				value.refSegRPH.forEach(function(segVal, segIdx, segArr){
					airItinerary.forEach(function(airItineraryVal, airItineraryIdx, airItineraryArr){
						if(airItineraryVal.RPH == segVal){
							bundleList += "&nbsp;" + airItineraryVal.RPH + " " + airItineraryVal.depStn + " " + airItineraryVal.arrStn;
						}
					});
				});
			}
			bundleList += "</td>";
			
			bundleList += "<td>";
			if(value.refSegRPH && Array.isArray(value.refSegRPH) && value.refSegRPH.length > 0){
				value.refSegRPH.forEach(function(segVal, segIdx, segArr){
					airItinerary.forEach(function(airItineraryVal, airItineraryIdx, airItineraryArr){
						if(airItineraryVal.RPH == segVal){
							bundleList += "&nbsp;" + nullCheck(airItineraryVal.flightNo);
						}
					});
				});
			}
			bundleList += "</td>";
			
			bundleList += "<td>";
			if(value.refSegRPH && Array.isArray(value.refSegRPH) && value.refSegRPH.length > 0){
				value.refSegRPH.forEach(function(segVal, segIdx, segArr){
					airItinerary.forEach(function(airItineraryVal, airItineraryIdx, airItineraryArr){
						if(airItineraryVal.RPH == segVal){
							bundleList += parseDDMMMYY(nullCheck(airItineraryVal.depDate));
						}
					});
				});
			}
			bundleList += "</td>";
			
			bundleList += "<td>" + value.airline + "</td>";			
			bundleList += "<td>" + value.status + "</td>";			
			bundleList += "<td>" + value.text + "</td>";
		});
		
		$("#bundleList").html(bundleList);
	}
}

function renderNSSTService(seatInfo, airTraveler, airItinerary){
	if(seatInfo){
		var nsstList = "";
		
		seatInfo.forEach(function(value, index, array){
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
						  + "<td>" + nullCheck(value.status) + "</td>"
						  + "<td class='align-left'>" + value.seatNumber + "</td>"
						  + "</tr>";
				}
			});
		});
	}
	$("#additionalServiceList").html(nsstList);
}

function renderAdditionalService(additionalService, airTraveler, airItinerary){
	if(additionalService){
		var additionalServiceList = "";
		additionalService.forEach(function(value, index, array){
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
							  + "<td>" + nullCheck(value.status) + "</td>"
							  + "<td class='align-left'>" + nullCheck(value.text) + "</td>"
							  + "</tr>";
						});
					}else{
						additionalServiceList += "<tr>"
							  + "<td>" + value.code + "</td>"
							  + "<td>" + value.codeDesc + "</td>"
							  + "<td>" + "" + "</td>"
							  + "<td>" + "" + "</td>"
							  + "<td>" + renderingFlight(seggment, airItinerary) + "</td>"
							  + "<td>" + renderingFlightDate(seggment, airItinerary) + "</td>"
							  + "<td>" + value.airline + "</td>"
							  + "<td>" + nullCheck(value.status) + "</td>"
							  + "<td class='align-left'>" + nullCheck(value.text) + "</td>"
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
						  + "<td>" + value.airline + "</td>"
						  + "<td>" + nullCheck(value.status) + "</td>"
						  + "<td class='align-left'>" + nullCheck(value.text) + "</td>"
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
					  + "<td>" + nullCheck(value.status) + "</td>"
					  + "<td class='align-left'>" + nullCheck(value.text) + "</td>"
					  + "</tr>";
			}
		});
		$("#additionalServiceList").append(additionalServiceList);
	}
	
	
}

function renderEMDTicket(EMDTicket, airTraveler, airItinerary){
	if(EMDTicket){
		var EMDTicketList = "";
		EMDTicket.forEach(function(value, index, array){
			if(value.refSegRPH && Array.isArray(value.refSegRPH) && value.refSegRPH.length > 0){
				value.refSegRPH.forEach(function(seggment, idx, arr){
					if(value.refPaxRPH && Array.isArray(value.refPaxRPH) && value.refPaxRPH.length > 0){
						value.refPaxRPH.forEach(function(pax, idxPax, arrPax){
							EMDTicketList += "<tr>"
							  + "<td>" + value.code + "</td>"
							  + "<td>" + value.codeDesc + "</td>"
							  + "<td>" + renderingTicketPaasengers(pax, airTraveler) + "</td>"
							  + "<td>" + renderingFromTo(seggment, airItinerary) + "</td>"
							  + "<td>" + renderingFlight(seggment, airItinerary) + "</td>"
							  + "<td>" + renderingFlightDate(seggment, airItinerary) + "</td>"
							  + "<td>" + value.airline + "</td>"
							  + "<td>" + nullCheck(value.status) + "</td>"
							  + "<td class='align-left'>" + nullCheck(value.text) + "</td>"
							  + "</tr>";
						});
					}else{
						EMDTicketList += "<tr>"
							  + "<td>" + value.code + "</td>"
							  + "<td>" + value.codeDesc + "</td>"
							  + "<td>" + "" + "</td>"
							  + "<td>" + "" + "</td>"
							  + "<td>" + renderingFlight(seggment, airItinerary) + "</td>"
							  + "<td>" + renderingFlightDate(seggment, airItinerary) + "</td>"
							  + "<td>" + value.airline + "</td>"
							  + "<td>" + nullCheck(value.status) + "</td>"
							  + "<td class='align-left'>" + nullCheck(value.text) + "</td>"
							  + "</tr>";
					}
				});
			}else if(value.refPaxRPH && Array.isArray(value.refPaxRPH) && value.refPaxRPH.length > 0){
				value.refPaxRPH.forEach(function(pax, idxPax, arrPax){
					EMDTicketList += "<tr>"
						  + "<td>" + value.code + "</td>"
						  + "<td>" + value.codeDesc + "</td>"
						  + "<td>" + renderingTicketPaasengers(pax, airTraveler) + "</td>"
						  + "<td>" + "" + "</td>"
						  + "<td>" + "" + "</td>"
						  + "<td>" + "" + "</td>"
						  + "<td>" + value.airline + "</td>"
						  + "<td>" + nullCheck(value.status) + "</td>"
						  + "<td class='align-left'>" + nullCheck(value.text) + "</td>"
						  + "</tr>";
				});
			}else{
				EMDTicketList += "<tr>"
					  + "<td>" + value.code + "</td>"
					  + "<td>" + value.codeDesc + "</td>"
					  + "<td>" + "" + "</td>"
					  + "<td>" + "" + "</td>"
					  + "<td>" + "" + "</td>"
					  + "<td>" + "" + "</td>"
					  + "<td>" + value.airline + "</td>"
					  + "<td>" + nullCheck(value.status) + "</td>"
					  + "<td class='align-left'>" + nullCheck(value.text) + "</td>"
					  + "</tr>";
			}
		});
		$("#EMDTicketList").html(EMDTicketList);
	}
}

function renderEmds(emds){
	if(emds){
		var emdsList = "";
		emds.forEach(function(value, index, array){
			if(value.refSegRPH && Array.isArray(value.refSegRPH) && value.refSegRPH.length > 0){
				value.refSegRPH.forEach(function(seggment, idx, arr){
					if(value.refPaxRPH && Array.isArray(value.refPaxRPH) && value.refPaxRPH.length > 0){
						value.refPaxRPH.forEach(function(pax, idxPax, arrPax){
							emdsList += nullCheck(value.text) + " <br>";
						});
					}else{
						emdsList += nullCheck(value.text) + " <br>";
					}
				});
			}else if(value.refPaxRPH && Array.isArray(value.refPaxRPH) && value.refPaxRPH.length > 0){
				value.refPaxRPH.forEach(function(pax, idxPax, arrPax){
					emdsList += nullCheck(value.text) + " <br>";
				});
			}else{
				emdsList += nullCheck(value.text) + " <br>";
			}
		});
	
		$("#emds").html(emdsList);
	}
}

/**
 * Special Service Request 항목을 출력합니다.
 * passengers(refPaxRPH), Itinerary(refSegRPH) 는 배열로 정보를 가지고 있습니다.
 * @param ssr
 * @param airTraveler
 * @param airItinerary
 */
function renderSsr(ssr, airTraveler, airItinerary){
	if(ssr){
		var ssrList = "";
		ssr.forEach(function(value, index, array){
			if(value.refSegRPH && Array.isArray(value.refSegRPH) && value.refSegRPH.length > 0){
				value.refSegRPH.forEach(function(seggment, idx, arr){					
					if(value.refPaxRPH && Array.isArray(value.refPaxRPH) && value.refPaxRPH.length > 0){
						value.refPaxRPH.forEach(function(pax, idxPax, arrPax){
							ssrList += "<tr>"
								  + "<td>" + value.code + "</td>"
								  + "<td>" + value.codeDesc + "</td>"
								  + "<td>" + renderingTicketPaasengers(pax, airTraveler) + "</td>"
								  + "<td>" + renderingFromTo(seggment, airItinerary) + "</td>"
								  + "<td>" + renderingFlight(seggment, airItinerary) + "</td>"
								  + "<td>" + renderingFlightDate(seggment, airItinerary) + "</td>"
								  + "<td>" + value.airline + "</td>"
								  + "<td>" + nullCheck(value.status) + "</td>"
								  + "<td class='align-left'>" + nullCheck(value.text) + "</td>"
								  + "</tr>";
						});
					}else{
						ssrList += "<tr>"
							  + "<td>" + value.code + "</td>"
							  + "<td>" + value.codeDesc + "</td>"
							  + "<td>" + "" + "</td>"
							  + "<td>" + "" + "</td>"
							  + "<td>" + renderingFlight(seggment, airItinerary) + "</td>"
							  + "<td>" + renderingFlightDate(seggment, airItinerary) + "</td>"
							  + "<td>" + value.airline + "</td>"
							  + "<td>" + nullCheck(value.status) + "</td>"
							  + "<td class='align-left'>" + nullCheck(value.text) + "</td>"
							  + "</tr>";
					}
				});
			}else if(value.refPaxRPH && Array.isArray(value.refPaxRPH) && value.refPaxRPH.length > 0){
				value.refPaxRPH.forEach(function(pax, idxPax, arrPax){
					ssrList += "<tr>"
						  + "<td>" + value.code + "</td>"
						  + "<td>" + value.codeDesc + "</td>"
						  + "<td>" + renderingTicketPaasengers(pax, airTraveler) + "</td>"
						  + "<td>" + "" + "</td>"
						  + "<td>" + "" + "</td>"
						  + "<td>" + "" + "</td>"
						  + "<td>" + value.airline + "</td>"
						  + "<td>" + nullCheck(value.status) + "</td>"
						  + "<td class='align-left'>" + nullCheck(value.text) + "</td>"
						  + "</tr>";
				});
			}else{
				ssrList += "<tr>"
					  + "<td>" + value.code + "</td>"
					  + "<td>" + value.codeDesc + "</td>"
					  + "<td>" + "" + "</td>"
					  + "<td>" + "" + "</td>"
					  + "<td>" + "" + "</td>"
					  + "<td>" + "" + "</td>"
					  + "<td>" + value.airline + "</td>"
					  + "<td>" + nullCheck(value.status) + "</td>"
					  + "<td class='align-left'>" + nullCheck(value.text) + "</td>"
					  + "</tr>";
			}
	    });
		$("#ssrList").html(ssrList);
	}
}

function renderOthsssr(othsssr){
	if(othsssr){
		var othsssrList = "";
		othsssr.forEach(function(value, index, array){
			if(value.refSegRPH && Array.isArray(value.refSegRPH) && value.refSegRPH.length > 0){
				value.refSegRPH.forEach(function(seggment, idx, arr){
					if(value.refPaxRPH && Array.isArray(value.refPaxRPH) && value.refPaxRPH.length > 0){
						value.refPaxRPH.forEach(function(pax, idxPax, arrPax){
							othsssrList += nullCheck(value.text) + "<br>";
						});
					}else{
						othsssrList += nullCheck(value.text) + "<br>";
					}
				});
			}else if(value.refPaxRPH && Array.isArray(value.refPaxRPH) && value.refPaxRPH.length > 0){
				value.refPaxRPH.forEach(function(pax, idxPax, arrPax){
					othsssrList += nullCheck(value.text) + "<br>";
				});
			}else{
				othsssrList += nullCheck(value.text) + "<br>";
			}
		});
	}
	$("#oths_ssr").html(othsssrList);	
}

function renderOtherServiceInfo(otherServiceInfo, airTraveler){
	if(otherServiceInfo && isArray(otherServiceInfo) && otherServiceInfo.length > 0){
		var otherServiceInfoList = "";
		otherServiceInfo.forEach(function(value, index, array){
/*			
			var paxList = "";
			value.refPaxRPH.forEach(function(paxVal, paxIdx, paxArr){
				if(airTraveler && isArray(airTraveler) && airTraveler.length > 0){
					airTraveler.forEach(function(val, idx, arr){
						if(paxVal == val.RPH){
							paxList += " " + val.lastName + "/" + val.firstName;
						}
					});
				}
			});
			otherServiceInfoList += value.text + " " + paxList +"<br>";
*/			
			otherServiceInfoList += value.text + "/P" + value.refPaxRPH +"<br>";
		});		
		$("#otherServiceInfo").html(otherServiceInfoList);
	}else{
		$("#otherServiceInfo").hide();
	}
}

function renderRemarks(remarks){
	if(remarks && isArray(remarks) && remarks.length > 0){
		var remarksList = "";
		remarks.forEach(function(value, index, array){
			remarksList += value.text + "<br>";
	    });		
		$("#remarksList").html(remarksList);
	}else{
		$("#remarksList").hide();
	}
}

function renderSpecialRemarks(specialRemarks){
	if(specialRemarks && isArray(specialRemarks) && specialRemarks.length > 0){
		var specialRemarksList = "";
		specialRemarks.forEach(function(value, index, array){
			if(value.text == "CNN") {
				specialRemarksList += "T/" + value.text + "/P" + value.refPaxRPH + "<br>";
			} else {
				specialRemarksList += value.text + "<br>";
			}
	    });
		$("#specialRemarkList").html(specialRemarksList);
	}else{
		$("#specialRemarkList").hide();
	}
}
function isDomestic(routeType){
	return routeType != "I" ? true : false;
}

function setPNRViewInfo(resultData){
	$("#isDomestic").val(isDomestic(resultData.routeType));
	
	//booking Information에서 Remarks의 NUMERICPNRINFO 가 있는  경우 PNR number 다음에 노출하기 위해 데이타를 사전에 가져옵니다.
	var remarks = getRemarksObject(resultData);
	renderRemarks(remarks);
	
	var bookingInfo = getBookingInfoObject(resultData);
	renderBookingInfo(bookingInfo, remarks);
	
	var ticketArrangement = getTicketArrangementObject(resultData);
	renderTicketArrangement(ticketArrangement);
	
	var groupName = getGroupNameString(resultData);
	renderGroupName(groupName);
	
	var airTraveler = getNamesObject(resultData);
	renderAirTraveler(airTraveler);
	
	var contactDetails = getContactDetailsObject(resultData);
	renderContactDetails(contactDetails);
	
	var airItinerary = getAirItineraryObject(resultData);
	renderAirItinerary(airItinerary);
	
	var ticket = getTicketObject(resultData);	
	renderTicket(ticket, airTraveler, airItinerary);
	
	var bundle;
	if(isDomestic(resultData.routeType)){
		bundle = getBundleObject(resultData);
	}

	//국내선인 경우에만 해당 영역 을노출합니다.
	if(resultData.routeType == "D"){
		$("#bundleTable").show();
		renderBundle(bundle, airTraveler, airItinerary);
	}else{
		$("#bundleTable").hide();
	}
	
	var seatInfo = getSeatInfoObject(resultData);
	renderNSSTService(seatInfo, airTraveler, airItinerary);
	
	var additionalService = getAdditionalServiceObject(resultData);
	renderAdditionalService(additionalService, airTraveler, airItinerary);
	
	var EMDTicket = getEMDTicketObject(resultData);
	renderEMDTicket(EMDTicket, airTraveler, airItinerary);
	
	var emds = getEMDSObject(resultData);
	renderEmds(emds);
	
	var ssr = getSSRObject(resultData);
	renderSsr(ssr, airTraveler, airItinerary);
	
	var othsssr = getOTHSSSRObject(resultData);
	if(othsssr && Array.isArray(othsssr) && othsssr.length > 0){
		renderOthsssr(othsssr);
	}else{
		$("#oths_ssr").parent().parent().hide();
	}
	
	var otherServiceInfo = getOtherServiceInfoObject(resultData);
	renderOtherServiceInfo(otherServiceInfo, airTraveler);
	
	var specialRemarks = getSpecialRemarksObject(resultData);		
	renderSpecialRemarks(specialRemarks);
	
	selectOffice();
}

function getBookinginfoPNR(responseData){
	var pnr = "";
	
	if(responseData.Result.data.bookingInfo){
		pnr = responseData.Result.data.bookingInfo.PNR;
	}else if(responseData.Result.data.successAndWarningsAndAirReservation){
		pnr = responseData.Result.data.successAndWarningsAndAirReservation.bookingReferenceIDAttr;
		
	}
	
	return pnr;
}

function assignValiable(data){
	responseData = data;
	currentPnr = getBookinginfoPNR(responseData);
	$.cookie("PNR", currentPnr);
	//if(responseData.Result.data.bookingInfo.numericPnr && !isUndefined(responseData.Result.data.bookingInfo.numericPnr)){
	if(responseData.Result.data.bookingInfo){
		$.cookie("numericPNR", responseData.Result.data.bookingInfo.numericPnr);
	}
}

function renderHistoryLayer(){
  var text = "";
  $("#pnrHistory").html(text);
  ajaxCall(
	"/selectPNRHistory.do" //call url
	, JSON.stringify({"PNR": currentPnr,
		"isDomestic": $("#isDomestic").val()})
	, function(data){
		if(data && data.Result && data.Result.data){
		  text += "<table>";
		  var lines = data.Result.data.split("\r\n"); 
		  lines.forEach(function(value, index, array){
			text += "<tr><td>";
				
			if(index < 2){
			  text += "<strong>";
			}
				
			text += value;
				
			if(index < 2){
			  text += "</strong>";
			}
				
			text += "</td></tr>";
		  });
		  text += "</table>";
			
		  $("#pnrHistory").html(text);
	  }
	}
	, true //로딩사용여부
	, true //동기화옵션
	, function () { //error시 callBack함수
		alert("Error!");
		//$('#noticeText').text("error!");
		//$('.noticelayer').css("display",'block');
	}
	, null
	, null //subData
	, true
  );
}

function renderSplitLayer(airTraveler){
	
	if(airTraveler){
		var text = "";
		
		airTraveler.forEach(function(value, index, array){
			text += "<tr>";
			text += "<td><span>";
			text += "<input name='splitedTarget' id='select1-" + value.RPH + "' type='checkbox' value='" + value.RPH + "'>";
			text += "<label for='select1-" + value.RPH + "' name='splitedTarget'></>";
			text += "</span>";
			text += "</td>";
			text += "<td>P" + value.RPH + "</td>";
			text += "<td>" + value.lastName + "/" + value.firstName + " " + nullCheck(value.title) + "</td>";
			text += "<td>" + renderingIconInfant(value) + "</td>";
			text += "</tr>";
		});
			
		$("#splitingPassenger").html(text);
	}
}

function splitNames(targetList){
	var param = new Array;
	var nameList = getNamesObject(responseData.Result.data);
	nameList.forEach(function(value, index, array){						
		targetList.each(function(){
			if($(this).val() == value.RPH){
				param.push(value);
			}
		});
	});
	
	var data = JSON.stringify({
		"PNR": currentPnr,
		"createDate": responseData.Result.data.bookingInfo.createDate,
		"names": param,
		"isDomestic": $("#isDomestic").val(),
		"officeInfo": parent.officeList[$('select[name=officeList] option:selected').attr('officeIndex')]
	});

	ajaxCall(
		"/splitPNR.do"
		, data
		, splitCallBack
		, true
		, true
		, function () { //error시 callBack함수
			$(this).parent().parent().parent().show();
			$('#noticeText').text("error!");
			$('.noticelayer').css("display",'block');
		}
		, null
		, null
		, true
	);
}

function splitCallBack(data) {
	if(data
			&& data.Result
			&& data.Result.code == "0000"
			&& data.Result.data){
	    assignValiable(data);
		setPNRViewInfo(responseData.Result.data);
		setRecentPnr(responseData.Result.data); // 최근 조회한 PNR 을 쿠키에 저장 utils.js (2018-07-09 유영민)
		$('.splitlayer').hide();
        $('#noticeText').text("성공하였습니다.");
        $('.noticelayer').css("display",'block');
	} else {
        $('#noticeText').text(responseData.Result.message);
        $('.noticelayer').css("display",'block');
	}
}

$('#cancelOK').click(function(){
	  $('.cancellayer').hide();
	  ajaxCall(
			  "/cancelPNR.do"
			  , JSON.stringify({"PNR": currentPnr
				  , "numericPnr": responseData.Result.data.bookingInfo.numericPnr
				  , "createDate": responseData.Result.data.bookingInfo.createDate
				  , "isDomestic": $("#isDomestic").val()
				  , "officeInfo": parent.officeList[$('select[name=officeList] option:selected').attr('officeIndex')]})
			  , cancelPnrCallBack
			  , true
			  , true
			  , function () { // error시 callBack함수
				  $('#noticeText').text("error!");
				  $('.noticelayer').css("display",'block');
			  }
			  , null // subData
			  , null
			  , true
	  );
});

function cancelPnrCallBack(data){
	$(this).toggleClass('current').siblings().removeClass("current");
	$(".gnb").find("li:first").addClass("current");

	if(data
		  && data.Result
		  && data.Result.code == "0000"){
		$("#noticeAndRedirectText").text("PNR CANCELLED " + currentPnr);
		$("#redirectUrl").val("/home.do");
		$("#isReplace").val("Y");
		$(".noticeAndRedirectLayer").show();
	} else {
		$("#noticeText").text(data.Result.message);
		$(".noticelayer").show();
	}
}

function renderReceitLayer(){
  ajaxCall(
		"/retrievePNR.do" //call url
		, JSON.stringify({"PNR": currentPnr})
		, function(data){
			
			var nameList = "";
			var rph = 0;
			
			if(data.Result.data.ticket == null || data.Result.data.ticket.length == 0){
				 nameList += "<tr>"
					   + "<td></td>"
					   + "<td colspan='2'>티켓 발권 전입니다.</td>"
					   
			    nameList += "</tr>";
				$("#receitList").html(nameList);
				return;
			}

			$(".etkt .all").hide();
			data.Result.data.names.forEach(function(value, index, array){
				nameList += "<tr>"
					   + "<td><span>"
					   + "<input name='receitTarget' id='select1-" + value.RPH + "' type='checkbox' value='" + value.RPH + "'>"
					   + "<label for='select1-" + value.RPH + "'></label>"
					   + "</span>"
					   + "</td>"
					   + "<td>" + "P" + value.RPH + "</td>"
					   + "<td>" + value.lastName + "/" + value.firstName + "</td>"
					   
			  nameList += "</tr>";
				
		      rph = value.RPH;
		      
			});
						
			//유아 추가
			if(data.Result.data.etcSSR && $("#isDomestic").val() != "true") {
				$.each(data.Result.data.etcSSR, function(etcIndex, etc){
					if (etc.code=='INFT' && etc.refSegRPH[0] == 1) {
												
						var names = etc.text.substring(1, etc.text.indexOf(' ')).split('/');
						
						rph++;
																		
						nameList += "<tr>"
							   + "<td><span>"
							   + "<input name='receitTarget' id='select1-INF" + etc.refPaxRPH[0] + "' type='checkbox' value='" + rph + "'>"
							   + "<label for='select1-INF" + etc.refPaxRPH[0] + "'></label>"
							   + "</span>"
							   + "</td>"
							   + "<td>" + "INFT" + "</td>"
							   + "<td>" + names[0] + "/" + names[1] + "</td>"							   
					    nameList += "</tr>";						
					}
					
				});
			}

			$("#receitList").html(nameList);
		}
		, true
		, true
		, function () { //error시 callBack함수
			$('#noticeText').text("error!");
			$('.noticelayer').css("display",'block');
		}
		, null
		, null //subData
		, true
  );
}

function changeOwnership(officeId){	
	ajaxCall(
			"/changeOwnership.do"
			, JSON.stringify({
				"PNR": currentPnr, 
			    "isDomestic": $("#isDomestic").val(),
				"officeId": officeId,
				"officeInfo": parent.officeList[$('select[name=officeList] option:selected').attr('officeIndex')]
			})
			, function(data){
				$("#noticeText").text("변경되었습니다.");
				$('.noticelayer').css("display",'block');
			}
			, true
			, true
			, function () { //error시 callBack함수
				$('#noticeText').text("Error!");
				$('.noticelayer').css("display",'block');
			}
			, null
			, null //subData
			, true
	);
}

function sendQueueMessage(officeId){
	ajaxCall(
			"/sendQueue.do" //call url
			, JSON.stringify({
				"PNR": currentPnr,
				"isDomestic": $("#isDomestic").val(),
				"officeId": officeId,
				"officeInfo": parent.officeList[$('select[name=officeList] option:selected').attr('officeIndex')]
			})
			, function(e){
				$('#noticeText').text("Success!");
				$('.noticelayer').css("display",'block');
			}
			, true //로딩사용여부
			, true //동기화옵션
			, function () { //error시 callBack함수
				$('#noticeText').text("Error!");
				$('.noticelayer').css("display",'block');
			}
			, null
			, null //subData
			, true
	);
}

function sendReceit(targetList) {

	var email = $.trim($("#receitEmail").val());

	if (email.indexOf("@") == -1 || email.indexOf(".") == -1) {
		alert("이메일 형식이 틀립니다.");
		return;
	}

	var selectList = [];

	$('input:checkbox[name=receitTarget]:checked').each(function(obj) {
		selectList.push($(this).val());
	});

	var data = JSON.stringify({
		"PNR" : currentPnr,
		"Names" : JSON.stringify(selectList),
		"Email" : email,
		"Lang" : $("#lang option:selected").val(),
		"sendOnePage" : $("#sendOnePage").prop("checked")
	});

	ajaxCall("/sendReceiptMail.do", data, function(data) {
		alert(data.Result.data);
		$(this).parent().parent().parent().parent().parent().hide();
	}, true //로딩사용여부
	);

}

function receiptPreview() {

	var targetList = $('input:checkbox[name=receitTarget]:checked');
	if (targetList.length < 1) {
		alert("탭승객을 1명 이상 선택하세요.");
		return false;
	}

	var selectList = [];
	$('input:checkbox[name=receitTarget]:checked').each(function() {
		selectList.push($(this).attr('value'));
	});

	window.open("/receiptPreview.do?pnr=" + $.cookie('PNR'), "_blank",
			"width=820, height=800, scrollbars=yes ");

}