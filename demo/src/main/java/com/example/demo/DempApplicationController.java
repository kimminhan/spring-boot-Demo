package com.example.demo;

import java.util.Arrays;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;


@Controller
public class DempApplicationController {
	
	
	@RequestMapping(value="/")
    public String test() {
		
		return "test";                
    }     
	
	//받은 입력값 출
	@RequestMapping(value="/cal")
    public ModelAndView testCal(HttpServletRequest request, ModelMap model) {
		
		//texetarea 입력값 
		String strInputTxt = request.getParameter("strInputTxt");
		//출력묶음 단위 
		String strGroupCnt = request.getParameter("strGroupCnt");
		//String strGroupCnt = "4";
		int intQuotient = 0;
		int intRemainder = 0;
		//최종 출력값 
		StringBuffer sbOutput = new StringBuffer();
		
		try {
			
			//숫자만 받기 
			String[] arrNum = strInputTxt.replaceAll("[^0-9]", "").split("");
			//문자만 받기 
			String[] arrChar = strInputTxt.replaceAll("[^a-zA-Z]", "").split("");
			
			//숫자 정렬 
			Arrays.sort(arrNum);
			//문자 정렬 
			Arrays.sort(arrChar, String.CASE_INSENSITIVE_ORDER);
			
			int intArrNumLength = arrNum.length;
			int intArrCharLength = arrChar.length;
			int intTotalLength = 0;
			
			if(arrNum[0] == null || arrNum[0].equals("")) {
				intArrNumLength = 0;
			}
			if(arrChar[0] == null || arrChar[0].equals("")) {
				intArrCharLength = 0;
			}
			
			intTotalLength = intArrNumLength + intArrCharLength;
			
			//UI에서 받을값 
			int intGroupCnt = Integer.parseInt(strGroupCnt);
			
			//나누기 숫자 비교 
			if(intTotalLength >= intGroupCnt) {
				
				intQuotient = intTotalLength / intGroupCnt;
				intRemainder = intTotalLength % intGroupCnt;
			}else {
				System.out.println("나누기 불가 !!!");
			}
			
			for(int i=0; i < intTotalLength; i++) {
		    	if(intArrNumLength > i) {
		    		sbOutput.append(arrNum[i]);
			    }
		    	if(intArrCharLength > i) {
		    		sbOutput.append(arrChar[i]);
			    }
		    } 
		    
		} catch (Exception e) {
			// TODO: handle exception
		}
		
		model.addAttribute("strInputTxt", sbOutput.toString());	
		model.addAttribute("strGroupCnt", strGroupCnt);	
		model.addAttribute("quotient", intQuotient);
		model.addAttribute("remainder", intRemainder);
		
		return new ModelAndView("test", model);          
    }  
	
	//정렬 평
	public String Sort(String inParam) {
		
		return inParam;
		
	}
}
