package infolayers.frontend.repository;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.sql.DataSource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import infolayers.frontend.model.Rol;


@Repository
public class RolRepository {
	
    private static final Logger LOGGER = LoggerFactory.getLogger(RolRepository.class);

    private JdbcTemplate jdbcTemplate;

    @Autowired
    @Qualifier("exchangeDS")
    public void setDataSource(DataSource dataSource) {
        this.jdbcTemplate = new JdbcTemplate(dataSource);
    }
    
    @Transactional(readOnly=true)
    public List<Rol> listarRolesDisponibles() {
        try {

        	String query = "SELECT * FROM rol ";
        	List<Rol> roles = new ArrayList<Rol>();
        
        	List<Map<String, Object>> map = jdbcTemplate.queryForList(query);
        	for (Map row : map) {
        		Rol rol = new Rol();
        		rol.setIdrol((Integer)row.get("idRol"));
        		rol.setNombre((String)row.get("nombre"));
        		rol.setDescripcion((String)row.get("descripcion"));
        		roles.add(rol);
        		
        	}  

        	return roles;
        }catch (Exception e){
        	LOGGER.error("Error", e);
            throw e;
        }
    	
    }
    
}
