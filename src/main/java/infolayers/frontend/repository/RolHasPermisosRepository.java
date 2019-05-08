package infolayers.frontend.repository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.sql.DataSource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.dao.IncorrectResultSizeDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;


@Repository
public class RolHasPermisosRepository {
	
    private static final Logger LOGGER = LoggerFactory.getLogger(UserRepository.class);

    private JdbcTemplate jdbcTemplate;

    @Autowired
    @Qualifier("exchangeDS")
    public void setDataSource(DataSource dataSource) {
        this.jdbcTemplate = new JdbcTemplate(dataSource);
    }
    

    @Transactional(readOnly=true)
    public Map<String, Object> findPermisosByRol(Integer idRol) {
        try {
        	String query = "SELECT b.* FROM rol_has_permisos as a inner join permisos as b on a.permisos_idpermisos=b.idpermisos WHERE a.rol_idrol = ?";
        	
        	List<Map<String, Object>> list = jdbcTemplate.queryForList(query,new Object[]{idRol});
        	Map<String, Object> map = new HashMap<String, Object>();
        	map.put("menuContent", list);
        	
        	return map;
        }catch (Exception e){
        	LOGGER.error("Error", e);
            throw e;
        }
    	
    }
    
}
