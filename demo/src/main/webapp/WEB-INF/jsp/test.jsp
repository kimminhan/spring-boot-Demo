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
		<div>입력</div>
		<div><textarea id="strInputTxt" name="strInputTxt" rows="10" cols="100">${strInputTxt}</textarea></div> 
		<div>출력묶음 단위 <input name="strGroupCnt" id="strGroupCnt" value="${strGroupCnt}"></div>
		<br>
		<div>출 력  <input type="button" id="btn_goCal" onclick="goCal()"><i></i></div>
		<br>
		<div id="quotient">몫 : ${quotient}</div>
		<br>
		<div id="remainder">나머지 : ${remainder}</div>
		<br>
	</form>
</body>
</html>