function setBundleInfo(responseData){
	var bundleInfo = getBundleObject(responseData);	
	var airTraveler = getNamesObject(responseData);
	var airItinerary = getAirItineraryObject(responseData);
	
	renderModifyBundleObject(bundleInfo, airTraveler, airItinerary);

}

/**
 * OSI의 refPaxRPH 를 참조 해서 PAX List를 가져옵니다. 
 * @param otherServiceInfo
 * @param airTraveler
 */
function renderModifyBundleObject(bundleInfo, airTraveler, airItinerary){
	if(bundleInfo && isArray(bundleInfo) && bundleInfo.length > 0){
		var bundleList = "";
		
		bundleInfo.forEach(function(value, index, array){
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
			
			var SSRObj = {
				"RPH" : value.RPH,
				"refSegRPH" : value.refSegRPH,
				"refPaxRPH" : value.refPaxRPH,
				"ssrCode" : value.code,
				"bundlecode" : value.code,
				"codeDesc" : value.codeDesc,
				"quantity" : value.quantity,
				"status" : value.status,
				"airline" : value.airline,
				"text" : value.text
			};
			
			bundleList += "<td>" + value.text + "</td>"
			  + "<td class='bo-left'><input name='btnRemove' class='delete_btn2' value='' type='button' data-rph='" + value.RPH + "' data-bundleObject='" + JSON.stringify(SSRObj) + "'></td>"
			  + "</tr>";
		});
		
		$("#bundleList").html(bundleList);
	}
}

function renderNewBundle(){
	var airTraveler = getNamesObject(responseData.Result.data);
	var airItinerary = getAirItineraryObject(responseData.Result.data);
	
	var newBundleList = "";
	newBundleList += "<div class='add_content01'>"          
	+ "<div class='con-l'>"
	+ "<table>";
	
	if(airItinerary){
		airItinerary.forEach(function(value, index, array){
			newBundleList += "<tr>"
				+ "<td><input type='radio' id='seg" + value.RPH +"' name='seg' data-segRPH='" + value.RPH + "' data-seg='" + JSON.stringify(value) + "'>"
				+ "<label for='seg" + value.RPH +"'>";
			newBundleList += "&nbsp;"+ value.airline + value.flightNo;
			newBundleList += value.bookingClass;
			newBundleList += "&nbsp;" + value.depDate.dateFormat('DDMMMYY');
			newBundleList += "&nbsp;" + value.depStn;
			newBundleList += "&nbsp;" + value.arrStn;
			newBundleList += "</label></td></tr>";
		});
	}
	//7C151 L 14APR18 GMP CJU
    
	newBundleList += "</table>"
	+ "</div>";

	newBundleList += "<div class='con-view2'>"
	+ "<table>"
	+ "<colgroup>"
	+ "<col>"
	+ "<col>"
	+ "<col>"
	+ "</colgroup>"
	+ "<tbody>"
	+ "<tr>"
	+ "<td><label>Carrier Code</label><span><input id='carrierCode' name='carrierCode' type='text' class='w30' value='' placeholder='7C'></span></td>"
	+ "<td><label>Action Code</label>"
	+ "<span><input id='actionCode' name='actionCode' type='text' class='w30' value='' placeholder='HK'></span"
	+ "</td>"
//	+ "<td><label>Quantity</label><span><input id='quantity' name='quantity' class='w30' value='1'></span></td>"
	+ "<td class='w400'><label>Text</label><span id='bundleText'></span></td>"
	+ "</tr>"
//	+ "<tr>"
//	+ "<td colspan='3' class='align-left'><label>Text</label><span id='bundleText'></span></td>"
//	+ "</tr>"
	+ "</tbody>"
	+ "</table>"
	+ "</div>"
	+ "<div class='board-foot'>"
	+ "<div class='buttons'>"
	+ "<button id='bundleSubmit'>Submit</button>"
	+ "<button id='bundleClear'>Clear</button>"
	+ "</div>"
	+ "</div>"
	+ "</div>";
	
    $("#newBundle").html(newBundleList);
    
    $("#newBundle").show();
}

function setNewBundle(selected){
	var segList = $(".add_service").find(".con-l").find("input[type='radio']:checked");
	var segArr = new Array();
	
	if(segList){
		segList.each(function(index, val){
			if ($(this).prop("checked")) {
				segArr.push($(this).data("seg"));
			}
		});
	}
	
	var carrierCode = $("#carrierCode").val();	
	if(!carrierCode){
		carrierCode = "7C";
	}
	
	var actionCode = $("#actionCode").val();
	if(!actionCode){
		actionCode = "HK";
	}
	
//	var quantity = $("#quantity").val();
//	if(!quantity || isNaN(quantity) || quantity < 0){
//		quantity = "0";
//	}
	
	var text = $("#bundleText").text();
	
	var newBundle = {
		"code" : selected,
		"bundleDesc" : $("#bundleCodeList option:selected").data("comment"),
		"bundlecode" : $("#bundleCodeList option:selected").data("bundlecode"),
		"paxArr" : getNamesObject(responseData.Result.data),
		"segArr" : segArr,
		"carrierCode" : carrierCode,
		"actionCode" : actionCode,
//		"quantity" : quantity,
		"text" : text
	};
	
	return newBundle;
}

function appendNewbundle(selected, newBundle, newRPH, tempRPH){
	var bundleObject;
	var bundleList = "";

	bundleList += "<tr>";
	bundleList += "<td class='rph'>" + newBundle.bundlecode + "</td>"
	  + "<td>" + newBundle.bundleDesc + "</td>";
	
	var arrayPaxRPH = new Array();
	if(newBundle.paxArr && newBundle.paxArr.length > 0){
		newBundle.paxArr.forEach(function(value, index, array){
			arrayPaxRPH.push(value.RPH);
		});
	}
	
	bundleList += "<td>";
	if(newBundle.paxArr && newBundle.paxArr.length > 0){
		newBundle.paxArr.forEach(function(value, index, array){
			bundleList += "&nbsp;" + value.RPH + ". " + value.lastName + "/" + value.firstName;
		});
	}
	bundleList += "</td>";
	//end of pax
	
	//start of seg
	var arraySegRPH = new Array();
	if(newBundle.segArr && Array.isArray(newBundle.segArr) && newBundle.segArr.length > 0){
		newBundle.segArr.forEach(function(segVal, segIdx, segArr){
			arraySegRPH.push(segVal.RPH);
		});
	}
	
	bundleList += "<td>";
	if(newBundle.segArr && Array.isArray(newBundle.segArr) && newBundle.segArr.length > 0){
		newBundle.segArr.forEach(function(segVal, segIdx, segArr){
			bundleList += "&nbsp;" + segVal.RPH + " " + segVal.depStn + " " + segVal.arrStn;
		});
	}
	bundleList += "</td>";
	
	bundleList += "<td>";
	if(newBundle.segArr && Array.isArray(newBundle.segArr) && newBundle.segArr.length > 0){
		newBundle.segArr.forEach(function(segVal, segIdx, segArr){
			bundleList += "&nbsp;" + nullCheck(segVal.flightNo);
		});
	}	
	bundleList += "</td>";
	
	bundleList += "<td>";
	if(newBundle.segArr && Array.isArray(newBundle.segArr) && newBundle.segArr.length > 0){
		newBundle.segArr.forEach(function(segVal, segIdx, segArr){
			bundleList += parseDDMMMYY(nullCheck(segVal.depDate));
		});
	}
	bundleList += "</td>";
	
	bundleList += "<td>";
	if(newBundle.segArr && Array.isArray(newBundle.segArr) && newBundle.segArr.length > 0){
		newBundle.segArr.forEach(function(segVal, segIdx, segArr){
			bundleList += segVal.airline;
		});
	}
	bundleList += "</td>";
	
	bundleList += "<td>";
	if(newBundle.segArr && Array.isArray(newBundle.segArr) && newBundle.segArr.length > 0){
		newBundle.segArr.forEach(function(segVal, segIdx, segArr){
			bundleList += segVal.bookingStatus;
		});
	}
	bundleList += "</td>";
	
	bundleList += "<td>" + newBundle.text + "</td>";

	bundleObject = {
		"RPH":"1",
		"refSegRPH": arraySegRPH,
		"refPaxRPH": arrayPaxRPH,
		"ssrCode": newBundle.code,
		"bundlecode": newBundle.bundlecode,
		"codeDesc": newBundle.bundleDesc,
		"quantity": newBundle.quantity,
		"status": newBundle.actionCode,
		"airline": newBundle.carrierCode,
		"text": newBundle.text
	};
	
	bundleList += "<td class='bo-left'><input name='btnRemove' class='delete_btn2' type='button' data-rph='" + tempRPH + "' data-bundleObject='" + JSON.stringify(bundleObject) + "' value=''></td>";
		
	bundleList += "</tr>";
	
	var handleList = "<input class='rph' name='bundleRPH' type='hidden' data-handle='add' data-rph='" + tempRPH + "' data-bundleObject='" + JSON.stringify(bundleObject) + "' >";
	$("#handleData").append(handleList);
	
	$("#bundleList").append(bundleList);
}