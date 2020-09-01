package com.example.demo;

import java.util.Arrays;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.codehaus.jackson.map.util.JSONPObject;
import org.codehaus.jackson.map.util.JSONWrappedObject;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import net.sf.json.JSONObject;


@Controller
public class BootStrapController {
	
	
	@RequestMapping(value="/")
    public String test() {
		
		return "bootMain";                
    }  
	
	@RequestMapping(value="/bootMainJson")
    public ModelAndView bootMainJson() {
		
		ModelAndView mv = new ModelAndView("jsonView");
		
		JSONObject JSONResponse = new JSONObject();
		
		JSONResponse.put("father","kimminhan");
		JSONResponse.put("mother","shimtaemin");
		
		mv.addAllObjects(JSONResponse);
		
		return mv;                
    }  
	
	
}
