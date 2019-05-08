package infolayers.frontend.service;

import java.security.Principal;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import infolayers.frontend.model.Usuario;
import infolayers.frontend.repository.RolHasPermisosRepository;
import infolayers.frontend.repository.UserRepository;

@Service
public class PermisosService {

	@Autowired
	RolHasPermisosRepository rolHasPermisosRepository; 

	@Autowired
	private UserRepository userRepository;
	
	public Map<String,Object> getAllPermisosByRol(Principal principal){
		Usuario u=userRepository.findByUser(principal.getName());
		
		return rolHasPermisosRepository.findPermisosByRol(u.getIdRol());
		
	}
}
