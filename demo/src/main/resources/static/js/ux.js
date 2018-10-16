$(function(){
	$("#iframe1").on("load",function(){
		$(window).scrollTop(0);
	});
	
	/* table row hover event [s] */
	
	$(".board-content tbody").find("tr>td").hover(
		function(){
			
			var $this = $(this), $thisTr = $this.parent(), $brdTr = $this.parent().parent().children("tr"); 
			var colCnt = $thisTr.parent().parent().find("colgroup col").length;
			var oRowInf= getRowInf($brdTr, $thisTr, colCnt); // {rSpan:해당 행에 속하는 rowspan 속성,trIdx:해당 행에 속하는 rowspan속성이 포함된 행 인덱스};
			
			if ($this.parent().parent().parent().find("table").length || $this.parent().parent().parent().parent(".ot_view").length) {return;}
			
			if (oRowInf.rSpan) {
				for (var idx = oRowInf.trIdx,d = oRowInf.trIdx+oRowInf.rSpan;idx < d;idx++) {
					$brdTr.eq(idx).find("td").addClass("hover");
				}
			} else {
				$thisTr.children("td").addClass("hover");
			}
			
			function getRowInf($tr, $t, colCnt) { // $tr : 리스트 전체 행들, $t : 마우스로 선택한 행, colCnt: 테이블의 총 열 개수 
				
				var rspan = 0,tridx = 0;
				
				for (var i = $t.prevAll().length, c = -1;i > c;i--) {
					
					var $tmp = $tr.eq(i).children("td");
					if ($tmp.length === colCnt) {
						tridx = $tr.index($tr.eq(i));
						
						for (var j = 0,cnt = $tmp.length;j < cnt;j++) {
							var r = parseInt(($tmp.eq(j).attr("rowspan") || "0"),10);
							rspan = (rspan >= r) ? rspan : r;
						}
						break;
					}
				}
				return {rSpan:rspan,trIdx:tridx};
			}
		},
		function() {
			
			var $this = $(this);
			
			if ($this.parent().parent().parent().find("table").length || $this.parent().parent().parent().parent(".ot_view").length) {return;}
			
			$this.parent().parent().find("td").removeClass("hover");
		}
	);
	/* table row hover event [e] */

	/* layout (gnb, iframe, snb) */
	$(".gnb li a,.sidebar li .snbmenu").click(function(){
		$(this).parent().addClass("current").siblings().removeClass("current");
	});

	/* side menu */
	var $sideLi = $("#sidebar li"),
		$sideMenu = $sideLi.children("a"),
		$subView = $sideLi.children(".snbView");
	
	$sideMenu.click(function(e){
		var $this = $(this),
			$sub = $this.siblings(".snbView");
		var duration = 400;

		var sideClss = "active", sideTitClss = "current";
		
		if ($sub.is(":hidden")) {
			$sideMenu.removeClass(sideClss);
			$this.addClass(sideClss);
			$subView.stop(true,true).slideUp(duration);
			$sub.stop(true,true).slideDown(duration);
		} else {
			$this.removeClass(sideClss).parent().removeClass(sideTitClss);
			$sub.stop(true,true).slideUp(duration);
		} 
		e.preventDefault();
	});
	
	$(".t_menu","#sidebar").find("a").click(function(e){
		var $this = $(this),
			$cont = $this.parent().parent().parent();
		
		if ($cont.hasClass("side_history")) {
			$(".side_payment","#sidebar").show(); $cont.hide();
		} else if ($cont.hasClass("side_payment")) {
			$(".side_history","#sidebar").show(); $cont.hide();
		}
		e.preventDefault();
	}).eq(1).click();
	
	$(".side_approval_cancel button","#sidebar").click(function(e){ // 2차 사이드바 메뉴 관련
		var $this = $(this),
			$btns = $this.siblings("button").add($this);
		
		$btns.removeClass("gray");
		$this.addClass("gray");
		
		return false;
	});
	
	/* 18.08.21 [s] */
	$(".side_history .link_ftype,.side_payment .link_ftype","#sidebar").click(function(e){ // 2차 사이드바 메뉴 관련
		$(this).parent().siblings("dd").find("ul").show();
		e.preventDefault();
	});
	/* 18.08.21 [e] */
	
	/* common */
	$("#tab-select").on("change", function() {
		var target = $(this).val();

		$(this).parent().parent().parent().find(".tab-contents").hide();
	    $(target).show();
	}).change();
	
	if ($(".all_chk").length) {
		var $allchk = $(".all_chk"); 
		$allchk.find(".ip_all_chk").click(function(){
			var $this = $(this),
				$chk = $this.parent().parent().parent().parent().parent().find("input:checkbox").not($this);
			if ($this.prop("checked")) {
				$chk.prop("checked",true);
			} else {
				$chk.prop("checked",false);
			}
		});
		
		$allchk.find("input:checkbox").not(".ip_all_chk").click(function(){
			var $this = $(this),
				$chk = $(this).parent().parent().parent().parent().find("input:checkbox"),
				$all = $chk.end().parent().find(".ip_all_chk");
			
			if ($chk.length === $chk.filter(":checked").length) {
				$all.prop("checked",true);
			} else {
				$all.prop("checked",false);
			}
			
		});
	}
	
	if ($(".all_chk2").length) {
		var $allchk = $(".all_chk2"); 
		$allchk.find(".ip_all_chk2").click(function(){
			var $this = $(this),
				$chk = $this.parent().parent().find(".ip_chk2");
			
			if ($this.prop("checked")) {
				$chk.prop("checked",true);
			} else {
				$chk.prop("checked",false);
			}
		});
		
		$allchk.find(".ip_chk2").click(function(){
			var $this = $(this),
				$chk = $(this).parent().parent().parent().find(".ip_chk2"),
				$all = $chk.end().find("ip_all_chk2");
			
			if ($chk.length === $chk.filter(":checked").length) {
				$all.prop("checked",true);
			} else {
				$all.prop("checked",false);
			}
		});
	}
	
	if ($(".sData").length) {
		
		$.datepicker.setDefaults({
			showOn: "button",
			buttonImage: "../images/btn_diary.gif",
			buttonImageOnly: true,
			dateFormat : "ddMy",
			monthNamesShort: ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"]	
		});
		
		$(".sData").datepicker();
	}
	
	$(".delete_btn2").click(function(){
		$(this).parent().parent().hide();
		return false;
	});
	
	$(".tablink").find("a").click(function(e){

		var $this = $(this);
		$this.parent().parent().find("a").removeClass("current");
		$this.addClass("current");
		e.preventDefault();
	});
	
	/* Availability */
	if ($(".labelset input:radio").length) {
		var $rdo = $(".labelset input:radio");
		$rdo.click(function() {
			var $this = $(this);
			$rdo.not(":checked").parent().find(".countryset").hide();
			$rdo.filter(":checked").parent().find(".countryset").show();
		});
		
		if (!$rdo.filter(":checked").attr("onclick")) {
			$rdo.parent().parent().find("input:radio").first().click();
		}
	}
	
	$("input:radio").filter(".muity,.one,.round").click(function() {			
		if($(this).hasClass("muity")) {
			$(".open_segment01").hide();
		} else {
			$(".open_segment01").show();
		}		
	});
	
	$(".btn_add_typ1").on("click",function() {
		var arrRow = [
			'<tr>',
				'<td class="contents">',
					'<p class="intbox"><input type="text"></p>',
				'</td>',
				'<td class="delete_btn"><input type="button" value="" class="btn_del_row"></td>',
			'</tr>'
		];
		
		var html = arrRow.join('');
		
		$(html).appendTo($(".tbl_add_typ1").find("tbody"))
				.find(".btn_del_row").click(function(e){
					$(this).parent().parent().remove();
				});
	});
	
	$('.ticketArrange .sel_tckt_arrgn').change(tickerArrangeEvt);
	
	function tickerArrangeEvt(){
		var $this = $(this), 
			$ip = $this.parent().parent().parent().find("input:text,select").not(".sel_tckt_arrgn"),
			$iconCal = $ip.filter(".sData").siblings();
		var val = $.trim($this.find("option:selected").text().toLowerCase());
		
		if (val === "timelimit auto cancel") {
			
			$ip.show();
			$iconCal.show();
		} else if (val === "airport ticket") {
			
			$ip.hide().filter(".ip_office").show();
			$iconCal.hide();
		} else if (val === "ticketed") {
			
			$ip.hide().filter(".ip_text").show();
			$iconCal.hide();
		} else if (val === "timelimit") {
			
			$ip.show();
			$iconCal.show();
		}
	}
	
	$(".btn_add_typ4").on("click",function() {
		var arrRow = [
			'<tr>',
				'<td>',
					'<div><select class="sel_tckt_arrgn">',
						'<option value="Timelimit Auto Cancel" selected>&nbsp;Timelimit Auto Cancel</option>',
//						'<option value="Airport Ticket">&nbsp;Airport Ticket</option>',
//						'<option value="Timelimit">&nbsp;Timelimit</option>',
						'<option value="Ticketed">&nbsp;Ticketed</option>',
					'</select></div>',
				'</td>',
				'<td><input type="text" class="w70p ip_time" value=""></td>',
				'<td>',
					'<div><select class="sel_date_opt">',
						'<option>&nbsp;Date</option>',
						'<option>&nbsp;Days from now</option>',
						'<option>&nbsp;Days prior departure</option>',
					'</select></div>',
				'</td>',
				'<td><input type="text" class="w70p sData" value=""></td>',
//				'<td><input type="text" class="w70p ip_office" value=""></td>',
				'<td><input type="text" class="w80p ip_text" value=""></td>',
				'<td class="bo-left"><input name="btnRemove" type="button" value="" class="delete_btn"></td>',
			'</tr>'
		];
         
		var html = arrRow.join('');
		
		$(html).appendTo($(".tbl_add_typ4").find("tbody"))
				.find(".delete_btn").click(function(e){
					$(this).parent().parent().remove();})
				.end().find(".sel_tckt_arrgn").change(tickerArrangeEvt)
				.end().find(".sData").datepicker();

	});
	
	/* payment */
	$(".sel_currency","#sidebar").change(function(){
		var $this = $(this), $cvc = $(".txt_cvc,.ip_cvc","#sidebar").filter("input").val("").end()
			$card = $(".wrap_cardholder","#sidebar"), $ars = $(".wrap_ars","#sidebar"), $krw = $(".wrap_paykrw","#sidebar")
		var txt = $.trim($this.children("option:selected").text().toLowerCase());
		
		if (txt === "krw") {
			$cvc.hide();$card.hide();$krw.hide();$ars.show();
		} else if (txt === "jpy") {
			$cvc.show();$ars.show();$card.hide();$krw.hide();
		} else {
			$cvc.show();$card.show();$ars.hide();$krw.show();
		}
	}).change();
	
	/* sidebar tab */
	$(".tab_area .tab li","#sidebar").click(function(){
		var $this = $(this),
			$tabArea = $this.parent().parent().parent(".tab_area");
			$li = $(".tab li",$tabArea).removeClass("current").filter($this).addClass("current").end();
		var idx = $li.index($this); 
		$(".tabview",$tabArea).hide().eq(idx).show();
	});
	
	/* auth */
	$(".board-content .link_info","#sidebar").click(function(e){
		var $this = $(this);
		
		$this.parent().parent().parent().find("tr").removeClass("active");
		$this.parent().parent().addClass("active");
			   
		e.preventDefault();
	});
	
	/* login */
	$(".login_box").find("input:text,input:password").focus(function(){
		$(".input_box").removeClass("current");
		$(this).parent().addClass("current");
	});	
	
	$(".sel_contact",".tbl_add_typ2").change(contactDtlsEvt);
	
	function contactDtlsEvt() {
		var $this = $(this),
			$ip = $this.parent().parent().parent().find("input:text");
		var txt = $.trim($this.children("option:selected").text().toLowerCase()); 
	
		if (txt === "phone") {
			$ip.show();
		} else if (txt === "email") {
			$ip.filter(".ip_addr").show().end().not(".ip_addr").hide();
		} else if (txt === "fax") {
			$ip.show().filter(".ip_name").hide();
		}
	}

	$(".btn_add_typ2").click(function(){
		var arrRow = [
			'<tr>',
				'<td><div class="s-w80p"><select class="sel_contact"><option selected>&nbsp;Phone</option><option>&nbsp;Email</option><option>&nbsp;Fax</option></select></div></td>',
				'<td><input type="text" class="w70p ip_city" value=""></td>',
				'<td><input type="text" class="w80p ip_addr"></td>',
				'<td><input type="text" class="w70p ip_name"></td>',
				'<td class="bo-left"><input class="delete_btn2 btn_del_row" type="button" value=""></td>',
			'</tr>'
		];

		var html = arrRow.join('');
		
		$(html).appendTo($(".tbl_add_typ2").find("tbody"))
				.find(".btn_del_row").click(function(e){
												$(this).parent().parent().remove();})
				.end().find(".sel_contact").change(contactDtlsEvt);
	});
	
	$(".btn_add_typ3").click(function(){
		var arrRow = [
			'<tr>',
				'<td><input type="text" value="" class="w100"></td>',
				'<td><input type="text" value="" class="w100"></td>',
				'<td><input type="text" value="" class="sData"></td>',
				'<td><input type="text" value="" class="w100"></td>',
				'<td><input type="text" value="" class="w100"></td>',
				'<td><input type="text" value="" class="w100"></td>',
				'<td><input type="text" value="" class="w100"></td>',
				'<td class="bo-left"><input class="delete_btn2 btn_del_row" type="button" value=""></td>',
			'</tr>'
		];
		
		var $this = $(this); 
		var html = arrRow.join('');
		
		$(html).appendTo($this.parent().siblings(".tbl_add_typ3").find("tbody"))
				.find(".btn_del_row").click(function(e){
											$(this).parent().parent().remove();})
				.end().find(".sData").datepicker();
		
		return false;
	});
	
	$(".open_segment01,.open_segment02").click(function(){
		var $segView1 = $(".segment_view01"), $segView2 = $(".segment_view02");
		if ($(this).hasClass("open_segment01")) {
			$segView1.show().find(".fare_view").hide();
			$segView2.hide();
		} else {
			$segView2.show().find(".fare_view").hide();
			$segView1.hide();
		}		
		return false;
	});	
	
	/* search */
	$(".sel_tab_cont").change(function(){
		var idx = $(this).prop("selectedIndex");
		$(".box_tab_cont").hide().eq(idx).show();		
	}).change();
	
	$(".mloption").find(".radio3-ml,.radio2-ml,.radio1-ml").click (function(e){
		var $this = $(this), $tapArea = $('.tabWrap'), $listArea = $('.pnrlist_view2'); 
		if ($this.hasClass("radio3-ml")) {
			$tapArea.show();
			$listArea.hide();
		} else if ($this.hasClass("radio2-ml")) {
			$tapArea.hide();
		} else if ($this.hasClass("radio1-ml")) {
			$tapArea.hide();
			$listArea.hide();
		}		
	});
	
	/* modify */
	$(".add_xbag").find("input:button").click(function(){
		var $this = $(this),
			$ip = $this.siblings(".ip_cnt");
		
		var val = $.trim($ip.val()),
			cnt = parseInt((!!val ? val : "1") ,10);
		
		if ($this.hasClass("btn_plus")) {
			$ip.val(cnt+1);
		} else if ($this.hasClass("btn_minus")) {
			$ip.val(cnt > 1 ? (cnt-1) : "1");
		}
	});
	
	$(".modify_act").click(function(){
		$(this).toggleClass("orange");
		$(".btn_modify").toggleClass("on");
		$(".disable_tab").toggle();
		return false;
	});
	
	$(".descending").click(function(){
		$(this).toggleClass("ascend");
		return false;
	});
	
	$(".seat-map li").click(function(){
		$(this).toggleClass("select");
		return false;
	});
});

$(function() {
	
	function openAlert(o) {
		var tit = o.title || "Notice",
			msg = o.message || "";
		
		var html = $("#layer_frame")[0].innerHTML.replace(/\{\{title\}\}/g,tit).replace(/\{\{message\}\}/g,msg);
		$(html).appendTo("body").show();
	}
	
	
	/* layer popup */
	$(".layer .chk_cnt").find("input:checkbox").click(function(){
		var $chk = $(".layer .chk_cnt").find("input:checkbox"),
			$txt = $(".layer .txt_alert");
		
		if ($chk.filter(":checked").length >= $chk.length) {
			$txt.css("visibility","visible");
		} else {
			$txt.css("visibility","hidden");
		}
	});
	
	$(".notice").click(function(){$(".noticelayer").show();return false;});
	
	$(".code_search").click(function(){$(".codelayer").show();});
	
	$(".int_sserch button").filter(".ffp,.discount").click(function(){
		if ($(this).hasClass("ffp")) {
			$(".ffplayer").show();
		} else {
			$(".discountlayer").show();
		}
	});
	
	$(".age_calculator").click(function(){$(".agelayer").show();return false;});
	
	$(".layerclick").click(function(){$(".farelayer").show();return false;});
	
	$(".umrulebtn").click(function(){$(".umrulelayer").show();return false;});
	
	$(".btn_close,.buttons button",".dim40").click(function(){$(".dim40").hide();});
	
	$(".ownership").find("a").click(function(e){$(".ownershiplayer").show();e.preventDefault();});
	
	$(".tab_hitory,.tab_split,.tab_qsend,.tab_cancel,.tab_receit").find("a").click(function(e){
		var clss= $(this).parent().attr("class"), prefix = clss.substring(clss.indexOf("_")+1);				
		$('.'+prefix+'layer').show(); //hitorylayer, splitlayer ..
		e.preventDefault();
	});
		
	$(".add_service .btn_close").click(function(e){
		$(this).parent().parent().hide();
		e.preventDefault();
	});
	
	$(".repricing").click(function(){$(".repricinglayer").show();return false;});
	
	$(".manual").click(function(){$(".manuallayer").show();return false;});	
	
	$(".sel_ssr").change(function(){
		var $this = $(this), $direct = $(".direct"); 
		var selector = ".add_content".concat($this.children("option:selected").attr("data-select"));
		
		if (selector === ".add_content11") {
			$direct.show();
		} else {
			$direct.hide();
		}
		
		$(".tab_cont").hide();
		$(selector).show();
		
	}).change();
	
	$(".btn_exTkt .down,.btn_exTkt .up").click(function(e){
		var $this = $(this),
			$nxt = $this.parent().parent().parent().next().next().find(".exTkt_view");
		
		if ($this.hasClass("down")) {
			$this.attr("class","up");
			$nxt.show();
		} else {
			$this.attr("class","down");
			$nxt.hide();
		}
		
		e.preventDefault();
	});
	
	$(".fr_head .repricing").click(function(){
		var $this = $(this),
			$inner = $(".inner_repricing");
		
		if ($inner.is(":hidden")) {
			$this.removeClass("off").addClass("on");
			$inner.show();
		} else {
			$this.removeClass("on").addClass("off");
			$inner.hide();
		} 
	});
	
	$(".inner_repricing .btn_hide").click(function(e){
		$(".fr_head .repricing").click();
		return false;
	});
});
