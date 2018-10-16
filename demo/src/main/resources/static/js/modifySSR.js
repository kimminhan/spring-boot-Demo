function setDatePickerForINFT(){
	$.datepicker.setDefaults({
		showOn: "button",
		buttonImage: "../images/btn_diary.gif",
		buttonImageOnly: true,
		dateFormat : "ddMy",
		monthNamesShort: ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"]	
	});

	$("#dateOfBirth").datepicker();
}

function setDatePicker(){
	$.datepicker.setDefaults({
		showOn: "button",
		buttonImage: "../images/btn_diary.gif",
		buttonImageOnly: true,
		dateFormat : "ddMy",
		monthNamesShort: ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"]	
	});
	
	var currentDate = new Date();
	$("#dateOfBirth").datepicker();
	$("#dateOfBirth").val(parseDDMMMYY(currentDate));
	
	if($("#expDate")){
		$("#expDate").datepicker();
		$("#expDate").val(parseDDMMMYY(currentDate));
	}
}

function renderNewDefaultSSR(){
	var airTraveler = getNamesObject(responseData.Result.data);
	var airItinerary = getAirItineraryObject(responseData.Result.data);
	
	var selected = $("#ssrCodeList option:selected").val();
	
	var newSSRList = "";
	newSSRList += "<div class='add_content01'>"          
	+ "<div class='con-l'>"
	+ "<table>"
	+ "<tbody>";
	
	if(airTraveler){		
		if(selected != "FQTV"){
			newSSRList += "<tr>"
			+ "<td><input class='chk_required' type='checkbox' id='checkAllPax' name='checkAllPax'>"
			+ "<label for='checkAllPax'>&nbsp;All Passengers</label>"
			+ "</td>";
		}
			
	
		airTraveler.forEach(function(value, index, array){
			newSSRList += "</tr>"
				+ "<tr>";
			if(selected != "FQTV"){
				newSSRList += "<td><input class='chk_required' type='checkbox' id='pax" + value.RPH +"' name='pax' data-paxRPH='" + value.RPH + "' data-pax='" + JSON.stringify(value) + "'>";
			}else{
				newSSRList += "<td><input class='chk_required' type='radio' id='pax" + value.RPH +"' name='pax' data-paxRPH='" + value.RPH + "' data-pax='" + JSON.stringify(value) + "'>";
			}
			newSSRList += "<label for='pax" + value.RPH +"'>&nbsp;" + value.lastName + "/" + value.firstName + "</label>"
				+ "</td>"
				+ "</tr>";
		});
	}
	
	newSSRList += "</tbody>"
	+ "</table>"
	+ "</div>"

	+ "<div class='con-r'>"
	+ "<table>"
	+ "<tbody>";
	
	if(airItinerary){
		newSSRList += "<tr>"
			+ "<td><input class='chk_required'  type='checkbox' id='checkAllSeg' name='checkAllSeg'>"
			+ "<label for='checkAllSeg'>&nbsp;All Segments</label>"
			+ "</td>"
			+ "</tr>";
		
		airItinerary.forEach(function(value, index, array){
			newSSRList += "<tr>"
				+ "<td><input class='chk_required' type='checkbox' id='seg" + value.RPH +"' name='seg' data-segRPH='" + value.RPH + "' data-seg='" + JSON.stringify(value) + "'>"
				+ "<label for='seg" + value.RPH +"'>&nbsp;"+ value.airline + value.flightNo + "&nbsp;" + value.bookingClass + "&nbsp;" + value.depDate.dateFormat('DDMMMYY') + "&nbsp;" + value.depStn + "&nbsp;" + value.arrStn + "</label>"
				+ "</td>"
				+ "</tr>"
		});
	}
	
	newSSRList += "</tbody>"
	+ "</table>"
	+ "</div>"

	+ "<div class='con-view2'>"
	+ "<table>"
	+ "<colgroup>"
	+ "<col>"
	+ "<col>"
	+ "<col>"
	+ "</colgroup>"
	+ "<tbody>"
	+ "<tr>"
	+ "<td><label>Carrier Code</label><span><input id='carrierCode' name='carrierCode' class='w30 required' value='' placeholder='7C'></span></td>"
	+ "<td><label>Action Code</label>"
	+ "<select id='actionCode' name='actionCode' class='w100 required'>"
	+ "<option value='HK'>&nbsp;HK</option>"
	+ "<option value='NN'>&nbsp;NN</option>"
	+ "</select>"
	+ "</td>"
	+ "<td><label>Quantity</label><span>"
	+ "<input id='quantity' name='quantity' class='w30 required' value='' placeholder='0'>"
	+ "</span></td>"
	+ "</tr>"
	+ "<tr>"
	+ "<td colspan='3'><label>Text</label><span>";
	
	var selected = $("#ssrCodeList option:selected").val();
	var required = "";

	if(selected != "FQTV"){
		required = "required";
	}
	
	newSSRList += "<input id='text' name='text' class='text " + required + "' type='text' value=''>";
	
	newSSRList += "</span></td>"
	+ "</tr>"
	+ "</tbody>"
	+ "</table>"
	+ "</div>"

	+ "</div>";
    $("#newSSRList").html(newSSRList);
}

function renderModifyCHLDSSR(){
	var airTraveler = getNamesObject(responseData.Result.data);
	
	var newSSRList = "";
	newSSRList += "<div class='add_content06'>"
	+ "<div class='con-l'>"
	+ "<table>"
	+ "<tbody>";
	
	
	if(airTraveler){
		airTraveler.forEach(function(value, index, array){
			newSSRList += "</tr>"
				+ "<td><input class='chk_required' type='radio' id='pax" + value.RPH +"' name='pax' data-paxRPH='" + value.RPH + "' data-pax='" + JSON.stringify(value) + "'>"
				+ "<label for='pax" + value.RPH +"'>&nbsp;" + value.lastName + "/" + value.firstName + "</label>"
				+ "</td>"
				+ "</tr>";
		});
	}
	
	newSSRList += "</tbody>"
	+ "</table>"
	+ "</div>"
	+ "<div class='con-view2'>"
	+ "<table>"
	+ "<colgroup>"
	+ "<col>"
	+ "<col>"
	+ "<col>"
	+ "</colgroup>"
	+ "<tbody>"
	+ "<tr>"
	+ "<td><label>Carrier Code</label><span><input id='carrierCode' name='carrierCode' class='w30 required' value='7C' type='text'></span></td>"
	+ "<td><label>Action Code</label>"
	+ "<select id='actionCode' name='actionCode' class='w100 required'>"
	+ "<option value='HK'>&nbsp;HK</option>"
	+ "<option value='NN'>&nbsp;NN</option>"
	+ "</select>"
	+ "</td>"
	+ "<td><label>Quantity</label><span>1<input id='quantity' name='quantity' type='hidden' class='w30' value='1'></span></td>"
	+ "</tr>"
	+ "<tr>"
	+ "<td colspan='3'><label>Date of Birth</label><span><input id='dateOfBirth' name='dateOfBirth' type='text' class='w70p sData hasDatepicker' value=''></span></td>"
	+ "</tr>"
	+ "</tbody>"
	+ "</table>"
	+ "</div>"
	+ "</div>";
	$("#newSSRList").html(newSSRList);
	
	if ($("#dateOfBirth").length) {
		setDatePicker();
	}
}

function renderModifyINFTSSR(){
	var airTraveler = getNamesObject(responseData.Result.data);
	var airItinerary = getAirItineraryObject(responseData.Result.data);
	
	var newSSRList = "";
	newSSRList += "<div class='add_content07'>"          
	+ "<div class='con-l'>"
	+ "<table>"
	+ "<tbody>";
	
	if(airTraveler){
		airTraveler.forEach(function(value, index, array){
			newSSRList += "<tr>"
			+ "<td><input class='chk_required' type='radio' id='pax" + value.RPH +"' name='pax' data-paxRPH='" + value.RPH + "' data-pax='" + JSON.stringify(value) + "'>"
			+ "<label for='pax" + value.RPH +"'>&nbsp;" + value.lastName + "/" + value.firstName + "</label>"
			+ "</td>"
			+ "</tr>";
		});
	}
	
	newSSRList += "</tbody>"
	+ "</table>"
	+ "</div>"
	+ "<div class='con-r'>"
	+ "<table>"
	+ "<tbody>";
	
	if(airItinerary){
		newSSRList += "<tr>"
			+ "<td><input class='chk_required' type='checkbox' id='checkAllSeg' name='checkAllSeg'>"
			+ "<label for='checkAllSeg'>&nbsp;All Segments</label>"
			+ "</td>"
			+ "</tr>";
		
		airItinerary.forEach(function(value, index, array){
			newSSRList += "<tr>"
				+ "<td><input type='checkbox' id='seg" + value.RPH +"' name='seg' data-segRPH='" + value.RPH + "' data-seg='" + JSON.stringify(value) + "'>"
				+ "<label for='seg" + value.RPH +"'>&nbsp;"+ value.airline + value.flightNo + "&nbsp;" + value.bookingClass + "&nbsp;" + value.depDate.dateFormat('DDMMMYY') + "&nbsp;" + value.depStn + "&nbsp;" + value.arrStn + "</label>"
				+ "</td>"
				+ "</tr>";
		});
	}
	
	newSSRList += "</tbody>"
	+ "</table>"
	+ "</div>"
	+ "<div class='con-view2'>"
	+ "<table>"
	+ "<colgroup>"
	+ "<col>"
	+ "<col>"
	+ "<col>"
	+ "</colgroup>"
	+ "<tbody>";
	
	newSSRList += "<tr>"
	+ "<td><label>Carrier Code</label><span><input id='carrierCode' name='carrierCode' type='text' class='w30 required' value='7C'></span></td>"
	+ "<td><label>Action Code</label>"
	+ "<select id='actionCode' name='actionCode' class='w100 required'>"
	+ "<option value='HK'>&nbsp;HK</option>"
	+ "<option value='NN'>&nbsp;NN</option>"
	+ "</select>"
	+ "</td>"
	+ "<td><label>Quantity</label><span><strong>1</strong><input id='quantity' name='quantity' type='hidden' value='1'></span></td>"
	+ "</tr>";
	
	newSSRList += "<tr>"
	+ "<td><label>Infant Name</label><span><input id='infantName' name='infantName' type='text' class='w180' value=''></span></td>"
	+ "<td><label>Title</label>"
    + "<select id='title' name='title' class='w140'>"
    + "<option value=''>Select</option>"
    + "<option value='MISS'>MISS</option>"
    + "<option value='MSTR'>MSTR</option>"
    + "</select>"
    + "</td>"
	+ "<td><label>Date of Birth</label>"
	+ "<span><input id='dateOfBirth' name='dateOfBirth' type='text' class='w70p sData required' value='' placeholder='DDMMMYY'>"
	+ "</span></td>"
	+ "</tr>";
	
	newSSRList += "</tbody>"
	+ "</table>"
	+ "</div>"     
	+ "</div>"; 
	$("#newSSRList").html(newSSRList);
	
	if ($("#dateOfBirth").length) {
		setDatePickerForINFT();
	}
}

function renderModifyFOIDSSR(){
	var airTraveler = getNamesObject(responseData.Result.data);
	var airItinerary = getAirItineraryObject(responseData.Result.data);
	
	var newSSRList = "";
	newSSRList += "<div class='add_content08'>"
	+ "<div class='con-l'>"
	+ "<table>"
	+ "<tbody>";
	
	if(airTraveler){
		newSSRList += "<tr>"
			+ "<td><input class='chk_required' type='checkbox' id='checkAllSeg' name='checkAllSeg'>"
			+ "<label for='checkAllSeg'>&nbsp;All Segments</label>"
			+ "</td>"
			+ "</tr>";
		
		airTraveler.forEach(function(value, index, array){
			newSSRList += "</tr>"
				+ "<tr>"
				+ "<td><input class='chk_required' type='checkbox' id='pax" + value.RPH +"' name='pax' data-paxRPH='" + value.RPH + "' data-pax='" + JSON.stringify(value) + "'>"
				+ "<label for='pax" + value.RPH +"'>&nbsp;" + value.lastName + "/" + value.firstName + "</label>"
				+ "</td>"
				+ "</tr>";
		});
	}
	
	newSSRList += "</tbody>"
	+ "</table>"
	+ "</div>"
	+ "<div class='con-view2'>"
	+ "<table>"
	+ "<colgroup>"
	+ "<col>"
	+ "<col>"
	+ "<col>"
	+ "</colgroup>"
	+ "<tbody>"
	+ "<tr>"
	+ "<td><label>Carrier Code</label><span><input id='carrierCode' name='carrierCode' type='text' class='w30 required' value='' placeholder='7C'></span></td>"
	+ "<td><label>Action Code</label> <span><strong>HK<input type='hidden' id='actionCode' name='actionCode' value='HK'></strong></span>"
	+ "</td>"
	+ "<td><label>Quantity</label><span><input id='quantity' name='quantity' class='w30' value='' placeholder='0'></span></td>"
	+ "</tr>"
	+ "<tr>"
	+ "<td colspan='2'><label>FOID Type</label>"
	+ "<select id='foidTypeList' name='foidTypeList' class='w200 required'>"
	+ "<option value=''>&nbsp;Select</option>"
	+ "<option value='CN'>&nbsp;- Confirmation Number (CN)</option>"
	+ "<option value='CC'>&nbsp;- Credit Card (CC) </option>"
	+ "<option value='TN'>&nbsp;- Document Number (TN)</option>"
	+ "<option value='DL'>&nbsp;- Drivers License (DL)</option>"
	+ "<option value='FF'>&nbsp;- Frequent Flyer (FF)</option>"
	+ "<option value='ID'>&nbsp;- Locally Defined Identification (ID)</option>"
	+ "<option value='NI'>&nbsp;- National Identity (NI)</option>"
	+ "<option value='PP'>&nbsp;- Passport (PP)</option>"
	+ "</select>"
	+ "</td></td>"
	+ "<td><label>Text</label><span><input id='foidType' name='foidType' type='text' class='w30 required' value=''></span><span><input type='text' id='text' name='text' value='' class='w150 required'></span></td>"
	+ "</tr>"
	+ "</tbody>"
	+ "</table>"
	+ "</div>"      
	+ "</div>";
	
	$("#newSSRList").html(newSSRList);
}

function renderModifyDOCASSR(){
	var airTraveler = getNamesObject(responseData.Result.data);
	var airItinerary = getAirItineraryObject(responseData.Result.data);
	
	var newSSRList = "";
	newSSRList += "<div class='add_content09 '>"
		+ "<div class='con-l'>"
		+ "<table>"
		+ "<tbody>";
		
	if(airTraveler){
		newSSRList += "<tr>"
			+ "<td><input type='checkbox' id='checkAllPax' name='checkAllPax'>"
			+ "<label for='checkAllPax'>&nbsp;All Passengers</label>"
			+ "</td>";
	
		airTraveler.forEach(function(value, index, array){
			newSSRList += "</tr>"
				+ "<tr>"
				+ "<td><input type='checkbox' id='pax" + value.RPH +"' name='pax' data-paxRPH='" + value.RPH + "' data-pax='" + JSON.stringify(value) + "'>"
				+ "<label for='pax" + value.RPH +"'>&nbsp;" + value.lastName + "/" + value.firstName + "</label>"
				+ "</td>"
				+ "</tr>";
		});
	}
		
	newSSRList += "</tbody>"
	+ "</table>"
	+ "</div>"
	
	+ "<div class='con-r'>"
	+ "<table>"
	+ "<tbody>";
	
	if(airItinerary){
		newSSRList += "<tr>"
			+ "<td><input type='checkbox' id='checkAllSeg' name='checkAllSeg'>"
			+ "<label for='checkAllSeg'>&nbsp;All Segments</label>"
			+ "</td>"
			+ "</tr>";
		
		airItinerary.forEach(function(value, index, array){
			newSSRList += "<tr>"
				+ "<td><input type='checkbox' id='seg" + value.RPH +"' name='seg' data-segRPH='" + value.RPH + "' data-seg='" + JSON.stringify(value) + "'>"
				+ "<label for='seg" + value.RPH +"'>&nbsp;"+ value.airline + value.flightNo + "&nbsp;" + value.bookingClass + "&nbsp;" + value.depDate.dateFormat('DDMMMYY') + "&nbsp;" + value.depStn + "&nbsp;" + value.arrStn + "</label>"
				+ "</td>"
				+ "</tr>"
		});
	}
	
	newSSRList += "</tbody>"
	+ "</table>"
	+ "</div>"
	+ "<div class='con-view2 add_content09_op'>"
	+ "<table>"
	+ "<colgroup>"
	+ "<col>"
	+ "<col>"
	+ "<col>"
	+ "</colgroup>"
	+ "<tbody>"
	+ "<tr>"
	+ "<td><label class='labelst1'>Carrier Code</label><span><input id='carrierCode' name='carrierCode' type='text' class='w30 required' value='7C'></span></td>"
	+ "<td><label>Action Code</label> <span><strong>HK<input type='hidden' id='actionCode' name='actionCode' value='HK'></strong></span></td>"
	+ "<td><label>Quantity</label><span><input id='quantity' name='quantity' class='w30 required' value='' placeholder='0'></span></td>"
	+ "</tr>"
	+ "<tr>"
	+ "<td><label class='labelst1'>Address Type</label>"
	+ "<span><select id='addressType' name='addressType' class='w150 required'>"
	+ "<option value=''>&nbsp;Select</option>"
	+ "<option value='D'>&nbsp;- Destination (D)</option>"
	+ "<option value='R'>&nbsp;- Primary Residence (R)</option>"
	+ "</select></span>"
	+ "</td>"
	+ "<td><input id='infant' name='infant' type='checkbox' value=''>"
	+ "<label for='infant'>&nbsp;Infant</label></td>"
	+ "<td><label>Country</label><span><input id='country' name='country' type='text' class='w150 required'></span></td>"
	+ "</tr>"
	+ "<tr>"
	+ "<td colspan='2'><label class='labelst1'>Address Details</label><span><input id='addressDetails' name='addressDetails' type='text' class='w150'></span></td>"
	+ "<td><label>City</label><span><input id='city' name='city' type='text' class='w150 required'></span></td>"
	+ "</tr>"
	+ "<tr>"
	+ "<td><label  class='labelst1'>Country of State</label><span><input id='countryOfState' name='countryOfState' type='text' class='w150'></span></td>"
	+ "<td colspan='2'><label class='labelst2'>Zip Code/Postal Code</label><span><input id='zipCode' name='zipCode' type='text' class='w50'></span></td>"
	+ "</tr>"
	+ "</tbody>"
	+ "</table>"
	+ "</div>"
	+ "</div>";
	
	$("#newSSRList").html(newSSRList);
}

function renderModifyDOCSSSR(){
	var airTraveler = getNamesObject(responseData.Result.data);
	var airItinerary = getAirItineraryObject(responseData.Result.data);
	
	var newSSRList = "";
	newSSRList += "<div class='add_content10 '>"
		+ "<div class='con-l'>"
		+ "<table>"
		+ "<tbody>";
		
	if(airTraveler){
		/*
		 * 사용 안함
		newSSRList += "<tr>"
			+ "<td><input class='chk_required' type='checkbox' id='checkAllPax' name='checkAllPax'>"
			+ "<label for='checkAllPax'>&nbsp;All Passengers</label>"
			+ "</td>";
		 */
		
		airTraveler.forEach(function(value, index, array){
			newSSRList += "</tr>"
				+ "<tr>"
				+ "<td><input class='chk_required' type='radio' id='pax" + value.RPH +"' name='pax' data-paxRPH='" + value.RPH + "' data-pax='" + JSON.stringify(value) + "'>"
				+ "<label for='pax" + value.RPH +"'>&nbsp;" + value.lastName + "/" + value.firstName + "</label>"
				+ "</td>"
				+ "</tr>";
		});
	}
		
	newSSRList += "</tbody>"
	+ "</table>"
	+ "</div>"

	+ "<div class='con-r'>"
	+ "<table>"
	+ "<tbody>";
	/*
	 * 사용 안함
	if(airItinerary){
		newSSRList += "<tr>"
			+ "<td><input type='checkbox' id='checkAllSeg' name='checkAllSeg'>"
			+ "<label for='checkAllSeg'>&nbsp;All Segments</label>"
			+ "</td>"
			+ "</tr>";
		
		airItinerary.forEach(function(value, index, array){
			newSSRList += "<tr>"
				+ "<td><input class='chk_required' type='checkbox' id='seg" + value.RPH +"' name='seg' data-segRPH='" + value.RPH + "' data-seg='" + JSON.stringify(value) + "'>"
				+ "<label for='seg" + value.RPH +"'>&nbsp;"+ value.airline + value.flightNo + "&nbsp;" + value.bookingClass + "&nbsp;" + value.depStn + "&nbsp;" + value.arrStn + "</label>"
				+ "</td>"
				+ "</tr>"
		});
	}
	*/
	newSSRList += "</tbody>"
	+ "</table>"
	+ "</div>"
	
	+ "<div class='con-view2 add_content10_op'>"
	+ "<table>"
	+ "<colgroup>"
	+ "<col>"
	+ "<col>"
	+ "<col>"
	+ "</colgroup>"
	+ "<tbody>"
	+ "<tr>"
	+ "<td><label class='labelst1'>Carrier Code</label><span><input id='carrierCode' name='carrierCode' type='text' class='w30 required' value='7C'></span></td>"
	+ "<td><label>Action Code</label> <span><strong>HK<input type='hidden' id='actionCode' name='actionCode' value='HK'></strong></span></td>"
	+ "<td><label>Quantity</label><span><input id='quantity' name='quantity' class='w30 required' value='' placeholder='0'></span></td>"
	+ "</tr>"
	+ "<tr>"
	+ "<td colspan='3'><label class='labelst1'>Document Type</label>"
	+ "<select id='documentType' name='documentType' class='w250'>"
	+ "<option value=''>&nbsp;Select</option>"
	+ "<option value='F'>&nbsp;- Approved Non-standard Identity (F)</option>"
	+ "<option value='AC'>&nbsp;- Crew Member (AC)</option>"
	+ "<option value='A'>&nbsp;- Identity Card (A)</option>"
	+ "<option value='I'>&nbsp;- Identity Card (I)</option>"
	+ "<option value='C'>&nbsp;- Identity Card (C)</option>"
	+ "<option value='M'>&nbsp;- Military ID (M)</option>"
	+ "<option value='ID'>&nbsp;- Passport Card (ID)</option>"
	+ "<option value='P'>&nbsp;- Passport (P)</option>"
	+ "</select>"
	+ "<span class='etctd'><label>Issue Country or State</label><input id='issueCountry' name='issueCountry' value='' type='text'></span>"
	+ "</td>"
	+ "</tr>"
	+ "<tr>"
	+ "<td colspan='2'><label class='labelst1'>Doc Number</label><span><input type='text' id='docNumber' name='docNumber' value='' class='w150'></span></td>"
	+ "<td><label>Nationality</label><span><input type='text' id='nationality' name='nationality' value='' class='w150'></span></td>"
	+ "</tr>"
	+ "</tbody>"
	+ "</table>"
	+ "<table>"
	+ "<colgroup>"
	+ "<col>"
	+ "<col>"
	+ "<col>"
	+ "</colgroup>"
	+ "<tbody>"
	+ "<tr>"
	+ "<td><label class='labelst3'>Date of Birth</label><span><input id='dateOfBirth' name='dateOfBirth' type='text' class='w70p sData required' value=''></span></td>"
	+ "<td><label>Gender</label>"
	+ "<select id='gender' name='gender' class='w140 required'>"
	+ "<option value=''>&nbsp;Select</option>"
	+ "<option value='F'>&nbsp;- Female (F)</option>"
	+ "<option value='FI'>&nbsp;- Female Infant (FI)</option>"
	+ "<option value='M'>&nbsp;- Male (M)</option>"
	+ "<option value='MI'>&nbsp;- Male Infant (MI)</option>"
	+ "<option value='U'>&nbsp;- Undisclosed (U)</option>"
	+ "</select>"
	+ "</td>"
	+ "<td><label class='labelst3'>Exp.Date</label><span><input id='expDate' name='expDate' type='text' class='w70p sData hasDatepicker' value=''></span></td>"
	+ "</tr>"
	+ "<tr>"
	+ "<td><label class='labelst3'>Last Name</label><span><input class='w100 required' id='lastName' name='lastName' value='' type='text'></span></td>"
	+ "<td><label>First Name</label><span><input class='w100 required' id='firstName' name='firstName' value='' type='text'></span></td>"
	+ "<td><label class='labelst3'>Middle Name</label><span><input class='w100' id='middleName' name='middleName' value=''  type='text'></span></td>"
	+ "</tr>"
	/*
	 * 사용 안함
	+ "<tr>"
	+ "<td colspan='3'>"
	+ "<span class='chk_passport'>"
	+ "<input type='checkbox' id='select10-9' name='select10-9'>"
	+ "<label for='select10-9'>&nbsp;Primary Passport Holder for Multi Passenger Passport</label>"
	+ "</span>"
	+ "</td>"
	+ "</tr>"
	*/
	+ "</tbody>"
	+ "</table>"
	+ "</div>"
	+ "</div>";
	
	$("#newSSRList").html(newSSRList);
	
	if ($("#dateOfBirth").length) {
		setDatePicker();
	}
}

function renderModifyOTHSSSR(){
	var airTraveler = getNamesObject(responseData.Result.data);
	var airItinerary = getAirItineraryObject(responseData.Result.data);
	
	var newSSRList = "";
	newSSRList += "<div class='add_content05 '>"
		+ "<div class='con-l'>"
		+ "<table>"
		+ "<tbody>";
		
	if(airTraveler){
		newSSRList += "<tr>"
			+ "<td><input class='chk_required' type='checkbox' id='checkAllPax' name='checkAllPax'>"
			+ "<label for='checkAllPax'>&nbsp;All Passengers</label>"
			+ "</td>";
	
		airTraveler.forEach(function(value, index, array){
			newSSRList += "</tr>"
				+ "<tr>"
				+ "<td><input class='chk_required' type='checkbox' id='pax" + value.RPH +"' name='pax' data-paxRPH='" + value.RPH + "' data-pax='" + JSON.stringify(value) + "'>"
				+ "<label for='pax" + value.RPH +"'>&nbsp;" + value.lastName + "/" + value.firstName + "</label>"
				+ "</td>"
				+ "</tr>";
		});
	}
		
	newSSRList += "</tbody>"
	+ "</table>"
	+ "</div>"

	+ "<div class='con-r'>"
	+ "<table>"
	+ "<tbody>";
	
	if(airItinerary){
		newSSRList += "<tr>"
			+ "<td><input class='chk_required' type='checkbox' id='checkAllSeg' name='checkAllSeg'>"
			+ "<label for='checkAllSeg'>&nbsp;All Segments</label>"
			+ "</td>"
			+ "</tr>";
		
		airItinerary.forEach(function(value, index, array){
			newSSRList += "<tr>"
				+ "<td><input class='chk_required' type='checkbox' id='seg" + value.RPH +"' name='seg' data-segRPH='" + value.RPH + "' data-seg='" + JSON.stringify(value) + "'>"
				+ "<label for='seg" + value.RPH +"'>&nbsp;"+ value.airline + value.flightNo + "&nbsp;" + value.bookingClass + "&nbsp;" + value.depDate.dateFormat('DDMMMYY') + "&nbsp;" + value.depStn + "&nbsp;" + value.arrStn + "</label>"
				+ "</td>"
				+ "</tr>"
		});
	}
	
	newSSRList += "</tbody>"
	+ "</table>"
	+ "</div>"
	
	+ "<div class='con-view2'>"
	+ "<table>"
	+ "<colgroup>"
	+ "<col>"
	+ "<col>"
	+ "<col>"
	+ "</colgroup>"
	+ "<tbody>"
	+ "<tr>"
	+ "<td><label>Carrier Code</label><span><input id='carrierCode' name='carrierCode' class='w30 required' value='7C' type='text'></span></td>"
	+ "<td><label>Action Code</label>"
	+ "<select id='actionCode' name='actionCode' class='w100 required'>"
	+ "<option value='NN'>&nbsp;NN</option>"
	+ "<option value='None'>&nbsp;None</option>"
	+ "</select>"
	+ "</td>"
	+ "<td><label>Quantity</label><span><input id='quantity' name='quantity' class='w30 required' value='' placeholder='0'></span></td>"
	+ "</tr>"
	+ "<tr>"
	+ "<td colspan='3'><label>Text</label><span><input id='text' name='text' class='text required' type='text'></span></td>"
	+ "</tr>"
	+ "</tbody>"
	+ "</table>"
	+ "</div>"
	+ "</div>";
	
	$("#newSSRList").html(newSSRList);
}

function renderModifyAVIHSSR(){
	var airTraveler = getNamesObject(responseData.Result.data);
	var airItinerary = getAirItineraryObject(responseData.Result.data);
	
	var newSSRList = "";
	newSSRList += "<div class='add_content03 '>"
		+ "<div class='con-l'>"
		+ "<table>"
		+ "<tbody>";
		
	if(airTraveler){
		newSSRList += "<tr>"
			+ "<td><input class='chk_required' type='checkbox' id='checkAllPax' name='checkAllPax'>"
			+ "<label for='checkAllPax'>&nbsp;All Passengers</label>"
			+ "</td>";
	
		airTraveler.forEach(function(value, index, array){
			newSSRList += "</tr>"
				+ "<tr>"
				+ "<td><input class='chk_required' type='checkbox' id='pax" + value.RPH +"' name='pax' data-paxRPH='" + value.RPH + "' data-pax='" + JSON.stringify(value) + "'>"
				+ "<label for='pax" + value.RPH +"'>&nbsp;" + value.lastName + "/" + value.firstName + "</label>"
				+ "</td>"
				+ "</tr>";
		});
	}
	
	newSSRList += "</tbody>"
	+ "</table>"
	+ "</div>"

	+ "<div class='con-r'>"
	+ "<table>"
	+ "<tbody>";
	
	if(airItinerary){
		newSSRList += "<tr>"
			+ "<td><input class='chk_required' type='checkbox' id='checkAllSeg' name='checkAllSeg'>"
			+ "<label for='checkAllSeg'>&nbsp;All Segments</label>"
			+ "</td>"
			+ "</tr>";
		
		airItinerary.forEach(function(value, index, array){
			newSSRList += "<tr>"
				+ "<td><input class='chk_required' type='checkbox' id='seg" + value.RPH +"' name='seg' data-segRPH='" + value.RPH + "' data-seg='" + JSON.stringify(value) + "'>"
				+ "<label for='seg" + value.RPH +"'>&nbsp;"+ value.airline + value.flightNo + "&nbsp;" + value.bookingClass+ "&nbsp;" + value.depDate.dateFormat('DDMMMYY') + "&nbsp;" + value.depStn + "&nbsp;" + value.arrStn + "</label>"
				+ "</td>"
				+ "</tr>"
		});
	}
	
	newSSRList += "</tbody>"
	+ "</table>"
	+ "</div>"
	
	+ "<div class='con-view2'>"
	+ "<table>"
	+ "<colgroup>"
	+ "<col>"
	+ "<col>"
	+ "<col>"
	+ "</colgroup>"
	+ "<tbody>"
	+ "<tr>"
	+ "<td><label>Carrier Code</label><span><input id='carrierCode' name='carrierCode' class='w30 required' value='' placeholder='7C'></span></td>"
	+ "<td><label>Action Code</label>"
	+ "<select id='actionCode' name='actionCode' class='w100 required'>"
	+ "<option value='HK'>&nbsp;HK</option>"
	+ "<option value='NN'>&nbsp;NN</option>"
	+ "</select>"
	+ "</td>"
	+ "<td><label>Quantity</label><span>"
	+ "<input id='quantity' name='quantity' class='w30 required' value='' placeholder='0'>"
	+ "</span></td>"
	+ "</tr>"
	+ "<tr>"
	+ "<td colspan='3'><label>Text</label><span>";
	
	var selected = $("#ssrCodeList option:selected").val();
	var required = "";

	if(selected == "AVIH" || selected == "PETC"){
		required = "required";
	}
	newSSRList += "<input id='text' name='text' class='text " + required + "' type='text' value=''>";	
	
	newSSRList += "</span></td>"
	+ "</tr>"
	+ "</tbody>"
	+ "</table>"
	+ "</div>"

	+ "</div>";
	$("#newSSRList").html(newSSRList);
}

function renderModifyMEDASSR(){
	var airTraveler = getNamesObject(responseData.Result.data);
	var airItinerary = getAirItineraryObject(responseData.Result.data);
	
	var newSSRList = "";
	newSSRList += "<div class='add_content04 '>"
		+ "<div class='con-l'>"
		+ "<table>"
		+ "<tbody>";
		
	if(airTraveler){
		newSSRList += "<tr>"
			+ "<td><input class='chk_required' type='checkbox' id='checkAllPax' name='checkAllPax'>"
			+ "<label for='checkAllPax'>&nbsp;All Passengers</label>"
			+ "</td>";
	
		airTraveler.forEach(function(value, index, array){
			newSSRList += "</tr>"
				+ "<tr>"
				+ "<td><input class='chk_required' type='checkbox' id='pax" + value.RPH +"' name='pax' data-paxRPH='" + value.RPH + "' data-pax='" + JSON.stringify(value) + "'>"
				+ "<label for='pax" + value.RPH +"'>&nbsp;" + value.lastName + "/" + value.firstName + "</label>"
				+ "</td>"
				+ "</tr>";
		});
	}
	
	newSSRList += "</tbody>"
	+ "</table>"
	+ "</div>";
		
	newSSRList += "<div class='con-view2'>"
	+ "<table>"
	+ "<colgroup>"
	+ "<col>"
	+ "<col>"
	+ "<col>"
	+ "</colgroup>"
	+ "<tbody>"
	+ "<tr>"
	+ "<td><label>Carrier Code</label><span><input id='carrierCode' name='carrierCode' class='w30 required' value='7C' type='text'></span></td>"
	+ "<td><label>Action Code</label>"
	+ "<select id='actionCode' name='actionCode' class='w100'>"
	+ "<option value='HK'>&nbsp;HK</option>"
	+ "<option value='NN'>&nbsp;NN</option>"
	+ "<option value='None'>&nbsp;None</option>"
	+ "</select>"
	+ "</td>"
	/*+ "<td><label>Quantity</label><span><input id='quantity' name='quantity' class='w30 required' value='' placeholder='0'></span></td>"*/
	+ "</tr>"
	+ "<tr>"
	+ "<td colspan='3'><label>Text</label><span><input id='text' name='text' class='text' type='text'></span></td>"
	+ "</tr>"
	+ "</tbody>"
	+ "</table>"
	+ "</div>"
	+ "</div>";
	
	$("#newSSRList").html(newSSRList);
}

function renderModifyWRIGHTSSR(){
	var airTraveler = getNamesObject(responseData.Result.data);
	var airItinerary = getAirItineraryObject(responseData.Result.data);
	
	var newSSRList = "";
	newSSRList += "<div class='add_content11 '>"
		+ "<div class='con-l'>"
		+ "<table>"
		+ "<tbody>";
		
	if(airTraveler){
		newSSRList += "<tr>"
			+ "<td><input type='checkbox' id='checkAllPax' name='checkAllPax'>"
			+ "<label for='checkAllPax'>&nbsp;All Passengers</label>"
			+ "</td>";
	
		airTraveler.forEach(function(value, index, array){
			newSSRList += "</tr>"
				+ "<tr>"
				+ "<td><input type='checkbox' id='pax" + value.RPH +"' name='pax' data-paxRPH='" + value.RPH + "' data-pax='" + JSON.stringify(value) + "'>"
				+ "<label for='pax" + value.RPH +"'>&nbsp;" + value.lastName + "/" + value.firstName + "</label>"
				+ "</td>"
				+ "</tr>";
		});
	}
	
	newSSRList += "</tbody>"
	+ "</table>"
	+ "</div>"

	+ "<div class='con-r'>"
	+ "<table>"
	+ "<tbody>";
	
	if(airItinerary){
		newSSRList += "<tr>"
			+ "<td><input class='chk_required' type='checkbox' id='checkAllSeg' name='checkAllSeg'>"
			+ "<label for='checkAllSeg'>&nbsp;All Segments</label>"
			+ "</td>"
			+ "</tr>";
		
		airItinerary.forEach(function(value, index, array){
			newSSRList += "<tr>"
				+ "<td><input type='checkbox' id='seg" + value.RPH +"' name='seg' data-segRPH='" + value.RPH + "' data-seg='" + JSON.stringify(value) + "'>"
				+ "<label for='seg" + value.RPH +"'>&nbsp;"+ value.airline + value.flightNo + "&nbsp;" + value.bookingClass+ "&nbsp;" + value.depDate.dateFormat('DDMMMYY') + "&nbsp;" + value.depStn + "&nbsp;" + value.arrStn + "</label>"
				+ "</td>"
				+ "</tr>"
		});
	}
	
	newSSRList += "</tbody>"
	+ "</table>"
	+ "</div>"
		
	+ "<div class='con-view2'> "
	+ "<table>"
	+ "<colgroup>"
	+ "<col>"
	+ "<col>"
	+ "<col>"
	+ "</colgroup>"
	+ "<tbody>"
	+ "<tr>"
	+ "<td><label>Carrier Code</label><span><input id='carrierCode' name='carrierCode' type='text' class='w30 required' value='' placeholder='7C'></span></td>"
	+ "<td><label>Action Code</label><input id='actionCode' name='actionCode' type='text' class='w50' value=''></span></td>"
	+ "<td><label>Quantity</label><span><input id='quantity' name='quantity' class='w30' value='' placeholder='0'></span></td>"
	+ "</tr>"
	+ "<tr>"
	+ "<td colspan='3'><label>Text</label><span><input id='text' name='text' class='text' type='text' value=''></span></td>"
	+ "</tr>"
	+ "</tbody>"
	+ "</table>"
	+ "</div>"
	+ "</div>";
	
	$("#newSSRList").html(newSSRList);
}


function setSSRInfo(responseData){
	var ssrInfo = getSSRObject(responseData);	
	var airTraveler = getNamesObject(responseData);
	var airItinerary = getAirItineraryObject(responseData);
	
	renderModifySSRInfoObject(ssrInfo, airTraveler, airItinerary);
	
	renderNewDefaultSSR(airTraveler, airItinerary);
	showDirect("NONE");
	
	var othsssr = getOTHSSSRObject(responseData);
	var othsssrListText = "";
	if(othsssr){
		othsssr.forEach(function(value, index, array){
			othsssrListText += nullCheck(value.text) + "<br>";
		});
		
		$("#othsssrList").html(othsssrListText);
	}else{
		$("#othsssrInfoTable").hide();
	}
}

/**
 * OSI의 refPaxRPH 를 참조 해서 PAX List를 가져옵니다. 
 * @param otherServiceInfo
 * @param airTraveler
 */
function renderModifySSRInfoObject(ssrInfo, airTraveler, airItinerary){
	if(ssrInfo && isArray(ssrInfo) && ssrInfo.length > 0){
		var ssrList = "";
		var text = "";
		
		ssrInfo.forEach(function(value, index, array){
			if(value.refSegRPH && Array.isArray(value.refSegRPH) && value.refSegRPH.length > 0){
				value.refSegRPH.forEach(function(seggment, idx, arr){
					if(value.refPaxRPH && Array.isArray(value.refPaxRPH) && value.refPaxRPH.length > 0){
						value.refPaxRPH.forEach(function(pax, idxPax, arrPax){							
							var SSRObj = {
								"RPH" : value.RPH,
								"refSegRPH" : seggment,
								"refPaxRPH" : pax,
								"ssrCode" : value.code,
								"codeDesc" : value.codeDesc,
								"quantity" : value.quantity,
								"status" : value.status,
								"airline" : value.airline,
								"text" : value.text
							};
							
							if(value.code == "CHLD"){
								SSRObj["dateOfBirth"] = value.text;
							}
							
							ssrList += "<tr>"
							  + "<td class='rph'>" + value.code + "</td>"
							  + "<td>" + value.codeDesc + "</td>"
							  + "<td>" + renderingTicketPaasengers(pax, airTraveler) + "</td>"
							  + "<td>" + renderingFromTo(seggment, airItinerary) + "</td>"
							  + "<td>" + renderingFlight(seggment, airItinerary) + "</td>"
							  + "<td>" + renderingFlightDate(seggment, airItinerary) + "</td>"
							  + "<td>" + value.airline + "</td>"
							  + "<td>" + value.status + "</td>"
							  + "<td>" + value.text + "</td>"
							  + "<td class='bo-left'><input name='btnRemove' class='delete_btn2' value='' type='button' data-rph='" + value.RPH + "' data-ssrobject='" + JSON.stringify(SSRObj) + "'></td>"
							  + "</tr>";
						});
					}else{						
						var SSRObj = {
							"RPH" : value.RPH,
							"refSegRPH" : seggment,
							"refPaxRPH" : "",
							"ssrCode" : value.code,
							"codeDesc" : value.codeDesc,
							"quantity" : value.quantity,
							"status" : value.status,
							"airline" : value.airline,
							"text" : value.text,
						};
						
						if(value.code == "CHLD"){
							SSRObj["dateOfBirth"] = value.text;
						}
						
						ssrList += "<tr>"
							  + "<td class='rph'>" + value.code + "</td>"
							  + "<td>" + value.codeDesc + "</td>"
							  + "<td>" + "" + "</td>"
							  + "<td>" + "" + "</td>"
							  + "<td>" + renderingFlight(seggment, airItinerary) + "</td>"
							  + "<td>" + renderingFlightDate(seggment, airItinerary) + "</td>"
							  + "<td>" + value.airline + "</td>"
							  + "<td>" + value.status + "</td>"
							  + "<td>" + value.text + "</td>"
							  + "<td class='bo-left'><input name='btnRemove' class='delete_btn2' value='' type='button' data-rph='" + value.RPH + "' data-ssrobject='" + JSON.stringify(SSRObj) + "'></td>"
							  + "</tr>";
					}
				});
			}else if(value.refPaxRPH && Array.isArray(value.refPaxRPH) && value.refPaxRPH.length > 0){
				value.refPaxRPH.forEach(function(pax, idxPax, arrPax){
					var SSRObj = {
							"RPH" : value.RPH,
							"refSegRPH" : "",
							"refPaxRPH" : pax,
							"ssrCode" : value.code,
							"codeDesc" : value.codeDesc,
							"quantity" : value.quantity,
							"status" : value.status,
							"airline" : value.airline,
							"text" : value.text,
						};
					
					if(value.code == "CHLD"){
						SSRObj["dateOfBirth"] = value.text;
					}
					
					ssrList += "<tr>"
						  + "<td class='rph'>" + value.code + "</td>"
						  + "<td>" + value.codeDesc + "</td>"
						  + "<td>" + renderingTicketPaasengers(pax, airTraveler) + "</td>"
						  + "<td>" + "" + "</td>"
						  + "<td>" + "" + "</td>"
						  + "<td>" + "" + "</td>"
						  + "<td>" + value.airline + "</td>"
						  + "<td>" + value.status + "</td>"
						  + "<td>" + value.text + "</td>"
						  + "<td class='bo-left'><input name='btnRemove' class='delete_btn2' value='' type='button' data-rph='" + value.RPH + "' data-ssrobject='" + JSON.stringify(SSRObj) + "'></td>"
						  + "</tr>";
				});
			}else{
				var SSRObj = {
						"RPH" : value.RPH,
						"refSegRPH" : "",
						"refPaxRPH" : "",
						"ssrCode" : value.code,
						"codeDesc" : value.codeDesc,
						"quantity" : value.quantity,
						"status" : value.status,
						"airline" : value.airline,
						"text" : value.text,
					};
				
				if(value.code == "CHLD"){
					SSRObj["dateOfBirth"] = value.text;
				}
				
				ssrList += "<tr>"
					  + "<td class='rph'>" + value.code + "</td>"
					  + "<td>" + value.codeDesc + "</td>"
					  + "<td>" + "" + "</td>"
					  + "<td>" + "" + "</td>"
					  + "<td>" + "" + "</td>"
					  + "<td>" + "" + "</td>"
					  + "<td>" + value.airline + "</td>"
					  + "<td>" + value.status + "</td>"
					  + "<td>" + value.text + "</td>"
					  + "<td class='bo-left'><input name='btnRemove' class='delete_btn2' value='' type='button' data-rph='" + value.RPH + "' data-ssrobject='" + JSON.stringify(SSRObj) + "'></td>"
					  + "</tr>";
			}
		});
		
		$("#ssrList").html(ssrList);
	}
}

function resetRenderSwitchType(selected){
	switch(selected){
	case "BLND" :
		renderNewDefaultSSR();
		break;
	case "DEAF" :
		renderNewDefaultSSR();
		break;
	case "WCHC" :
		renderNewDefaultSSR();
		break;
	case "WCHR" :
		renderNewDefaultSSR();
		break;
	case "WCHS" :
		renderNewDefaultSSR();
		break;
	case "WCMP" :
		renderNewDefaultSSR();
		break;
	case "CHLD" :
		renderModifyCHLDSSR();
		break;
	case "EXST" :
		renderNewDefaultSSR();
		break;
	case "INFT" :
		renderModifyINFTSSR();
		break;
	case "UMNR" :
		renderNewDefaultSSR();
		break;
	case "FOID" :
		renderModifyFOIDSSR();
		break;
	case "DOCA" :
		renderModifyDOCASSR();
		break;
	case "DOCS" :
		renderModifyDOCSSSR();
		break;
	case "FQTV" :
		renderNewDefaultSSR();
		break;
	case "COUR" :
		renderNewDefaultSSR();
		break;
	case "OTHS" :
		renderModifyOTHSSSR();
		break;
	case "AVIH" :
		renderModifyAVIHSSR();
		break;
	case "CBBG" :
		renderNewDefaultSSR();
		break;
	case "PETC" :
		renderModifyAVIHSSR();
		break;
	case "MEDA" :
		renderModifyMEDASSR();
		break;
	case "WRITE" :
		renderModifyWRIGHTSSR();
		break;
	default:
		renderNewDefaultSSR();
		break;
	}
}

$(document).on("change", "#ssrCodeList", function(e){
	var $this = $(this);
	var selected = $("#ssrCodeList option:selected").val();
	
	showDirect(selected);
	
	resetRenderSwitchType(selected);
});

function setNewDefaultSSR(selected){
	var typeCheck = $("#newSSRList").find(".con-l").find("input").not($("#checkAllPax")).attr("type");
	var paxArr = new Array();
	
	var paxList;
	
	if(typeCheck == "checkbox"){
		paxList = $("#newSSRList").find(".con-l").find("input[type='checkbox']:checked").not($("#checkAllPax"))
	}else{
		paxList = $("#newSSRList").find(".con-l").find("input[type='radio']:checked").not($("#checkAllPax"));
	}
	
	if(paxList){
		paxList.each(function(index, val){
			if ($(this).prop("checked")) {
				paxArr.push($(this).data("pax"));
			}
		});
	}
	
	var segList = $("#newSSRList").find(".con-r").find("input[type='checkbox']:checked").not($("#checkAllSeg"));
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
	
	var actionCode = "";
	
	if($("#actionCode option:selected").val()){
		actionCode = $("#actionCode option:selected").val();
	}else{
		actionCode = $("#actionCode").val();
	}
	
	var quantity = $("#quantity").val();
	if(!quantity){
		quantity = "1";
	}
	
	var dateOfBirth = "";
	if($("#dateOfBirth").length){
		dateOfBirth = $("#dateOfBirth").val();
		
		if(!dateOfBirth){
			alert("날짜를 입력해 주세요.");
			return false;
		}
	}
	
	var text = $("#text").val();
	var newSSR;
	
	if(selected == "CHLD"){
		if(paxArr.length < 1){
			alert("승객을 선택해 주세요.");
			return false;
		}
		
		newSSR = {
			"code" : selected,
			"ssrDesc" : $("#ssrCodeList option:selected").data("comment"),
			"paxArr" : paxArr,
			"segArr" : "",
			"carrierCode" : carrierCode,
			"actionCode" : actionCode,
			"quantity" : quantity,
			"dateOfBirth": $("#dateOfBirth").val()
		};
	}else if(selected == "DOCA"){
		if(carrierCode.length < 1){
			alert("Carrier Code를 입력해주세요.");
			return false;
		}
		
		if(quantity.length < 1){
			alert("Quantity 를 입력해주세요.");
			return false;
		}
		
		var addressType = $("#addressType option:selected").val();
		if(addressType.length < 1){
			alert("Address Type 선택해 주세요.");
			return false;
		}
		
		if($("#country").val().length < 1){
			alert("Country를 입력해주세요.");
			return false;
		}
		
		if($("#city").val().length < 1){
			aalert("City를 입력해주세요.");
			return false;
		}
		
		newSSR = {
			"code" : selected,
			"ssrDesc" : $("#ssrCodeList option:selected").data("comment"),
			"paxArr" : paxArr,
			"segArr" : "",
			"carrierCode" : carrierCode,
			"actionCode" : actionCode,
			"quantity" : quantity,
			"addressType": $("#addressType").val(),
			"infant": $("#infant").val(),
			"country": $("#country").val(),
			"addressDetails": $("#addressDetails").val(),
			"addressDetails": $("#addressDetails").val(),
			"city": $("#city").val(),
			"countryOfState": $("#countryOfState").val(),
			"zipCode": $("#zipCode").val()
			
		};
	}else if(selected == "DOCS"){
		if(paxArr.length < 1){
			alert("승객을 선택해 주세요.");
			return false;
		}
		
		if(carrierCode.length < 1){
			alert("Carrier Code를 입력해주세요.");
			return false;
		}
		
		if(quantity.length < 1){
			alert("Quantity 를 입력해주세요.");
			return false;
		}
		
		if($("#dateOfBirth").val().length < 1){
			alert("Date of Birth  입력해주세요.");
			return false;
		}
		
		var gender = $("#gender option:selected").val();
		if(gender.length < 1){
			alert("Gender를 선택해 주세요.");
			return false;
		}
		
		if($("#lastName").val().length < 1){
			alert("Last Name 입력해주세요.");
			return false;
		}
		
		if($("#firstName").val().length < 1){
			alert("First Name 입력해주세요.");
			return false;
		}
		
		newSSR = {
			"code" : selected,
			"ssrDesc" : $("#ssrCodeList option:selected").data("comment"),
			"paxArr" : paxArr,
			"segArr" : segArr,
			"carrierCode" : carrierCode,
			"actionCode" : actionCode,
			"quantity" : quantity,
			"documentType" : $("#documentType option:selected").val(),
			"issueCountry" : $("#issueCountry").val(),
			"docNumber" : $("#docNumber").val(),
			"nationality" : $("#nationality").val(),
			"gender" : $("#gender").val(),
			"lastName" : $("#lastName").val(),
			"firstName" : $("#firstName").val(),
			"middleName" : $("#middleName").val(),			
			"dateOfBirth": $("#dateOfBirth").val(),
			"expDate": $("#expDate").val()
		};
	}else if(selected == "INFT"){
		if(paxArr.length < 1){
			alert("승객을 선택해 주세요.");
			return false;
		}
		
		if(segArr.length < 1){
			alert("여정을 선택해 주세요.");
			return false;
		}
		
		if(carrierCode.length < 1){
			alert("Carrier Code를 입력해 주세요.");
			return false;
		}
		
		if(actionCode.length < 1){
			alert("Action Code를 입력해 주세요.");
			return false;
		}
		
		if($("#dateOfBirth").val().length < 1){
			alert("Date of Birth를 입력해 주세요.");
			return false;
		}
		
		newSSR = {
			"code" : selected,
			"ssrDesc" : $("#ssrCodeList option:selected").data("comment"),
			"paxArr" : paxArr,
			"segArr" : segArr,
			"carrierCode" : carrierCode,
			"actionCode" : actionCode,
			"quantity" : quantity,
			"dateOfBirth": $("#dateOfBirth").val(),
			"infantName": $("#infantName").val(),
	    	"title" : $("#title option:selected").val()
		};
	}else if(selected == "FOID"){
		if(paxArr.length < 1){
			alert("승객을 선택해 주세요.");
			return false;
		}
		
		if(carrierCode.length < 1){
			alert("Carrier Code를 입력해 주세요.");
			return false;
		}
		
		var foidType = $("#foidType").val();		
		var foidTypeList = $("#foidTypeList option:selected").val();
		
		if(foidType == null || foidType.length  < 1){
			alert("FOID Type를 선택해 주세요.");
			return false;
		}
		
		if(text.length < 1){
			alert("Text를 입력해 주세요.");
			return false;
		}
		
		newSSR = {
				"code" : selected,
				"ssrDesc" : $("#ssrCodeList option:selected").data("comment"),
				"paxArr" : paxArr,
				"segArr" : segArr,
				"carrierCode" : carrierCode,
				"actionCode" : actionCode,
				"quantity" : quantity,
				"foidType" : $("#foidType").val(),
				"text" : text
			};
	}else if(selected == "WRITE"){
		if(paxArr.length < 1){
			alert("승객을 선택해 주세요.");
			return false;
		}
		
		if(segArr.length < 1){
			alert("여정을 선택해 주세요.");
			return false;
		}
		
		if(carrierCode.length < 1){
			alert("Carrier Code를 입력해 주세요.");
			return false;
		}
		
		if(actionCode.length < 1){
			alert("Action Code를 입력해 주세요.");
			return false;
		}
		
		if(quantity.length < 1){
			alert("Quantity 를 입력해주세요.");
			return false;
		}
		
		if($("#direct").val().length < 1){
			alert("SSR 코드를 입력해주세요.");
			return false;
		}
		
		if(text.length < 1){
			alert("Text를 입력해 주세요.");
			return false;
		}
		
		newSSR = {
			"code" : selected,
			"ssrDesc" : $("#ssrCodeList option:selected").data("comment"),
			"paxArr" : paxArr,
			"segArr" : segArr,
			"direct" : $("#direct").val(),
			"carrierCode" : carrierCode,
			"actionCode" : actionCode,
			"quantity" : quantity,
			"text" : text
		};
	}else{
		if(paxArr.length < 1){
			alert("승객을 선택해 주세요.");
			return false;
		}
		
		if(segArr.length < 1){
			alert("여정을 선택해 주세요.");
			return false;
		}
		
		if(carrierCode.length < 1){
			alert("Carrier Code를 입력해 주세요.");
			return false;
		}
		
		if(actionCode.length < 1){
			alert("Action Code를 입력해 주세요.");
			return false;
		}
		
		if(quantity.length < 1){
			alert("Quantity 를 입력해주세요.");
			return false;
		}
		
		if(text.length < 1){
			alert("Text를 입력해 주세요.");
			return false;
		}
		
		newSSR = {
			"code" : selected,
			"ssrDesc" : $("#ssrCodeList option:selected").data("comment"),
			"paxArr" : paxArr,
			"segArr" : segArr,
			"carrierCode" : carrierCode,
			"actionCode" : actionCode,
			"quantity" : quantity,
			"text" : text
		};
	}
	
	return newSSR;
}

function appendNewSSR(selected, newSSR, newRPH, tempRPH){
	var ssrobject;
	var ssrList = "";
	if(newSSR.paxArr && Array.isArray(newSSR.paxArr) && newSSR.paxArr.length > 0){
		newSSR.paxArr.forEach(function(value, index, array){
			if(newSSR.segArr && Array.isArray(newSSR.segArr) && newSSR.segArr.length > 0){
				newSSR.segArr.forEach(function(segVal, segIdx, segArr){
					var rph = value.RPH ? value.RPH : $(this).data("paxrph");
					//start of pax
					ssrList += "<tr>";
					ssrList += "<td class='rph'>" + newSSR.code + "</td>"
					  + "<td>" + newSSR.ssrDesc + "</td>";
					  
					ssrList += "<td>";
					ssrList += value.RPH + ". " + value.lastName + "/" + value.firstName;
					ssrList += "</td>";
					//end of pax
					
					//start of seg
					ssrList += "<td>";
					ssrList += segVal.depStn + " " + segVal.arrStn;
					ssrList += "</td>";
					
					ssrList += "<td>" + nullCheck(segVal.flightNo) + "</td>"
						  + "<td>" + parseDDMMMYY(nullCheck(segVal.depDate)) + "</td>"
						  + "<td>" + newSSR.carrierCode + "</td>"
						  + "<td>" + newSSR.actionCode + "</td>";

					if(selected == "CHLD"){
						 ssrobject = {
						    		"RPH":tempRPH,
							    	"refSegRPH": segVal.RPH,
							    	"refPaxRPH": value.RPH,
							    	"ssrCode": newSSR.code,
							    	"codeDesc": newSSR.ssrDesc,
							    	"quantity": newSSR.quantity,
							    	"status": newSSR.actionCode,
							    	"airline": newSSR.carrierCode,
							    	"dateOfBirth": newSSR.dateOfBirth
						};
						ssrList += "<td>" + newSSR.dateOfBirth +"</td>";
					}else if(selected == "DOCA"){
						ssrobject = {
								"RPH":tempRPH,
						    	"refSegRPH": segVal.RPH,
						    	"refPaxRPH": value.RPH,
						    	"ssrCode": newSSR.code,
						    	"codeDesc": newSSR.ssrDesc,
						    	"quantity": newSSR.quantity,
						    	"status": newSSR.actionCode,
						    	"airline": newSSR.carrierCode,
						    	"addressType": newSSR.addressType,
						    	"infant": newSSR.infant,
						    	"country": newSSR.country,
						    	"addressDetails": newSSR.addressDetails,
						    	"city": newSSR.city,
						    	"countryOfState": newSSR.countryOfState,
						    	"zipCode": newSSR.zipCode,
						};
						ssrList += "<td>" + newSSR.addressType;
						ssrList += " " + newSSR.infant;
						ssrList += " " + newSSR.country;
						ssrList += " " + newSSR.addressDetails;
						ssrList += " " + newSSR.city;
						ssrList += " " + newSSR.countryOfState;
						ssrList += " " + newSSR.zipCode;
						ssrList += "</td>";
					}else if(selected == "DOCS"){
						var textVal = "";
						textVal += newSSR.documentType + "/" + newSSR.issueCountry + "/" + newSSR.docNumber;
						textVal += "/" + newSSR.nationality + "/" + newSSR.dateOfBirth + " " + newSSR.gender;
						textVal += "/" + newSSR.expDate + "/" + newSSR.lastName + "/" + newSSR.firstName + "/" + newSSR.middleName;
						
						ssrobject = {
								"RPH":tempRPH,
						    	"refSegRPH": segVal.RPH,
						    	"refPaxRPH": value.RPH,
						    	"ssrCode": newSSR.code,
						    	"codeDesc": newSSR.ssrDesc,
						    	"quantity": newSSR.quantity,
						    	"status": newSSR.actionCode,
						    	"airline": newSSR.carrierCode,						    	
						    	"documentType" : newSSR.documentType,
						    	"issueCountry" : newSSR.issueCountry,
						    	"docNumber" : newSSR.docNumber,
						    	"nationality" : newSSR.nationality,
						    	"gender" : newSSR.gender,
						    	"lastName" : newSSR.lastName,
						    	"firstName" : newSSR.firstName,
						    	"middleName" : newSSR.middleName,			
						    	"dateOfBirth": newSSR.dateOfBirth,
						    	"expDate": newSSR.expDate,						    	
						    	"text": textVal 
						};
						ssrList += "<td>" + textVal + "</td>";
					}else if(selected == "INFT"){
						ssrobject = {
								"RPH":tempRPH,
						    	"refSegRPH": segVal.RPH,
						    	"refPaxRPH": value.RPH,
						    	"ssrCode": newSSR.code,
						    	"codeDesc": newSSR.ssrDesc,
						    	"quantity": newSSR.quantity,
						    	"status": newSSR.actionCode,
						    	"airline": newSSR.carrierCode,
						    	"infantName": newSSR.infantName,
						    	"dateOfBirth": newSSR.dateOfBirth,
						    	"title" : newSSR.title
						};
						ssrList += "<td>" + newSSR.infantName;
						ssrList += " " + newSSR.title;
						ssrList += " " + newSSR.dateOfBirth;
						ssrList += "</td>";
					}else if(selected == "FOID"){
					    ssrobject = {
					    		"RPH":tempRPH,
						    	"refSegRPH": segVal.RPH,
						    	"refPaxRPH": value.RPH,
						    	"ssrCode": newSSR.code,
						    	"codeDesc": newSSR.ssrDesc,
						    	"quantity": newSSR.quantity,
						    	"status": newSSR.actionCode,
						    	"airline": newSSR.carrierCode,
						    	"foidType": newSSR.foidType,
						    	"text": newSSR.text
						};
					    ssrList += "<td>" + newSSR.foidType + newSSR.text + "</td>";
					}else if(selected == "WRITE"){
					    ssrobject = {
					    		"RPH":tempRPH,
						    	"refSegRPH": segVal.RPH,
						    	"refPaxRPH": value.RPH,
						    	"ssrCode": newSSR.code,
						    	"codeDesc": newSSR.ssrDesc,
						    	"quantity": newSSR.quantity,
						    	"status": newSSR.actionCode,
						    	"airline": newSSR.carrierCode,
						    	"direct": newSSR.direct,
						    	"text": newSSR.text
						};
					    ssrList += "<td>" + newSSR.text + "</td>";
					}else{
					    ssrobject = {
					    		"RPH":tempRPH,
						    	"refSegRPH": segVal.RPH,
						    	"refPaxRPH": value.RPH,
						    	"ssrCode": newSSR.code,
						    	"codeDesc": newSSR.ssrDesc,
						    	"quantity": newSSR.quantity,
						    	"status": newSSR.actionCode,
						    	"airline": newSSR.carrierCode,
						    	"text": newSSR.text
						};
					    ssrList += "<td>" + newSSR.text + "</td>";
					}
					
					ssrList += "<td class='bo-left'><input name='btnRemove' class='delete_btn2' type='button' data-rph='" + tempRPH + "' data-ssrobject='" + JSON.stringify(ssrobject) + "' value=''></td>";
						
					ssrList += "</tr>";
					
					var handleList = "<input class='rph' name='ssrRPH' type='hidden' data-handle='add' data-rph='" + tempRPH + "' data-ssrobject='" + JSON.stringify(ssrobject) + "' >";
					$("#handleData").append(handleList);
					
					//end of seg
					tempRPH++;
				});
			}else{
				//start of pax
				ssrList += "<tr>";
				ssrList += "<td class='rph'>" + newSSR.code + "</td>"
				  + "<td>" + newSSR.ssrDesc + "</td>";
				  
				ssrList += "<td>";
				ssrList += value.RPH + ". " + value.lastName + "/" + value.firstName;
				ssrList += "</td>";
				//end of pax
				
				//start of seg
				ssrList += "<td>";
				ssrList += "";
				ssrList += "</td>";
				
				ssrList += "<td>" + "" + "</td>"
				  + "<td>" + "" + "</td>"
				  + "<td>" + newSSR.carrierCode + "</td>"
				  + "<td>" + newSSR.actionCode + "</td>";
				  //+ "<td>" + newSSR.text + "</td>";

				  if(selected == "CHLD"){
						 ssrobject = {
								 "RPH":tempRPH,
						    		"refSegRPH": "",
							    	"refPaxRPH": value.RPH,
							    	"ssrCode": newSSR.code,
							    	"codeDesc": newSSR.ssrDesc,
							    	"quantity": newSSR.quantity,
							    	"status": newSSR.actionCode,
							    	"airline": newSSR.carrierCode,
							    	"dateOfBirth": newSSR.dateOfBirth
						};
						 ssrList += "<td>" + newSSR.dateOfBirth +"</td>";
				 }else if(selected == "DOCA"){
						ssrobject = {
								"RPH":tempRPH,
					    		"refSegRPH": "",
						    	"refPaxRPH": value.RPH,
						    	"ssrCode": newSSR.code,
						    	"codeDesc": newSSR.ssrDesc,
						    	"quantity": newSSR.quantity,
						    	"status": newSSR.actionCode,
						    	"airline": newSSR.carrierCode,
						    	"addressType": newSSR.addressType,
						    	"infant": newSSR.infant,
						    	"country": newSSR.country,
						    	"addressDetails": newSSR.addressDetails,
						    	"city": newSSR.city,
						    	"countryOfState": newSSR.countryOfState,
						    	"zipCode": newSSR.zipCode,
						};
						ssrList += "<td>" + newSSR.addressType;
						ssrList += " " + newSSR.infant;
						ssrList += " " + newSSR.country;
						ssrList += " " + newSSR.addressDetails;
						ssrList += " " + newSSR.city;
						ssrList += " " + newSSR.countryOfState;
						ssrList += " " + newSSR.zipCode;
						ssrList += "</td>";
				}else if(selected == "DOCS"){
					var textVal = "";
					textVal += newSSR.documentType + "/" + newSSR.issueCountry + "/" + newSSR.docNumber;
					textVal += "/" + newSSR.nationality + "/" + newSSR.dateOfBirth + " " + newSSR.gender;
					textVal += "/" + newSSR.expDate + "/" + newSSR.lastName + "/" + newSSR.firstName + "/" + newSSR.middleName;
					
					ssrobject = {
							"RPH":tempRPH,
					    	"refSegRPH": "",
					    	"refPaxRPH": value.RPH,
					    	"ssrCode": newSSR.code,
					    	"codeDesc": newSSR.ssrDesc,
					    	"quantity": newSSR.quantity,
					    	"status": newSSR.actionCode,
					    	"airline": newSSR.carrierCode,						    	
					    	"documentType" : newSSR.documentType,
					    	"issueCountry" : newSSR.issueCountry,
					    	"docNumber" : newSSR.docNumber,
					    	"nationality" : newSSR.nationality,
					    	"gender" : newSSR.gender,
					    	"lastName" : newSSR.lastName,
					    	"firstName" : newSSR.firstName,
					    	"middleName" : newSSR.middleName,			
					    	"dateOfBirth": newSSR.dateOfBirth,
					    	"expDate": newSSR.expDate,						    	
					    	"text": textVal 
					};
					ssrList += "<td>" + textVal + "</td>";
				}else if(selected == "INFT"){
					ssrobject = {
							"RPH":tempRPH,
				    		"refSegRPH": "",
					    	"refPaxRPH": value.RPH,
					    	"ssrCode": newSSR.code,
					    	"codeDesc": newSSR.ssrDesc,
					    	"quantity": newSSR.quantity,
					    	"status": newSSR.actionCode,
					    	"airline": newSSR.carrierCode,
					    	"infantName": newSSR.infantName,
					    	"dateOfBirth": newSSR.dateOfBirth,
					    	"title" : newSSR.title
					};
					ssrList += "<td>" + newSSR.infantName;
					ssrList += " " + newSSR.title;
					ssrList += " " + newSSR.dateOfBirth;
					ssrList += "</td>";
				}else if(selected == "FOID"){
				    ssrobject = {
				    		"RPH":tempRPH,
					    	"refSegRPH": "",
					    	"refPaxRPH": value.RPH,
					    	"ssrCode": newSSR.code,
					    	"codeDesc": newSSR.ssrDesc,
					    	"quantity": newSSR.quantity,
					    	"status": newSSR.actionCode,
					    	"airline": newSSR.carrierCode,
					    	"foidType": newSSR.foidType,
					    	"text": newSSR.text
					};
				    ssrList += "<td>" + newSSR.foidType + newSSR.text + "</td>";
				}else{
				    ssrobject = {
				    		"RPH":tempRPH,
				    		"refSegRPH": "",
					    	"refPaxRPH": value.RPH,
					    	"ssrCode": newSSR.code,
					    	"codeDesc": newSSR.ssrDesc,
					    	"quantity": newSSR.quantity,
					    	"status": newSSR.actionCode,
					    	"airline": newSSR.carrierCode,
					    	"text": newSSR.text
					};
				    ssrList += "<td>" + newSSR.text + "</td>";
				}
			  
				ssrList += "<td class='bo-left'><input name='btnRemove' class='delete_btn2' type='button' data-rph='" + tempRPH + "' data-ssrobject='" + JSON.stringify(ssrobject) + "' value=''></td>";
				ssrList += "</tr>";
				
				var handleList = "<input class='rph' name='ssrRPH' type='hidden' data-handle='add' data-rph='" + tempRPH + "' data-ssrobject='" + JSON.stringify(ssrobject) + "' >";
				$("#handleData").append(handleList);
				//end of seg
				tempRPH++;
			}
		});
	}else{
		if(newSSR.segArr && Array.isArray(newSSR.segArr) && newSSR.segArr.length > 0){
			newSSR.segArr.forEach(function(segVal, segIdx, segArr){
				//start of pax
				ssrList += "<tr>";
				ssrList += "<td class='rph'>" + newSSR.code + "</td>"
				  + "<td>" + newSSR.ssrDesc + "</td>";			  
				ssrList += "<td>";		
				ssrList += "";
				ssrList += "</td>";
				//end of pax
				
				//start of seg
				ssrList += "<td>";					
				ssrList += segVal.depStn + " " + segVal.arrStn;				
				ssrList += "</td>";
				
				ssrList += "<td>" + nullCheck(segVal.flightNo) + "</td>"
					  + "<td>" + parseDDMMMYY(nullCheck(segVal.depDate)) + "</td>"
					  + "<td>" + newSSR.carrierCode + "</td>"
					  + "<td>" + newSSR.actionCode + "</td>";
				
			  	if(selected == "CHLD"){
					ssrobject = {
							"RPH":tempRPH,
							"refSegRPH": segVal.RPH,
							"refPaxRPH": "",
							"ssrCode": newSSR.code,
							"codeDesc": newSSR.ssrDesc,
							"quantity": newSSR.quantity,
							"status": newSSR.actionCode,
							"airline": newSSR.carrierCode,
							"dateOfBirth": newSSR.dateOfBirth
					};
					ssrList += "<td>" + newSSR.dateOfBirth + "</td>";
			  	}else if(selected == "DOCA"){
					ssrobject = {
							"RPH":tempRPH,
				    		"refSegRPH": segVal.RPH,
							"refPaxRPH": "",
					    	"ssrCode": newSSR.code,
					    	"codeDesc": newSSR.ssrDesc,
					    	"quantity": newSSR.quantity,
					    	"status": newSSR.actionCode,
					    	"airline": newSSR.carrierCode,
					    	"addressType": newSSR.addressType,
					    	"infant": newSSR.infant,
					    	"country": newSSR.country,
					    	"addressDetails": newSSR.addressDetails,
					    	"city": newSSR.city,
					    	"countryOfState": newSSR.countryOfState,
					    	"zipCode": newSSR.zipCode,
					};
					ssrList += "<td>" + newSSR.addressType;
					ssrList += " " + newSSR.infant;
					ssrList += " " + newSSR.country;
					ssrList += " " + newSSR.addressDetails;
					ssrList += " " + newSSR.city;
					ssrList += " " + newSSR.countryOfState;
					ssrList += " " + newSSR.zipCode;
					ssrList += "</td>";
				}else if(selected == "DOCS"){
					var textVal = "";
					textVal += newSSR.documentType + "/" + newSSR.issueCountry + "/" + newSSR.docNumber;
					textVal += "/" + newSSR.nationality + "/" + newSSR.dateOfBirth + " " + newSSR.gender;
					textVal += "/" + newSSR.expDate + "/" + newSSR.lastName + "/" + newSSR.firstName + "/" + newSSR.middleName;
					
					ssrobject = {
							"RPH":tempRPH,
					    	"refSegRPH": segVal.RPH,
					    	"refPaxRPH": "",
					    	"ssrCode": newSSR.code,
					    	"codeDesc": newSSR.ssrDesc,
					    	"quantity": newSSR.quantity,
					    	"status": newSSR.actionCode,
					    	"airline": newSSR.carrierCode,						    	
					    	"documentType" : newSSR.documentType,
					    	"issueCountry" : newSSR.issueCountry,
					    	"docNumber" : newSSR.docNumber,
					    	"nationality" : newSSR.nationality,
					    	"gender" : newSSR.gender,
					    	"lastName" : newSSR.lastName,
					    	"firstName" : newSSR.firstName,
					    	"middleName" : newSSR.middleName,			
					    	"dateOfBirth": newSSR.dateOfBirth,
					    	"expDate": newSSR.expDate,						    	
					    	"text": textVal 
					};
					ssrList += "<td>" + textVal + "</td>";
				}else if(selected == "INFT"){
					ssrobject = {
							"RPH":tempRPH,
				    		"refSegRPH": segVal.RPH,
							"refPaxRPH": "",
					    	"ssrCode": newSSR.code,
					    	"codeDesc": newSSR.ssrDesc,
					    	"quantity": newSSR.quantity,
					    	"status": newSSR.actionCode,
					    	"airline": newSSR.carrierCode,
					    	"infantName": newSSR.infantName,
					    	"dateOfBirth": newSSR.dateOfBirth,
					    	"title" : newSSR.title
					};
					ssrList += "<td>" + newSSR.infantName + " " + newSSR.dateOfBirth +"</td>";
				}else if(selected == "FOID"){
				    ssrobject = {
				    		"RPH":tempRPH,
					    	"refSegRPH": segVal.RPH,
					    	"refPaxRPH": "",
					    	"ssrCode": newSSR.code,
					    	"codeDesc": newSSR.ssrDesc,
					    	"quantity": newSSR.quantity,
					    	"status": newSSR.actionCode,
					    	"airline": newSSR.carrierCode,
					    	"foidType": newSSR.foidType,
					    	"text": newSSR.text
					};
				    ssrList += "<td>" + newSSR.foidType + newSSR.text + "</td>";
				}else{
					ssrobject = {
							"RPH":tempRPH,
							"refSegRPH": segVal.RPH,
							"refPaxRPH": "",
							"ssrCode": newSSR.code,
							"codeDesc": newSSR.ssrDesc,
							"quantity": newSSR.quantity,
							"status": newSSR.actionCode,
							"airline": newSSR.carrierCode,
							"text": newSSR.text
					};
					ssrList += "<td>" + newSSR.text +"</td>";
				}
			  	
				ssrList += "<td class='bo-left'><input name='btnRemove' class='delete_btn2' type='button' data-rph='" + tempRPH + "' data-ssrobject='" + JSON.stringify(ssrobject) + "' value=''></td>";
				ssrList += "</tr>";
				
				var handleList = "<input class='rph' name='ssrRPH' type='hidden' data-handle='add' data-rph='" + tempRPH + "' data-ssrobject='" + JSON.stringify(ssrobject) + "' >";
				$("#handleData").append(handleList);
				//end of seg
				tempRPH++;
			});
		}else{
			//start of pax
			ssrList += "<tr>";
			ssrList += "<td class='rph'>" + newSSR.code + "</td>"
			  + "<td>" + newSSR.ssrDesc + "</td>";			  
			ssrList += "<td>";		
			ssrList += "";
			ssrList += "</td>";
			//end of pax
			
			//start of seg
			ssrList += "<td>";
			ssrList += "";			
			ssrList += "</td>";
			
			ssrList += "<td>" + "" + "</td>"
				  + "<td>" + "" + "</td>"
				  + "<td>" + newSSR.carrierCode + "</td>"
				  + "<td>" + newSSR.actionCode + "</td>";
			
			  if(selected == "CHLD"){
					ssrobject = {
							"RPH":tempRPH,
							"refSegRPH": "",
					    	"refPaxRPH": "",
							"ssrCode": newSSR.code,
							"codeDesc": newSSR.ssrDesc,
							"quantity": newSSR.quantity,
							"status": newSSR.actionCode,
							"airline": newSSR.carrierCode,
							"dateOfBirth": newSSR.dateOfBirth
					};
					ssrList += "<td>" + newSSR.dateOfBirth +"</td>";
			  }else if(selected == "DOCA"){
					ssrobject = {
							"RPH":tempRPH,
				    		"refSegRPH": "",
					    	"refPaxRPH": "",
					    	"ssrCode": newSSR.code,
					    	"codeDesc": newSSR.ssrDesc,
					    	"quantity": newSSR.quantity,
					    	"status": newSSR.actionCode,
					    	"airline": newSSR.carrierCode,
					    	"addressType": newSSR.addressType,
					    	"infant": newSSR.infant,
					    	"country": newSSR.country,
					    	"addressDetails": newSSR.addressDetails,
					    	"city": newSSR.city,
					    	"countryOfState": newSSR.countryOfState,
					    	"zipCode": newSSR.zipCode,
					};
					ssrList += "<td>" +  newSSR.addressType + " " + newSSR.infant + " " + newSSR.country + " " + newSSR.addressDetails + " " + newSSR.city + " " + newSSR.countryOfState + " " + newSSR.zipCode +"</td>";
			  }else if(selected == "DOCS"){
				  var textVal = "";
					textVal += newSSR.documentType + "/" + newSSR.issueCountry + "/" + newSSR.docNumber;
					textVal += "/" + newSSR.nationality + "/" + newSSR.dateOfBirth + " " + newSSR.gender;
					textVal += "/" + newSSR.expDate + "/" + newSSR.lastName + "/" + newSSR.firstName + "/" + newSSR.middleName;
					
					ssrobject = {
							"RPH":tempRPH,
					    	"refSegRPH": "",
					    	"refPaxRPH": "",
					    	"ssrCode": newSSR.code,
					    	"codeDesc": newSSR.ssrDesc,
					    	"quantity": newSSR.quantity,
					    	"status": newSSR.actionCode,
					    	"airline": newSSR.carrierCode,						    	
					    	"documentType" : newSSR.documentType,
					    	"issueCountry" : newSSR.issueCountry,
					    	"docNumber" : newSSR.docNumber,
					    	"nationality" : newSSR.nationality,
					    	"gender" : newSSR.gender,
					    	"lastName" : newSSR.lastName,
					    	"firstName" : newSSR.firstName,
					    	"middleName" : newSSR.middleName,			
					    	"dateOfBirth": newSSR.dateOfBirth,
					    	"expDate": newSSR.expDate,						    	
					    	"text": textVal 
					};
					ssrList += "<td>" + textVal + "</td>";
			  }else if(selected == "INFT"){
					ssrobject = {
							"RPH":tempRPH,
				    		"refSegRPH": "",
					    	"refPaxRPH": "",
					    	"ssrCode": newSSR.code,
					    	"codeDesc": newSSR.ssrDesc,
					    	"quantity": newSSR.quantity,
					    	"status": newSSR.actionCode,
					    	"airline": newSSR.carrierCode,
					    	"infantName": newSSR.infantName,
					    	"dateOfBirth": newSSR.dateOfBirth,
					    	"title" : newSSR.title
					};
					ssrList += "<td>" + newSSR.infantName + " " + newSSR.dateOfBirth + "</td>";
			  }else if(selected == "FOID"){
				    ssrobject = {
				    		"RPH":tempRPH,
					    	"refSegRPH": "",
					    	"refPaxRPH": "",
					    	"ssrCode": newSSR.code,
					    	"codeDesc": newSSR.ssrDesc,
					    	"quantity": newSSR.quantity,
					    	"status": newSSR.actionCode,
					    	"airline": newSSR.carrierCode,
					    	"foidType": newSSR.foidType,
					    	"text": newSSR.text
					};
				    ssrList += "<td>" + newSSR.foidType + newSSR.text + "</td>";
				}else{
					ssrobject = {
							"RPH":tempRPH,
							"refSegRPH": "",
					    	"refPaxRPH": "",
							"ssrCode": newSSR.code,
							"codeDesc": newSSR.ssrDesc,
							"quantity": newSSR.quantity,
							"status": newSSR.actionCode,
							"airline": newSSR.carrierCode,
							"text": newSSR.text
					};
					ssrList += "<td>" + newSSR.text + " + </td>";
			}
				  
			ssrList += "<td class='bo-left'><input name='btnRemove' class='delete_btn2' type='button' data-rph='" + tempRPH + "' data-ssrobject='" + JSON.stringify(ssrobject) + "' value=''></td>";
			ssrList += "</tr>";
			
			var handleList = "<input class='rph' name='ssrRPH' type='hidden' data-handle='add' data-rph='" + tempRPH + "' data-ssrobject='" + JSON.stringify(ssrobject) + "' >";
			$("#handleData").append(handleList);
			//end of seg
			tempRPH++;
		}
	}
	
	$("#ssrList").append(ssrList);
}


$(document).on("click", "input[name='pax']", function(e){
	var checkedLen = $("input[name='pax']:checked").length;
	var paxLen = $("input[name='pax']").length;
	
	if (paxLen == checkedLen) {
		$("#checkAllPax").prop("checked",true);
	} else {
		$("#checkAllPax").prop("checked",false);
	}
});

$(document).on("click", "input[name='seg']", function(e){
	var checkedLen = $("input[name='seg']:checked").length;
	var paxLen = $("input[name='seg']").length;
	
	if (paxLen == checkedLen) {
		$("#checkAllSeg").prop("checked",true);
	} else {
		$("#checkAllSeg").prop("checked",false);
	}
});