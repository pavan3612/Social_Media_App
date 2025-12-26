package com.example.demo.controller;

import org.springframework.web.bind.annotation.*;

@RestController

public class HomeController {
	@GetMapping("/home")
	public String homeControllerHandler() {
		return "this is home page"; 
	}
}
