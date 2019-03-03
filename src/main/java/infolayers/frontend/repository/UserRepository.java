package infolayers.frontend.repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.sql.DataSource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.dao.IncorrectResultSizeDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import infolayers.frontend.config.security.Encryption;
import infolayers.frontend.model.Usuario;



@Repository
public class UserRepository {

    private static final Logger LOGGER = LoggerFactory.getLogger(UserRepository.class);

    private JdbcTemplate jdbcTemplate;
    
    @Autowired
    Encryption encryption;
    
    
    @Autowired
    @Qualifier("exchangeDS")
    public void setDataSource(DataSource dataSource) {
        this.jdbcTemplate = new JdbcTemplate(dataSource);
    }
    
    @Transactional(readOnly=true)
    public Usuario findByUsername(String usuario) {
    	Usuario us = null;
    	try {
    		us = jdbcTemplate.queryForObject("SELECT * FROM usuarios WHERE email = ?", 
        			new Object[]{usuario}, new UsuarioRowMapper());    		
    	} catch(IncorrectResultSizeDataAccessException e) {
    		LOGGER.error("Invalid user");
    	}

    	return us;
    }
    
    @Transactional(readOnly=true)
    public Usuario findByUser(String usuario) {
    	Usuario us = null;
    	try {
    		us = jdbcTemplate.queryForObject("SELECT * FROM usuarios WHERE nombreUsuario = ?", 
        			new Object[]{usuario}, new UsuarioRowMapper());    		
    	} catch(IncorrectResultSizeDataAccessException e) {
    		LOGGER.error("Invalid user");
    	}

    	return us;
    }
    public Usuario AgregarNuevoUsuarioActionPerformed(Usuario user) {                                                    
          try{
         
              String sqlString="INSERT INTO `usuarios` " + 
              		"(" + 
              		"`nombreUsuario`, " + 
              		"`password`, " + 
              		"`nombre`, " + 
              		"`apellidop`, " + 
              		"`apellidom`, " + 
              		"`c1`, " + 
              		"`c2`, " + 
              		"`c3`, " + 
              		"`c4`, " + 
              		"`c5`, " + 
              		"`estatus`, " + 
              		"`email`, " + 
              		"`telefono`, " + 
              		"`rol_idrol`, " + 
              		"`sucursal_idsucursal`) " + 
              		"VALUES " + 
              		"( " + 
              		"'"+user.getNombreUsuario()+"', " + 
              		"'"+encryption.buildHashPassword(user.getPassword())+"', " + 
              		"'"+user.getNombre()+"', " + 
              		"'"+user.getApellidop()+"', " + 
              		"'"+user.getApellidom()+"', " + 
              		"0, " + 
              		"0, " + 
              		"0, " + 
              		"0, " + 
              		"0, " + 
              		"1, " + 
              		"'"+user.getEmail()+"', " + 
              		"'"+user.getTelefono()+"', " + 
              		""+user.getIdRol()+", " + 
              		""+user.getSucursal_idsucursal()+");";

        	int  resultado=jdbcTemplate.update(sqlString);
         }catch(Exception e){
             e.printStackTrace();
         }
          return user; 
      }
    
    public Usuario DesactivarUsuarioActionPerformed(Usuario user) {                                                  
             try{
               String sqlString="UPDATE `usuarios` " + 
               		"SET " +  
               		"`estatus` = 0" + 
               		"WHERE `idusuario` = "+user.getId()+";";
               int  resultado=jdbcTemplate.update(sqlString);
             }catch(Exception e){
                 e.printStackTrace();
             }
             
             return user;
     }                                                     
    
    public Usuario actualizarUsuario(Usuario user) {                                         
        
        try{
          
          String sqlString="UPDATE `usuarios` " + 
          		"SET " + 
          		"`nombreUsuario` = '"+user.getNombreUsuario()+"',";
          
          if(!user.getPassword().equals("")) {
        	  sqlString+="`password` ='"+encryption.buildHashPassword(user.getPassword())+"',";
          }
          sqlString+="`nombre` = '"+user.getNombre()+"'," + 
          		   "`apellidop` = '"+user.getApellidop()+"'," + 
          		   "`apellidom` = '"+user.getApellidom()+"'," + 
          		   "`email` = '"+user.getEmail()+"'," + 
          		  "`telefono` ='"+user.getTelefono()+"'," + 
          		   "`rol_idrol` = "+user.getIdRol()+" " + 
          		   " WHERE `idusuario` = "+user.getId()+";";
          
          int resultado=jdbcTemplate.update(sqlString);
        }catch(Exception e){
            e.printStackTrace();
        }
       return user; 
    }                                        

    public List<Usuario> buscarUsuariosPorSucursal(Usuario currentSessionUser) {                                                      
    	List<Usuario> usuarios = new ArrayList<Usuario>();
    	try{
          
          String sqlString="Select * from  usuarios " +
                           " where ";
              
               	sqlString+= " sucursal_idsucursal="+currentSessionUser.getSucursal_idsucursal();
            	
            	List<Map<String, Object>> rows = jdbcTemplate.queryForList(sqlString);
            	for (Map row : rows) {
            		Usuario usuario = new Usuario();
            		usuario.setId((Integer)(row.get("idusuario")));
            		usuario.setNombre((String)(row.get("nombre")));
            		usuario.setApellidop((String)(row.get("apellidop")));
            		usuario.setApellidom((String)(row.get("apellidom")));
            		usuario.setEmail((String)(row.get("email")));
            		usuario.setIdRol((Integer)(row.get("rol_idRol")));
            		usuario.setTelefono((String)(row.get("telefono")));
            		usuarios.add(usuario);
            	}
               	
        }catch(Exception e){
            e.printStackTrace();
        }
        
        return usuarios;
    } 
    
    class UsuarioRowMapper implements RowMapper<Usuario> {
        @Override
        public Usuario mapRow(ResultSet rs, int rowNum) throws SQLException {
        	Usuario usuario = new Usuario();

        	usuario.setId(rs.getInt("idusuario"));
        	usuario.setNombre(rs.getString("nombre"));
        	usuario.setApellidop(rs.getString("apellidop"));
        	usuario.setApellidom(rs.getString("apellidom"));
        	usuario.setNombreUsuario(rs.getString("nombreUsuario"));
        	usuario.setPassword(rs.getString("password"));
        	usuario.setEmail(rs.getString("email"));
        	usuario.setIdRol(rs.getInt("rol_idrol"));
        	usuario.setSucursal_idsucursal(rs.getInt("sucursal_idsucursal"));
            return usuario;
        }
        
    }
}
