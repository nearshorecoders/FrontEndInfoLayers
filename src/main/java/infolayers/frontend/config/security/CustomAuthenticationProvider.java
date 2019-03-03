package infolayers.frontend.config.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Component;

import infolayers.frontend.model.Usuario;
import infolayers.frontend.repository.UserRepository;

@Component
public class CustomAuthenticationProvider implements AuthenticationProvider {

	@Autowired
	private UserRepository userRepository;
	
	@Override
	public Authentication authenticate(Authentication authentication) throws AuthenticationException {

		final String usuario = authentication.getName();
	    final String contrasena = authentication.getCredentials().toString();
	    
	    Usuario u = userRepository.findByUsername(usuario);
	    
		if(u != null && Encryption.comparePassword(contrasena,u.getPassword())) {
			
			Authentication auth = new UsernamePasswordAuthenticationToken(u, authentication.getCredentials(),
					u.getGrantedAuthorities());
			
			return auth;
		}
		
		throw new BadCredentialsException("Credenciales Invalidas");
	}

	@Override
	public boolean supports(Class<?> authentication) {
		return authentication.equals(UsernamePasswordAuthenticationToken.class);
	}	

}
