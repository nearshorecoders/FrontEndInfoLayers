package infolayers.frontend.config;

import javax.sql.DataSource;

import org.apache.commons.dbcp2.BasicDataSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.jdbc.core.JdbcTemplate;

@Configuration
@ConfigurationProperties
public class DatabaseConfig {

    @Autowired
    private Environment environment;
    
    @Bean(name = "exchangeDS", destroyMethod = "")
    public DataSource exchangeDatasource() {
        BasicDataSource ds = new BasicDataSource();
        ds.setUrl(environment.getProperty("pos.datasource.url"));
        ds.setUsername(environment.getProperty("pos.datasource.username"));
        ds.setPassword(environment.getProperty("pos.datasource.password"));
        //ds.setInitialSize(Integer.valueOf(environment.getProperty("pos.datasource.initialsize")));
        //ds.setMaxTotal(Integer.valueOf(environment.getProperty("pos.datasource.maxtotal")));
        ds.setDriverClassName(environment.getProperty("pos.datasource.driverclassname"));
        //ds.setPoolPreparedStatements(Boolean.valueOf(environment.getProperty("pos.datasource.pool-prepared-statements")));
        return ds;
    }

    @Bean(name = "jdbcExchange")
    public JdbcTemplate b2cJdbcTemplate(@Qualifier("exchangeDS") DataSource dataSource){
        return new JdbcTemplate(dataSource);
    }
}
