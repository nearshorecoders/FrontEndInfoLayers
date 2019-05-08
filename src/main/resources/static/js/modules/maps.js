var maps = (function() {

	var initProperties = function() {}

	var dom = {}

	var catchDom = function() {
	};

	var suscribeEvents = function() {};

	var events = {
		InitMapState : function(idState, idDiv) {
			var map = L.map(idDiv, {
				zoomControl : false
			}).setView(circumscription.centerOfStates[idState].latlng, circumscription.centerOfStates[idState].zoom);

			L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
				attribution : '',
				id : 'mapbox.light',
				accessToken : 'pk.eyJ1Ijoiam9zZWx1aXNwYWxpbGxlcm8iLCJhIjoiY2lqenh2cTUyMzFsM3Z3bTVtaTVnaHkxdyJ9.DAkVkUbVmwwWuXQoTS5NIA'
			}).addTo(map);
			return map;
		},
		ColorSalud : function(campo, maximo, descrip, perc, mapa, estado) {
			$(".gradiente-cont p").html(descrip + (perc ? " (Porcentaje)" : ""));
			$(".gradiente-cont span").html("0" + (perc ? "%" : ""));
			$(".gradiente-cont .span2").html(maximo + (perc ? "%" : ""));
			$.blockUI();
			setTimeout(function() {
				$.unblockUI();
			}, 700);
			allLayersStates[estado][501] = L.geoJSON(allLayersStates[estado]["vivResponse"], {
				style : function(layer) {

					var minimo = 0;

					var percent = layer.properties[campo] * 100 / maximo;
					var color = "rgb(0, " + (percent * 2.55 * 1.11) + ", 255)";
					return {
						fillColor : (typeof layer.properties[campo] !== 'undefined') ? color : "#ccc",
						weight : 1,
						color : (typeof layer.properties[campo] !== 'undefined') ? color : "#ccc",
						opacity : 1,
						fillOpacity : 0.7
					};
				},

				onEachFeature : function(feature, layer) {
					layer.on({
						mouseover : function(e) {
							var layer = e.target.feature;
							if (typeof layer.properties[campo] !== 'undefined') {
								$(".info.leaflet-control").css("display", "block").html('<h4>' + descrip + ': ' + (layer.properties[campo] > 0 ? layer.properties[campo] : 0) + (perc ? "%" : "") + '</h4>');
							}
						},
						mouseout : function(e) {
							$(".info.leaflet-control").css("display", "none");
						}
					});
				}
			});
			allLayersStates[estado][501].addTo(mapa);
		},
		CreaSalud : function(idState, map) {
			var items = $("<div/>").addClass("collapse").attr("id", "collapsesalud");

			$.each(salud, function(k, v) {
				if (v.campo == "VIV2_R") {
					items.append($('<h3/>').html("Porcentajes...").css({
						"color" : "white",
						"background" : "#008cc9",
						"text-align" : "center"
					}));
				}
				var item = $('<label/>').addClass("form-check-label").html(v.desc).append(
					$('<input/>').attr("type", "radio").attr("name", "radSalud").val(v.maximo ? 501 : 0)
						.data("campo", v.campo).data("maximo", v.maximo).data("desc", v.desc).data("percent", v.percent)
						.change(function() {
							var campo = $(this).data("campo");
							var maximo = $(this).data("maximo");
							var descrip = $(this).data("desc");
							var percent = $(this).data("percent");

							if (this.value == 501) {
								if (!allLayersStates[idState][501]) {
									layoutUtils.progressDownload( "Capa","Descargando ","state/getLayerById?layerId=" + 501 + "&stateId=" + idState, function (data, textStatus, jqxhr) {
										var response = data.capa;
										allLayersStates[idState]["vivResponse"] = response;
										events.ColorSalud(campo, maximo, descrip, percent, map, idState);
									});
								} else {
									events.deleteLayer(idState, 501, map);
									events.ColorSalud(campo, maximo, descrip, percent, map, idState);
								}
							} else {
								events.deleteLayer(idState, 501, map);
							}
						})
				);
				items.append(item)
					.append("<br/>");
			});


			var asd = $("<div/>").addClass("card")
				.append(
					$("<div/>").addClass("card-header").attr("id", "headingOne").append(
						$("<h5/>").addClass("mb-0").append(
							$("<button/>").addClass("btn btn-link")
								.attr("data-toggle", "collapse")
								.attr("data-target", "#collapsesalud")
								.attr("aria-expanded", "false")
								.attr("aria-controls", "collapsesalud")
								.html("Salud").append(
								$("<span/>").addClass("expand_caret caret")
								)
						)
					)
			).append(items)
			return asd;
		},

		createLayersMap : function(id, div, map) {
			$.get("state/loadAllStatesWithLayers", function(res) {
				if (res[id - 1]) {
					$.each(res[id - 1].stateLayers, function(k, val) {
						var items = $("<div/>").addClass("collapse").attr("id", "collapse" + k);
						$.each(val, function(k, v) {
							var item = $('<label/>').addClass("form-check-label").html(v.layerAlias).append(
								$('<input/>').attr("type", "checkbox").val(v.layerId)
									.change(function() {
										if ($(this).is(':checked')) {
											events.loadLayer(id, v.layerId, map);
										} else {
											events.deleteLayer(id, v.layerId, map);
										}
									})
							);
							items.append(item)
								.append("<br/>");
						});

						$(div).append(
							$("<div/>").addClass("card")
								.append(
									$("<div/>").addClass("card-header").attr("id", "headingOne").append(
										$("<h5/>").addClass("mb-0").append(
											$("<button/>").addClass("btn btn-link")
												.attr("data-toggle", "collapse")
												.attr("data-target", "#collapse" + k)
												.attr("aria-expanded", "false")
												.attr("aria-controls", "collapse" + k)
												.html(k).append(
												$("<span/>").addClass("expand_caret caret")
												)
										)
									)
							).append(items)
						);
					});
					
					

					console.log(id);
					if(id == 21){
						var items = $("<div/>").addClass("collapse").attr("id", "collapseValidacion");
						var item = $('<label/>').addClass("form-check-label").html("Servidores").append(
								$('<input/>').attr("type", "checkbox").val(-1)
								.change(function() {
									if ($(this).is(':checked')) {

										$(".txtBuscarServidores").show();
										$.getJSON("live/getPromoted2018", function(response) {
											var cluster = L.markerClusterGroup({disableClusteringAtZoom: 0});
											$.each(response, function(k, item) {
												cluster.addLayer(
													L.marker(
														new L.LatLng(item.latitud,item.longitud),
														{
															title:item.imei,
															icon : L.AwesomeMarkers.icon({
																"icon" : "child",
																"markerColor" : "green",
																"prefix" : "fa",
																"spin" : false
															})
														}
													).on("click", function(e){
															map.flyTo([item.latitud,item.longitud], 16);
														}
													).bindPopup(
														"<br/>Última ubicación: " + item.fecha_registro.substring(0, item.fecha_registro.indexOf("."))+
														"<br/>IMEI: " + item.imei+
														"<br/>Pila: " + item.pila+"%"+
														"<br/>Señal: " + item.senial+"%"
													)
												);
											});
											cluster.addTo(map);
											allLayersStates[21]["promoted"] = cluster;
										});
									} else {
										map.removeLayer(allLayersStates[21]["promoted"]);
										$(".txtBuscarServidores").hide();
									}
								})
						);
						items.append(item).append("<br/>")
						.append(
							$("<div/>").addClass("txtBuscarServidores").css({"text-align":"center", "display": "none"}).html(
									$("<input/>")
									.attr({"type": "text", "placeholder":"Buscar por IMEI"}).addClass("form-control")
								).append("<br/>")
								.append(
									$("<a/>").addClass("btn btn-primary").html("Buscar").css("margin", "10px")
									.click(function(){
										$('[title="'+$(".txtBuscarServidores input").val()+'"]').click();
									})
								)
							);
						
						$(div).append(
								$("<div/>").addClass("card")
								.append(
										$("<div/>").addClass("card-header").attr("id", "headingOne").append(
												$("<h5/>").addClass("mb-0").append(
														$("<button/>").addClass("btn btn-link")
														.attr("data-toggle", "collapse")
														.attr("data-target", "#collapseValidacion")
														.attr("aria-expanded", "false")
														.attr("aria-controls", "collapseValidacion")
														.html("S. Nación").append(
														$("<span/>").addClass("expand_caret caret")
														)
												)
										)
								).append(items)
						);
					}
					
					$.get("programs/getCapas", function(res) {
						$.each(res.capas, function(capa, capaValue) {
							if (capaValue.idLayerCapa) {
								var itemInfo = "";
								var items = $("<div/>").addClass("collapse").attr("id", "collapse" + capa);
								var item = $('<label/>').addClass("form-check-label").html("Ninguna Capa").append(
									$('<input/>').attr("type", "radio").attr("name", "rad" + capa).val(0)
										.change(function() {
											events.deleteLayer(id, capaValue.idLayerCapa, map, capa);
										})
								);
								items.append(item)
									.append("<br/>");
								$.each(capaValue.no_porcentaje, function(k, v) {

									var item = $('<label/>').addClass("form-check-label").html(v.descripcion).append(
										$('<input/>').attr("type", "radio").attr("name", "rad" + capa).val(v.layerid)
											.data("campo", v.campo).data("maximo", v.maximo).data("desc", v.descripcion).data("percent", v.porcentaje)
											.change(function() {
												var campo = $(this).data("campo");
												var maximo = $(this).data("maximo");
												var descrip = $(this).data("desc");
												var percent = $(this).data("percent");
												var layerId = $(this).val();

												if (!allLayersStates[id][layerId]) {
													layoutUtils.progressDownload( "Capa","Descargando ","state/getLayerById?layerId=" + layerId + "&stateId=" + id, function (data, textStatus, jqxhr) {
														var response = data.capa;
														allLayersStates[id]["response" + layerId] = response;
														events.ColorCapa(campo, maximo, descrip, percent, map, id, layerId, capa);
													});
												} else {
													events.deleteLayer(id, layerId, map, capa);
													events.ColorCapa(campo, maximo, descrip, percent, map, id, layerId, capa);
												}
											})
									);
									items.append(item)
										.append("<br/>");
								});

								if (capaValue.porcentaje.length > 0) {
									items.append($('<h3/>').html("Porcentaje de " + capa + "...").css({
										"color" : "white",
										"background" : "#008cc9",
										"text-align" : "center"
									}));
								}

								$.each(capaValue.porcentaje, function(k, v) {
									var item = $('<label/>').addClass("form-check-label").html(v.descripcion).append(
										$('<input/>').attr("type", "radio").attr("name", "rad" + capa).val(v.layerid)
											.data("campo", v.campo).data("maximo", v.maximo).data("desc", v.descripcion).data("percent", v.porcentaje)
											.change(function() {
												var campo = $(this).data("campo");
												var maximo = $(this).data("maximo");
												var descrip = $(this).data("desc");
												var percent = $(this).data("percent");
												var layerId = $(this).val();

												if (!allLayersStates[id][layerId]) {
													layoutUtils.progressDownload( "Capa","Descargando ","state/getLayerById?layerId=" + layerId + "&stateId=" + id, function (data, textStatus, jqxhr) {
														var response = data.capa;
														allLayersStates[id]["response" + layerId] = response;
														events.ColorCapa(campo, maximo, descrip, percent, map, id, layerId, capa);
													});
												} else {
													events.deleteLayer(id, layerId, map, capa);
													events.ColorCapa(campo, maximo, descrip, percent, map, id, layerId, capa);
												}
											})
									);
									items.append(item)
										.append("<br/>");
								});

								$(div).append(
									$("<div/>").addClass("card")
										.append(
											$("<div/>").addClass("card-header").attr("id", "headingOne").append(
												$("<h5/>").addClass("mb-0").append(
													$("<button/>").addClass("btn btn-link")
														.attr("data-toggle", "collapse")
														.attr("data-target", "#collapse" + capa)
														.attr("aria-expanded", "false")
														.attr("aria-controls", "collapse" + capa)
														.html(capa).append(
														$("<span/>").addClass("expand_caret caret")
														)
												)
											)
									).append(items)
								);
								var padre = $(div).parent();
								padre.append(
									'<div id="gradiente' + capa + '" class="gradiente-cont"><span class="col-md-1">0%</span><p class="col-md-10 col-md-offset-1"></p><span class="span2 col-md-1">100%</span><div class="gradiente col-md-12"></div></div>'
								);

							}
						});
					});

					$(div).show();
				}
			});

		},
		ColorCapa : function(campo, maximo, descrip, perc, mapa, estado, layerId, capa) {
			$.blockUI();
			$(".gradiente-cont").css("z-index", "0");
			$("#gradiente" + capa + " p").html(descrip + (perc ? " (Porcentaje)" : ""));
			$("#gradiente" + capa + " span").html("0" + (perc ? "%" : ""));
			$("#gradiente" + capa + " .span2").html(maximo + (perc ? "%" : ""));
			$("#gradiente" + capa).css("z-index", "1000");
			//$("#gradiente"+capa+" .gradiente").css("background","linear-gradient(to right, rgba(255,0,0,1) 0%, rgba(0,255,0,1) 100%)");
			$("#gradiente" + capa).show();

			allLayersStates[estado][layerId] = L.geoJSON(allLayersStates[estado]["response" + layerId], {
				style : function(layer) {
					var minimo = 0;
					var percent = layer.properties[campo] * 100 / maximo;

					var color = "#ccc";
					var colorLinea = "#000";

					switch (capa) {
					case "Discapacitados":
						color = "rgb(255, " + (percent * 2.551) + ", 255";
						colorLinea = "rgb(255, 0, 255)";
						$("#gradiente" + capa + " .gradiente").css("background", "linear-gradient(to right, rgb(255,0,255) 0%, rgb(255,240, 255) 100%)");
						break;
					case "Economía":
						color = "rgb(210, 210, " + (percent * 2.10) + ")";
						colorLinea = "rgb(210, 210, 0)";
						$("#gradiente" + capa + " .gradiente").css("background", "linear-gradient(to right, rgb(210,210,0) 0%, rgb(210,210, 210) 100%)");
						break;
					case "Educación":
						color = "rgb(" + (percent * 2.55 * 1.11) + ", 255, " + (percent * 2.55 * 1.11) + ")";
						colorLinea = "rgb(0, 255, 0)";
						$("#gradiente" + capa + " .gradiente").css("background", "linear-gradient(to right, rgb(0,255,0) 0%, rgb(240,255,240) 100%)");
						break;
					case "Salud":
						color = "rgb(0, " + (percent * 2.55 * 1.11) + ", 255)";
						colorLinea = color;
						$("#gradiente" + capa + " .gradiente").css("background", "linear-gradient(to right, rgb(0,0,255) 0%, rgb(0,240, 255) 100%)");
						break;
					case "Vivienda":
						color = percent <= 90 ? "rgb(255, " + (percent * 2.55 * 1.11) + ", 0)" : "rgb(" + ((100 - percent) / 10 * 255) + ", 255, 0)";
						colorLinea = color;
						break;
					}
					return {
						fillColor : (layer.properties[campo] !== undefined) ? color : "#ccc",
						weight : 1,
						color : colorLinea,
						opacity : 1,
						fillOpacity : 0.7
					};
				},

				onEachFeature : function(feature, layer) {
					layer.on({
						mouseover : function(e) {
							var layer = e.target.feature;
							if (campo !== undefined) {
								$(".info.leaflet-control").css("display", "block").html('<h4>' + descrip + ': ' + (layer.properties[campo] > 0 ? layer.properties[campo] : 0) + (perc ? "%" : "") + '</h4>');
							}
						},
						mouseout : function(e) {
							$(".info.leaflet-control").css("display", "none");
						}
					});
				}
			});
			allLayersStates[estado][layerId].addTo(mapa);
			setTimeout(function() {
				$.unblockUI();
			}, 500);
		},
		loadLayer : function(state, layerParam, mapa) {
			if (!allLayersStates[state][layerParam]) {
				events.getLayer(state, layerParam, mapa);
			} else {
				//allLayersStates[state][layerParam].addTo(circumscription.st.globalMap);
				allLayersStates[state][layerParam].addTo(mapa);
			}
		},
		deleteLayer : function(state, layer, mapa, capa) {
			//circumscription.st.globalMap.removeLayer(allLayersStates[state][layer]);
			if(capa){
				$("#gradiente" + capa).hide();
			}
			mapa.removeLayer(allLayersStates[state][layer]);
		},
		getLayer : function(stateId, layerId, mapa) {
			if (layerId !== 49 && layerId !== 50) {
				layoutUtils.progressDownload( "Capa","Descargando ","state/getLayerById?layerId=" + layerId + "&stateId=" + stateId, function (data, textStatus, jqxhr) {
					var response = data.capa;
					events.printLayerInMap(stateId, layerId, response, mapa);
					$(".gradiente-cont").hide();
				});
			} else {
				layoutUtils.progressDownload( "Capa","Descargando ","state/getLayerById?layerId=" + layerId + "&stateId=" + stateId, function (data, textStatus, jqxhr) {
					var response = data.capa;

					$(".gradiente-cont p").html("Población de 15 años y más alfabeta");
					$(".gradiente-cont span").html("0%");
					$(".gradiente-cont .span2").html("100%");
					$(".gradiente-cont").show();
					allLayersStates[stateId][layerId] = L.geoJSON(response, {
						style : function(layer) {

							var percent = layer.properties.EDU25_R;
							var color = percent <= 90 ? "rgb(255, " + (percent * 2.55 * 1.11) + ", 0)" : "rgb(" + ((100 - percent) / 10 * 255) + ", 255, 0)";
							return {
								fillColor : (typeof layer.properties.EDU25_R !== 'undefined') ? color : "#ccc",
								weight : 1,
								color : (typeof layer.properties.EDU25_R !== 'undefined') ? color : "#ccc",
								opacity : 1,
								fillOpacity : 0.7
							};
						},

						onEachFeature : function(feature, layer) {
							layer.on({
								mouseover : function(e) {
									var layer = e.target.feature;
									if (typeof layer.properties.EDU25_R !== 'undefined') {
										$(".info.leaflet-control").css("display", "block").html('<h4>Población de 15 años y más alfabeta: ' + layer.properties.EDU25_R + '%</h4>');
									} else {
										$(".info.leaflet-control").css("display", "block").html('<h4>Población con discapacidad: ' + layer.properties.DISC1 + '</h4>');
									}
								},
								mouseout : function(e) {
									$(".info.leaflet-control").css("display", "none");
								}
							});
						}
					});

					//allLayersStates[stateId][layerId].addTo(circumscription.st.globalMap);
					allLayersStates[stateId][layerId].addTo(mapa);
				});
			}

		},
		printLayerInMap : function(state, layer, geoJsonData, mapa) {
			if (geoJsonData[0].geometry.type === "Point") {
				var cluster = L.markerClusterGroup();
				geoJsonData.forEach(function(item, index) {
					cluster.addLayer(
						L.marker(
							new L.LatLng(item.geometry.coordinates[1], item.geometry.coordinates[0]),
							{
								icon : L.AwesomeMarkers.icon(item.icon)
							}
						).bindPopup(
								(item.properties.img ? "<img src='img/" + item.properties.img+"'/>": "") +
							(item.properties.NOMBRE ? "<br/>Nombre: " + item.properties.NOMBRE : "") +
							(item.properties.elector ? "<br/>Elector: " + item.properties.elector : "") +
							(item.properties.telefono ? "<br/>Teléfono: " + item.properties.telefono : "") +
							(item.properties.nom_estab ? "<br/>Nombre: " + item.properties.nom_estab : "") +
							(item.properties.nom_vial ? "<br/>Dirección: " + item.properties.nom_vial : "") +
							(item.properties.fecha_alta ? "<br/>Fecha Alta: " + item.properties.fecha_alta : "") +
							(item.properties.municipio ? "<br/>Municipio: " + item.properties.municipio : "") +
							(item.properties.AGRUPADO ? "<br/>AGRUPADO: " + item.properties.AGRUPADO : "") +
							(item.properties.DOMICILIO ? "<br/>Domicilio: " + item.properties.DOMICILIO : "") +
							(item.properties["DIRECCIóN"] ? "<br/>Domicilio: " + item.properties["DIRECCIóN"] : "") +
							(item.properties.CAT ? "<br/>Categoría: " + item.properties.CAT : "") +
							(item.properties.MUNICIPIO ? "<br/>Municipio: " + item.properties.MUNICIPIO : "") +
							(item.properties.NOM_MPIO ? "<br/>Municipio: " + item.properties.NOM_MPIO : "") +
							(item.properties.PADRON ? "<br/>Padrón: " + item.properties.PADRON : "") +
							(item.properties.SECCION ? "<br/>Sección: " + item.properties.SECCION : "") +
							(item.properties.TIPO ? "<br/>Tipo: " + item.properties.TIPO : "") +
							(item.properties.TIPO_CA ? "<br/>Tipo casilla: " + item.properties.TIPO_CA : "") +
							(item.properties.edad ? "<br/>Edad: " + item.properties.edad : "") +
							(item.properties.ocupacion ? "<br/>Ocupación: " + item.properties.ocupacion : "") +
							(item.properties.UBIC ? "<br/>Ubicación: " + item.properties.UBIC : "")
						)
							.openPopup());
				});
				cluster.addTo(mapa);
				allLayersStates[state][layer] = cluster;
			} else {
				allLayersStates[state][layer] = L.geoJSON(geoJsonData, {
					style : function(layer) {
						return layer.style;
					},

					onEachFeature : function(feature, layer) {
						layer.on({
							mouseover : function(e) {
								var layer = e.target;

								var name = false;
								if (layer.feature.properties.df_Cabecera) {
									name = layer.feature.properties.df_Cabecera;
								} else if (layer.feature.properties.DISTRITO) {
									name = "Distrito: " + layer.feature.properties.DISTRITO;
								} else if (layer.feature.properties.SECCION) {
									name = "Sección: " + layer.feature.properties.SECCION;
				 			    	if(layer.feature.properties.PARTIDO_GANADOR){
				 			    		name += "<br/>Ganador: "+layer.feature.properties.PARTIDO_GANADOR;
				 			    	}
								} else if (layer.feature.properties.NOMBRE) {
									name = layer.feature.properties.NOMBRE;
								}
								if (layer.feature.properties.SS_MUNICIPIO) {
									name += "<br/>Municipio: " + layer.feature.properties.SS_MUNICIPIO;
								}


								$("#detallePoblacion").html("");
								$("#detalleGenero").html("");
								if (layer.feature.properties.LN160318) {
									$("#detallePoblacion").append(
										$("<div/>").html($("<b/>").html("Listado nominal:")).append(layer.feature.properties.LN160318)
									);
								}
								if (layer.feature.properties.HAB2015INEGI) {
									$("#detallePoblacion").append(
										$("<div/>").html($("<b/>").html("Listado nominal:")).append(layer.feature.properties.HAB2015INEGI)
									);
								}
								if (layer.feature.properties.HOMBRES) {
									$("#detalleGenero").append(
										$("<div/>").html($("<b/>").html("Listado nominal:")).append(layer.feature.properties.HOMBRES)
									);
								}
								if (layer.feature.properties.MUJERES) {
									$("#detalleGenero").append(
										$("<div/>").html($("<b/>").html("Listado nominal:")).append(layer.feature.properties.MUJERES)
									);
								}

								if (name) {
									layer.setStyle({
										weight : 3,
										color : '#666'
									});

									if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
										layer.bringToFront();
									}
									$(".info.leaflet-control").css("display", "block").html('<h4>' + name + '</h4>');
								}
							},
							mouseout : function(e) {
								var layer = e.target;
								var name = false;
								if (layer.feature.properties.df_Cabecera) {
									name = layer.feature.properties.df_Cabecera;
								} else if (layer.feature.properties.DISTRITO) {
									name = "Distrito: " + layer.feature.properties.DISTRITO;
								} else if (layer.feature.properties.SECCION) {
									name = "Sección: " + layer.feature.properties.SECCION;
								}
								if (layer.feature.properties.SS_MUNICIPIO) {
									name += "<br/>Municipio: " + layer.feature.properties.SS_MUNICIPIO;
								}
								if (name) {
									layer.setStyle({
										weight : 1,
										color : '#888'
									});
									$(".info.leaflet-control").css("display", "none");
								}
							}
						});
					}
				});
			}

			allLayersStates[state][layer].addTo(mapa);
		},

	}
	var initialize = function() {
		suscribeEvents();
		initProperties();
	};

	return {
		init : initialize,
		events : events
	}
})();


$(document).ready(function() {
	maps.init();
});