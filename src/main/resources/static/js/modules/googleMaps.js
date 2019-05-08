var allLayersStatesGmaps = [];
var markers = [];
var markerCluster = [];
var nombreCapas = [];
var banderaCapaManchaUrbanaAislada=0;
var layersAisladas=[];
var nearBankablePlaces = [];
var initializedMap=null;

var googleMaps = (function() {
	var Variables = {
			currentGeo : "",
			dataMap: null,
			currentSeccion: 0,
	}
	var st = {
		requestTimeDistance : false,
		marksToTraceRoute : [],
		mapToTraceRoute : null
	}
	var initProperties = function() {
		
		nombreCapas["urbanas"]="Urbanas";
		nombreCapas["estructurales"]="Estructurales";
		nombreCapas["electorales"]="Electorales";
		nombreCapas["otras"]="Otras";
		nombreCapas["beneficiarios"]="Beneficiarios";
		nombreCapas["cobertura"]="Cobertura";
		nombreCapas["economiaLocal"]="Economía local";
		nombreCapas["centrosIntegradores"]="Centros Integradores";
		nombreCapas["sep"]="SEP";
	}

	// Declare new dom objects here if you needed
	var dom = {}

	// Keep your code here to reach the dom components out
	var catchDom = function() {}

	// Main event function
	var suscribeEvents = function() {}
	/*
	 * DOM EVENTS
	 */
	var events = {
			showPropuestasBancarizacionAll: function(mapa){
				var markers = [];
				for(i=1;i<=32;i++){
					layer=allLayersStatesGmaps[i][76];
					layer.setStyle(function(feature) {
							  var color = 'red';
							  //if (feature.getProperty('economialocal')==true) {
							  if(feature.getProperty('propuestaBancarizacion')==true){	
								  //console.log("propuesta bancarizacion encontrada"); 
								  color = 'blue';

				 					latLongCenter=feature.getProperty('center');	
				 					
				 					var bounds = new google.maps.LatLngBounds();
				 				    events.processPoints(feature.getGeometry(), bounds.extend, bounds);
				 		            var center = bounds.getCenter();

				        			//if(feature.getProperty('propuestaBancarizacion')==true){
					        			 /* var image = {
					        					    url: 'img/tpv2.svg',
					        					    //size: new google.maps.Size(50,50),
				        					    	//origin:new google.maps.Point(0, -25), 
				        					    	scaledSize: new google.maps.Size(20, 20)
				        					  };
				        			
					        			kmTotal=parseFloat(feature.getProperty('kilometros'));
					        			
				        				var	marker = new google.maps.Marker({									            
				        					position:center,	
				        					icon:image,
				        					map: mapa
					        				});
					        			marker.addListener('click', function() {
					        				    mapa.setZoom(8);
					        				    mapa.setCenter(marker.getPosition());
					        			});
				  
					        			
					        			blueMarkersBancarizacion.push(marker);	*/        				
				        			//}
				        			
							  }else{
								  
								  color='red';
							  }
							  //console.log("setting color:"+color);
							  return /** @type {!google.maps.Data.StyleOptions} */({
							    fillColor: color,
							    strokeColor: color,
							    strokeWeight: 1,
							    fillOpacity:1.0
							  });
					});  
					
					
				}
			},
			showPropuestasBancarizacionByState: function(state,mapa){
				layer=allLayersStatesGmaps[state][76];
				layer.setStyle(function(feature) {
						  var color = 'red';
						  //if (feature.getProperty('economialocal')==true) {
						  if(feature.getProperty('propuestaBancarizacion')==true){	  
						    color = 'blue';
		 					latLongCenter=feature.getProperty('center');	
		 					
		 					var bounds = new google.maps.LatLngBounds();
		 				    events.processPoints(feature.getGeometry(), bounds.extend, bounds);
		 		            var center = bounds.getCenter();

		        			var myLatlng = new google.maps.LatLng(latLongCenter.coordinates[1],latLongCenter.coordinates[0]);
		        			//if(feature.getProperty('propuestaBancarizacion')==true){
			        			  var image = {
		        					    	url: 'img/tpv2.svg',
		        					    	//size: new google.maps.Size(50,50),
		        					    	//origin:new google.maps.Point(0, -25), 
		        					    	scaledSize: new google.maps.Size(50, 50)
		        					  };
		        			
			        			kmTotal=parseFloat(feature.getProperty('kilometros'));
			        			
		        				var	marker = new google.maps.Marker({									            
		        					position:center,	
		        					icon:image,
		        					map: mapa
			        				});
			        			marker.addListener('click', function() {
			        				    mapa.setZoom(8);
			        				    mapa.setCenter(marker.getPosition());
			        			});
		  
			        			
			        			blueMarkersBancarizacion.push(marker);	        				
		        			//}

						  }else{
							  color='red';
						  }								 

						 return /** @type {!google.maps.Data.StyleOptions} */({
						    fillColor: color,
						    strokeColor: color,
						    strokeWeight: 1,
						    fillOpacity:1.0
						  });
				});
			},
			showPropuestasSucursalesAll: function(mapa){
				var markers = [];
				for(i=1;i<=32;i++){
					layer=allLayersStatesGmaps[i][76];
					layer.setStyle(function(feature) {
							  var color = 'red';
							  if (feature.getProperty('economialocal')==true) {
								  color = 'blue';

				 					latLongCenter=feature.getProperty('center');	
				 					
				 					var bounds = new google.maps.LatLngBounds();
				 				    events.processPoints(feature.getGeometry(), bounds.extend, bounds);
				 		            var center = bounds.getCenter();

				        			var myLatlng = new google.maps.LatLng(latLongCenter.coordinates[1],latLongCenter.coordinates[0]);
				        			
				        			  var image = {
				        					    	url: 'img/tpv.svg',
				        					    	size: new google.maps.Size(75,75), //size
				        					    	origin:new google.maps.Point(0,-35),  
				        					    	scaledSize: new google.maps.Size(75, 75)
				        					  };
				        			
				        			kmTotal=parseFloat(feature.getProperty('kilometros'));
				        			
				        			if(kmTotal>9){
				        				
				        				var	marker = new google.maps.Marker({									            
				        					position:center,	
				        					icon:image,
				        					map: mapa
					        				});
					        			marker.addListener('click', function() {
					        				    mapa.setZoom(8);
					        				    mapa.setCenter(marker.getPosition());
					        			});
					        			blueMarkers.push(marker);
				        			}
				        			
							  }else{
								  
								  color='red';
							  }
							  return /** @type {!google.maps.Data.StyleOptions} */({
							    fillColor: color,
							    strokeColor: color,
							    strokeWeight: 1,
							    fillOpacity:1.0
							  });
					});  
					
					
				}
			},
			showPropuestasSucursalesByState: function(state,mapa){
				layer=allLayersStatesGmaps[state][76];
				layer.setStyle(function(feature) {
						  var color = 'red';
						  if (feature.getProperty('economialocal')==true) {
						    color = 'blue';
		 					latLongCenter=feature.getProperty('center');	
		 					
		 					var bounds = new google.maps.LatLngBounds();
		 				    events.processPoints(feature.getGeometry(), bounds.extend, bounds);
		 		            var center = bounds.getCenter();

		        			var myLatlng = new google.maps.LatLng(latLongCenter.coordinates[1],latLongCenter.coordinates[0]);
		        			
		        			  var image = {
		        					    	url: 'img/tpv.svg',
		        					    	origin:new google.maps.Point(0, -35), 
		        					    	scaledSize: new google.maps.Size(75, 75)
		        					  };
		        			
			        			kmTotal=parseFloat(feature.getProperty('kilometros'));
			        			
		        				var	marker = new google.maps.Marker({									            
		        					position:center,	
		        					icon:image,
		        					map: mapa
			        				});
			        			marker.addListener('click', function() {
			        				    mapa.setZoom(8);
			        				    mapa.setCenter(marker.getPosition());
			        			});
		  
			        			
			        			blueMarkers.push(marker);
						  }else{
							  color='red';
						  }								 

						 return /** @type {!google.maps.Data.StyleOptions} */({
						    fillColor: color,
						    strokeColor: color,
						    strokeWeight: 1,
						    fillOpacity:1.0
						  });
				});
			},
			
			processPoints : function(geometry, callback, thisArg) {
				  if (geometry instanceof google.maps.LatLng) {
				    callback.call(thisArg, geometry);
				  } else if (geometry instanceof google.maps.Data.Point) {
				    callback.call(thisArg, geometry.get());
				  } else {
				    geometry.getArray().forEach(function(g) {
				      events.processPoints(g, callback, thisArg);
				    });
				  }
			},
			loadLayer : function(state, layerParam, mapa) {
				if(layerParam==76 && banderaCapaManchaUrbanaAislada==0){
					mapa.addListener('zoom_changed', function() {
						for(j=1;j<=32;j++){
							events.deleteMarkers(j, 76);
						}
						if(mapa.getZoom()<=8){
							for(i=0;i<blueMarkers.length;i++){
								
								marker=blueMarkers[i];
								
								marker.setMap(null);
								
								var image = {
	        					    	url: 'img/tpv.svg',
	        					    	origin:new google.maps.Point(0,-45),  
	        					    	scaledSize: new google.maps.Size(100, 100)
	        					};

								marker.icon=null;
			        			marker.icon=image;  
								marker.setMap(mapa);
								
								blueMarkers[i]=marker;
							}
						}
						
						if(mapa.getZoom()>8){
							for(j=1;j<=32;j++){
								events.deleteMarkers(j, 76);
							}	
							for(i=0;i<blueMarkers.length;i++){
								
								marker=blueMarkers[i];
								
								marker.setMap(null);
								
			        			  var image = {
		        					    	url: 'img/tpv.svg',
		        					    	size: new google.maps.Size(75,75), //size
		        					    	origin:new google.maps.Point(0,-35),  
		        					    	scaledSize: new google.maps.Size(75, 75)
		        					  };

								marker.icon=null;
			        			marker.icon=image;  
								marker.setMap(mapa);
								blueMarkers[i]=marker;
							}
						}
						
					});
					banderaCapaManchaUrbanaAislada=1;
					initializedMap=mapa;
					$("#btn-propuestaSucursalQuizzes").click(function() {
						var markers = [];
						for(i=1;i<=32;i++){
							layer=allLayersStatesGmaps[i][76];
							layer.setStyle(function(feature) {
									  var color = 'red';
									  if (feature.getProperty('economialocal')==true) {
										  color = 'blue';

						 					latLongCenter=feature.getProperty('center');	
						 					
						 					var bounds = new google.maps.LatLngBounds();
						 				    events.processPoints(feature.getGeometry(), bounds.extend, bounds);
						 		            var center = bounds.getCenter();

						        			var myLatlng = new google.maps.LatLng(latLongCenter.coordinates[1],latLongCenter.coordinates[0]);
						        			
						        			  var image = {
						        					    	url: 'img/tpv.svg',
						        					    	size: new google.maps.Size(75,75),
						        					    	origin:new google.maps.Point(0,-35),  
						        					    	scaledSize: new google.maps.Size(75, 75)
						        					  };
						        			
						        			kmTotal=parseFloat(feature.getProperty('kilometros'));
						        			
						        			if(kmTotal>9){
						        				
						        				var	marker = new google.maps.Marker({									            
						        					position:center,	
						        					icon:image,
						        					map: mapa
							        				});
							        			marker.addListener('click', function() {
							        				    mapa.setZoom(8);
							        				    mapa.setCenter(marker.getPosition());
							        			});
							        			blueMarkers.push(marker);
						        			}
						        			
									  }else{
										  
										  color='red';
									  }
									  return /** @type {!google.maps.Data.StyleOptions} */({
									    fillColor: color,
									    strokeColor: color,
									    strokeWeight: 1,
									    fillOpacity:1.0
									  });
							});  
							
							
						}
//						
//				        layer.map.data.addListener('mouseover', function(event) {
//				        		if(event.feature.getProperty('economialocal')){
//				        			latLongCenter=feature.getProperty('center');
//				        			var myLatlng = new google.maps.LatLng(latLongCenter.coordinates[1],latLongCenter.coordinates[0]);
//				        			marker = new google.maps.Marker({
//							            position: myLatlng,
//							            icon: "img/tpv.svg",
//							            map: mapa
//							        });
//				        			blueMarkers.push(marker);
//				        		}
//				          });
//				        layer.map.data.addListener('mouseout', function(event) {
//			        		if(event.feature.getProperty('economialocal')){
//			        			       for (var i = 0; i < blueMarkers.length; i++) {
//			        			    	   blueMarkers[i].setMap(null);
//			        			         }	
//			        		}
//			          });
					});
					
					$("#btn-propuestaSucursalStates").click(function() {
//							layer=allLayersStatesGmaps[state][76];
//							layer.setStyle(function(feature) {
//									  var color = 'red';
//									  if (feature.getProperty('economialocal')==true) {
//									    color = 'blue';
//					 					latLongCenter=feature.getProperty('center');	
//					 					
//					 					var bounds = new google.maps.LatLngBounds();
//					 				    events.processPoints(feature.getGeometry(), bounds.extend, bounds);
//					 		            var center = bounds.getCenter();
//
//					        			var myLatlng = new google.maps.LatLng(latLongCenter.coordinates[1],latLongCenter.coordinates[0]);
//					        			
//					        			  var image = {
//					        					    	url: 'img/tpv.svg',
//					        					    	origin:new google.maps.Point(0, -35), 
//					        					    	scaledSize: new google.maps.Size(75, 75)
//					        					  };
//					        			
//						        			kmTotal=parseFloat(feature.getProperty('kilometros'));
//						        			
//					        				var	marker = new google.maps.Marker({									            
//					        					position:center,	
//					        					icon:image,
//					        					map: mapa
//						        				});
//						        			marker.addListener('click', function() {
//						        				    mapa.setZoom(8);
//						        				    mapa.setCenter(marker.getPosition());
//						        			});
//					  
//						        			
//						        			blueMarkers.push(marker);
//									  }else{
//										  color='red';
//									  }								 
//
//									 return /** @type {!google.maps.Data.StyleOptions} */({
//									    fillColor: color,
//									    strokeColor: color,
//									    strokeWeight: 1,
//									    fillOpacity:1.0
//									  });
//							});  
					});

				}
				
				//FILTROS PARA NIVEL NACIONAL

				switch (layerParam) {
				case 1000:
				case 1001:
				case 1002:
				case 1003:
				case 1004:
				case 1005:
				case 1006:
				case 1007:
				case 1008:
				case 1009:
				case 1010:
				case 1011:
				case 1012:
				case 1013:
				case 1014:
				case 1015:
				case 1016:
				case 1017:
				case 1018:
				case 1019:
				case 1020:
				case 1021:
				case 1022:
				case 1023:
				case 1024:
				case 1025:
				case 1026:
				case 1027:
					events.dynamicNationalFilters(layerParam, mapa);
					break;	
				default:
					if(!customFilter) {
						if(!allLayersStatesGmaps[state]){
							allLayersStatesGmaps[state] = [];
						}
						
						if (!allLayersStatesGmaps[state][layerParam]) {
							events.getLayer(state, layerParam, mapa);
						} else {
							allLayersStatesGmaps[state][layerParam].setMap(mapa);
					    	currentDownloadingLayer= arrLayerRequested[state+"-"+layerParam];
					    				    	
					    	if(typeof(currentDownloadingLayer)!=="undefined"){
					    		currentDownloadingLayer.attr("disabled",false);
					    		delete arrLayerRequested[state+"-"+layerParam]; 
					    	}
						}					
					}
					break;
				}	
			},
			
			dynamicNationalFilters : function(layerParam, mapa) {
				for(i = 1; i <= 32; i++) {
					layer = allLayersStatesGmaps[i][filteringByMUA ? 76 : 77];
					layer.setStyle(function(feature) {
						var color = (customFilter ? 'transparent' :  (filteringByMUA ? 'red' : 'green'));
						
						if(customFilter) {
							switch (layerParam) {
							case 1000:
								if(feature.getProperty('beneficiarios') > 0) {
									color = '#E67E22';
								}								
								break;
							case 1001:
								if(feature.getProperty('coberturabancaria')) {
									color = '#19BBBE';
								}							
								break;
							case 1002:
								if (!feature.getProperty('coberturabancaria')) {
									color = '#0F8CB4';
								}								
								break;
							case 1003:
								if (!feature.getProperty('coberturacelular') && feature.getProperty('coberturabancaria')) {
									color = '#1B5FB8';
								}								
								break;
							case 1004:
								if (feature.getProperty('oxxos') > 0) {
									color = '#E67E22';
								}								
								break;
							case 1005:
								if (feature.getProperty('seven') > 0) {
									color = '#0F8CB4';
								}								
								break;	
							case 1006:
								if (feature.getProperty('coberturacelular')) {
									color = '#752A98';
								}								
								break;	
							case 1007:
								if (feature.getProperty('bansefi') > 0) {
									color = '#778BEB';
								}								
								break;	
							case 1008:
								if (feature.getProperty('liconsa') > 0) {
									color = '#28B489';
								}								
								break;	
							case 1009:
								if (feature.getProperty('diconsa') > 0) {
									color = '#ADB817';
								}								
								break;	
							case 1010:
								if (feature.getProperty('bancoazteca') > 0) {
									color = '#F55032';
								}								
								break;	
							case 1011:
								if (feature.getProperty('bancomer') > 0) {
									color = '#072146';
								}								
								break;	
							case 1012:
								if (feature.getProperty('coppel') > 0) {
									color = '#0f7ac7';
								}								
								break;	
							case 1013:
								if (feature.getProperty('banamex') > 0) {
									color = '#01B2E8';
								}								
								break;	
							case 1014:
								if (feature.getProperty('santander') > 0) {
									color = '#FF4D4C';
								}								
								break;	
							case 1015:
								if (feature.getProperty('hsbc') > 0) {
									color = '#9A605C';
								}								
								break;	
							case 1016:
								if (feature.getProperty('banorte') > 0) {
									color = '#CE2FA3';
								}								
								break;	
							case 1017:
								if (feature.getProperty('telecom') > 0) {
									color = '#00B7D7';
								}
								break;							
							}							
						} else {
							switch (layerParam) {
							case 1001:
								events.utilClearMarkers(coberturaBancariaMarker);							
								break;
							case 1002:
								events.utilClearMarkers(sinCoberturaBancariaMarker);
								break;
							case 1003:
								events.utilClearMarkers(bancosSinCoberturaBancariaMarker);
								break;
							case 1004:
								events.utilClearMarkers(oxxoMarker);
								break;
							case 1005:
								events.utilClearMarkers(sevenElevenMarker);
								break;	
							case 1006:
								events.utilClearMarkers(coberturaCelularMarker);
								break;	
							}
						}

						return ({
							fillColor: color,
							strokeColor: color,
							strokeWeight: 1,
							fillOpacity:1.0
						});
						
					});  
				}			
			},
			
			utilFilterLayer: function (feature, image, mapa, markerArray) {
				//GENERIC BOOLEAN FILTER PROPERTY
				latLongCenter = feature.getProperty('center');	
					var myLatlng = new google.maps.LatLng(latLongCenter.coordinates[1],latLongCenter.coordinates[0]);

					var image = {
			    	url: icon,
			    	scaledSize: new google.maps.Size(16, 16)
				};
					
					marker = new google.maps.Marker({
		            position: myLatlng,
		            icon: image,
		            map: mapa
        			});
					markerArray.push(marker);
			},
			
			utilClearMarkers: function(markerArray) {
				for (var j = 0; j < markerArray.length; j++) {
					markerArray[j].setMap(null);
			    }
				markerArray = [];
			},
			
			deleteLayerAisladaAll : function(state, layer, mapa, capa) {
				if(capa){
					$("#gradiente" + capa).hide();
				}
				for(i=1;i<=32;i++){
					layer=allLayersStatesGmaps[i][76];
					layer.setStyle(function(feature) {
							  var color = 'red';
							  return /** @type {!google.maps.Data.StyleOptions} */({
							    fillColor: color,
							    strokeColor: color,
							    strokeWeight: 1,
							    fillOpacity:1.0
							  });
					});  
				}
				banderaCapaManchaUrbanaAislada=0;
				if(allLayersStatesGmaps[state][layer]) {
					allLayersStatesGmaps[state][layer].setMap(null);					
				}
				events.deleteMarkers(state, layer);
            	for (var i = 0; i < blueMarkers.length; i++) {
			    	   blueMarkers[i].setMap(null);
			    }
            	blueMarkers=[];
            	
            	for (var i = 0; i < blueMarkersBancarizacion.length; i++) {
            		blueMarkersBancarizacion[i].setMap(null);
			    }
            	blueMarkersBancarizacion=[];
			},
			deleteLayer : function(state, layer, mapa, capa) {
				//circumscription.st.globalMap.removeLayer(allLayersStatesGmaps[state][layer]);
				if(capa){
					$("#gradiente" + capa).hide();
				}
				//mapa.removeLayer(allLayersStatesGmaps[state][layer]);
				if(allLayersStatesGmaps[state][layer]) {
					allLayersStatesGmaps[state][layer].setMap(null);					
				}
				events.deleteMarkers(state, layer);				
			},
			deleteLayerAisladaByState : function(state, layer, mapa, capa) {
				if(capa){
					$("#gradiente" + capa).hide();
				}
					layer=allLayersStatesGmaps[state][76];
					layer.setStyle(function(feature) {
							  var color = 'red';
							  return /** @type {!google.maps.Data.StyleOptions} */({
							    fillColor: color,
							    strokeColor: color,
							    strokeWeight: 1,
							    fillOpacity:1.0
							  });
					});  
				banderaCapaManchaUrbanaAislada=0;
				if(allLayersStatesGmaps[state][76]) {
					allLayersStatesGmaps[state][76].setMap(null);					
				}
				events.deleteMarkers(state, layer);
            	for (var i = 0; i < blueMarkers.length; i++) {
			    	   blueMarkers[i].setMap(null);
			    }
            	blueMarkers=[];
            	//cambio que se volaron
            	for (var i = 0; i < blueMarkersBancarizacion.length; i++) {
            		blueMarkersBancarizacion[i].setMap(null);
			    }
            	blueMarkersBancarizacion=[];
			},
			clearAllLayers: function(){
				$.each(allLayersStatesGmaps, function(k, v){
				    if(v){
				        $.each(v, function(key, value){
				        	if (!Array.isArray(value)){
				        		if(value){
					                value.setMap(null);
					            }
				        	}
				        })
				    }				    
				});
			},
			deleteMarkers: function(stateId, layerId) {
				if(markers && markers[stateId] && markers[stateId][layerId]) {
					for (var i = 0; i < markers[stateId][layerId].length; i++) {
						markers[stateId][layerId][i].setMap(null);
					}
					markers[stateId][layerId] = [];
				}
				
				if(markerCluster && markerCluster[stateId] && markerCluster[stateId][layerId]) {
					markerCluster[stateId][layerId].clearMarkers();
				}
			},
			getLayer : function(stateId, layerId, mapa, zoomId = 1, fromZoom = false) {
				if (layerId !== 49 && layerId !== 50) {
					
					if(layerId === 79 || layerId === 80 ||
							layerId === 81 || layerId === 82 ||
							layerId === 83 || layerId === 84 || 
							layerId === 139 || layerId === 124 ||
							layerId === 135 || layerId === 136 ||
							layerId === 137 || layerId === 138 ) { //solo viviendas
						
						if(!fromZoom) {
							zoomId = zoomMap;
				    	}
						
						var request;
						if(zoomId === 7 || zoomId === 8 || zoomId === 9) {
							layoutUtils.progressDownload(
									layerId, 
									"Descargando ", 
									"state/getGeoCapas?layerId="+layerId+"&stateId="+stateId+"&zoomId="+zoomId+"&ne0="+ne0+"&ne1="+ne1+"&sw0="+sw0+"&sw1="+sw1+"&nw0="+nw0+"&nw1="+nw1+"&se0="+se0+"&se1="+se1, 
									function (data, textStatus, jqxhr) {
								    	currentDownloadingLayer= arrLayerRequested[stateId+"-"+layerId];
								    	
								    	if(typeof(currentDownloadingLayer)!=="undefined"){
								    		currentDownloadingLayer.attr("disabled",false);
								    		delete arrLayerRequested[stateId+"-"+layerId];
								    	}
								    	
								    	if(fromZoom) {
									    	events.deleteMarkers(stateId, layerId);
								    	}

								    	if(data) {
								    		if(zoomId === 7 || zoomId === 8 || zoomId === 9) {
								    			//var geoJson = JSON.parse(data);
								    			var geoJson = data;
								    			
								    			if((layerId === 135 || layerId === 136 || layerId === 137 || layerId === 138 || layerId === 139)  && googleMaps.st.bandQuizze){
								    				geoJson.forEach(function(item, index) {
								    					
								    					var nearBankablePlacesString="";
								    					
								    					for(i=0;i<nearBankablePlaces.length;i++){
								    						var place=nearBankablePlaces[i];
								    						
								    						
								    						nearBankablePlacesString=nearBankablePlacesString+'<li>' +
								    													'<button class="btn btn-block btn-azul" id="getNear'+place.nombre+'" data-layerId="'+place.layerId+'" data-layerName="'+place.nombre+'">'+place.label+'</button>' +
								    												 '</li>';
								    						//nearBankablePlacesString=nearBankablePlacesString+'<button class="btn btn-default" data-toggle="tooltip" data-placement="top" id="getNear'+place.nombre+'" data-layerId="'+place.layerId+'" data-layerName="'+place.nombre+'" title="'+place.nombre+'">'+
															//'	<div class="b-icon">'+
															//'		<img src="img/iconsMenu/'+ place.icon +'.png"/>'+
															//'	</div>'+
															//'</button>';
								    					}
								    					
								    					
														var contstrEnc = '<div class="caja-beneficiario">' +		 
																			 	'<div class="detalles">' +			 		
																		 		'<ul>' +
																		 			'<li>' +
																		 				'<h4 class="">'+ (item.properties.NOMBRE ? item.properties.NOMBRE : '') +'</h4>' +	
																		 			'</li>' +
																		 			'<li>' +
																		 				'<p>Domicilio:</p><p>'+ (item.properties.DOMICILIO ? item.properties.DOMICILIO : '' ) +' CP <span>'+ (item.properties.ine_codigo_postal ? item.properties.ine_codigo_postal : '' )+'</span></p>' +
																		 			'</li>' +
																		 			'<li>' +
																		 				'<p>Ocupación:</p><p>'+ (item.properties.ine_ocupacion ? item.properties.ine_ocupacion : '' ) +'</p>' +
																		 			'</li>' +
																		 			'<li>' +
																		 				'<p>CURP: </p><p>'+ ( item.properties.ine_curp ? item.properties.ine_curp : '' ) +'</p>' +
																		 			'</li>' +
																		 			'<li>' +
																		 				'<p>RFC: </p><p>'+ ( item.properties.rfc ? item.properties.rfc : '' ) +'</p>' +
																		 			'</li>' +
																		 			'<li>' +
																		 				'<p>Telefono:</p><p>'+ (item.properties.telefono ? item.properties.telefono : '') +'</p>' +
																		 			'</li>' +
																		 			'<li>' +
																		 				'<button class="btn btn-block btn-azul" data-toggle="modal" data-target="#modal-encuestas">Encuestar</button>' +
																		 			'</li>' +
																		 			nearBankablePlacesString+
																		 		'</ul>' +
																		 	'</div>' +
																	'</div>';
														
//										 var contstrEnc='<div class="box-flot">'+
//														'<div class="caret"></div>'+
//														'<button class="close">x</button>'+
//														'<div class="flot-header">'+
//														'	<h4>'+(item.properties.NOMBRE ? item.properties.NOMBRE : '')+'</h4>'+
//														'</div>'+
//														'<div class="flot-body">'+
//															'<div class="row">'+
//																'<div class="col-md-6">'+
//																'	<div class="caja-beneficiario">'+
//																'		<div class="detalles">'+
//																'			<ul>'+
//																'				<li>'+
//																'					<p>Domicilio:'+ (item.properties.DOMICILIO ? item.properties.DOMICILIO : '' ) +'</p>'+
//																'					<p> CP <span>'+ (item.properties.ine_codigo_postal ? item.properties.ine_codigo_postal : '' )+'</span></p>'+
//																'				</li>'+
//																'				<li>'+
//																'					<p>Ocupación:</p>'+
//																'					<p>'+ (item.properties.ine_ocupacion ? item.properties.ine_ocupacion : '' ) +'</p>'+
//																'				</li>'+
//																'				<li>'+
//																'					<p>CURP: </p>'+
//																'					<p>'+ ( item.properties.ine_curp ? item.properties.ine_curp : '' ) +'</p>'+
//																'				</li>'+
//																'				<li>'+
//																'					<p>RFC: </p>'+
//																'					<p>'+ ( item.properties.rfc ? item.properties.rfc : '' ) +'</p>'+
//																'				</li>'+
//																'				<li>'+
//																'					<p>Telefono:</p>'+
//																'					<p>'+ (item.properties.telefono ? item.properties.telefono : '') +'</p>'+
//																'				</li>'+
//																'			</ul>'+
//																'		</div>'+
//																'	</div>'+
//																'</div>'+
//																'<div class="col-md-6">'+
//																	'<div class="cont-bot">'+
//																	nearBankablePlacesString+
//																	'</div>'+
//																'</div>'+
//															'</div>'+
//														'</div>'+
//														
//													'</div>';
														
															var infowindow = new google.maps.InfoWindow({
													          content: contstrEnc
													        });
															
															var myLatlng = new google.maps.LatLng(item.geometry.coordinates[1],item.geometry.coordinates[0]);
															
															var marker = new google.maps.Marker({
													            position: myLatlng,
													            title: item.properties.NOMBRE,
													            icon: "img/capasIcons/"+layerId+".svg", 
													            map: mapa
													            //label: item.properties.NOMBRE
													        });
															
															marker.addListener('click', function(evt) {
																infowindow.open(mapa, marker);
																initializedMap=mapa;
																st.itemSelected = item;
																$('#m-user-name').html(item.properties.NOMBRE ? item.properties.NOMBRE : 'EMPTY');
																$('#m-user-phone').html(item.properties.telefono ? item.properties.telefono : 'EMPTY');
																$('#m-user-email').html(item.properties.dir_busca ? item.properties.dir_busca : '');
																$('#m-user-program').html(item.properties.rfc ? item.properties.rfc : '');
																$('#m-user-date').html(item.properties.fecha_nac ? item.properties.fecha_nac : '');
																$('#m-user-time').html(item.properties.curp ? item.properties.curp : '');
																googleMaps.events.initMapRuta(evt);
																
																//funcionalidad localizacion lugares sibok
																for(i=0;i<nearBankablePlaces.length;i++){
																	var place=nearBankablePlaces[i];
																	
																    $("#getNear"+place.nombre).click(function() {
																    	$("#btn-trace-route").click();
																    	var latToSend = marker.getPosition().lat();
																    	var lngToSend = marker.getPosition().lng();
																    	//$(this).attr("data-id")
																    	var idLayerToSend=$(this).attr("data-layerId");
																    	console.log("DataLayerid="+$(this).attr("data-layerId")+" "+place.nombre);
																    	dataToSend={
																    		lng:lngToSend,
																    		lat:latToSend,
																    		layerId:idLayerToSend
																    	}
																		var request = $.ajax({
																			url: 'circumscription/getNearLayer',
																	        method: 'GET',
																	        data:dataToSend,
																	        async:false
																	    });
																		
																    	var iconName="";
																    	
																    	switch(parseInt(idLayerToSend)){
																	    	case 53://oxxo
																	    		iconName="53";
																	    		break;
																	    	case 54://seven
																	    		iconName="72";
																	    		break;
																	    	case 55://bansefi
																	    		iconName="71";
																	    		break;
																	    	case 56://banamex
																	    		iconName="106";
																	    		break;
																	    	default:
																	    		iconName="fin";
																	    		break;	
																    	}
																    	
																		request.done(function(data) {
																			if(data.body==null){
																				alert("No se han encontrado algun establecimiento cerca.");
																			}else{
																				if(data.body.content[0]!=undefined){
																					data=JSON.parse(data.body.content[0].content);
																					coord=data.geometry.coordinates;
																					lngEnd=coord[0];
																					latEnd=coord[1];
																				
																					latLong={};
																				
																					latLong.lat=latToSend;
																					latLong.lng=lngToSend;
																					events.traceRouteInMapNear(initializedMap,latLong,iconName);
																					latLong={};
																					latLong.lat=latEnd;
																					latLong.lng=lngEnd;
																					events.traceRouteInMapNear(initializedMap,latLong,iconName);
																				}else{
																					alert("No se han encontrado algun establecimiento cerca.");
																				}
																			}
																		});
																		request.fail(function() {
																			
																	    });
															    });

																}	
																
															});
															
															markers[stateId][layerId].push(marker);
															
													});
													
												}else{
													geoJson.forEach(function(item, index) {
														var contentString = events.beneficiariosDetalle(item);
														/*
								    				var contentString = 
														(item.properties.NOMBRE ? "<br/>Nombre: " + item.properties.NOMBRE : "") +
														(item.properties.elector ? "<br/>Elector: " + item.properties.elector : "") +
														(item.properties.rfc ? "<br/>RFC: " + item.properties.rfc : "") +
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
														(item.properties.UBIC ? "<br/>Ubicación: " + item.properties.UBIC : "");*/

												        var infowindow = new google.maps.InfoWindow({
												          content: contentString
												        });
														
														var myLatlng = new google.maps.LatLng(item.geometry.coordinates[1],item.geometry.coordinates[0]);
														
														var marker;
														if(zoomId === 9) {
															marker = new google.maps.Marker({
													            position: myLatlng,
													            title: item.properties.NOMBRE,
													            icon: "img/capasIcons/"+layerId+".svg",
													            map: mapa
													        });
														}else {
															var marker = new google.maps.Marker({
													            position: myLatlng,
													            title: item.properties.NOMBRE,
													            icon: "img/capasIcons/"+layerId+".svg",
													        });
														}
														
														marker.addListener('click', function() {
															infowindow.open(mapa, marker);	
														});
														
														markers[stateId][layerId].push(marker);
								    			});	
												}
												if(zoomId !== 9) {
									    				markerCluster[stateId][layerId] = new MarkerClusterer(mapa, markers[stateId][layerId],
									    			            {imagePath: 'images/m', zoomOnClick: true});
									    		}
								    		}else {
										    	
										    	var countR = 0;
										    	var idx = 0;
										    	data.multipolygon.forEach(function(item, index) {

										    		if(item.count > 0) {
										    			idx++;
										    			var cat = 0;
										    			if(item.count <= 10) {
										    				cat = 1;
										    			}else if(item.count <= 100) {
										    				cat = 2;
										    			}else if(item.count <= 1000) {
										    				cat = 3;
										    			}else if(item.count <= 5000) {
										    				cat = 4;
										    			}else {
										    				cat = 5;
										    			}
										    			
										    			var urlIcon;
										    			switch(cat) {
										    				case 1: urlIcon = 'images/m1.png'; break;
										    				case 2: urlIcon = 'images/m2.png'; break;
										    				case 3: urlIcon = 'images/m3.png'; break;
										    				case 4: urlIcon = 'images/m4.png'; break;
										    				case 5: urlIcon = 'images/m5.png'; break;
										    				default: urlIcon = '';
										    			}
										    			var pointCoord;
										    			if(zoomId === 0) {
										    				pointCoord = {lat: centerOfStates[stateId].latlng.lat, lng: centerOfStates[stateId].latlng.lng};
										    			}else {
										    				pointCoord = {lat: item.coord[1], lng: item.coord[0]};
										    			}
											    		var marker = new google.maps.Marker({position: pointCoord,
											    			title: item.count.toString(),
											    			label: { color: '#000000', fontWeight: 'bold', fontSize: '12px', text: item.count.toString() },
											    			icon: urlIcon,
											    			map: mapa});
											    		marker.addListener('click', function() {
											    			var zoom = mapa.getZoom()+1;
											    			mapa.setZoom(zoom);
											    			mapa.setCenter(marker.getPosition());
											    	        });
											    		markers[stateId][layerId].push(marker);
											    		countR += item.count;
										    		}
												});
										    	$("#infoS"+stateId+"L"+layerId).html(countR.toLocaleString('en-US'));
								    		}
								    	}
								    });
							/*
							request = $.ajax({
								url: "state/getGeoCapas?layerId="+layerId+"&stateId="+stateId+"&zoomId="+zoomId+"&ne0="+ne0+"&ne1="+ne1+"&sw0="+sw0+"&sw1="+sw1+"&nw0="+nw0+"&nw1="+nw1+"&se0="+se0+"&se1="+se1,
						        method: "GET"
						    });*/
						}else {
							request = $.ajax({
						        url: "state/getGeoCapas?layerId="+layerId+"&stateId="+stateId+"&zoomId="+zoomId,
						        method: "GET"
						    });
							
							 request.done(function(data) {
							    	currentDownloadingLayer= arrLayerRequested[stateId+"-"+layerId];
							    	
							    	if(typeof(currentDownloadingLayer)!=="undefined"){
							    		currentDownloadingLayer.attr("disabled",false);
							    		delete arrLayerRequested[stateId+"-"+layerId];
							    	}
							    	
							    	if(fromZoom) {
								    	events.deleteMarkers(stateId, layerId);
							    	}

							    	if(data) {
							    		if(zoomId === 7 || zoomId === 8 || zoomId === 9) {
							    			var geoJson = JSON.parse(data);
							    			
							    			if((layerId === 135 || layerId === 136 || layerId === 137 || layerId === 138 || layerId === 139)  && googleMaps.st.bandQuizze){
							    				geoJson.forEach(function(item, index) {
							    					
							    					var nearBankablePlacesString="";
							    					
							    					for(i=0;i<nearBankablePlaces.length;i++){
							    						var place=nearBankablePlaces[i];
							    						
							    						
							    						nearBankablePlacesString=nearBankablePlacesString+'<li>' +
							    													'<button class="btn btn-block btn-azul" id="getNear'+place.nombre+'" data-layerId="'+place.layerId+'" data-layerName="'+place.nombre+'">'+place.label+'</button>' +
							    												 '</li>';
//							    						nearBankablePlacesString=nearBankablePlacesString+'<button class="btn btn-default" data-toggle="tooltip" data-placement="top" id="getNear'+place.nombre+'" data-layerId="'+place.layerId+'" data-layerName="'+place.nombre+'" title="'+place.nombre+'">'+
//														'	<div class="b-icon">'+
//														'		<img src="img/iconsMenu/'+ place.icon +'.png"/>'+
//														'	</div>'+
//														'</button>';
							    					}
							    					
							    					//sibok
													var contstrEnc = '<div class="caja-beneficiario">' +		 
																		 	'<div class="detalles">' +			 		
																	 		'<ul>' +
																	 			'<li>' +
																	 				'<h4 class="">'+ (item.properties.NOMBRE ? item.properties.NOMBRE : '') +'</h4>' +	
																	 			'</li>' +
																	 			'<li>' +
																	 				'<p>Domicilio:</p><p>'+ (item.properties.DOMICILIO ? item.properties.DOMICILIO : '' ) +' CP <span>'+ (item.properties.ine_codigo_postal ? item.properties.ine_codigo_postal : '' )+'</span></p>' +
																	 			'</li>' +
																	 			'<li>' +
																	 				'<p>Ocupación:</p><p>'+ (item.properties.ine_ocupacion ? item.properties.ine_ocupacion : '' ) +'</p>' +
																	 			'</li>' +
																	 			'<li>' +
																	 				'<p>CURP: </p><p>'+ ( item.properties.ine_curp ? item.properties.ine_curp : '' ) +'</p>' +
																	 			'</li>' +
																	 			'<li>' +
																	 				'<p>RFC: </p><p>'+ ( item.properties.rfc ? item.properties.rfc : '' ) +'</p>' +
																	 			'</li>' +
																	 			'<li>' +
																	 				'<p>Telefono:</p><p>'+ (item.properties.telefono ? item.properties.telefono : '') +'</p>' +
																	 			'</li>' +
																	 			'<li>' +
																	 				'<button class="btn btn-block btn-azul" data-toggle="modal" data-target="#modal-encuestas">Encuestar</button>' +
																	 			'</li>' +
																	 			nearBankablePlacesString+
																	 		'</ul>' +
																	 	'</div>' +
																'</div>';
//							    					 var contstrEnc='<div class="box-flot">'+
//														'<div class="caret"></div>'+
//														'<button class="close">x</button>'+
//														'<div class="flot-header">'+
//														'	<h4>'+(item.properties.NOMBRE ? item.properties.NOMBRE : '')+'</h4>'+
//														'</div>'+
//														'<div class="flot-body">'+
//															'<div class="row">'+
//																'<div class="col-md-6">'+
//																'	<div class="caja-beneficiario">'+
//																'		<div class="detalles">'+
//																'			<ul>'+
//																'				<li>'+
//																'					<p>Domicilio:'+ (item.properties.DOMICILIO ? item.properties.DOMICILIO : '' ) +'</p>'+
//																'					<p> CP <span>'+ (item.properties.ine_codigo_postal ? item.properties.ine_codigo_postal : '' )+'</span></p>'+
//																'				</li>'+
//																'				<li>'+
//																'					<p>Ocupación:</p>'+
//																'					<p>'+ (item.properties.ine_ocupacion ? item.properties.ine_ocupacion : '' ) +'</p>'+
//																'				</li>'+
//																'				<li>'+
//																'					<p>CURP: </p>'+
//																'					<p>'+ ( item.properties.ine_curp ? item.properties.ine_curp : '' ) +'</p>'+
//																'				</li>'+
//																'				<li>'+
//																'					<p>RFC: </p>'+
//																'					<p>'+ ( item.properties.rfc ? item.properties.rfc : '' ) +'</p>'+
//																'				</li>'+
//																'				<li>'+
//																'					<p>Telefono:</p>'+
//																'					<p>'+ (item.properties.telefono ? item.properties.telefono : '') +'</p>'+
//																'				</li>'+
//																'			</ul>'+
//																'		</div>'+
//																'	</div>'+
//																'</div>'+
//																'<div class="col-md-6">'+
//																	'<div class="cont-bot">'+
//																	nearBankablePlacesString+
//																	'</div>'+
//																'</div>'+
//															'</div>'+
//														'</div>'+
//														
//													'</div>';
														var infowindow = new google.maps.InfoWindow({
												          content: contstrEnc
												        });
														
														var myLatlng = new google.maps.LatLng(item.geometry.coordinates[1],item.geometry.coordinates[0]);
														
														var marker = new google.maps.Marker({
												            position: myLatlng,
												            title: item.properties.NOMBRE,
												            icon: "img/capasIcons/"+layerId+".svg", 
												            map: mapa
												            //label: item.properties.NOMBRE
												        });
														
														marker.addListener('click', function(evt) {
															infowindow.open(mapa, marker);
															initializedMap=mapa;
															$('#m-user-name').html(item.properties.NOMBRE ? item.properties.NOMBRE : 'EMPTY');
															$('#m-user-phone').html(item.properties.telefono ? item.properties.telefono : 'EMPTY');
															$('#m-user-email').html(item.properties.dir_busca ? item.properties.dir_busca : '');
															$('#m-user-program').html(item.properties.ine_curp ? item.properties.ine_curp : '');
															$('#m-user-date').html(item.properties.fecha_nac ? item.properties.fecha_nac : '');
															$('#m-user-time').html(item.properties.curp ? item.properties.curp : '');
															googleMaps.events.initMapRuta(evt);
															
															//funcionalidad localizacion lugares sibok
															for(i=0;i<nearBankablePlaces.length;i++){
															var place=nearBankablePlaces[i];
															
														    $("#getNear"+place.nombre).click(function() {
														    	$("#btn-trace-route").click();
														    	var latToSend = marker.getPosition().lat();
														    	var lngToSend = marker.getPosition().lng();
														    	//$(this).attr("data-id")
														    	var idLayerToSend=$(this).attr("data-layerId");
														    	console.log("DataLayerid="+$(this).attr("data-layerId")+" "+place.nombre);
														    	dataToSend={
														    		lng:lngToSend,
														    		lat:latToSend,
														    		layerId:idLayerToSend
														    	}
																var request = $.ajax({
																	url: 'circumscription/getNearLayer',
															        method: 'GET',
															        data:dataToSend,
															        async:false
															    });
																
														    	var iconName="";
														    	
														    	switch(parseInt(idLayerToSend)){
															    	case 53://oxxo
															    		iconName="53";
															    		break;
															    	case 54://seven
															    		iconName="72";
															    		break;
															    	case 55://bansefi
															    		iconName="71";
															    		break;
															    	case 56://banamex
															    		iconName="106";
															    		break;
															    	default:
															    		iconName="fin";
															    		break;	
														    	}
														    	
																request.done(function(data) {
																	if(data.body==null){
																		alert("No se han encontrado algun establecimiento cerca.");
																	}else{
																		if(data.body.content[0]!=undefined){
																			data=JSON.parse(data.body.content[0].content);
																			coord=data.geometry.coordinates;
																			lngEnd=coord[0];
																			latEnd=coord[1];
																		
																			latLong={};
																		
																			latLong.lat=latToSend;
																			latLong.lng=lngToSend;
																			events.traceRouteInMapNear(initializedMap,latLong,iconName);
																			latLong={};
																			latLong.lat=latEnd;
																			latLong.lng=lngEnd;
																			events.traceRouteInMapNear(initializedMap,latLong,iconName);	
																		}else{
																			alert("No se han encontrado algun establecimiento cerca.");
																		}
																	}
																});
																request.fail(function() {
																	
															    });
													    });
											
														}	
															
														});
														
														markers[stateId][layerId].push(marker);
														
												});
												
											}else{
												geoJson.forEach(function(item, index) {
													var contentString = events.beneficiariosDetalle(item);
													/*
							    				var contentString = 
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
													(item.properties.UBIC ? "<br/>Ubicación: " + item.properties.UBIC : "");*/

											        var infowindow = new google.maps.InfoWindow({
											          content: contentString
											        });
													
													var myLatlng = new google.maps.LatLng(item.geometry.coordinates[1],item.geometry.coordinates[0]);
													
													var marker;
													if(zoomId === 9) {
														marker = new google.maps.Marker({
												            position: myLatlng,
												            title: item.properties.NOMBRE,
												            icon: "img/capasIcons/"+layerId+".svg",
												            map: mapa
												        });
													}else {
														var marker = new google.maps.Marker({
												            position: myLatlng,
												            title: item.properties.NOMBRE,
												            icon: "img/capasIcons/"+layerId+".svg",
												        });
													}
													
													marker.addListener('click', function() {
														infowindow.open(mapa, marker);	
													});
													
													markers[stateId][layerId].push(marker);
							    			});	
											}
											if(zoomId !== 9) {
								    				markerCluster[stateId][layerId] = new MarkerClusterer(mapa, markers[stateId][layerId],
								    			            {imagePath: 'images/m'});
								    		}
							    		}else {
									    	
									    	var countR = 0;
									    	var idx = 0;
									    	data.multipolygon.forEach(function(item, index) {

									    		if(item.count > 0) {
									    			idx++;
									    			var cat = 0;
									    			if(item.count <= 10) {
									    				cat = 1;
									    			}else if(item.count <= 100) {
									    				cat = 2;
									    			}else if(item.count <= 1000) {
									    				cat = 3;
									    			}else if(item.count <= 5000) {
									    				cat = 4;
									    			}else {
									    				cat = 5;
									    			}
									    			
									    			var urlIcon;
									    			switch(cat) {
									    				case 1: urlIcon = 'images/m1.png'; break;
									    				case 2: urlIcon = 'images/m2.png'; break;
									    				case 3: urlIcon = 'images/m3.png'; break;
									    				case 4: urlIcon = 'images/m4.png'; break;
									    				case 5: urlIcon = 'images/m5.png'; break;
									    				default: urlIcon = '';
									    			}
									    			var pointCoord;
									    			if(zoomId === 0) {
									    				pointCoord = {lat: centerOfStates[stateId].latlng.lat, lng: centerOfStates[stateId].latlng.lng};
									    			}else {
									    				pointCoord = {lat: item.coord[1], lng: item.coord[0]};
									    				/*var constSum = 0;
									    				if(zoomId === 1) {
									    					constSum = 0.06;
									    				}else if(zoomId === 2) {
									    					constSum = 0.05;
									    				}else if(zoomId === 3) {
									    					constSum = 0.04;
									    				}else if(zoomId === 4) {
									    					constSum = 0.03;
									    				}else if(zoomId === 5) {
									    					constSum = 0.02;
									    				}else if(zoomId === 6) {
									    					constSum = 0.01;
									    				}
									    				var mod5 = idx % 5;
									    				if(mod5 === 0) {
									    					pointCoord = {lat: item.coord[1], lng: item.coord[0]};
									    				}else if(mod5 === 1) {
									    					pointCoord = {lat: item.coord[1], lng: (item.coord[0]-constSum)};
									    				}else if(mod5 === 2) {
									    					pointCoord = {lat: item.coord[1], lng: (item.coord[0]+constSum)};
									    				}else if(mod5 === 3) {
									    					pointCoord = {lat: (item.coord[1]-constSum), lng: (item.coord[0])};
									    				}else if(mod5 === 4) {
									    					pointCoord = {lat: (item.coord[1]+constSum), lng: (item.coord[0])};
									    				}*/
									    			}
										    		var marker = new google.maps.Marker({position: pointCoord,
										    			title: item.count.toString(),
										    			label: { color: '#000000', fontWeight: 'bold', fontSize: '12px', text: item.count.toString() },
										    			icon: urlIcon,
										    			map: mapa});
										    		marker.addListener('click', function() {
										    			var zoom = mapa.getZoom()+1;
										    			mapa.setZoom(zoom);
										    			mapa.setCenter(marker.getPosition());
										    	        });
										    		markers[stateId][layerId].push(marker);
										    		countR += item.count;
									    		}
											});
									    	$("#infoS"+stateId+"L"+layerId).html(countR.toLocaleString('en-US'));
							    		}
							    	}
							    });
							    
							    request.fail(function() {
							    });
						}
						
					   
					    
					}else {
						layoutUtils.progressDownload( stateId+"-"+layerId,"Descargando ","state/getLayerById?layerId=" + layerId + "&stateId=" + stateId, function (data, textStatus, jqxhr) {
					
						var response = data.capa;
						if(data.capa.length > 0){

							if (response[0].geometry.type == "Point" || response[0].geometry.type == "MultiPolygon" || response[0].geometry.type == "Polygon") {
								$("#infoS"+stateId+"L"+layerId).html(response.length.toLocaleString('en-US'));
							}else{
								$("#contenInfoS"+stateId+"L"+layerId).remove();
							}						
							events.printLayerInMap(stateId, layerId, response, mapa);
					    	currentDownloadingLayer= arrLayerRequested[stateId+"-"+layerId];
					    	if(layerId==76){
					    		banderaCapaManchaUrbanaAislada=1;
					    	}
					    	if(typeof(currentDownloadingLayer)!=="undefined"){
					    		currentDownloadingLayer.attr("disabled",false);
					    		delete arrLayerRequested[stateId+"-"+layerId];
					    	}
							
							$(".gradiente-cont").hide();
						}else{

					    	  new Noty({ theme: 'sunset',
		            	    	    text: 'Sin resultados que mostrar', type: 'alert', timeout: 3000
						      }).show();
						}				
			        });
					}
				} else {
					layoutUtils.progressDownload( stateId+"-"+layerId,"Descargando ","state/getLayerById?layerId=" + layerId + "&stateId=" + stateId, function (data, textStatus, jqxhr) {
						var response = data.capa;
						$(".gradiente-cont p").html("Población de 15 años y más alfabeta");
						$(".gradiente-cont span").html("0%");
						$(".gradiente-cont .span2").html("100%");
						$(".gradiente-cont").show();
						allLayersStatesGmaps[stateId][layerId] = L.geoJSON(response, {
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
				    	currentDownloadingLayer= arrLayerRequested[stateId+"-"+layerId];
				    	
				    	if(typeof(currentDownloadingLayer)!=="undefined"){
				    		currentDownloadingLayer.attr("disabled",false);
				    		delete arrLayerRequested[stateId+"-"+layerId];
				    	}
						//allLayersStatesGmaps[stateId][layerId].addTo(circumscription.st.globalMap);
						allLayersStatesGmaps[stateId][layerId].addTo(mapa);
					});
				}

			},
			printLayerInMap : function(state, layer, geoJsonData, mapa) {
				switch (geoJsonData[0].geometry.type) {
				case "Point":
					//clustering for: Puntos Moviles 
					var deepZoom = (layer == 133) ? 1 : 21;
					allLayersStatesGmaps[state][layer] = new MarkerClusterer(null, null, {imagePath: 'images/m',maxZoom: deepZoom});
					
					var oms = new OverlappingMarkerSpiderfier(mapa,{
						markersWontMove: true,
						markersWontHide: true,
						basicFormatEvents: true,
						keepSpiderfied: true
					});
					
					geoJsonData.forEach(function(item, index) {
						var contentString = events.beneficiariosDetalle(item);	
						/*
					var contentString = 
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
					(item.properties.UBIC ? "<br/>Ubicación: " + item.properties.UBIC : "") +
					(item.properties.TURNO ? "<br/>Turno: " + item.properties.TURNO : "") +
					(item.properties.LOCALIDAD ? "<br/>Localidad: " + item.properties.LOCALIDAD : "") +
					(item.properties.BENEFICIARIOS ? "<br/>Beneficiarios: " + item.properties.BENEFICIARIOS : "");*/

			        var infowindow = new google.maps.InfoWindow({
			          content: contentString
			        });
					
					var myLatlng = new google.maps.LatLng(item.geometry.coordinates[1],item.geometry.coordinates[0]);
					
      			  var image = {
					    	url: "img/capasIcons/" + layer + ".svg",
					    	//size: new google.maps.Size(50,50),
					    	//origin:new google.maps.Point(0, -25), 
					    	scaledSize: new google.maps.Size(25, 25)
					  };
      			  
					var marker = new google.maps.Marker({
			            position: myLatlng,
			            title: item.properties.NOMBRE,
			            icon: image, 
			            //label: item.properties.NOMBRE
			        });
					
					marker.addListener('click', function() {
						infowindow.open(mapa, marker);	
					});
					
					allLayersStatesGmaps[state][layer].addMarker(marker);
					
					oms.addMarker(marker);
					
					});
					
					break;
				case "LineString":
					if(layer == 104 || layer == 140 || layer == 142){
						events.createDataRutas(state,layer);
					}else{
						events.createData(state,layer);
					}
					var geojson = {
						"type" : "FeatureCollection",
						"metadata" : {},
						"features" : geoJsonData
					}
					allLayersStatesGmaps[state][layer].addGeoJson(geojson);
					break;
				case "MultiLineString":
					events.createData(state,layer);
					var geojson = {
							"type" : "FeatureCollection",
							"metadata" : {},
							"features" : geoJsonData
					}
					allLayersStatesGmaps[state][layer].addGeoJson(geojson);
					break;
				default:
					events.createData(state,layer, true);
					var geojson = {
							"type" : "FeatureCollection",
							"metadata" : {},
							"features" : geoJsonData
					}
					allLayersStatesGmaps[state][layer].addGeoJson(geojson);
				break;
				}
				allLayersStatesGmaps[state][layer].setMap(mapa);					
			},
			
			beneficiariosDetalle : function(item) {
				var contentString = 
					(item.properties.NOMBRE ? "<br/><strong>Nombre: </strong>" + item.properties.NOMBRE : "") +
					(item.properties.ine_calle ? "<br/><strong>Calle: </strong>" + item.properties.ine_calle : "") +
					(item.properties.ine_num_ext ? "<br/><strong>Num Ext: </strong>" + item.properties.ine_num_ext : "") +
					(item.properties.ine_num_colonia ? "<br/><strong>Colonia: </strong>" + item.properties.ine_num_colonia : "") +
					(item.properties.elector ? "<br/><strong>Elector: </strong>" + item.properties.elector : "") +
					(item.properties.rfc ? "<br/><strong>RFC: </strong>" + item.properties.rfc : "") +
					(item.properties.curp ? "<br/><strong>CURP: </strong>" + item.properties.curp : "") +
					(item.properties.fecha_nac ? "<br/><strong>Fecha Nac: </strong>" + item.properties.fecha_nac : "") +					
					(item.properties.telefono ? "<br/><strong>Teléfono: </strong>" + item.properties.telefono : "") +
					(item.properties.ine_ocupacion ? "<br/><strong>Ocupación: </strong>" + item.properties.ine_ocupacion : "") +
					(item.properties.nom_estab ? "<br/><strong>Nombre: </strong>" + item.properties.nom_estab : "") +
					(item.properties.nom_vial ? "<br/><strong>Dirección: </strong>" + item.properties.nom_vial : "") +
					(item.properties.fecha_alta ? "<br/><strong>Fecha Alta: </strong>" + item.properties.fecha_alta : "") +
					(item.properties.municipio ? "<br/><strong>Municipio: </strong>" + item.properties.municipio : "") +
					(item.properties.AGRUPADO ? "<br/><strong>AGRUPADO: </strong>" + item.properties.AGRUPADO : "") +
					(item.properties.DOMICILIO ? "<br/><strong>Domicilio: </strong>" + item.properties.DOMICILIO : "") +
					(item.properties["DIRECCIóN"] ? "<br/><strong>Domicilio: </strong>" + item.properties["DIRECCIóN"] : "") +
					(item.properties.cod_post ? "<br/><strong>Código Postal: </strong>" + item.properties.cod_post : "") +
					(item.properties.CAT ? "<br/><strong>Categoría: </strong>" + item.properties.CAT : "") +
					(item.properties.MUNICIPIO ? "<br/><strong>Municipio: </strong>" + item.properties.MUNICIPIO : "") +
					(item.properties.NOM_MPIO ? "<br/><strong>Municipio: </strong>" + item.properties.NOM_MPIO : "") +
					(item.properties.PADRON ? "<br/><strong>Padrón: </strong>" + item.properties.PADRON : "") +
					(item.properties.SECCION ? "<br/><strong>Sección: </strong>" + item.properties.SECCION : "") +
					(item.properties.TIPO ? "<br/><strong>Tipo: </strong>" + item.properties.TIPO : "") +
					(item.properties.TIPO_CA ? "<br/><strong>Tipo casilla: </strong>" + item.properties.TIPO_CA : "") +
					(item.properties.edad ? "<br/><strong>Edad: </strong>" + item.properties.edad : "") +
					(item.properties.UBIC ? "<br/><strong>Ubicación: </strong>" + item.properties.UBIC : "") +
					(item.properties.TURNO ? "<br/><strong>Turno: </strong>" + item.properties.TURNO : "") +
					(item.properties.LOCALIDAD ? "<br/><strong>Localidad: </strong>" + item.properties.LOCALIDAD : "") +
					(item.properties.BENEFICIARIOS ? "<br/><strong>Beneficiarios: </strong>" + item.properties.BENEFICIARIOS : "");	
				return contentString;
			},
			
			createDataRutas(stateId,layerId, over){
				if(!allLayersStatesGmaps[stateId]){
					allLayersStatesGmaps[stateId] = [];
				}
				allLayersStatesGmaps[stateId][layerId] = new google.maps.Data();
				allLayersStatesGmaps[stateId][layerId].setStyle(function(feature) {
		            var style = feature.getProperty('style');		            
		        	return /** @type {!google.maps.Data.StyleOptions} */style;
		        });
				allLayersStatesGmaps[stateId][layerId].addListener('mouseover', function(event) {
					allLayersStatesGmaps[stateId][layerId].overrideStyle(event.feature, {strokeWeight: 3, strokeColor: "red"});
					
					var distance = event.feature.getProperty('distance');
					var duration = event.feature.getProperty('duration');
					$(".info.leaflet-control").css("display", "block").html('<span>Distancia: '+distance.text+'</span>'+"<br/><span>Duración: "+duration.text+'</span>');
				});
				

				allLayersStatesGmaps[stateId][layerId].addListener('mouseout', function(event) {
					allLayersStatesGmaps[stateId][layerId].revertStyle();
					$(".info.leaflet-control").css("display", "none");
					$("#info-box").css("display", "none");
				});
			},
			createData(stateId,layerId, over){
				if(!allLayersStatesGmaps[stateId]){
					allLayersStatesGmaps[stateId] = [];
				}
				allLayersStatesGmaps[stateId][layerId] = new google.maps.Data();
				allLayersStatesGmaps[stateId][layerId].setStyle(function(feature) {
					var style = feature.getProperty('style');		            
					return /** @type {!google.maps.Data.StyleOptions} */style;
				});
				if(over){
					
					allLayersStatesGmaps[stateId][layerId].addListener('mouseover', function(event) {
						allLayersStatesGmaps[stateId][layerId].overrideStyle(event.feature, {strokeWeight: 2});
						
						var name = false;
						if (event.feature.getProperty('df_Cabecera')) {
							name = event.feature.getProperty('df_Cabecera');
						} else if (event.feature.getProperty('DISTRITO')) {
							name = "Distrito: " + event.feature.getProperty('DISTRITO');
						} else if (event.feature.getProperty('SECCION')) {
							name = "Sección: " + event.feature.getProperty('SECCION');
							if(event.feature.getProperty('PARTIDO_GANADOR')){
								name += "<br/>Ganador: "+event.feature.getProperty('PARTIDO_GANADOR');
							}
						} else if (event.feature.getProperty('NOMBRE')) {
							name = event.feature.getProperty('NOMBRE');
						}
						if (event.feature.getProperty('SS_MUNICIPIO')) {
							name += "<br/>Municipio: " + event.feature.getProperty('SS_MUNICIPIO');
						}
						
						
						$("#detallePoblacion").html("");
						$("#detalleGenero").html("");
						if (event.feature.getProperty('LN160318')) {
							$("#detallePoblacion").append(
									$("<div/>").html($("<b/>").html("Listado nominal:")).append(event.feature.getProperty('LN160318'))
							);
						}
						if (event.feature.getProperty('HAB2015INEGI')) {
							$("#detallePoblacion").append(
									$("<div/>").html($("<b/>").html("Listado nominal:")).append(event.feature.getProperty('HAB2015INEGI'))
							);
						}
						if (event.feature.getProperty('HOMBRES')) {
							$("#detalleGenero").append(
									$("<div/>").html($("<b/>").html("Listado nominal:")).append(event.feature.getProperty('HOMBRES'))
							);
						}
						if (event.feature.getProperty('MUJERES')) {
							$("#detalleGenero").append(
									$("<div/>").html($("<b/>").html("Listado nominal:")).append(event.feature.getProperty('MUJERES'))
							);
						}
						
						if (name) {
							$(".info.leaflet-control").css("display", "block").html('<h4>'+name+'</h4>');
							//$("#info-box").css("display", "block").html('<h4>' + name + '</h4>');
						}
						
//		 				if(event.feature.getProperty('economialocal')){
//		        			latLongCenter=event.feature.getProperty('center');
//		        			var myLatlng = new google.maps.LatLng(latLongCenter.coordinates[1],latLongCenter.coordinates[0]);
//		        			marker = new google.maps.Marker({
//					            position: myLatlng,
//					            icon: "img/tpv.svg",
//					            map: initializedMap
//					        });
//		        			blueMarkers.push(marker);
//		 				}
						
					});
				}
				
				allLayersStatesGmaps[stateId][layerId].addListener('click', function(event) {
					if(!googleMaps.st.requestTimeDistance){
						if (event.feature.getProperty('kilometros')) {
							events.showDetalleManchaUrbanaModal(event);
						}
					}else{
						googleMaps.events.traceRouteInMap(allLayersStatesGmaps[stateId][layerId].map, event);
					}
				});

				allLayersStatesGmaps[stateId][layerId].addListener('mouseout', function(event) {
					allLayersStatesGmaps[stateId][layerId].revertStyle();
					$(".info.leaflet-control").css("display", "none");
					$("#info-box").css("display", "none");
//					
//	 	        	if(event.feature.getProperty('economialocal')){
//     			       for (var i = 0; i < blueMarkers.length; i++) {
//     			    	   blueMarkers[i].setMap(null);
//     			         }	
//     			       blueMarkers=[];
//	 	        	}
					
				});
			},
			showDetalleManchaUrbanaModal: function(event){
				$("#detailManchaUrbanaModal .modal-body").html('');
				$("#detailManchaUrbanaModal .modal-body").append(
					'<div class="detalleManchaUrb clearfix">'+
					'<div><span><span>Municipios:</span></span><span><span> '+event.feature.getProperty('municipios_desc')+'</span></span></div>'+
					'<div><img src="img/iconsMenu/35.png"><span><span>KM2:</span></span><span><span> '+event.feature.getProperty('kilometros')+'</span></span></div>'+
					'<div><img src="img/iconsMenu/53.png"><span><span>Oxxos:</span></span><span><span> '+event.feature.getProperty('oxxos')+'</span></span></div>'+
					'<div><img src="img/iconsMenu/72.png"><span><span>Seven:</span></span><span><span> '+event.feature.getProperty('seven')+'</span></span></div>'+
					'<div><img src="img/iconsMenu/23.png"><span><span>Bancos:</span></span><span><span> '+event.feature.getProperty('bancos')+'</span></span></div>'+
					'<div><img src="img/iconsMenu/71.png"><span><span>Bansefi:</span></span><span><span> '+event.feature.getProperty('bansefi')+'</span></span></div>'+
					'<div><img src="img/iconsMenu/85.png"><span><span>Banco Azteca:</span></span><span><span> '+event.feature.getProperty('bancoazteca')+'</span></span></div>'+
					'<div><img src="img/iconsMenu/57.png"><span><span>Liconsa:</span></span><span><span> '+event.feature.getProperty('liconsa')+'</span></span></div>'+
					'<div><img src="img/iconsMenu/73.png"><span><span>Diconsa:</span></span><span><span> '+event.feature.getProperty('diconsa')+'</span></span></div>'+
					'<div><img src="img/iconsMenu/67.png"><span><span>Localidades Indígenas:</span></span><span><span> '+event.feature.getProperty('loc_ind')+'</span></span></div>'+
					'<div><img src="img/iconsMenu/29.png"><span><span>Mercados:</span></span><span><span>'+event.feature.getProperty('mercados')+'</span></span></div>'+
					'<div><img src="img/iconsMenu/44.png"><span><span>Tienditas:</span></span><span><span> '+event.feature.getProperty('tienditas')+'</span></span></div>'+
					'<div><img src="img/iconsMenu/31.png"><span><span>Municipios No.:</span></span><span><span> '+event.feature.getProperty('municipio')+'</span></span></div>'+
					'<div><img src="img/iconsMenu/21.png"><span><span>Hospital:</span></span><span><span> '+event.feature.getProperty('hospital')+'</span></span></div>'+
					'<div><img src="img/iconsMenu/19.png"><span><span>Escuelas:</span></span><span><span> '+event.feature.getProperty('escuela')+'</span></span></div>'+
					'<div><img src="img/iconsMenu/3.png"><span><span>Autopista:</span></span><span><span> '+event.feature.getProperty('autopista')+'</span></span></div>'+
					'<div><img src="img/iconsMenu/86.png"><span><span>Cobertura Telcel 4G:</span></span><span><span> '+event.feature.getProperty('coberturatelcel4g')+'</span></span></div>'+
					'<div><img src="img/iconsMenu/87.png"><span><span>Cobertura Telcel 3G Datos:</span></span><span><span> '+event.feature.getProperty('coberturatelcel3g')+'</span></span></div>'+
					'<div><img src="img/iconsMenu/88.png"><span><span>Cobertura Telcel 3G Voz:</span></span><span><span> '+event.feature.getProperty('coberturatelcel3gv')+'</span></span></div>'+
					'<div><img src="img/iconsMenu/89.png"><span><span>Cobertura Telcel 2G:</span></span><span><span> '+event.feature.getProperty('coberturatelcel2g')+'</span></span></div>'+
					'<div><img src="img/iconsMenu/95.png"><span><span>Cobertura Movi 4G:</span></span><span><span> '+event.feature.getProperty('coberturamovi4g')+'</span></span></div>'+
					'<div><img src="img/iconsMenu/96.png"><span><span>Cobertura Movi 3G:</span></span><span><span> '+event.feature.getProperty('coberturamovi3g')+'</span></span></div>'+
					'<div><img src="img/iconsMenu/97.png"><span><span>Cobertura Movi 2G:</span></span><span><span> '+event.feature.getProperty('coberturamovi2g')+'</span></span></div>'+
					'<div><img src="img/iconsMenu/98.png"><span><span>Cobertura AT&T 4G:</span></span><span><span> '+event.feature.getProperty('coberturaatt4g')+'</span></span></div>'+
					'<div><img src="img/iconsMenu/99.png"><span><span>Cobertura AT&T 3G:</span></span><span><span> '+event.feature.getProperty('coberturaatt3g')+'</span></span></div>'+
					'</div>'
				);
				
				$("#detailManchaUrbanaModal").modal('show');
			},
			mouseoverMap: function(stateId,layerId,event){
				
			},
			createLayersMap : function(id, div, map) {				
				if(!allLayersStatesGmaps[id]){
					allLayersStatesGmaps[id] = [];
				}
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
													.html(nombreCapas[k]).append(
													$("<span/>").addClass("expand_caret caret")
													)
											)
										)
								).append(items)
							);
						});
						
						
						if(id == 21){
							var items = $("<div/>").addClass("collapse").attr("id", "collapseValidacion");
							var item = $('<label/>').addClass("form-check-label").html("Servidores").append(
									$('<input/>').attr("type", "checkbox").val(-1)
									.change(function() {
										if ($(this).is(':checked')) {

											$(".txtBuscarServidores").show();
											$.getJSON("live/getPromoted2018", function(response) {
												
												allLayersStatesGmaps[21]["promoted"] = new MarkerClusterer(null, null, {imagePath: 'images/m',maxZoom: 21});
												
												var oms = new OverlappingMarkerSpiderfier(map,{
													markersWontMove: true
													,markersWontHide: true
													,basicFormatEvents: true
													,keepSpiderfied: true
												});
												
												$.each(response, function(k, item) {
													var contentString = 
														"<br/>Última ubicación: " + item.fechaRegistro.$date.substring(0, item.fechaRegistro.$date.indexOf("."))+
														"<br/>IMEI: " + item.imei+
														"<br/>Pila: " + item.pila+"%"+
														"<br/>Señal: " + item.senial+"%"
														;
												
											        var infowindow = new google.maps.InfoWindow({
											          content: contentString
											        });
													
													var myLatlng = new google.maps.LatLng(item.latitud,item.longitud);
													
													var marker = new google.maps.Marker({
											            position: myLatlng,
											            title: item.imei,
											            icon: "img/capasIcons/servidor_nacion.svg",
											        });
													
													marker.addListener('click', function() {
														infowindow.open(map, marker);
														map.setZoom(22);
												        map.setCenter(marker.getPosition());
													});
													
													allLayersStatesGmaps[21]["promoted"].addMarker(marker);
													
													oms.addMarker(marker);
													
												});
												
												allLayersStatesGmaps[21]["promoted"].setMap(map);
												
											});
										} else {
											allLayersStatesGmaps[21]["promoted"].setMap(null);
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
											$.each(allLayersStatesGmaps[21]["promoted"].getMarkers(), function(k, item) {
												if (item.title == $(".txtBuscarServidores input").val()){
													google.maps.event.trigger(item, "click");
												}
											});
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
															.html("S. Nación")
															.append(
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

													if (!allLayersStatesGmaps[id][layerId]) {
														layoutUtils.progressDownload( id+"-"+layerId,"Descargando ","state/getLayerById?layerId=" + layerId + "&stateId=" + id, function (data, textStatus, jqxhr) {
															var response = data.capa;
															allLayersStatesGmaps[id]["response" + layerId] = response;
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

													if (!allLayersStatesGmaps[id][layerId]) {
														layoutUtils.progressDownload( id+"-"+layerId,"Descargando ","state/getLayerById?layerId=" + layerId + "&stateId=" + id, function (data, textStatus, jqxhr) {
															var response = data.capa;
															allLayersStatesGmaps[id]["response" + layerId] = response;
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

				allLayersStatesGmaps[estado][layerId] = new google.maps.Data();
				allLayersStatesGmaps[estado][layerId].setStyle(function(feature) {
					var minimo = 0;
					var percent = feature.f[campo] * 100 / maximo;

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
						fillColor: (feature.f[campo] !== undefined) ? color : "#ccc",
					    strokeColor: colorLinea,
					    fillOpacity: 0.7,
					    strokeOpacity: 1,
					    strokeWeight: 1,
					};
				});
				allLayersStatesGmaps[estado][layerId].addListener('mouseover', function(event) {
					var layer = event.feature;			
					if (campo !== undefined) {
						$(".info.leaflet-control").css("display", "block").html('<h4>' + descrip + ': ' + (layer.f[campo] > 0 ? layer.f[campo] : 0) + (perc ? "%" : "") + '</h4>');
					}
				});
				allLayersStatesGmaps[estado][layerId].addListener('mouseout', function(event) {
					$(".info.leaflet-control").css("display", "none");
				});
				var geojson = {"type" : "FeatureCollection","metadata" : {},"features" : allLayersStatesGmaps[estado]["response" + layerId]}
				allLayersStatesGmaps[estado][layerId].addGeoJson(geojson);
				allLayersStatesGmaps[estado][layerId].setMap(mapa);
				setTimeout(function() {
					$.unblockUI();
				}, 500);
			},
			fitBounds: function(layer, mapa) {
				layer.toGeoJson(function(e) {
					var bounds = new google.maps.LatLngBounds();						
					e.geometry.coordinates[0][0].forEach(function(item, index) {
						coord = {lat: parseFloat(item[1]),lng: parseFloat(item[0])};
						// Agregamos la coordenada al bounds
						bounds.extend(coord);
					});
					mapa.fitBounds(bounds);
				});
			},
			getCenter: function(e) {
				var center;
				var bounds = new google.maps.LatLngBounds();						
				e.geometry.coordinates[0][0].forEach(function(item, index) {
					coord = {lat: parseFloat(item[1]),lng: parseFloat(item[0])};
					// Agregamos la coordenada al bounds
					bounds.extend(coord);
				});				
				return bounds.getCenter();
			},
			getDetailsZoneAisladaByState : function(stateId, layerId, layerAlias){
				
				let params = { stateId : stateId, labelName : layerAlias.toLowerCase().replace("oxxo", "oxxos").replace(" ", "").replace(" ", "").replace(" ", "")
						.replace("&", "").replace("hospitales", "hospital").replace("escuelas", "escuela").replace("seveneleven", "seven")
						.replace("localidadesindigenas", "loc_ind").replace("tortillerías", "tortillerias").replace("mecánicos", "mecanicos")
						.replace("pizeríaspolleríasyafines", "pizzeria")};
				
				st.requestDetailsZoneAisladaByState = $.ajax({
					url: "quizze/getDetailsZoneAisladaByState",
					method: "POST",
					data : params
				});
				
				st.requestDetailsZoneAisladaByState.done(function(response) {
					st.responseGetDetailsZoneAisladaByState = response;
					
					if( response.aisaladas.total != 0 || response.no_aisladas.total != 0){
						$("#contenInfoS"+stateId+"L"+layerId).append(
								"<span>&nbsp; A: </span>" +
								"<b id='infoS"+stateId+"L"+layerId+"A' style='margin-left: 5px;'>"+ response.aisaladas.total.toLocaleString('en-US') +"</b>" +
								"<span>&nbsp; NA: </span>" +
								"<b id='infoS"+stateId+"L"+layerId+"NA' style='margin-left: 5px;'>"+ response.no_aisladas.total.toLocaleString('en-US') +"</b>"
						);
					}
				});
				
			},
			traceRouteInMapNear(map_selected, latLong, icon){
				if(googleMaps.st.marksToTraceRoute.length < 2){
					var marker = new google.maps.Marker({
				          map: map_selected,
				          position: {lat: latLong.lat ,  lng: latLong.lng },
				          title: googleMaps.st.marksToTraceRoute.length == 0 ? 'Inicio' : 'Fin',
				          icon: googleMaps.st.marksToTraceRoute.length == 0 ? "" : "img/capasIcons/"+icon+".svg"
				    });
					googleMaps.st.marksToTraceRoute.push(marker);
					
					if(googleMaps.st.marksToTraceRoute.length == 2){
						var request_d = {
							      origin: new google.maps.LatLng(googleMaps.st.marksToTraceRoute[0].getPosition().lat(), googleMaps.st.marksToTraceRoute[0].getPosition().lng()),
							      destination: new google.maps.LatLng(googleMaps.st.marksToTraceRoute[1].getPosition().lat(), googleMaps.st.marksToTraceRoute[1].getPosition().lng()),
							      travelMode: "DRIVING"
							  };
						var request_w = {
						      origin: new google.maps.LatLng(googleMaps.st.marksToTraceRoute[0].getPosition().lat(), googleMaps.st.marksToTraceRoute[0].getPosition().lng()),
						      destination: new google.maps.LatLng(googleMaps.st.marksToTraceRoute[1].getPosition().lat(), googleMaps.st.marksToTraceRoute[1].getPosition().lng()),
						      travelMode: "WALKING"
						  };
						var request_b = {
			        		  origin: new google.maps.LatLng(googleMaps.st.marksToTraceRoute[0].getPosition().lat(), googleMaps.st.marksToTraceRoute[0].getPosition().lng()),
			        		  destination: new google.maps.LatLng(googleMaps.st.marksToTraceRoute[1].getPosition().lat(), googleMaps.st.marksToTraceRoute[1].getPosition().lng()),
			        		  travelMode: "BICYCLING"
						};
				          new google.maps.DirectionsService().route(request_d, function(response, status) {
				        	  if (status == 'OK') {
							      if(response.routes && response.routes[0]){
							    	  var geo = [];
							    	  
							    	  if(!response.routes[0].overview_path){
							    		  //console.log("decode");
							    		  response.routes[0].overview_path = google.maps.geometry.encoding.decodePath(encodedPolyline);
							    	  }
							    	  
							    	  response.routes[0].overview_path.forEach(function(e){
							    	  	geo.push([e.lng(), e.lat()])
							    	  })
							    	  
							    	  var geojson = {
												type:"Feature" ,
												stateId: 1,
												properties: {
													distance: response.routes[0].legs[0].distance,
								    	  			duration: response.routes[0].legs[0].duration,
								    	  			style: {
								    	  				strokeColor: '#ff0000',
										    	        strokeOpacity:1,
										    	        strokeWeight:2.5,
										    	        fillColor: '#ff0000',
										    	        fillOpacity:.1
								    	  			}
												},
												geometry: {
												        type: "LineString", 
												        coordinates:geo
												}
											};
							    	  
							    	  googleMaps.st.marksToTraceRoute[2] = new google.maps.Data({style: geojson.properties.style });
							    	  
							    	  googleMaps.st.marksToTraceRoute[2].addGeoJson(geojson);
							    	  googleMaps.st.marksToTraceRoute[2].setMap(map_selected);
							    	  
							    	  new google.maps.DirectionsService().route(request_w, function(response_w, status) {
							    		  new google.maps.DirectionsService().route(request_b, function(response_b, status) {
									    	  var infowindow = new google.maps.InfoWindow({
									    		  content: '<div style="margin-bottom: 2em;">' +
											    			  '<ul class="nav nav-tabs" role="tablist">' +
											    			    '<li role="presentation" class="active"><a href="#home" aria-controls="home" role="tab" data-toggle="tab"><h5>Carro</h5></a></li>' +
											    			    '<li role="presentation"><a href="#profile" aria-controls="profile" role="tab" data-toggle="tab"><h5>Bicicleta</h5></a></li>' +
											    			    '<li role="presentation"><a href="#messages" aria-controls="messages" role="tab" data-toggle="tab"><h5>Caminar</h5></a></li>' +
											    			  '</ul>' +
											    			  '<div class="tab-content">' +
											    			    '<div role="tabpanel" class="tab-pane active" id="home">' +
											    			  		'<h5 style="text-align: center;"> Tiempo: ' + response.routes[0].legs[0].duration.text + '</h5>' +
											    			  		'<h5 style="text-align: center;"> Distancia: ' + response.routes[0].legs[0].distance.text + '</h5>' +
											    			  	'</div>' +
											    			    '<div role="tabpanel" class="tab-pane" id="profile">' +
											    			  		'<h5 style="text-align: center;"> Tiempo: ' + response_b.routes[0].legs[0].duration.text + '</h5>' +
											    			  		'<h5 style="text-align: center;"> Distancia: ' + response_b.routes[0].legs[0].distance.text + '</h5>' +
											    			  	'</div>' +
											    			    '<div role="tabpanel" class="tab-pane" id="messages">' +
											    			  		'<h5 style="text-align: center;"> Tiempo: ' + response_w.routes[0].legs[0].duration.text + '</h5>' +
											    			  		'<h5 style="text-align: center;"> Distancia: ' + response_w.routes[0].legs[0].distance.text + '</h5>' +
											    			  	'</div>' +
											    			  '</div>' +
											    			'</div>'+
											    			'<div>'+
												    			'<h5> <img src="img/capasIcons/inicio.svg" style="width: 20px; margin-right: 10px;"/>' + response.routes[0].legs[0].start_address + '</h5>'+
								    	  						'<h5> <img src="img/capasIcons/fin.svg" style="width: 20px; margin-right: 10px;"/>' + response.routes[0].legs[0].end_address + '</h5>' + 
								    	  					'</div>'
									    	  });
									    	  
									    	  googleMaps.st.marksToTraceRoute[1].addListener('click', function() {
									    		    infowindow.open(map_selected, googleMaps.st.marksToTraceRoute[1]);
									    	  });
									    	  
									    	  infowindow.open(map_selected, googleMaps.st.marksToTraceRoute[1]);
							    		  });
							    	  });
							    	  
							      }									      
				        	  }else{
						    	  new Noty({ theme: 'sunset',
			            	    	    text: 'No se encontró una ruta', type: 'alert', timeout: 3000
							      }).show();
						      }
		                });							
					}
				}else{
					googleMaps.st.marksToTraceRoute.forEach(function(v, i){
						googleMaps.st.marksToTraceRoute[i].setMap(null);
					});
					googleMaps.st.marksToTraceRoute = [];
				}
			},
			traceRouteInMap(map_selected, event){
				if(googleMaps.st.marksToTraceRoute.length < 2){
					var marker = new google.maps.Marker({
				          map: map_selected,
				          position: {lat: event.latLng.lat() ,  lng: event.latLng.lng() },
				          title: googleMaps.st.marksToTraceRoute.length == 0 ? 'Inicio' : 'Fin',
				          icon: googleMaps.st.marksToTraceRoute.length == 0 ? "img/capasIcons/inicio.svg" : "img/capasIcons/fin.svg"
				    });
					googleMaps.st.marksToTraceRoute.push(marker);
					
					if(googleMaps.st.marksToTraceRoute.length == 2){
						var request_d = {
							      origin: new google.maps.LatLng(googleMaps.st.marksToTraceRoute[0].getPosition().lat(), googleMaps.st.marksToTraceRoute[0].getPosition().lng()),
							      destination: new google.maps.LatLng(googleMaps.st.marksToTraceRoute[1].getPosition().lat(), googleMaps.st.marksToTraceRoute[1].getPosition().lng()),
							      travelMode: "DRIVING"
							  };
						var request_w = {
						      origin: new google.maps.LatLng(googleMaps.st.marksToTraceRoute[0].getPosition().lat(), googleMaps.st.marksToTraceRoute[0].getPosition().lng()),
						      destination: new google.maps.LatLng(googleMaps.st.marksToTraceRoute[1].getPosition().lat(), googleMaps.st.marksToTraceRoute[1].getPosition().lng()),
						      travelMode: "WALKING"
						  };
						var request_b = {
			        		  origin: new google.maps.LatLng(googleMaps.st.marksToTraceRoute[0].getPosition().lat(), googleMaps.st.marksToTraceRoute[0].getPosition().lng()),
			        		  destination: new google.maps.LatLng(googleMaps.st.marksToTraceRoute[1].getPosition().lat(), googleMaps.st.marksToTraceRoute[1].getPosition().lng()),
			        		  travelMode: "BICYCLING"
						};
				          new google.maps.DirectionsService().route(request_d, function(response, status) {
				        	  if (status == 'OK') {
							      if(response.routes && response.routes[0]){
							    	  var geo = [];
							    	  
							    	  if(!response.routes[0].overview_path){
							    		  response.routes[0].overview_path = google.maps.geometry.encoding.decodePath(encodedPolyline);
							    	  }
							    	  
							    	  response.routes[0].overview_path.forEach(function(e){
							    	  	geo.push([e.lng(), e.lat()])
							    	  })
							    	  
							    	  var geojson = {
												type:"Feature" ,
												stateId: 1,
												properties: {
													distance: response.routes[0].legs[0].distance,
								    	  			duration: response.routes[0].legs[0].duration,
								    	  			style: {
								    	  				strokeColor: '#ff0000',
										    	        strokeOpacity:1,
										    	        strokeWeight:2.5,
										    	        fillColor: '#ff0000',
										    	        fillOpacity:.1
								    	  			}
												},
												geometry: {
												        type: "LineString", 
												        coordinates:geo
												}
											};
							    	  
							    	  googleMaps.st.marksToTraceRoute[2] = new google.maps.Data({style: geojson.properties.style });
							    	  
							    	  googleMaps.st.marksToTraceRoute[2].addGeoJson(geojson);
							    	  googleMaps.st.marksToTraceRoute[2].setMap(map_selected);
							    	  
							    	  new google.maps.DirectionsService().route(request_w, function(response_w, status) {
							    		  new google.maps.DirectionsService().route(request_b, function(response_b, status) {
									    	  var infowindow = new google.maps.InfoWindow({
									    		  content: '<div style="margin-bottom: 2em;">' +
											    			  '<ul class="nav nav-tabs" role="tablist">' +
											    			    '<li role="presentation" class="active"><a href="#home" aria-controls="home" role="tab" data-toggle="tab"><h5>Carro</h5></a></li>' +
											    			    '<li role="presentation"><a href="#profile" aria-controls="profile" role="tab" data-toggle="tab"><h5>Bicicleta</h5></a></li>' +
											    			    '<li role="presentation"><a href="#messages" aria-controls="messages" role="tab" data-toggle="tab"><h5>Caminar</h5></a></li>' +
											    			  '</ul>' +
											    			  '<div class="tab-content">' +
											    			    '<div role="tabpanel" class="tab-pane active" id="home">' +
											    			  		'<h5 style="text-align: center;"> Tiempo: ' + response.routes[0].legs[0].duration.text + '</h5>' +
											    			  		'<h5 style="text-align: center;"> Distancia: ' + response.routes[0].legs[0].distance.text + '</h5>' +
											    			  	'</div>' +
											    			    '<div role="tabpanel" class="tab-pane" id="profile">' +
											    			  		'<h5 style="text-align: center;"> Tiempo: ' + response_b.routes[0].legs[0].duration.text + '</h5>' +
											    			  		'<h5 style="text-align: center;"> Distancia: ' + response_b.routes[0].legs[0].distance.text + '</h5>' +
											    			  	'</div>' +
											    			    '<div role="tabpanel" class="tab-pane" id="messages">' +
											    			  		'<h5 style="text-align: center;"> Tiempo: ' + response_w.routes[0].legs[0].duration.text + '</h5>' +
											    			  		'<h5 style="text-align: center;"> Distancia: ' + response_w.routes[0].legs[0].distance.text + '</h5>' +
											    			  	'</div>' +
											    			  '</div>' +
											    			'</div>'+
											    			'<div>'+
												    			'<h5> <img src="img/capasIcons/inicio.svg" style="width: 20px; margin-right: 10px;"/>' + response.routes[0].legs[0].start_address + '</h5>'+
								    	  						'<h5> <img src="img/capasIcons/fin.svg" style="width: 20px; margin-right: 10px;"/>' + response.routes[0].legs[0].end_address + '</h5>' + 
								    	  					'</div>'
									    	  });
									    	  
									    	  googleMaps.st.marksToTraceRoute[1].addListener('click', function() {
									    		    infowindow.open(map_selected, googleMaps.st.marksToTraceRoute[1]);
									    	  });
									    	  
									    	  infowindow.open(map_selected, googleMaps.st.marksToTraceRoute[1]);
							    		  });
							    	  });
							    	  
							      }									      
				        	  }else{
						    	  new Noty({ theme: 'sunset',
			            	    	    text: 'No se encontró una ruta', type: 'alert', timeout: 3000
							      }).show();
						      }
		                });							
					}
				}else{
					googleMaps.st.marksToTraceRoute.forEach(function(v, i){
						googleMaps.st.marksToTraceRoute[i].setMap(null);
					});
					googleMaps.st.marksToTraceRoute = [];
				}
			},
			restoreTraceRoute :  function(){
				googleMaps.st.requestTimeDistance = false;
				if(googleMaps.st.marksToTraceRoute){
					googleMaps.st.marksToTraceRoute.forEach(function(v, i){
						googleMaps.st.marksToTraceRoute[i].setMap(null);
					});
					googleMaps.st.marksToTraceRoute = [];
				}
			},
			loadListMunicipiosByState : function (stateId, nameStates) {
				$("#cmbMunDetalle")
				.html(
					$("<option/>")
					.attr("value", "-1")
					.append("Buscar por Municipio de "+ nameStates)
				);
				function sortMunicipioList(a,b){
				    return a.properties.NOMBRE.toLowerCase() > b.properties.NOMBRE.toLowerCase() ? 1 : -1;
				};
				$.getJSON("state/getMuninipiosList",{stateId:stateId}, function(res){
					res = $(res).sort(sortMunicipioList);
					$.each(res, function(k,v){
			    		$("#cmbMunDetalle")
						.append(
							$("<option/>")
							.attr("value", v.properties.NOMBRE)
							.append(v.properties.NOMBRE)
						);
			    	});
			    	$("#cmbMunDetalle").selectpicker('refresh');
				});
			},
			initMapRuta : function(evt){
				layout.st.currentLatLng = evt.latLng;
				layout.st.globalMapRuta.setCenter(evt.latLng);
				
				if(layout.st.polyLineMap)
					layout.st.polyLineMap.setMap(null);
				
				layout.st.polyLineMap = new google.maps.Polyline({
			    	path: [{lat: evt.latLng.lat() ,  lng: evt.latLng.lng() }],
			        geodesic: true,
			        editable: true,
			        strokeColor: '#FF0000',
			        strokeOpacity: 1.0,
			        strokeWeight: 2
			    });
			    
				//limpiar de marcadores anteriores
				events.deleteMarkersRoute(false);
				//marker de ubicacion inicio de ruta
				let marker = new google.maps.Marker({
			          map: layout.st.globalMapRuta,
			          position: {lat: evt.latLng.lat() ,  lng: evt.latLng.lng() },
			          title: 'Inicio!'
			    });
				layout.st.markerRuta.push(marker);
				
				//variable que centra al accionar el boton
				layout.st.centerofMapRuta = {lat: evt.latLng.lat() ,  lng: evt.latLng.lng() };
				
			    layout.st.polyLineMap.setMap(layout.st.globalMapRuta);
			    
			    //limpiar formulario
			    $('#form-quizze')[0].reset();
				$('#select-recibe-beneficio').trigger('change');
			},
			drawLine : function(loc) {
				layout.st.polyLineMap.getPath().push(loc);
			},
			deleteMarkersRoute : function( flag ){
				layout.st.markerRuta.forEach(function(v, i){
					if(flag){
						if(i != 0){
							layout.st.markerRuta[i].setMap(null);
							layout.st.markerRuta.splice(i,1);
						}
					}else{
						layout.st.markerRuta[i].setMap(null);
					}
				});
				if(!flag){
					layout.st.markerRuta = [];
				}
			},
		    saveRuta : function(data){
				st.req_saveRuta = $.ajax({
					url: "quizze/saveRutaEncuesta",
					method: "POST",
					//contentType: "application/json; charset=utf-8",
					data : data
				});
			},
	}
	var initialize = function() {
		suscribeEvents();
		initProperties();
	};

	return {
		// calling master module
		init : initialize,
		Variables : Variables,
		events : events,
		st : st
	}
})();


$(document).ready(function() {
	bankablePlace1={ nombre: "Oxxo" ,layerId: 53,label:"OXXO",icon:53};
	
	nearBankablePlaces.push(bankablePlace1);
	
	bankablePlace2={ nombre: "Seven" ,layerId: 54,label:"Seven",icon:72};
	
	nearBankablePlaces.push(bankablePlace2);
	
	bankablePlace3={ nombre: "Bansefi" , layerId: 55,label:"BANSEFI",icon:71};
	
	nearBankablePlaces.push(bankablePlace3);
	
	bankablePlace4={ nombre: "Banamex" , layerId: 56,label:"BANAMEX",icon:106};
	
	nearBankablePlaces.push(bankablePlace4);
	
	googleMaps.init();
});
