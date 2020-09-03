<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>

<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<title>Test</title>
	<script type="text/javascript" src="/js/jquery-3.3.1.js" ></script>
	<script type="text/javascript" src="/js/jquery-ui.js" ></script>
	<script type="text/javascript" src="/js/jquery.utils.js" ></script>
	<script type='text/javascript'>
	
		$(document).ready(function(){
		});
	
		function goCal(){
			document.testForm.action = "/cal";
			document.testForm.method = "post";
			document.testForm.submit();
		}
		
		
	</script>
	
</head>
<body>
	<form name="testForm" id="testForm">	
		<div>BootMain</div>
		<br>
		<div>김태연 사랑해요!! 두번 사랑해요</div>
	</form>
</body>
</html>
