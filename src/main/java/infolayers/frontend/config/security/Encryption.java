package infolayers.frontend.config.security;

import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Component;

@Component
public class Encryption {

	public static String buildHashPassword(String password) {
        String salt = BCrypt.gensalt();
        String hash = BCrypt.hashpw(password, salt);
        return hash;
    }
	
	public static boolean comparePassword(String plaintext, String hashed) {
        try {
            return BCrypt.checkpw(plaintext, hashed);
        } catch (IllegalArgumentException e) {
            e.printStackTrace();
            return false;
        }
    }
}
