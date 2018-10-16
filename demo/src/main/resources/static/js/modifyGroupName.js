function setDatepicker(){
	$.datepicker.setDefaults({
		showOn: "button",
		buttonImage: "../images/btn_diary.gif",
		buttonImageOnly: true,
		dateFormat : "ddMy",
		monthNamesShort: ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"]	
	});

	$(".sData").datepicker();
	
	var currentDate = new Date();
	$("#dateOfBirth").datepicker();
	$("#dateOfBirth").val(parseDDMMMYY(currentDate));
	
	if($("#expDate")){
		$("#expDate").datepicker();
		$("#expDate").val(parseDDMMMYY(currentDate));
	}
}

function getBirthDay(ssr, paxRPH){
	var birthDay = "";
	if(ssr){
		ssr.forEach(function(value, index, array){
			if(value.code == "CHLD" && value.refPaxRPH[0] == paxRPH){
				birthDay = value.text
				return false;
			}
		});
	}
	
	return birthDay;
}

function setGroupNameInfo(data){
	var groupName = getGroupNameString(data);	
	var airTraveler = getNamesObject(data);
	var airItinerary = getAirItineraryObject(data);
	var ssr = getSSRObject(data);
	
	renderModifyGroupName(groupName, airTraveler, airItinerary, ssr);
}

function renderModifyGroupName(groupName, airTraveler, airItinerary, ssr){
	var totalNumberSeat = 0;
	var totalNumberUnassignedSeaat = 0;
	
	airItinerary.forEach(function(value, index, array){
		totalNumberSeat = value.paxCount;
	});
	
	if(airTraveler && airTraveler.length > 0){
		totalNumberUnassignedSeaat = totalNumberSeat - airTraveler.length;
	}else{
		totalNumberUnassignedSeaat = totalNumberSeat
	}
	
	var groupNameText = "Group Name  : " + groupName;
	var numberOfSeatText = "<span>Total Number of Seats " + totalNumberSeat + " <em></em></span> <span>Total Number of Unassigned Seats " +totalNumberUnassignedSeaat + " <em></em></span>";
	
	$("#groupName").html(groupNameText + " " + numberOfSeatText);
	
	var segArray = new Array();
	airItinerary.forEach(function(value, index, array){
		segArray.push(value);
	});
	
	var nextIndex = 1;
	var nameList = "";
	
	if(airTraveler){
		airTraveler.forEach(function(value, index, array){
			nextIndex = nextIndex + index;
			nameList += "<tr>"
			+ "<td>"
			+ "<div class='s-w80p'>"
			+ "<select id='ptc" + index + "' name='ptc'>"
			+ "<option value='ADT'" + (value.type == 'ADT' ? 'selected' : '') + ">ADT</option>"
			+ "<option value='CHD'" + ((value.type == 'CNN' || value.type == 'CHD') ? 'selected' : '') + ">CHD</option>"
			+ "</select>"
			+ "</div>"
			+ "</td>";
			nameList += "<td><input id='lastName" + index + "' name='lastName' class='w70p' value='" + value.lastName + "' data-isadded='Y' data-groupname='" + groupName + "' data-totalnumberseat='" + totalNumberSeat + "' data-seg='" + JSON.stringify(segArray) + "' data-pax='" + JSON.stringify(value) +"'></td>";
			nameList += "<td><input id='firstName" + index + "' name='firstName' class='w70p' value='" + value.firstName + "' data-isadded='Y' data-groupname='" + groupName + "' data-totalnumberseat='" + totalNumberSeat + "' data-seg='" + JSON.stringify(segArray) + "' data-pax='" + JSON.stringify(value) +"'></td>";
			nameList += "<td>"
			+ "<div class='s-w80p'>"
			+ "<select id='title" + index + "' name='title'>";
			
			if(value.type == 'CNN' || value.type == 'CHD'){
				nameList += "<option value=''>Select</option>";
				nameList += "<option value='MSTR'" + selectedNamesTitle(value.Title, "MSTR") +">MSTR</option>";
				nameList += "<option value='MISS'" + selectedNamesTitle(value.Title, "MISS") +">MISS</option>";
			}else{
				nameList += "<option value=''>Select</option>";
				nameList += "<option value='MR' " + selectedNamesTitle(nullCheck(value.title), "MR") +">MR</option>";
				nameList += "<option value='MS' " + selectedNamesTitle(nullCheck(value.title), "MS") +">MS</option>";				
			}
			
			nameList += "</select>"
			+ "</div>"
			+ "</td>";
			
			if(value.type == 'CNN' || value.type == 'CHD'){
				nameList += "<td><span id='dateOfBirth" + index + "' name='dateOfBirth'>";
			}else{
				nameList += "<td><span id='dateOfBirth" + index + "' name='dateOfBirth' style='display: none;'>";
			}
			
			nameList += "<input id='sData" + index + "' name='sData' type='text' class='w70p sData' value='" + getBirthDay(ssr, value.RPH) + "'>";
			nameList += "</span></td>"
			+ "<td>"
			+ "<span>"
			+ "<input type='checkbox' id='deleteCheck" + index + "' name='chk' data-seg='" + JSON.stringify(segArray) + "' data-isadded='Y' data-groupname='" + groupName + "' data-totalnumberseat='" + totalNumberSeat + "' data-pax='" + JSON.stringify(value) +"'>"
			+ "<label for='deleteCheck" + index + "'>&nbsp;</label>"
			+ "</span>"
			+ "</td>"
			+ "</tr>";
		});
	}
	
	for(var i = 0; i < totalNumberUnassignedSeaat; i++){
		nextIndex = nextIndex + i;
		nameList += "<tr>"
			+ "<td>"
			+ "<div class='s-w80p'>"
			+ "<select id='ptc" + nextIndex + "' name='ptc'>"
			+ "<option value='ADT'>ADT</option>"
			+ "<option value='CHD'>CHD</option>"
			+ "</select>"
			+ "</div>"
			+ "</td>";
		nameList += "<td><input id='lastName" + nextIndex + "' name='lastName' class='w70p' value='' data-isadded='N' data-totalnumberseat='" + totalNumberSeat + "' data-groupname='" + groupName + "' data-seg='" + JSON.stringify(segArray) + "'></td>";
		nameList += "<td><input id='firstName" + nextIndex + "' name='firstName' class='w70p' value='' data-isadded='N' data-totalnumberseat='" + totalNumberSeat + "' data-groupname='" + groupName + "' data-seg='" + JSON.stringify(segArray) + "'></td>"
			+ "<td>"
			+ "<div class='s-w80p'>"
			+ "<select id='title" + nextIndex + "' name='title'>"
			+ "<option value=''>Select</option>"
			+ "<option value='MR'>MR</option>"
			+ "<option value='MS'>MS</option>"
			+ "</select>"
			+ "</div>"
			+ "</td>"
			+ "<td><span id='dateOfBirth" + nextIndex + "' name='dateOfBirth' style='display: none;''>"
			+ "<input id='sData" + nextIndex + "' name='sData' type='text' class='w70p sData' value=''>"
            + "</span></td>"
			+ "<td>"
			+ "<span>"
			+ "<input type='checkbox' id='deleteCheck" + nextIndex + "' name='chk' data-isadded='N' data-totalnumberseat='" + totalNumberSeat + "' data-groupname='" + groupName + "' data-seg='" + JSON.stringify(segArray) + "'>"
			+ "<label for='deleteCheck" + nextIndex + "'>&nbsp;</label>"
			+ "</span>"
			+ "</td>"
			+ "</tr>";
	}
	
	$("#groupNameList").html(nameList);
}

function setAddAction(action){
	var arrayNameData = new Array();
	
	var addPassenger = $("input[name=lastName]").filter(function(){
		return $(this).data("isadded") == "N" && $(this).val().trim().length > 0;
	});
	
	if(addPassenger){
		addPassenger.each(function(index, value){
			var idNumber = $(this).attr("id").replace("lastName", "");
			var lastName = $(this).val();
			var firstName = $("#firstName"+idNumber).val();
			
			if(lastName && firstName && lastName.length > 0 && firstName.length > 0){				
				var groupName = $(this).data("groupname");
				var paxInfo = $(this).data("pax");
				var ptc = $("#ptc"+idNumber + " option:selected").val()
				
				var isNewAssignedName = false;
				
				if(paxInfo == undefined || paxInfo == null){
					isNewAssignedName = true;
				}
		
				var segInfoArray = new Array();
				var segInfo = $(this).data("seg");
				
				if(segInfo && segInfo.length < 1){
					segInfo.forEach(function(value, index, array){
						segInfoArray.push(value);
					});
				}
				
				var totalNumberSeat = $(this).data("totalnumberseat");
				var title = $("#title"+idNumber + " option:selected").val();
				var dateOfBirth = $("#sData"+idNumber).val();
				var checked = $("#deleteCheck"+idNumber).prop("checked");
				
				var paxNameData;
			
				if(isNewAssignedName == true){
					paxNameData = {
						"groupName" : groupName,
						"ptc" : ptc,
						"lastName" : lastName,
						"firstName" : firstName,
						"title" : title,
						"dateOfBirth" : dateOfBirth,
						"checked" : checked,
						"operation" : action,
						"pax" : paxInfo,
						"seg" : segInfoArray,
						"totalNumberSeat" : totalNumberSeat,
						"status": "HK"
					};
					
					arrayNameData.push(paxNameData);
				}
			}
		});
	}
	
	return arrayNameData;
}

function setDeletePassengerName(action){
	var arrayNameData = new Array();
	
	var validation = $("input[name=chk]:checked").filter(function(){
		return $(this).data("isadded") == "N" && $(this).val().trim().length > 0;
	});
	
	if(validation && validation.length > 0){
		alert("승객 이름이 미 등록된 좌석의 승객 이름은 삭제 할 수 없습니다.");
		return false;
	}
	
	var checkedPassengers = $("input[name=chk]:checked").filter(function(){
		return $(this).data("isadded") == "Y";
	});
	
	checkedPassengers.each(function(index, value){
			var segInfoArray = new Array();
			var segInfo = $(this).data("seg");
			var paxInfo = $(this).data("pax");
			
			var idNumber = $(this).attr("id").replace("deleteCheck", "");
			
			var paxNameData = {
				"groupName" : $(this).data("groupname"),
				"ptc" : paxInfo.type,
				"lastName" : paxInfo.lastName,
				"firstName" : paxInfo.firstName,
				"title" : paxInfo.title,
				"dateOfBirth" : $("#sData"+idNumber).val(),
				"checked" : $(this).prop("checked"),
				"operation" : action,
				"pax" : paxInfo,
				"seg" : segInfo,
				"totalNumberSeat" : $(this).data("totalnumberseat"),
				"status": "HK"
			};
				
			arrayNameData.push(paxNameData);
	});
	
	return arrayNameData;
}

function setReduceSeat(action){
	var arrayNameData = new Array();
	
	var validation = $("input[name=chk]:checked").filter(function(){
		return $(this).data("pax") !== undefined;
	});
	
	if(validation && validation.length > 0){
		alert("이름이 입력된 좌석은 삭제할 수 없습니다.");
		return false;
	}
	
	var checkedSeats = $("input[name=chk]:checked").filter(function(){
		return $(this).data("pax") === undefined;
	});
	
	checkedSeats.each(function(index, value){
		var segInfoArray = new Array();
		var segInfo = $(this).data("seg");
		var paxInfo = $(this).data("pax");
		
		var paxNameData = {
			"groupName" : $(this).data("groupname"),
//			"ptc" : paxInfo.type,
//			"lastName" : paxInfo.lastName,
//			"firstName" : paxInfo.firstName,
//			"title" : paxInfo.title,
//			"dateOfBirth" : paxInfo.birth,
//			"checked" : $(this).prop("checked"),
			"operation" : action,
//			"pax" : paxInfo,
			"seg" : segInfo,
			"totalNumberSeat" : $(this).data("totalnumberseat")
		};
			
		arrayNameData.push(paxNameData);
	});
	
	return arrayNameData;
}

function setNamesData(action){
	var arrayNameData = new Array();

	if(action == "add"){
		arrayNameData = setAddAction(action);
	}else if(action == "delete"){
		arrayNameData = setDeletePassengerName(action);
	}else if(action == "reduce"){
		arrayNameData = setReduceSeat(action);
	}
	
	return arrayNameData;
}