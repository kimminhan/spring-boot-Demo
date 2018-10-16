package com.example.demo;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;
import org.springframework.web.servlet.view.json.MappingJackson2JsonView;

@Configuration
public class StaticResourceConfiguration extends WebMvcConfigurerAdapter {
  private static final String[] CLASSPATH_RESOURCE_LOCATIONS = { 
      "classpath:/resources/", 
      "classpath:/static/", 
      "classpath:/public/" };
  
  @Override
  public void addResourceHandlers(ResourceHandlerRegistry registry) {
    if (!registry.hasMappingForPattern("/**")) {
      registry.addResourceHandler("/**").addResourceLocations(
          CLASSPATH_RESOURCE_LOCATIONS);
    }
  }
  
  @Bean
  MappingJackson2JsonView jsonView() {
    return new MappingJackson2JsonView();
  }
  
}