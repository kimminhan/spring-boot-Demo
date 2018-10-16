
					
		var today = new Date();
		
		$("#datepicker").datepicker({
			showOn: "button",
			buttonImage: "../images/btn_diary.gif",
			buttonImageOnly: true,
			dateFormat : "ddMy",
			monthNamesShort: ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"]
		}).datepicker("setDate", today.dateFormat('DDMMMYY'));	
		
		var fareAjaxXHR;
		var pnrData = JSON.parse($('#pnrData').val().replaceAll('\n', ''));
		
		
		////여정, 탑승객, emd 데이터 각각 RPH 또는 바인딩하기 수월한 키값으로 재정의 start
		
		//티켓 객체
		var ticketObj = new Object();
		if (pnrData.ticket) {
			if (pnrData.routeType == "D") {
				pnrData.ticket.forEach(function(ticket, tkIndex) {
					ticketObj[ticket.refPaxRPH+'_'+ticket.refSegRPH] = ticket;
				});
			} else {
				var ticketKey;
				pnrData.ticket.forEach(function(ticket, tkIndex) {
					if(ticket.text){
						ticketKey = ticket.text.indexOf('.INF') == -1 ? ticket.refPaxRPH[0]+'_'+ticket.refSegRPH : 'INF_'+ticket.refPaxRPH[0]+'_'+ticket.refSegRPH;
						ticketObj[ticketKey] = ticket;
					}
				});
			}
		}
		
		
		//탑승객 객체
		var paxObj = new Object();
		pnrData.names.forEach(function(pax, paxIndex) {
			paxObj[pax.RPH] = pax;
		});
		
		//SSR 객체 생성 및 SSR내에 INFT정보 탑승객 객체에 추가
		var etcSSRObj = new Object();
		if(pnrData.etcSSR) {
			var infRPH = 1; //유아 RPH(index)
			$.each(pnrData.etcSSR, function(etcIndex, etc){
				if (etc.code == 'OTHS' && etc.text.startsWith('.PTCINFO ') > 0) {
					etcSSRObj['dcCode' + '_' + etc.refPaxRPH[0] + '_' + etc.refSegRPH[0]] = etc; //etc객체 추가 (dcCode)
				} else if (pnrData.routeType == 'I' && etc.code=='INFT' && etc.refSegRPH[0] == 1) {
					
					//탑승객 객체에 유아 추가 start
					var etcTextArr = etc.text.split(' ');
					
					var names = etc.text.substring(1, etc.text.indexOf(' ')).split('/');
					var titleArray = ['MS', 'MR', 'MISS', 'MSTR'];
					var title = $.inArray(etcTextArr[1], titleArray) != -1 ? etcTextArr[1]: '';
					var birth = title ? etcTextArr[2].split('/')[0].dateFormat('YYYYMMDD') : etcTextArr[1].split('/')[0].dateFormat('YYYYMMDD');
					
					var ticketNo = '';
					if (ticketObj['INF_'+etc.refPaxRPH[0]+'_'+etc.refSegRPH]) {
						ticketNo = ticketObj['INF_'+etc.refPaxRPH[0]+'_'+etc.refSegRPH].text.replace('.', '');
					}
					
					var paxData = {
						'RPH': 'P'+etc.refPaxRPH[0]+'I'+infRPH,
						'firstName': names[1],
						'lastName': names[0],
						'title': title,
						'birth': birth,
						'type': 'INF',
						'ticketNo': ticketNo
					}
					
					paxObj['INF_'+etc.refPaxRPH[0]] = paxData;
					infRPH++;
					//탑승객 객체에 유아 추가 end
					
					/*	etcSSRObj[etc.code + '_' + etc.refPaxRPH[0] + '_' + etc.refSegRPH[0]] = etc; //etc객체 추가
									} else {
					etcSSRObj[etc.code + '_' + etc.refPaxRPH[0] + '_' + etc.refSegRPH[0]] = etc; //etc객체 추가*/
				}
				
			});
		}
		
		//여정 객체
		var segObj = new Object(); //여정RPH가 키값인 여정배열
		var segObjByFlightNo = new Object(); //flightNo가 키값인 여정배열 (좌석정보와 바인딩위해 FlightNo가 기준)
		pnrData.itinerary.forEach(function(itinerary, idx) {
			if (itinerary.flightNo == 'ARNK') return true;
			segObj[itinerary.RPH] = itinerary;
			segObjByFlightNo[itinerary.flightNo] = itinerary; //emaA중 Seat를 위함. Seat정보와 바인딩할 데이터가 flightNo. 
		});
		
		
		
		
		//티켓, 탑승객, 여정 바인딩 객체
		var ticketBindedObj = new Object();
		var key;
		
		if (pnrData.routeType == "D") {
			$.each(paxObj, function(paxIndex, pax){
				
				var ticketData = new Object();
				
				$.each(segObj, function(segIndex, seg){
					key = pax.RPH+'_'+seg.RPH;
					ticketData = new Object();
					ticketData.paxRPH = pax.RPH;
					ticketData.name = pax.lastName+'/'+pax.firstName;
					
					if(etcSSRObj) {
						var dcCodeObj = etcSSRObj['dcCode'+'_' + key];
					}
					
					ticketData.dcCode = dcCodeObj ? dcCodeObj.text.replace('.PTCINFO ', '') : '';
					ticketData.type = pax.type;
					ticketData.segRPH = seg.RPH
					ticketData.depStn = seg.depStn;
					ticketData.arrStn = seg.arrStn;
					ticketData.bookingClass = seg.bookingClass;
					ticketData.depDate = seg.depDate;
					ticketData.arrDate = seg.arrDate;
					ticketData.bundleType = seg.bundleType;
					
					var ticketNo = '';
					if (ticketObj[key]) {
						ticketNo = ticketObj[key].text.replace('.', '');
					}
					
					ticketData.ticketNo = ticketNo;
					
					ticketBindedObj[key] = ticketData;
				});
			});
		} else {
			$.each(paxObj, function(paxIndex, pax){
				
				
				ticketData = new Array();
				
				key = pax.type == 'INF' ? 'INF_'+pax.RPH.charAt(1) : pax.RPH;
				
				$.each(segObj, function(segIndex, seg){
					
					var ticketObjKey = key + '_' + seg.RPH;
					
					var ticketDataBySeg = new Object;
					
					ticketDataBySeg.paxRPH = pax.RPH;
					ticketDataBySeg.name = pax.lastName+'/'+pax.firstName;
					ticketDataBySeg.type = pax.type;
					ticketDataBySeg.segRPH = seg.RPH
					ticketDataBySeg.depStn = seg.depStn;
					ticketDataBySeg.arrStn = seg.arrStn;
					ticketDataBySeg.bookingClass = seg.bookingClass;
					ticketDataBySeg.depDate = seg.depDate;
					ticketDataBySeg.arrDate = seg.arrDate;
					ticketDataBySeg.bundleType = seg.bundleType;
					
					var ticketNo = '';
					if (ticketObj[ticketObjKey]) {
						ticketNo = ticketObj[ticketObjKey].text.replace('.', '');
					}
					ticketDataBySeg.ticketNo = ticketNo;
					
					ticketData.push(ticketDataBySeg);
				});
				
				ticketBindedObj[key] = ticketData;
			});
		}
			
		var MEALCODES = ['SPML', 'LCML', 'SFML', 'LSML', 'CHML', 'VGML', 'BBML', 'BLML', 'FPML', 'RVML', 'KSML', 'MOML', 'HNML', 'GFML', 'LFML', 'DBML', 'VOML'];
		var BAGCODES = ['XBAG'];
		var SEATCODES = ['NSST'];
		var BUNDLEV = ['FQTR'];
		var BUNDLEP = ['FQTS'];
		var BUNDLEU = ['FQTU'];
		
		//EMDTicket 객체
		var emdTicketObj = new Object();
		var emdTkTextArr;
		if(pnrData.EMDTicket) {
			pnrData.EMDTicket.forEach(function(emdTk, paxIndex) {
				if (emdTk.text != null) {
					emdTkTextArr = emdTk.text.split('/');
					emdTicketObj[emdTkTextArr[1]+"_"+emdTk.refSegRPH[0]+'_'+emdTk.refPaxRPH[0]] = emdTk;	
				}
				
			});
		}
		
		//EMD-A 객체
		var emdAArr = new Array();
		var emdTextArr;
		
		
		if(pnrData.routeType == 'D') {
			if(pnrData.bundle) {
				pnrData.bundle.forEach(function(bundle) {
					bundle.refPaxRPH.forEach(function(paxRPH) { //bundle은 bundle객체당 pax가 여러개 나와서 emdA의 paxRPH마다 하나씩 EMDA Object 생성
						var emdAData = setEMDAData(bundle, paxRPH);
						if (emdAData != null) {
							emdAArr.push(emdAData); 
						}
					});
					
				});
			}	
		} else{
			if(pnrData.EMDA) {
				pnrData.EMDA.forEach(function(emdA) {	//bundle이 아닌경우 EMDA객체당 pax가 하나로, paxRPH 0번째사용
					var emdAData = setEMDAData(emdA, emdA.refPaxRPH[0]);
					if (emdAData != null) {
						emdAArr.push(emdAData); 
					}
				});
			}
		}			
		
		if(pnrData.seatInfo) {
			pnrData.seatInfo.forEach(function(seat) {
				var emdAData = new Object();
				var segRPH = segObjByFlightNo[seat.flightNumber].RPH;
				
				emdAData.segRPH = segRPH;
				emdAData.paxRPH = seat.refPaxRPH;
				emdAData.code = 'NSST';
				emdAData.status = seat.status;
				emdAData.detail = seat.seatNumber;
				
				emdAData.seatNo = seat.seatNumber; //priceEmd.do 요청시 필요 
				
				if (emdTicketObj["0B5"+"_"+segRPH+"_"+seat.refPaxRPH]) {
					emdAData.emdTicketNo = emdTicketObj["0B5"+"_"+segRPH+"_"+seat.refPaxRPH].text.split('/')[5].split('C')[0];
				} else {
					emdAData.emdTicketNo = '';	
				}
				
				emdAArr.push(emdAData);
			});
		}
		
		////여정, 탑승객, emd 데이터 각각 RPH 또는 바인딩하기 수월한 키값으로 재정의 end
		
		////테이블생성 start
		if (pnrData.routeType == "D") {
			createDomTicketTbl(); //ticket 테이블 생성	
		} else {
			createIntTicketTbl(); //ticket 테이블 생성
		}
	        
		createEMDATbl(); //emdA 테이블 생성
		createEMDSTbl(); //emdS 테이블 생성
		////테이블생성 end
		
		////체크박스 전체선택 이벤트 start
		if ($(".all_chk").length) {
			var $allchk = $(".all_chk");
			$allchk.find(".ip_all_chk").click(function() {
				var $this = $(this), $chk = $this.parent().parent().parent().parent().parent().find("input[type='checkbox']").not($this);
				
				if ($this.prop("checked")) {
					$chk.prop("checked", true);
				} else {
					$chk.prop("checked", false);
				}
			});

			$allchk.find("input[type='checkbox']").not(".ip_all_chk").click(function() {
				var $this = $(this), $chk = $(this).parent().parent().parent().parent().find("input[type='checkbox']"), $all = $chk.end().parent().find(".ip_all_chk");

				if ($chk.length === $chk.filter(":checked").length) {
					$all.prop("checked", true);
				} else {
					$all.prop("checked", false);
				}
			});
		}
		////체크박스 전체선택 이벤트 end
		
		
		////Pricing 버튼 클릭 이벤트 start
		$("#pricingButton").click(function() {
			if ( $('.ticketCheck:checked, .emdACheck:checked').length > 0 ) {
				
				//pricing중인 ajax요청있으면 취소
				if (typeof(fareAjaxXHR) != 'undefined') {
					fareAjaxXHR.abort();
				}
				
				var chkTicketArray = new Array();
				$('.ticketCheck:checked').each(function() {
					
					if(pnrData.routeType == 'D') {
						chkTicketArray.push([ticketBindedObj[$(this).attr('ticketKey')]]);
					} else {
						chkTicketArray.push(ticketBindedObj[$(this).attr('ticketKey')]);	
					}
					
				});

				var ticketNo;
				var chkEmdAArray = new Array();
				var chkEmdValue;
				$('.emdACheck:checked').each(function() {
					chkEmdValue = emdAArr[$(this).attr('chkIndex')];
					
					if(ticketObj[chkEmdValue.paxRPH+'_'+chkEmdValue.segRPH]) {
						ticketNo = ticketObj[chkEmdValue.paxRPH+'_'+chkEmdValue.segRPH].text.replace('.', '').split('C')[0];	
					}
					
					chkEmdValue.ticketNo = ticketNo;
					
					chkEmdAArray.push(chkEmdValue);
				});
				
				
				var fareSearchData = setFareSearchData(chkTicketArray);
				
				//ticket 선택이 있는경우 pricing
				if ($('.ticketCheck:checked').length > 0) {
					
					fareAjaxXHR = ajaxCall(
						"/priceFare.do",
						JSON.stringify(fareSearchData),
						function(data) {

							if (data.Result.data == null) {
								commonNotice('조회된 Fare 데이터가 존재하지않습니다.');
							} else {
								
								if(chkEmdAArray.length > 0) {
									
									emdASearchData = setEmdSearchData(chkEmdAArray, data.Result.data);
									
									ajaxCall(
										"/priceEmd.do",
										JSON.stringify(emdASearchData),
										function(emdData, pricingData){
											if (emdData.Result.data == null) {
												commonNotice('조회된 EMD-A Fare 데이터가 존재하지않습니다.');
											} else {
												pricingFormSubmit(pricingData, emdData.Result.data, chkTicketArray, chkEmdAArray);	
											}
											
										}, null, null, null, null,
										data.Result.data
									);
									
								} else {
									pricingFormSubmit(data.Result.data, null, chkTicketArray, null);	
								}
								
							}
							
						},
						true
					);
				} else { //ticket 선택이 없는경우, EMD는 DB조회만함
					
					emdASearchData = setEmdSearchData(chkEmdAArray, null);
					
					ajaxCall(
						"/priceEmd.do",
						JSON.stringify(emdASearchData),
						function(emdData){
							if (emdData.Result.data == null) {
								commonNotice('조회된 EMD-A Fare 데이터가 존재하지않습니다.');
							} else {
								pricingFormSubmit(null, emdData.Result.data, null, chkEmdAArray);	
							}
							
						}
					);
				}
				
				
			} else {
				commonNotice('Pricing 할 Ticket 혹은 EMDA를 선택해 주세요.');
			}
		}); 
		////Pricing 버튼 클릭 이벤트 end
		
		
		//국제선 티켓 테이블 생성
		function createIntTicketTbl() {
			$('#dcCodeTh').hide();
		
			var ticketHtml = '';
			var indexForCheck = 0;
			$.each(ticketBindedObj, function(ticketIndex, ticketData){
				$.each(ticketData, function(index, ticketDataBySeg){
					ticketHtml += createIntTicketTr(ticketDataBySeg, indexForCheck, index);
					indexForCheck++
				});
			});

			$('#ticketTbody').html(ticketHtml);
			
		}
		
		//국제선 티켓 테이블 TR 생성
		function createIntTicketTr(ticketData, indexForCheck, index) {
			var returnHtml = '';
			var isInf = ticketData.paxRPH.substring(0,1) == 'P';
			if (index == 0) {
				var rowspan = ' rowspan="'+Object.keys(segObj).length+'"';
				var ticketKey = isInf ? 'INF_'+ticketData.paxRPH.charAt(1)  : ticketData.paxRPH; 
				var paxNo = isInf ? 'INFT' : 'P'+ticketData.paxRPH;
				returnHtml += '<tr><td'+rowspan+'><span><input name="chk" id="select1-'+indexForCheck+'" type="checkbox" class="ticketCheck" checked ';
				returnHtml += 'ticketKey="'+ticketKey+'" paxType="'+ticketData.type+'" paxRPH="'+ticketData.paxRPH+'"><label for="select1-'+indexForCheck+'">&nbsp;</label></span></td>';
				returnHtml += '<td'+rowspan+'>'+paxNo+'</td>';
				returnHtml += '<td'+rowspan+'>'+ticketData.name+'</td>';
				returnHtml += '<td'+rowspan+'>'+ticketData.type+'</td>';
			}
			
			returnHtml += '<td>'+ticketData.depStn+'</td>';
			returnHtml += '<td>'+ticketData.arrStn+'</td>';
			returnHtml += '<td>'+ticketData.ticketNo+'</td>';

			returnHtml += '</tr>';
			
			return returnHtml;
		}
		
		
		//----------------국내선----------------
		//국내선 티켓테이블 생성
		function createDomTicketTbl() {
			
			var ticketHtml = '';
			$.each(ticketBindedObj, function(index, ticketData){
				
				ticketHtml += '<tr>';
				
				ticketHtml += '<td><span><input name="chk" id="select1-'+index+'" type="checkbox" class="ticketCheck" checked ';
				ticketHtml += 'ticketKey="'+ticketData.paxRPH+'_'+ticketData.segRPH+'" paxType="'+ticketData.type+'" paxRPH="'+ticketData.paxRPH+'" segRPH="'+ticketData.segRPH+'">';
				ticketHtml += '<label for="select1-'+index+'">&nbsp;</label></span></td>';	
				
				
				var paxNo = ticketData.type == 'INF' ? 'INFT' :'P'+ticketData.paxRPH
				ticketHtml += '<td>'+paxNo+'</td>';
				ticketHtml += '<td>'+ticketData.name+'</td>';
				ticketHtml += '<td>'+nullCheck(ticketData.dcCode)+'</td>';
				ticketHtml += '<td>'+ticketData.type+'</td>';
				ticketHtml += '<td>'+ticketData.depStn+'</td>';
				ticketHtml += '<td>'+ticketData.arrStn+'</td>';					
				ticketHtml += '<td>'+ticketData.ticketNo+'</td>';
				ticketHtml += '</tr>';
			});	
			
			//승객순으로 정렬
			var rows = $(ticketHtml);
		    
	        rows.sort(function(a,b){
	            var compare1 = $(a).children('td').eq(1).text().replace('P', '');
	            var compare2 = $(b).children('td').eq(1).text().replace('P', '');
	    
	            return compare1-compare2;
	        })
	    
	        $.each(rows, function(index, row){
	            $('#ticketTbody').append(row);
	        });
	        
			
		}
		
		//----------------국제,국내 공통----------------
		//EMD-A테이블 생성
		function createEMDATbl() {
			
			var emdAHtml = '';
			var chkIndex = 0;
			var emdType;
			if(emdAArr.length > 0) {
				emdAArr.forEach(function(emdA, emdIndex) {
					emdAHtml += '<tr>';
					emdAHtml += '<td><span> <input class="emdACheck" id="select2-'+chkIndex+'" chkIndex="'+chkIndex+'"type="checkbox" checked> <label for="select2-'+chkIndex+'">&nbsp;</label></span></td>';
					var name =  emdA.paxRPH+'. '+paxObj[emdA.paxRPH].lastName+'/'+paxObj[emdA.paxRPH].firstName;
					if(pnrData.routeType=='I') name += ' ' + nullCheck(paxObj[emdA.paxRPH].title);
					emdAHtml += '<td>'+name+'</td>';
		
					emdAHtml += '<td>'+emdA.segRPH+'. '+segObj[emdA.segRPH].depStn+' '+segObj[emdA.segRPH].arrStn+'</td>';
					emdAHtml += '<td>'+segObj[emdA.segRPH].flightNo+'</td>';
					emdAHtml += '<td>'+segObj[emdA.segRPH].depDate.dateFormat('DDMMMYY')+'</td>';
					
					if (pnrData.routeType != 'D') {
						emdAHtml += '<td>'+segObj[emdA.segRPH].bookingClass+'</td>';
					}
					
					emdAHtml += '<td>'+segObj[emdA.segRPH].airline+'</td>';
					emdAHtml += '<td>'+emdA.status+'</td>';
					emdAHtml += '<td>'+emdA.code+'</td>';
					emdAHtml += '<td>'+emdA.detail+'</td>';
					emdAHtml += '<td>'+emdA.emdTicketNo+'</td>';
					emdAHtml += '</tr>';
					chkIndex++;
				});
			} else {
				var colspan = pnrData.routeType == 'D' ? 10 : 11;
				emdAHtml += '<tr><td colspan = "'+colspan+'">선택한 EMD-A가 없습니다.</td></tr>'
			}
			
			$('#emdATbody').html(emdAHtml);
		}
		
		//EMD-S테이블 생성
		function createEMDSTbl() {
			
			var emdSHtml = '';
			
			if(pnrData.EMDS != null) {
				
				var paxNo;
				var airline;
				var status;
				var serviceCode;
				var ticketNo;
				
				var emdSSplitArr;
				var emdSSplitArr2;
				pnrData.EMDS.forEach(function(emdS) {
					emdSHtml += '<tr>';
					emdSSplitArr = emdS.text.split('/');
					emdSSplitArr2 = emdSSplitArr[0].split(' ');
					
					paxNo = emdSSplitArr.slice(-1)[0].replace('P', '');
					
					airline = emdSSplitArr2[1];
					status = emdSSplitArr2[3];
					
					serviceCode = emdSSplitArr[2];
					ticketNo = emdSSplitArr[6].split('.')[0];
					
					emdSHtml += '<td>'+paxNo+'. '+paxObj[paxNo].lastName+'/'+paxObj[paxNo].firstName+' '+nullCheck(paxObj[paxNo].title)+'</td>';
					emdSHtml += '<td>'+airline+'</td>';
					emdSHtml += '<td>'+status+'</td>';
					emdSHtml += '<td>'+serviceCode+'</td>';            
					emdSHtml += '<td>'+ticketNo+'</td>';
					emdSHtml += '</tr>';
				});
				
				
			} else {
				emdSHtml += '<tr><td colspan = "5">발급한 EMD-S가 없습니다.</td></tr>'
			}
			$('#emdSTbody').html(emdSHtml);
		}
		
		//pricing 후 pricing화면 submit
		function pricingFormSubmit(pricingData, emdPricingData, chkTicketArray, chkEmdAArray) {
			var currency = parent.officeList[$('select[name=officeList] option:selected').attr('officeIndex')].currency;
			if (pricingData != null) {
				currency = pricingData.viewCurrency;	
			}
			var submitData = JSON.stringify({
				'paxObj': paxObj,
				'segObj': segObj,
				'ticketBindedObj': ticketBindedObj,
				'chkTicketArray': chkTicketArray,
				'chkEmdAArray': chkEmdAArray,
				'pricingRs': pricingData,
				'emdPricingRs': emdPricingData,
				'routeType': pnrData.routeType,
				'bookingInfo': pnrData.bookingInfo,
				'officeInfo': parent.officeList[$('select[name=officeList] option:selected').attr('officeIndex')],
				'pricingDate': $('[name=pricingDate]').val(),   
				'viewCurrency': currency,
				'etcSSR': pnrData.etcSSR
			});
			
			$('#pricingData').val(submitData);
			
			$('#pricingForm').submit();
		}
		
		function setFareSearchData(chkTicketArray) {
			
			var fareSearchData = new Object();
			
			
			fareSearchData.paxType = 'ADT';
	        fareSearchData.officeInfo = parent.officeList[$('select[name=officeList] option:selected').attr('officeIndex')];
			fareSearchData.issueDate = $('[name=pricingDate]').val().dateFormat('YYYYMMDD');

			fareSearchData.passengerInfo = new Array();
			fareSearchData.segmentInfo = new Array();
			
			$('.ticketCheck:checked').each(function(idx, checkedtk) {
				
				var isAreadyPush = false;
				$(fareSearchData.passengerInfo).each(function(idx, passenger) {
					if ($(checkedtk).attr('paxRPH') == passenger.RPH) { //이미 push한 탑승객인경우
						isAreadyPush = true;
						return false;
					}
				});
				
				if (!isAreadyPush) {
					var key = $(this).attr('paxtype') == 'INF' ? 'INF_'+$(this).attr('paxRPH').charAt(1) : $(this).attr('paxRPH');
					fareSearchData.passengerInfo.push(paxObj[key]);
				}
				
				if (pnrData.routeType == 'D') {
					isAreadyPush = false;
					$(fareSearchData.segmentInfo).each(function(idx, segment) {
						if ($(checkedtk).attr('segRPH') == segment.RPH) { //이미 push한 탑승객인경우
							isAreadyPush = true;
							return false;
						}
					});
					
					if (!isAreadyPush) {
						fareSearchData.segmentInfo.push(segObj[$(this).attr('segRPH')]);
					}
				}
			});
			
			if (!fareSearchData.segmentInfo[$(this).attr('segRPH')] && pnrData.routeType == 'I') {
				var segIndex = 0;
				
				$.each(segObj, function(index, seg){
					fareSearchData.segmentInfo[segIndex] = seg;
					segIndex++;
				});
			}
			
			fareSearchData.etcSSR = pnrData.etcSSR;
			
			return fareSearchData;
			
		}
		
		function setEmdSearchData(chkEmdAArray, pricingRs) {
			
			if(chkEmdAArray.length > 0) {

				var emdInfoData = new Object();
				emdInfoData.segmentInfo = $.map(segObj, function(arrValue) {return arrValue;}); //object -> array
				emdInfoData.passengerInfo = $.map(paxObj, function(arrValue) {return arrValue;}); //object -> array
				emdInfoData.issueDate = $('[name=pricingDate]').val().dateFormat('YYYYMMDD');
				emdInfoData.currency = parent.officeList[$('select[name=officeList] option:selected').attr('officeIndex')].currency;
				emdInfoData.language = parent.officeList[$('select[name=officeList] option:selected').attr('officeIndex')].country2c;
				
				if (pricingRs != null) {
					emdInfoData.currency = pricingRs.viewCurrency;	
				}
				
				emdInfoData.emdInfo  = chkEmdAArray;
			}
			
			return emdInfoData;
		}
			
		//bundle은 bundle객체당 pax가 여러개 나와서 emdA의 paxRPH마다 하나씩 EMDA Object 생성
		function setEMDAData(emdA, paxRPH) {
			
			var emdAData = new Object();
			var emdACode;
			
			if(MEALCODES.indexOf(emdA.code) != -1) {
				emdACode = '0B3';
			} else if (BAGCODES.indexOf(emdA.code) != -1) {
				emdACode = '0AA';
				emdAData.bagPaidCount = emdA.quantity;
			} else if (BUNDLEV.indexOf(emdA.code) != -1) {
				emdACode = '0II';
			} else if (BUNDLEP.indexOf(emdA.code) != -1) {
				emdACode = '0H6';
			} else if (BUNDLEU.indexOf(emdA.code) != -1) {
				emdACode = '';
			}
			
			emdAData.segRPH = emdA.refSegRPH[0];
			emdAData.paxRPH = paxRPH;
			emdAData.code = emdA.code;
			emdAData.status = emdA.status;
			
			var detailText = emdA.text;
			if (!emdA.text) detailText = emdA.codeDesc;
			
			emdAData.detail = detailText;
			
			if (emdTicketObj[emdACode+"_"+emdAData.segRPH+"_"+emdAData.paxRPH]) {
				emdAData.emdTicketNo = emdTicketObj[emdACode+"_"+emdAData.segRPH+"_"+emdAData.paxRPH].text.split('/')[5].replace('C1', '').replace('C2', '');
			} else {
				emdAData.emdTicketNo = '';	
			}
			
			return emdAData;
		}
			
		 //function end
			