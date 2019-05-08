package infolayers.frontend.controllers;

import java.security.Principal;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import infolayers.frontend.service.PermisosService;


@Controller
//@RequestMapping(value = "/businesstools")
public class HomeController {

	@Autowired
	PermisosService permisosService;
	
//    @GetMapping("/")
//    public String home1() {
//        return "/login";
//    }

    @GetMapping("/home")
    public String home() {
        return "/layout";
    }

    @GetMapping("/usuarios")
    public String usuarios() {
        return "/usuarios";
    }
    
    @GetMapping("/dashboard")
    public String dashboard() {
        return "/dashboard";
    }
    
    @GetMapping("/ventas")
    public String ventas() {
        return "/ventas";
    }
    
    @GetMapping("/reporteVentas")
    public String reporteVentas() {
        return "/reporteVentas";
    }
    @GetMapping("/caja")
    public String caja() {
        return "/caja";
    }
    @GetMapping("/config")
    public String configuracion() {
        return "/config";
    }   
    @GetMapping("/reporteInventario")
    public String reporteInventario() {
        return "/reporteInventario";
    }
    
    @GetMapping("/administrarMesas")
    public String administrarMesas() {
        return "/administrarMesas";
    }
    
    @GetMapping("/asignarMesas")
    public String asignarMesas() {
        return "/asignarMesas";
    }
    
    @GetMapping("/productos")
    public String productos() {
        return "/productos";
    }
    
    @GetMapping("/clientes")
    public String clientes() {
        return "/clientes";
    }
    
    @GetMapping("/admin")
    public String admin() {
        return "/admin";
    }

    @GetMapping("/user")
    public String user() {
        return "/profile";
    }

    @GetMapping("/about")
    public String about() {
        return "/about";
    }

    @PostMapping("/login")
    public String login2() {
    	return "redirect:/";
    }

    @GetMapping("/403")
    public String error403() {
        return "/error/403";
    }
    
	@RequestMapping(value = "/")
	public String index(Model model) {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		
		if (!(auth instanceof AnonymousAuthenticationToken)) {
			return "redirect:/home";
		}
		return "/login";
	}
	
	@RequestMapping(value = "/login")
	public String login(final Model model) {
		return "redirect:/";
	}
	
	@RequestMapping(value = "/getMainMenu",method = RequestMethod.GET)
	public ResponseEntity<?> getMenu(Principal principal) {
		 return new ResponseEntity<Map<String,Object>>(permisosService.getAllPermisosByRol(principal),HttpStatus.OK);
	}
	 
	
}