package infolayers.frontend.model;

public class Permisos {

	private Integer idpermisos;
	private String nombreModulo;
	private Integer moduloOrigen;
	private Integer moduloPadre;
	private String urlAction;
	private String componentString;
	private String edoIdentifierMongo;
	
	public Integer getIdpermisos() {
		return idpermisos;
	}
	public void setIdpermisos(Integer idpermisos) {
		this.idpermisos = idpermisos;
	}
	public String getNombreModulo() {
		return nombreModulo;
	}
	public void setNombreModulo(String nombreModulo) {
		this.nombreModulo = nombreModulo;
	}
	public Integer getModuloOrigen() {
		return moduloOrigen;
	}
	public void setModuloOrigen(Integer moduloOrigen) {
		this.moduloOrigen = moduloOrigen;
	}
	public Integer getModuloPadre() {
		return moduloPadre;
	}
	public void setModuloPadre(Integer moduloPadre) {
		this.moduloPadre = moduloPadre;
	}
	public String getUrlAction() {
		return urlAction;
	}
	public void setUrlAction(String urlAction) {
		this.urlAction = urlAction;
	}
	public String getComponentString() {
		return componentString;
	}
	public void setComponentString(String componentString) {
		this.componentString = componentString;
	}
	public String getEdoIdentifierMongo() {
		return edoIdentifierMongo;
	}
	public void setEdoIdentifierMongo(String edoIdentifierMongo) {
		this.edoIdentifierMongo = edoIdentifierMongo;
	}
	
	
	
}
