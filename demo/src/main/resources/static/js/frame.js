$(function() {  //gnb, sidebar 클릭시 스타일 현재 상태 스타일링을 위한 시연용 스크립트 입니다. 구현시 삭제 필요
  $('nav.gnb li a, aside.sidebar li a').click(
    function() {
      $(this).parent().toggleClass('current').siblings().removeClass("current");
    }
  );
});


/* SNB Accordion Menu */
$(function() {
	var accordion_head = $('#sidebar .snb > li > a'),
		accordion_body = $('#sidebar .snb li > div.snbView');
		accordion_head.on('click', function(event) {			
			if(!$(this).hasClass("nosub")){
				event.preventDefault();
			}
	if ($(this).attr('class') != 'active'){
			accordion_body.slideUp('normal');
			$(this).next().stop(true,true).slideToggle('normal');
			accordion_head.removeClass('active');
			$(this).addClass('active');
			$(this).next().show();
		} else {
			$(this).removeClass('active');
			$(this).next().hide();
		}
	});

});
