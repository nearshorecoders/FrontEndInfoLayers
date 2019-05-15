
var currentView="";
var arrayAllZones=[];
var arrayAllStates=[];
var arrayCircunscriptionStates=[];
var lastCircunscripcionSelected="";
var lastStateSelected="";
var abiertoC = 0;
var dataGeometryEstados=null;
var globalMarkerClusterByState=null;
var divisionToSend;

var circumscription = (function() {
    //your variables here
    //---var a;
	var st = {
			globalMap: null,
			globalMapG: null,
			globalLayers: {},
			titleLayer: null,
			globalGeoJson: null,
			globalGeoJsonGM: null,
			requestGetPollingLayerByState: null,
			responseGetPollingLayerByState: null,
			stateSelected: null,
			layerSelected: null, 
	}
	
	var centerOfCir = {
			"C1": {latlng: [26.194876675795218, -107.34741210937501 ],zoom: 6},
			"C2": {latlng: [24.50714328310284, -101.04125976562501 ],zoom: 6},
			"C3": {latlng: [18.95824648598139, -95.67993164062501],zoom: 6},
			"C4": {latlng: [18.166730410221938, -99.02526855468751],zoom: 7},
			"C5": {latlng: [19.487307518564272, -101.2445068359375 ],zoom: 7},
	}
	var centerOfStates = {
			  1: {shortDesc: "AGS" ,latlng: [22.04745905654542 , -102.3204803466797 ],zoom: 10},
			  2: {shortDesc: "BC" ,latlng: [30.41078179084589 ,  -115.02136230468751 ],zoom:  7 },
			  3: {shortDesc: "BCS" ,latlng: [25.97779895546436  , -112.04406738281251],zoom: 7 },
			  4: {shortDesc: "CAM" ,latlng: [19.21780295966795 , -90.45318603515626],zoom: 8 },
			  5: {shortDesc: "COAH" ,latlng: [27.518015241965667 , -101.14562988281251],zoom: 7 },
			  6: {shortDesc: "COL" ,latlng: [19.12700450429055 , -104.08515930175781],zoom: 10 },
			  7: {shortDesc: "CHIS" ,latlng: [16.320139453117577 , -92.58453369140626],zoom: 8 },
			  8: {shortDesc: "CHIH" ,latlng: [29.113775395114416 , -106.61682128906251],zoom: 7 },
			  9: {shortDesc: "DF" ,latlng: [19.338357615423384 , -99.15229797363283],zoom: 10 },
			  10: {shortDesc: "DUR" ,latlng: [24.936257323061316 ,  -105.13366699218751 ],zoom:  7 },
			  11: {shortDesc: "GTO" ,latlng: [20.879342971957897 , -101.14974975585939],zoom: 9 },
			  12: {shortDesc: "GRO" ,latlng: [17.65449123359241 , -100.14862060546876],zoom: 8 },
			  13: {shortDesc: "HGO" ,latlng: [20.517071864049157 , -98.84536743164062],zoom: 9 },
			  14: {shortDesc: "JAL" ,latlng: [20.87421043965721 , -104.19708251953126],zoom: 8 },
			  15: {shortDesc: "MEX" ,latlng: [19.34742802788708 ,  -99.64187622070314 ],zoom:  9 },
			  16: {shortDesc: "MICH" ,latlng: [19.108838815166017 , -102.11517333984376],zoom: 8 },
			  17: {shortDesc: "MOR" ,latlng: [18.747708976598755 ,  -99.01771545410156 ],zoom:  10 },
			  18: {shortDesc: "NAY" ,latlng: [21.790107059807873 ,  -104.80133056640626 ],zoom:  8 },
			  19: {shortDesc: "NL" ,latlng: [25.93828707492375 ,  -99.48669433593751 ],zoom:  7 },
			  20: {shortDesc: "OAX" ,latlng: [17.31917640744285 ,  -96.75384521484376 ],zoom:  8 },
			  21: {shortDesc: "PUE" ,latlng: [19.4303341116379 ,  -97.67120361328126 ],zoom:  8 },
			  22: {shortDesc: "QRO" ,latlng: [20.92809327710347 ,  -100.00167846679689 ],zoom:  9 },
			  23: {shortDesc: "QROO" ,latlng: [19.813222194938504 ,  -88.15155029296875 ],zoom:  8 },
			  24: {shortDesc: "SLP" ,latlng: [22.776181505086505 ,  -100.32440185546876 ],zoom:  8 },
			  25: {shortDesc: "SIN" ,latlng: [24.73685348477069 ,  -107.49572753906251 ],zoom:  7 },
			  26: {shortDesc: "SON" ,latlng: [29.53522956294847 ,  -111.41784667968751 ],zoom:  7 },
			  27: {shortDesc: "TAB" ,latlng: [17.926475979176452 ,  -92.52822875976564 ],zoom:  9 },
			  28: {shortDesc: "TAM" ,latlng: [24.79670834894575 ,  -98.68469238281251 ],zoom:  7 },
			  29: {shortDesc: "TLA" ,latlng: [19.429039028956183 , -98.16490173339844],zoom: 10 },
			  30: {shortDesc: "VER" ,latlng: [19.4665922322076 ,  -96.3665771484375 ],zoom:  7 },
			  31: {shortDesc: "YUC" ,latlng: [20.56079574020845 ,  -88.94256591796875 ],zoom:  8 },
			  32: {shortDesc: "ZAC" ,latlng: [23.34225583513053 ,  -102.88146972656251 ],zoom:  7 },
			}
    //Set here the initial properties that works over the dom objects
    var initProperties = function() {
        events.loadDataAllZones();
    }

    // Declare new dom objects here if you needed
    var dom = {}

    // Keep your code here to reach the dom components out
    var catchDom = function() {
        // - - -
    };

    // Main event function
    var suscribeEvents = function() {
    	
    	$("#cmbMunDetalle").change(function(e){
    		$.getJSON("state/getGeometryMunByName",{nameMun: e.target.value , stateId : state.id }, function(res){
    			//DetalleMapa.loadLayer2(res, "blue", st.stateSelected);
    			$("#modalMapGmaps").hide(); 
    			DetalleMapa.municipiosRegion = null;
    			
    			$("#modDetalleMapa").modal("show");
    			$("#modalMapGmaps").show();
    			//DetalleMapa.Gmaps.getLayers();
    			DetalleMapa.Gmaps.ClearAllLayers();
    			if(DetalleMapa.MAPA){
    				DetalleMapa.Gmaps.BuscarSeccion(3,res.properties.MUNICIPIO,state.id);
				}else{
					setTimeout(function(){
						DetalleMapa.Load();
						DetalleMapa.Gmaps.BuscarSeccion(3,res.properties.MUNICIPIO,state.id);
					}, 1500);
				}
    		});
    	});
    	
    	$("#cmbGobierno").change(function(){
    		$.blockUI();
    		setTimeout(function(){
    			$.unblockUI();
			}, 700);
    	});
    	/*
    	setInterval(function(){
			if($('input[value="50"]')[0] && $('input[value="50"]')[0].checked || $("input[name='radViviendas']:checked").val()){
				$(".gradiente-cont").show();
			}else{
				$(".gradiente-cont").hide();
			}
		}, 1000);
		*/
        events.genericFunctionEvents("HELLO");
        //events.fillTable();
        
		st.globalMap = L.map('initialMap', {maxZoom: 18,zoomControl: false,minZoom: 4}).setView([23.4219128, -100.05443359375], 5).on('click', function(e) {
		});
		
		
		L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
		    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
		    maxZoom: 18,
		    id: 'mapbox.streets',
		    accessToken: 'pk.eyJ1Ijoic2lib2siLCJhIjoiY2pnZnlvcDg3MDZ5djJ3bzVhZXk0ZHc2aCJ9.Kwg_2h2gsvQqpTRcxVWkVA'
		}).addTo(st.globalMap);
		
		st.globalMapG = new google.maps.Map(document.getElementById('googleMap'), {
			zoom: 5,
	        center: {lat: 23.4219128, lng: -100.05443359375}
	    });
		
		st.globalMapG.addListener('click', function(event) {
			if(googleMaps.st.requestTimeDistance){
				googleMaps.events.traceRouteInMap(st.globalMapG, event);
			}
		});
		
		$("#container").append($("<div/>").addClass("info leaflet-control").css("display","none"));
		
		st.titleLayer = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
			attribution: '',
			id: 'mapbox.light',
			accessToken: 'pk.eyJ1Ijoiam9zZWx1aXNwYWxpbGxlcm8iLCJhIjoiY2lqenh2cTUyMzFsM3Z3bTVtaTVnaHkxdyJ9.DAkVkUbVmwwWuXQoTS5NIA'
		});
		/*
		events.getStatesZonesLayers();		
		st.requestGetStatesZonesLayers.done(function(response) {
			var geoJson = JSON.parse(JSON.stringify(response));
			st.geoJSONMap = geoJson;
			events.loadMapStates();
		});
		*/
		
//		layoutUtils.progressDownload( "","","state/getStatesZonesLayers", function (data, textStatus, jqxhr) {						
//			var geoJson = JSON.parse(JSON.stringify(data));
//			st.responseGetStatesZonesLayers = geoJson.capa;
//			dataGeometryEstados=st.responseGetStatesZonesLayers;
//			
//			$.each(dataGeometryEstados, function(k,v){
//				v.properties.stateId = v.stateId;
//			});
//			
//			st.geoJSONMap = geoJson.capa;
//			events.loadMapStates();			
//        });
		
		$("#divDetalleRegion .close").click(function(){
			$("#divDetalleRegion").hide();
		});
		$("#detalleSeccionesAside .btn").click(function(){
			$('#detalleSeccionesAside').hide();
		});
		
		googleMaps.st.requestTimeDistance = false;
		$("#btn-trace-route").on('click', function(){
			googleMaps.st.requestTimeDistance = googleMaps.st.requestTimeDistance == true ? false : true;
			$(this).html(googleMaps.st.requestTimeDistance == true ? "Salir de Consultar Distancia" : "Consultar Distancia");
			if(googleMaps.st.marksToTraceRoute){
				googleMaps.st.marksToTraceRoute.forEach(function(v, i){
					googleMaps.st.marksToTraceRoute[i].setMap(null);
				});
				googleMaps.st.marksToTraceRoute = [];
			}
		});
		
		setTimeout(function() {	
        	$("#animated-loader").css("display", "none");	
        }, 1000);
    };

    /*
     * DOM EVENTS
     */
    var events = {
    		colorGL: function(grupoL){
		var color = "rgb(255,255,255)";
		switch (grupoL) {
		case "PRI":
			color = "#008e5b";
			break;
		case "PRD":
			color = "#ffe600";
			break;
		case "PVEM":
			color = "#5cb24a";
			break;
		case "PNA":
			color = "#29c9d2";
			break;
		case "MORENA":
			color = "#b14747";
			break;
		case "CPP":
			color = "rgb(219,85,5)";
			break;
		case "PAN":
			color = "#174189";
			break;
		case "PSI":
			color = "rgb(245,196,0)";
			break;
		case "PT":
			color = "rgb(218,38,26)";
			break;
		case "CPP":
			color = "rgb(218,85,5)";
			break;
		case "PANAL":
			color = "#40e0d0";
			break;	
		case "MC":
			color = "#f5821f";
			break;	

		default:
			color = "rgba(200,200,200,0.5)";
			break;
		}
		return color;
	},
        loadDataAllZones : function () {
            $.ajax({
                url: "http://localhost:8080/api/v1/informationlayers/electoralZones",
            }).done(function(data) {
            	console.log("Se obtuvieron zonas electorales");
            	console.log(data);
            });
            
//            $.ajax({
//                url: "http://localhost:8080/api/v1/informationlayers/states",
//            }).done(function(data) {
//            	console.log("Se obtuvieron Estados");
//            	st.geoJSONMap=data;
//            	events.loadStatesOnMap();
//            });            
            
            $.ajax({
                url: "http://localhost:8080/api/v1/informationlayers/pobreza",
            }).done(function(data) {
            	console.log("Se obtuvieron pobreza");
            	st.geoJSONMap=data;
            	events.loadStatesOnMap();
            }); 
        },
        loadStatesOnMap: function (){
        	console.log("hereee");
        	if(st.globalGeoJson){
        		st.globalGeoJson.clearLayers();
        	}
        	st.globalGeoJson = L.geoJSON(st.geoJSONMap , {  
        		style: function(feature) {
        			console.log(feature);
                     return {
                       fillColor: feature.properties.color,
                       weight: 1,
                       color: '#ddd',
                       opacity: 1,
                       fillOpacity: 1,
                     };
                   },
		           onEachFeature: function (feature, layer) {
		        		layer.on({
		        			mouseover:  function (e) {
		        				$(".info.leaflet-control").css("display", "block")
		        				.html('<h4 style="text-align: center;">'+layer.feature.properties.state+'</h4>');
		        				
		        				var selectedLayer = e.target;
		        				st.globalGeoJson.eachLayer(function (layer) {  
	        						  if(circunscripcion == layer.feature.properties.circumscription && selectedLayer.feature.stateId ==  layer.feature.stateId) {    
	        							  layer.setStyle({ weight: 4,color: '#3cd86c' })
	        						  }else{
	        							  layer.setStyle({ weight: 1,color: '#ddd' })
	        						  }
	        						});
		        			},
		        			click:  function (e) {
		        				var layer = e.target;
		        				if(circunscripcion == layer.feature.properties.circumscription){
		        					circumscription.st.globalMap.clearLayers();
		        					selectState(layer.feature.stateId);
		        				}
		        			}, 
		        		});
		        	}
                 });
        	st.globalGeoJson.addTo(st.globalMap);
    	},
        loadSelectedCircunscription: function (circunscripcion){
        	if(st.globalGeoJson){
        		st.globalGeoJson.clearLayers();
        	}
        	
        	st.globalGeoJson = L.geoJSON(st.geoJSONMap , {  
        		style: function(feature) {
                     return {
                       fillColor: feature.properties.circumscription == circunscripcion ? feature.properties.color: "transparent" ,
                       weight: 1,
                       color: '#ddd',
                       opacity: 1,
                       fillOpacity: 1,
                     };
                   },
		           onEachFeature: function (feature, layer) {
		        		layer.on({
		        			mouseover:  function (e) {
		        				$(".info.leaflet-control").css("display", "block")
		        				.html('<h4 style="text-align: center;">'+layer.feature.properties.state+'</h4>');
		        				
		        				var selectedLayer = e.target;
		        				st.globalGeoJson.eachLayer(function (layer) {  
	        						  if(circunscripcion == layer.feature.properties.circumscription && selectedLayer.feature.stateId ==  layer.feature.stateId) {    
	        							  layer.setStyle({ weight: 4,color: '#3cd86c' })
	        						  }else{
	        							  layer.setStyle({ weight: 1,color: '#ddd' })
	        						  }
	        						});
		        			},
		        			click:  function (e) {
		        				var layer = e.target;
		        				if(circunscripcion == layer.feature.properties.circumscription){
		        					circumscription.st.globalMap.clearLayers();
		        					selectState(layer.feature.stateId);
		        				}
		        			}, 
		        		});
		        	}
                 });
        	st.globalGeoJson.addTo(st.globalMap);

        	st.globalMap.flyTo(centerOfCir[circunscripcion].latlng,centerOfCir[circunscripcion].zoom );
        },	

        genericFunctionEvents : function ( aParamIfNeeded ) {

//            var request = $.ajax({
//                url: "promoted/getPartidosPoliticos",
//                method: "GET"
//            });
//
//            request.done(function(data) {
//            });
//
//            request.fail(function() {
//            });
        },
//        getStatesZonesLayers : function(){
//			st.requestGetStatesZonesLayers = $.ajax({
//				url: "state/getStatesZonesLayers",
//				method: "GET",
//				dataType:"json"
//			});
//			
//			st.requestGetStatesZonesLayers.done(function(response) {
//				st.responseGetStatesZonesLayers = JSON.parse(JSON.stringify(response));
//				dataGeometryEstados=st.responseGetStatesZonesLayers;
//				$.each(dataGeometryEstados, function(k,v){
//					v.properties.stateId = v.stateId;
//				});
//			});
			
//		},
		getPollingLayerByState : function(idStateToSend){
			var datos={
				idState:idStateToSend
			}

			events.loadPollingStateLayer(idStateToSend);
		},
		
	    paintMarkers : function(){
	    	
	        var iconC1 = L.icon({
	          iconUrl: 'img/c1.svg',
	          iconSize: [30, 30],
	          className: "circIcon"
	        });
	        var iconC2 = L.icon({
	          iconUrl: 'img/c2.svg',
	          iconSize: [30, 30],
	          className: "circIcon"
	        });
	        var iconC3 = L.icon({
	          iconUrl: 'img/c3.svg',
	          iconSize: [30, 30],
	          className: "circIcon"
	        });
	        var iconC4 = L.icon({
	          iconUrl: 'img/c4.svg',
	          iconSize: [30, 30],
	          className: "circIcon"
	        });
	        var iconC5 = L.icon({
	          iconUrl: 'img/c5.svg',
	          iconSize: [30, 30],
	          className: "circIcon"
	        });

	        var cluster = L.markerClusterGroup();
	         cluster.addLayer(L.marker(new L.LatLng(27.907058371121995, -107.24786123806764),{icon: iconC1}));
	         cluster.addLayer(L.marker(new L.LatLng(24.671978191593258, -100.55203422928628),{icon: iconC2}));
	         cluster.addLayer(L.marker(new L.LatLng(18.03097474989003, -99.03030151882443),{icon: iconC4}));
	         cluster.addLayer(L.marker(new L.LatLng(19.921712747556207, -101.9960657358826),{icon: iconC5}));
	         cluster.addLayer(L.marker(new L.LatLng(17.35063837604883, -92.57002151609672),{icon: iconC3}));
	         cluster.addTo(st.globalMap);
	    },
		loadMapStates:  function(){
			circumscription.st.globalMap.clearLayers();

            events.paintMarkers();
			st.globalGeoJson = L.geoJSON(st.geoJSONMap , {  
				style: function(feature) {
		             return {
		               fillColor: feature.properties.color,
		               weight: 1,
		               color: '#ccc',
		               opacity: 1,
                       fillOpacity: 0.2,
		             };
		           },
		           onEachFeature: function (feature, layer) {
		        		layer.on({
		        			mouseover:  function (e) {
		        				$(".info.leaflet-control").css("display", "block")
		        				.html('<h4 style="text-align: center;">'+layer.feature.properties.circumscription+'</h4>')
		        				.append("Estado: "+layer.feature.properties.state);
		        				
		        				var selectedLayer = e.target;
		        				st.globalGeoJson.eachLayer(function (layer) {  
	        						  if(selectedLayer.feature.properties.circumscription ==  layer.feature.properties.circumscription) {    
	        						    layer.setStyle({fillOpacity : 1 }) 
	        						  }else{
	        							  layer.setStyle({fillOpacity : 0.2 }) 
	        						  }
	        						});
		        			},
		        			click:  function (e) {
		        				var layer = e.target;

		        			    $(".info.leaflet-control").css("display", "none");
		        				selectCircunscription({id: layer.feature.properties.circumscription});
		        			},
		        	        mouseout: function (e) {
		        	        	$(".info.leaflet-control").css("display", "none");
		        			}
		        		});
		        	}
		         });
			st.globalGeoJson.addTo(st.globalMap);
		},
		loadPollingStateLayer:  function(idStateToSend){
			if(st.globalGeoJson){
				st.globalGeoJson.clearLayers();
			}

			st.globalGeoJson = L.geoJSON(dataGeometryEstados , {  
				style (feature) {
		             return {
		               fillColor: "transparent",
		               weight: 2,
		               color: (feature.stateId == idStateToSend ? "#888": "transparent"),
		               opacity: 1,
		             };
		           },
		         });
			st.globalGeoJson.addTo(st.globalMap);
			st.titleLayer.addTo(st.globalMap);
            datosEstado(idStateToSend);

			var markers = L.markerClusterGroup();
			var geoJsonLayer = L.geoJson(st.geoJSONMapMarkers, {
				onEachFeature: function (feature, layer) {
					layer.bindPopup(feature.properties.address);
				}
			});
			
			markers.addLayer(geoJsonLayer);
			globalMarkerClusterByState=markers;
			st.globalMap.addLayer(markers);
			try{
				st.globalMap.fitBounds(markers.getBounds());	
			}catch(error){
			}
			st.globalMap.flyTo(centerOfStates[idStateToSend].latlng,centerOfStates[idStateToSend].zoom );
		},
		loadPollingStateLayerGM:  function(idStateToSend){
			if(st.globalGeoJsonGM){
				st.globalGeoJsonGM.setMap(null);
			}
			st.globalGeoJsonGM = new google.maps.Data();				
			st.globalGeoJsonGM.setStyle(function(feature) {
				return ({
					//strokeColor: (feature.getProperty("stateId") == idStateToSend ? "#888": "transparent"), //color de contorno
					strokeColor: getCleanedString(feature.f.state.toLowerCase().trim()) == getCleanedString(document.getElementById('pEstadoSelec').innerHTML.toLowerCase().trim())
								 ? "#888" : "transparent",
		            strokeWeight: 2,      //grosor de contorno
		            //fillColor: 'transparent',    //color de relleno
		            //fillOpacity: 1,       //opacidad de relleno
		         });
		    });
			var geojson = nationalLines;/*{
					"type" : "FeatureCollection",
					"metadata" : {},
					"features" : dataGeometryEstados
				}			*/	
			st.globalGeoJsonGM.addGeoJson(geojson);
			st.globalGeoJsonGM.setMap(st.globalMapG);

			//st.titleLayer.addTo(st.globalMap);
            datosEstado(idStateToSend); 
            
            //add listener click to state
            circumscription.st.globalGeoJsonGM.addListener('click', function(event){
        		if(googleMaps.st.requestTimeDistance){
        			googleMaps.events.traceRouteInMap(st.globalMapG, event);
				}
        	});
		},
		
        getActualGovernment: function () {
//            var $ajaxRequest = $.ajax({
//                url: "circumscription/getDataCurrentAdminByStateParty/"+edoId+"/"+shortDesc,
//                type: 'GET',
//                contentType: 'application/json',
//                data: jsonData
//            });



        }

    };

    // this behavior works as constructor, declare the whole operations that you need on set up
    var initialize = function() {
        suscribeEvents();
        initProperties();
        //$('.selectpicker').selectpicker('refresh');
    };	
    
    var mapClick = function ($element) {

        var idSelected = "#"+$($element).attr('id');

        var divisionId = 2;
        var stateId = 21;
        var selectedId = $(idSelected).data("id");

        var url = "circumscription/getPoliticPartiesLayerByDivision?divisionId="+divisionId+"&stateId="+stateId+"&selectedId="+selectedId;


//        var $ajaxRequest = $.ajax({
//            url: url,
//            type: 'GET'
//        });
//
//        $ajaxRequest.done(function(data) {
//        });
//
//        $ajaxRequest.fail(function() {
//        });
    };

    return {
        //calling master module
        init : initialize,
        mapClick : mapClick,
        events: events,
        st: st,
        centerOfStates: centerOfStates
    }
})();

function selectCircunscription(element){
	layoutUtils.blockDiv("#modalDetalleCirc");
	$("#circunscripcionLabel").css("cursor", "alias");
    resetCollapses();
    $('#modalDetalleLayer').hide();	
    $('#modalDetalleCirc').hide();
    ocultarDetalleEstado();
    var circunscripcionSelected=element.id;
    circunscripcionSelected=circunscripcionSelected.replace("circunscripcion","");
    $('#collapse-12').collapse('show');
    circumscription.events.loadSelectedCircunscription(circunscripcionSelected);

    //circumscription.st.globalMap.flyTo([23.4219128, -100.05443359375], 5 );
    
    $('#selectedCirc').text(circunscripcionSelected);
    var x = circunscripcionSelected;
    abiertoC = x;

    if($(this).attr("test") != "1"){
        $(".circ").hide();
        $("#"+x).show();
        $("#"+x).attr("test","1");
        $("#pEstado").css("display", "block")
    }else{
        $("#"+x).attr("test","0");
        $(".circ").show()
        $("#collapse-13").collapse('hide');
        $("#pEstado").css("display", "none")
    }


    lastCircunscripcionSelected=circunscripcionSelected;
    var statesByZone=arrayAllZones[circunscripcionSelected].states;
    arrayCircunscriptionStates=statesByZone;
    var contentEstadosTable="";
    $('#ciscunscripcionEstados').html('');
    for(var i=0;i<statesByZone.length;i++){

        arrayAllStates[statesByZone[i].id]=statesByZone[i];

        var listaNominal=statesByZone[i].nominalList.toLocaleString().trim();
        listaNominal=listaNominal.replace(/\./g,',');
        contentEstadosTable='<tr>'+
            '<td>'+
            '<a class="estado" id="estado'+statesByZone[i].id+'"  onclick="selectState('+statesByZone[i].id+');" test="0" style="display:block;" role="button" data-parent="#accordion" aria-expanded="true">'+
            '<div>'+
            statesByZone[i].name+
            '</div>'+
            '</a>'+
            '</td>'+
            '<td class="nominal">'+
            listaNominal+
            '</td>'+
            '</tr>';
        $('#ciscunscripcionEstados').append(contentEstadosTable);

    }
    
    
    var url = "layout/getCircumscriptionSummary";
    zoneToSend=circunscripcionSelected.charAt(1);
    
    var datosToSend={
    	zoneId : zoneToSend, 
    };
    
    
    var $ajaxRequest = $.ajax({
//        url: url,
//        type: 'GET',
//        data: datosToSend,
//        beforeSend : function() {
//        	layoutUtils.blockDiv("#modalDetalleCirc");
//         } 
    });
    
    $('#textoDetalleS1').html('');
    $('#textoDetalleS2').html('');
    $('#textoDetalleS3').html('');
    $('#textoDetalleS4').html('');
    
    $('.tituloModalDetalleCirc').html('');
//    $ajaxRequest.done(function(data) {
//        $('.tituloModalDetalleCirc').append('CIRCUNSCRIPCIÓN C' + zoneToSend);
//        noEstados=0;
//        poblacion=0;
//        superficie=0;
//        dFederales=0;
//        dLocales=0;
//        municipios=0;
//        secciones=0;
//        lNominal=0;
//        pElectoral=0;
//        
//        
//        if(typeof(data.NumeroDeEstados)==='undefined'){
//        	
//        }else{
//        	noEstados=data.NumeroDeEstados.toLocaleString("en-US");
//        }
//        
//        if(typeof(data.Poblacion)==='undefined'){
//        	
//        }else{
//        	poblacion=data.Poblacion.toLocaleString("en-US");
//        }
//        
//        if(typeof(data.Superficie)==='undefined'){
//        	
//        }else{
//        	superficie=data.Superficie.toLocaleString("en-US");
//        }
//        
//        if(typeof(data.DistritosFederales)==='undefined'){
//        	
//        }else{
//        	dFederales=data.DistritosFederales.toLocaleString("en-US");
//        }
//        
//        if(typeof(data.DistritosLocales)==='undefined'){
//        	
//        }else{
//        	dLocales=data.DistritosLocales.toLocaleString("en-US");
//        }
//        
//        if(typeof(data.Municipios)==='undefined'){
//        	
//        }else{
//        	municipios=data.Municipios.toLocaleString("en-US");
//        }
//        
//        if(typeof(data.Secciones)==='undefined'){
//        	
//        }else{
//        	secciones=data.Secciones.toLocaleString("en-US");
//        }
//        
//        if(typeof(data.ListaNominal)==='undefined'){
//        	
//        }else{
//        	lNominal=data.ListaNominal.toLocaleString("en-US");
//        }
//        
//        if(typeof(data.PadronElectoral)==='undefined'){
//        	
//        }else{
//        	pElectoral=data.PadronElectoral.toLocaleString("en-US");
//        }
//        
//        contentS1=	'<li>'+
//					'<p>No. estados:</p><p>' +
//					noEstados +	
//					'</p>'+
//					'</li>';
//        $('#textoDetalleS1').append(contentS1);
//		
//		
//        contentS2=	'<li>'+
//					'<p>Poblacion:</p><p>'+
//					poblacion +
//					'</p>'+
//	 				'</li>'+
//	 				'<li>'+
//	 				'<p>Superficie:</p><p>'+
//	 				superficie +
//	 				'</p>'+
//	 				'</li>';
//        $('#textoDetalleS2').append(contentS2);
//        
//        contentS3=	'<li>'+
//        			'	<p>Distritos Federales:</p><p>'+
//        			dFederales +
//        			'</p>'+
//        			'</li>'+
//        			'<li>'+
//        			'	<p>Distritos Locales:</p><p>'+
//        			dLocales +
//        			'</p>'+
//        			'</li>'+
//        			'<li>'+
//        			'	<p>Municipios:</p><p>'+
//        			municipios +
//        			'</p>'+
//        			'</li>'+
//        			'<li>'+
//        			'	<p>Secciones:</p><p>'+
//        			secciones +
//        			'</p>'+
//        			'</li>';
//        $('#textoDetalleS3').append(contentS3);
//        
//        contentS4 =	'<li>'+
//        			'<p>Lista nominal:</p><p>'+
//        			lNominal +
//        			'</p>'+
//        			'</li>'+
//        			'<li>'+
//        			'<p>Padrón electoral:</p><p>'+
//        			pElectoral +
//        			'</p>'+
//        			'</li>';
//       
//       $('#textoDetalleS4').append(contentS4);
//       
//       layoutUtils.unBlockDiv("#modalDetalleCirc");
//    });

//    $ajaxRequest.fail(function() {
//    });
//
//   $('#modalDetalleCirc').show(); 
}

function ocultarModalDetalle(){
	$('#modalDetalleCirc').hide();
	$('#modalDetalleLayer').hide();
}

function toggleCasillas(){
	
	if(!allLayersStatesGmaps[circumscription.st.stateSelected]){
		allLayersStatesGmaps[circumscription.st.stateSelected] = [];
    }
	
	if(!allLayersStatesGmaps[circumscription.st.stateSelected][610]){
		allLayersStatesGmaps[circumscription.st.stateSelected][610] = [];
    }
		
	if(!$("#collapse-15").hasClass("in")){
		if(allLayersStatesGmaps[circumscription.st.stateSelected][610] != []){
			layoutUtils.progressDownload( 6,"Descargando ","state/getLayerById?layerId=6&stateId="+circumscription.st.stateSelected, function (data, textStatus, jqxhr) {
				data = data.capa;
				
				allLayersStatesGmaps[circumscription.st.stateSelected][610] = [];
				allLayersStatesGmaps[circumscription.st.stateSelected][610]["urbana"] = new MarkerClusterer(null, null, {imagePath: 'images/m',maxZoom: 21});
				allLayersStatesGmaps[circumscription.st.stateSelected][610]["rural"] = new MarkerClusterer(null, null, {imagePath: 'images/m',maxZoom: 21});
				allLayersStatesGmaps[circumscription.st.stateSelected][610]["perdida"] = new MarkerClusterer(null, null, {imagePath: 'images/m',maxZoom: 21});
				allLayersStatesGmaps[circumscription.st.stateSelected][610]["ganada"] = new MarkerClusterer(null, null, {imagePath: 'images/m',maxZoom: 21});
				allLayersStatesGmaps[circumscription.st.stateSelected][610]["no_instalada"] = new MarkerClusterer(null, null, {imagePath: 'images/m',maxZoom: 21});
				allLayersStatesGmaps[circumscription.st.stateSelected][610]["todas"] = new MarkerClusterer(null, null, {imagePath: 'images/m',maxZoom: 21});
				
				var oms = new OverlappingMarkerSpiderfier(circumscription.st.globalMapG,{
					markersWontMove: true
					,markersWontHide: true
					,basicFormatEvents: true
					,keepSpiderfied: true
				});
				
				data.forEach(function(item, index) {
					var contentString = 
						'<h2>Casilla<\/h2>' + 
						'<br> Municipio: ' + item.properties.MUNICIPIO+ 
						'<br> Seccion: ' + item.properties.SECCION+ 
						'<br> Lista nominal: ' + item.properties.LN+ 
						'<br> Tipo casilla: ' + item.properties.TIPO_CA+ 
						'<br> Domicilio: ' + item.properties.DOMICILIO+ 
						'<br> Ubicación: ' + item.properties.UBIC+ 
						'<br> Referencia: ' + item.properties.REF;
					
			        var infowindow = new google.maps.InfoWindow({
			          content: contentString
			        });
					
					var myLatlng = new google.maps.LatLng(item.geometry.coordinates[1],item.geometry.coordinates[0]);
					
					var marker = new google.maps.Marker({
			            position: myLatlng,
			            title: item.properties.NOMBRE,
			            icon: "img/capasIcons/"+item.icon.img, 
			            //label: item.properties.NOMBRE
			        });
					
					marker.addListener('click', function() {
						infowindow.open(circumscription.st.globalMapG, marker);	
					});
					
					switch (item.properties.TIPO) {
					case "URBANA":
						allLayersStatesGmaps[circumscription.st.stateSelected][610]["urbana"].addMarker(marker);
						color = "darkblue";
						break;
					case "NO URBANA":
						allLayersStatesGmaps[circumscription.st.stateSelected][610]["rural"].addMarker(marker);
						color = "green";
						break;
					}
					switch (item.properties.CAT) {
					case "Ganada":
						allLayersStatesGmaps[circumscription.st.stateSelected][610]["ganada"].addMarker(marker);
						color = "darkblue";
						break;
					case "Perdida":
						allLayersStatesGmaps[circumscription.st.stateSelected][610]["perdida"].addMarker(marker);
						color = "green";
						break;
					case "No instalada":
						allLayersStatesGmaps[circumscription.st.stateSelected][610]["no_instalada"].addMarker(marker);
						color = "lightgray";
						break;
					}
					
					allLayersStatesGmaps[circumscription.st.stateSelected][610]["todas"].addMarker(marker);
					
					oms.addMarker(marker);
					
				});
				
				filterCasillas("todas");
			});
		}else{
			filterCasillas("todas");
		}
	}else{
		filterCasillas(false);
	}
	$("#collapse-15").collapse('toggle');
}


function filterCasillas(show) {
	Object.keys(allLayersStatesGmaps[circumscription.st.stateSelected][610]).forEach(function (key) {
		if(key != "_leaflet_id"){
			allLayersStatesGmaps[circumscription.st.stateSelected][610][key].setMap(null);
		}
	});
	if(show){
		allLayersStatesGmaps[circumscription.st.stateSelected][610][show].setMap(circumscription.st.globalMapG);
	}
}

function selectState(id,casillas){
	circumscription.st.stateSelected= id;
	
	$("#initialMap").hide();
	$("#googleMap").show();	
	circumscription.st.globalMapG.panTo({lat: circumscription.centerOfStates[id].latlng[0], lng: circumscription.centerOfStates[id].latlng[1]});
	circumscription.st.globalMapG.setZoom(circumscription.centerOfStates[id].zoom);
	
	googleMaps.events.clearAllLayers();
	
	if (!casillas){
		if (allLayersStatesGmaps[id]){
			if (Array.isArray(allLayersStatesGmaps[id][610])){
				filterCasillas(false);
			}
		}
	}	
		
	$("#divLayers").html("");
	googleMaps.events.createLayersMap(id,"#divLayers", circumscription.st.globalMapG);	
	
	$("#pEstado").css("cursor","alias");
    $('#partidosPorEstado').html('');	
	if(!allLayersStates[id]){		
    	allLayersStates[id] = [];
    }
    resetCollapses();
    $('#collapse-13').collapse('show')
    $('#collapse-14').collapse('show')
    gstate = id;
    $('#modalDetalleCirc').hide(); 
    //circumscription.events.getPollingLayerByState(id);
	
	/*circumscription.events.loadPollingStateLayerGM(id);*/
    
    $('#contenedorBotones').show();
    if($(this).attr("test") != "1"){
        $(".estado").parent().parent().hide()
        $("#estado"+id).parent().parent().show();
        $("#estado"+id).attr("test","1");
        $("#pEstadoSelec").css("display", "block");
        $("#pPartidos").css("display", "block");
        $("#pCasillas").css("display", "block");
        $('#collapse-14').collapse('show');
        $('#pPartidos').css("display","block");
//		//el colapse 15 es el que muestra el detalle de las casillas
    }else{
        $("#estado"+id).attr("test","0");
        $(".estado").parent().parent().show()
        $("#pEstadoSelec").css("display", "none")
        $("#pPartidos").css("display", "none");
        $("#pCasillas").css("display", "none");
        $('#collapse-14').collapse('hide');
        $('#pPartidos').css("display","none");
        //el colapse 15 es el que muestra el detalle de las casillas
        $('#collapse-15').collapse('hide');
        $('#pCasillas').css("display","none");
    }

    llenarListaCargoByEstado(id);

    state=arrayAllStates[id];

    lastStateSelected=id;
    $('#detalleEstado').html('');
    $('#pEstadoSelec').html('');
    $('#pEstadoSelec').html(state.name);
    var estadoContent='<tr>'+
        '<td><a id="1'+'_'+id+'" onclick="llenarPartidosPorEstado(this, 14,'+id+');" data-select="false"> Distritos Federales</a></td>'+
        '<td>'+formatNumber(state.federalDistricts)+'</td>'+
        '<td>'+formatNumber(state.nominalList)+'</td>'+
        '</tr>'+
        '<tr>'+
        '<td><a id="2'+'_'+id+'" onclick="llenarPartidosPorEstado(this, 15,'+id+');" data-select="false"> Distritos Locales'+'</a></td>'+
        '<td>'+formatNumber(state.localDistricts)+'</td>'+
        '<td>'+formatNumber(state.nominalList)+'</td>'+
        '</tr>'+
        '<tr>'+
        '<td>'+'<a id="3'+'_'+id+'" onclick="llenarPartidosPorEstado(this, 31,'+id+');" data-select="false"> Municipios'+'</a></td>'+
        '<td>'+formatNumber(state.municipalities)+'</td>'+
        '<td>'+formatNumber(state.nominalList)+'</td>'+
        '</tr>'+
        '<tr>'+
        '<td>'+'<a id="4'+'_'+id+'" onclick="llenarPartidosPorEstado(this, 42,'+id+');" data-select="false"> Secciones'+'</a></td>'+
        '<td>'+formatNumber(state.sections)+'</td>'+
        '<td>'+formatNumber(state.nominalList)+'</td>'+
        '</tr>'+
        '<tr>'+
        '<td>'+'<a id="5'+'_'+id+'" onclick="llenarPartidosPorEstado(this, 59,'+id+');" data-select="false"> Regiones'+'</a></td>'+
        '<td>'+(id==21?'11':'0')+'</td>'+
        '<td>'+formatNumber(state.nominalList)+'</td>'+
        '</tr>'+
	    '<tr>'+
	    '<td>'+'<a id="6'+'_'+id+'" onclick="llenarPartidosPorEstado(this, 68,'+id+');" data-select="false"> Coord. Regionales Indígenas'+'</a></td>'+
	    '<td>'+(id==21?'9':'0')+'</td>'+
	    '<td></td>'+
	    '</tr>';
    $('#detalleEstado').append(estadoContent);
	getMuninipiosList(id);
	circumscription.events.loadPollingStateLayerGM(id);
}

function getMuninipiosList (stateId) {
	$("#cmbMunDetalle")
	.html(
		$("<option/>")
		.attr("value", "-1")
		.append("Buscar por Municipio")
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
    	//$("#cmbMunDetalle").selectpicker('refresh');
	});
}
function llenarPartidosPorEstado(element, layerId, stateId){
	circumscription.st.globalMapG.panTo({lat: circumscription.centerOfStates[stateId].latlng[0], lng: circumscription.centerOfStates[stateId].latlng[1]});
	circumscription.st.globalMapG.setZoom(circumscription.centerOfStates[stateId].zoom);

    $('#detalleSeccionesAside').hide();
	var seleccionado = $(element).attr("data-select");	
	if (seleccionado == "true"){
		circumscription.st.globalMap.clearLayers()
		selectState(stateId,true);		
		googleMaps.events.clearAllLayers();
		$(element).attr("data-select","false");
		$(element).removeAttr("style");
		
		/*
		for (i = 1; i < 5; i++) {
			if ( $("#"+i+"_"+stateId).attr("data-select") == "true" ){
				$("#"+i+"_"+stateId).attr("data-select","false");
				$("#"+i+"_"+stateId).removeAttr("style");		
				$.each(allLayersStates, function(k,v){
			    	if(v){
			    		$.each(v, function(key,val){
			    			if(val){
			    				circumscription.st.globalMap.removeLayer(val);
			    			}
			    		});
			    	}
			    });
			}
		}*/
		
	}else{
		/**/
		
		
		for (i = 1; i <= 6; i++) {
			if ( $("#"+i+"_"+stateId).attr("data-select") == "true" ){
				$("#"+i+"_"+stateId).attr("data-select","false");
				$("#"+i+"_"+stateId).removeAttr("style");		
				$.each(allLayersStatesGmaps, function(k,v){
			    	if(v){
			    		$.each(v, function(key,val){
			    			if (!Array.isArray(val)){
				        		if(val){
					                val.setMap(null);
					            }
				        	}
			    		});
			    	}
			    });
			}
		}
		$(element).attr("data-select","true");
		$(element).css("text-decoration","underline red");
		//$(element).css("text-decoration","underline wavy red");
		
		resetCollapses();
	    $('#modalDetalleCirc').hide();
	    $('#modalDetalleLayer').hide();
	    ocultarDetalleEstado();
	    var idCompleto=element.id;
	    divisionToSend=idCompleto.substring(0,idCompleto.indexOf('_'));
	    var idEstateToSend=idCompleto.substring(idCompleto.indexOf('_')+1,idCompleto.length);

	    
	    circumscription.st.stateSelected= idEstateToSend;
	    circumscription.st.layerSelected= layerId;
	    
	    if(!allLayersStatesGmaps[idEstateToSend]){
	    	allLayersStatesGmaps[idEstateToSend] = [];
	    }
	    googleMaps.events.clearAllLayers();
	    
	    if(!allLayersStatesGmaps[idEstateToSend][layerId+"90"]){
		    layoutUtils.progressDownload( layerId ,"Descargando ","state/getLayerById?layerId=" + layerId + "&stateId=" + idEstateToSend, function (data, textStatus, jqxhr) {
				var res = data.capa;
	    		allLayersStatesGmaps[idEstateToSend][layerId+"90"] = new google.maps.Data();
				allLayersStatesGmaps[idEstateToSend][layerId+"90"].setStyle(function(feature) {
		            var style = feature.getProperty('style');
		            var color = "transparent";
		            switch (divisionToSend) {
					case "1":
					case "2":
						color = circumscription.events.colorGL(feature.getProperty('df_GL'));
						break;
					case "3":
						color = circumscription.events.colorGL(feature.getProperty('m_Partido político del presidente municipal'));
						break;
					case "4":
						color = circumscription.events.colorGL(feature.getProperty('PARTIDO_AFIN_PRESIDENTE'));
						break;
					default:
						return /** @type {!google.maps.Data.StyleOptions} */style;
						break;
					}
		            style = {
	            			 fillColor: color ,
            				 strokeColor: "#888",
            				 fillOpacity: 1,
            				 strokeOpacity: 1,
            				 strokeWeight: 1,
	            		 };
		            return style;
		        });				
				allLayersStatesGmaps[idEstateToSend][layerId+"90"].addListener('mouseover', function(event) {					
					var layer = event.feature;
					allLayersStatesGmaps[idEstateToSend][layerId+"90"].overrideStyle(event.feature, {strokeWeight: 3,strokeColor: "#666"});
    				
    			    var name = false;
    			    if(layer.getProperty("region")){
    			    	name = "Región: "+layer.getProperty("region"); 
    			    }else if(layer.getProperty("df_Cabecera")){
	 			    	name = layer.getProperty("df_Cabecera"); 
	 			    }else if(layer.getProperty("DISTRITO")){
	 			    	name = "Distrito: " + layer.getProperty("DISTRITO");
	 			    }else if(layer.getProperty("SECCION")){ 
	 			    	name = "Sección: " + layer.getProperty("SECCION");
	 			    }else if(layer.getProperty("NOMBRE")){
	 			    	name = layer.getProperty("NOMBRE");
	 			    }
	 			    if(layer.getProperty("SS_MUNICIPIO")){
	 			    	name += "<br/>Municipio: "+layer.getProperty("SS_MUNICIPIO");
	 			    }
	 			    
		 			$("#detallePoblacion").html("");
		 			$("#detalleGenero").html("");
		 			
    			    if(layer.getProperty("LN160318")){
    			    	$("#detallePoblacion").append(
    			    			$("<div/>").html($("<b/>").html("L.N:        ")).append(layer.getProperty("LN160318"))
    			    	);
    			    }
    			    if(layer.getProperty("HAB2015INEGI")){
    			    	$("#detallePoblacion").append(
    			    			$("<div/>").html($("<b/>").html("Habitantes: ")).append(layer.getProperty("HAB2015INEGI"))
    			    	);
    			    }
    			    if(layer.getProperty("HOMBRES")){
    			    	$("#detalleGenero").append(
    			    			$("<div/>").html($("<b/>").html("Hombres:    ")).append(layer.getProperty("HOMBRES"))
    			    	);
    			    }
    			    if(layer.getProperty("MUJERES")){
    			    	$("#detalleGenero").append(
    			    			$("<div/>").html($("<b/>").html("Mujeres:    ")).append(layer.getProperty("MUJERES"))
    			    	);
    			    }
    				
    				$(".info.leaflet-control").css("display", "block").html('<h4>'+name+'</h4>');
    				
				});
				allLayersStatesGmaps[idEstateToSend][layerId+"90"].addListener('mouseout', function(event) {
					allLayersStatesGmaps[idEstateToSend][layerId+"90"].revertStyle();					
					$("#detallePoblacion").html("");
			 		$("#detalleGenero").html("");	 	        						
					$(".info.leaflet-control").css("display", "none");
					$("#info-box").css("display", "none");
				});				
				allLayersStatesGmaps[idEstateToSend][layerId+"90"].addListener('click', function(event) {
					var layer = event.feature;
					googleMaps.events.fitBounds(layer, circumscription.st.globalMapG);
					layoutUtils.blockDiv("#modalDetalleCirc");
    				$('#detalleSeccionesAside').hide();
    			    $(".info.leaflet-control").css("display", "none");
					$("#modalDetalleLayer .scroll").html("");
					$(".tituloModalDetalleCirc").html("");
    				
					switch (divisionToSend) {
    				case "6":
    					$(".tituloModalDetalleCirc").html("Región: "+layer.getProperty("NOMBRE"));
    					$("#modalDetalleLayer .scroll").html(
    							$("<div/>").addClass("detalles").html(
    									$("<ul/>").addClass("textoDetalleS1")
    									.append(
    											$("<li/>")
    											.append($("<p/>").text("Número: "))
    											.append($("<p/>").text( layer.getProperty("coord_indigena")))
    									)
    							)
    					)
    					$("#modalDetalleLayer .scroll").append(
        						$("<div/>").addClass("row").append(
        								$("<div/>").addClass("col-xs-12").css("display", "flex").append(
        										$("<div/>").addClass("center-block").append(
	        										$("<a/>").html($("<i/>").addClass("fas fa-eye"))
	    				        					.addClass("btn btn-info")
	    				        					.css("margin-top", "10px")
	    				        					.append("Ver capas a detalle.")
	    				        					.click(function(){
	    				        						//coord_indigena
	    				        						/*
	    				        						layer.toGeoJson(function(e) {
	    				        							DetalleMapa.loadLayer(e, layer.getProperty("style.fillColor") ,circumscription.st.stateSelected);	    				        							
	    				        						});*/
	    				        						DetalleMapa.Gmaps.BuscarSeccion(divisionToSend,layer.getProperty("coord_indigena"),state.id);
	    						        			})
	    						        		)
        								)
        						)
        				);
    					break;
    				case "5":
    					$(".tituloModalDetalleCirc").html("Región: "+layer.getProperty("region"));
    					$("#modalDetalleLayer .scroll").append(
    							$("<div/>").addClass("detalles").html(
    									$("<ul/>").addClass("textoDetalleS1")
    									.append(
    											$("<li/>")
    											.append($("<p/>").text("Áreas: "))
    											.append($("<p/>").text( layer.getProperty("num_secc").toLocaleString('en-US')))
    									)
    									.append(
    											$("<li/>")
    											.append($("<p/>").text("Municipios: "))
    											.append($("<p/>").text( (layer.getProperty("num_mun")) ))
    									)
    									.append(
    											$("<li/>")
    											.append($("<p/>").text("Población: "))
    											.append($("<p/>").text(layer.getProperty("poblacion").toLocaleString('en-US')))
    									)
    									.append(
    											$("<li/>")
    											.append($("<p/>").text("Viviendas: "))
    											.append($("<p/>").text(layer.getProperty("viviendas").toLocaleString('en-US')))
    									)
    							)
    					)
    					$("#modalDetalleLayer .scroll").append(
    							$("<div/>").addClass("row").append(
    									$("<div/>").addClass("col-xs-12").css("display", "flex").append(
    											$("<div/>").addClass("center-block").append(
    													$("<a/>").html($("<i/>").addClass("fas fa-eye"))
    													.addClass("btn btn-info")
    													.css("margin-top", "10px")
    													.append("Ver capas a detalle.")
    													.click(function(){
    														/*
    														layer.toGeoJson(function(e) {
    	    				        							DetalleMapa.loadLayer(e, layer.f.style.fillColor ,circumscription.st.stateSelected);	    				        							
    	    				        						});
    	    				        						*/
    														DetalleMapa.Gmaps.BuscarSeccion(divisionToSend,layer.getProperty("region"),state.id);
    													})
    													
    											)
    									)
    							)
    					);
    					break;
					case "4":
						$(".tituloModalDetalleCirc").text(layer.getProperty("PARTIDO_AFIN_PRESIDENTE"));
        				$("#modalDetalleLayer .scroll").append(
        					$("<div/>").addClass("detalles").html(
    							$("<ul/>").addClass("textoDetalleS1")
    								.append(
        								$("<li/>")
        									.append($("<p/>").text("Seccion: "))
        									.append($("<p/>").text( layer.getProperty("SECCION")  ))
        							)
    								.append(
        								$("<li/>")
        									.append($("<p/>").text("Gobernador: "))
        									.append($("<p/>").text( (layer.getProperty("PRESIDENTE_MUN") ? layer.getProperty("PRESIDENTE_MUN") : "" ) ))
        							)
        							.append(
        								$("<li/>")
        									.append($("<p/>").text("Grupo Lejislativo: "))
        									.append($("<p/>").text(layer.getProperty("PARTIDO_AFIN_PRESIDENTE")))
        							)
        							.append(
        								$("<li/>")
        									.append($("<p/>").text("Periodo: "))
        									.append($("<p/>").text(layer.getProperty("PRESIDENTE_MUN")))
        							)
        					)
        				)
        				$("#modalDetalleLayer .scroll").append(	
        					$("<div/>").addClass("detalles").html(
    							$("<ul/>").addClass("textoDetalleS1")		        								
        							.append(
        								$("<li/>")
        									.append($("<p/>").text("Hombres: "))
        									.append($("<p/>").text(layer.getProperty("HOMBRES").toLocaleString('en-US')))
        							)
        							.append(
        								$("<li/>")
        									.append($("<p/>").text("Mujeres: "))
        									.append($("<p/>").text(layer.getProperty("MUJERES").toLocaleString('en-US')))
        							)
        					)
        				)
        				$("#modalDetalleLayer .scroll").append(
        					$("<div/>").addClass("detalles").html(
    							$("<ul/>").addClass("textoDetalleS1")
    								.append(
        								$("<li/>")
        									.append($("<p/>").text("Priorizacion estatal: "))
        									.append($("<p/>").text(layer.getProperty("PRIORIZACION_EST")))
    								)
        							.append(
        								$("<li/>")
        									.append($("<p/>").text("Priorizacion municipal: "))
        									.append($("<p/>").text(layer.getProperty("PRIORI_MUN")))
        							)
        							.append(
        								$("<li/>")
        									.append($("<p/>").text("Lista nominal: "))
        									.append($("<p/>").text(layer.getProperty("LN160318").toLocaleString('en-US')))
        							)
        					)
        				)
        				$("#modalDetalleLayer .scroll").append(
        					$("<div/>").addClass("detalles").html(
    							$("<ul/>").addClass("textoDetalleS1")		        								
        							.append(
        								$("<li/>")
        									.append($("<p/>").text("Listado Nominal: "))
        									.append($("<p/>").text(layer.getProperty("LN160318").toLocaleString('en-US')))
        							)
        					)
        					
        				);	
        				$("#modalDetalleLayer .scroll").append(
        						$("<div/>").addClass("row").append(
        								$("<div/>").addClass("col-xs-12").css("display", "flex").append(
        										$("<div/>").addClass("center-block").append(
	        										$("<a/>").html($("<i/>").addClass("fas fa-eye"))
	    				        					.addClass("btn btn-info")
	    				        					
	    				        					.css("margin-top", "10px")
	    				        					.append("Ver capas a detalle.")
	    				        					.click(function(){
	    						        				//DetalleMapa.loadLayer(e.sourceTarget.feature, e.target.getElement().getAttribute("fill") ,circumscription.st.stateSelected);
	    				        						DetalleMapa.Gmaps.BuscarSeccion(divisionToSend,layer.getProperty("SECCION"),state.id);
	    						        			})
	    						        		)
        								)
        						)			        					
        				);								
        				$("#modalDetalleLayer .scroll").append(
        						$("<div/>").addClass("row").append(
        								$("<div/>").addClass("col-xs-12").css("display", "flex").append(
        										$("<div/>").addClass("center-block").append(
        												$("<a/>").html($("<i/>").addClass("fas fa-download"))
        												.addClass("btn btn-info")
        												
        												.css("margin-top", "10px")
        												.append("Descargar Detalle INE.")
        												.click(function(){
        													var secc = "";
        													if(layer.getProperty("SECCION")<10){
        														secc +="000";
        													}else if(layer.getProperty("SECCION")<100){
        														secc +="00";
        													}else if(layer.getProperty("SECCION")<1000){
        														secc +="0";
        													}
        													window.open("http://e-government.in/resources/21/psi-"+secc+layer.getProperty("SECCION")+"_2018.zip");
        												})
        										)
        								)
        						)			        					
        				);								
						break;
					default:
						$.get("circumscription/getViewPolls", {stateId: idEstateToSend, division: divisionToSend, idSolicitado: layer.getProperty("MUNICIPIO") || layer.getProperty("ID")}, function(data) {
							$("#modalDetalleLayer .scroll").html("");
							$(".tituloModalDetalleCirc").text(layer.getProperty("df_GL"));
	        				$("#modalDetalleLayer .scroll").append(
	        					$("<div/>").addClass("detalles").html(
        							$("<ul/>").addClass("textoDetalleS1")
	        							.append(
	        									$("<li/>")
	        									.append($("<p/>").text("Nombre: "))
	        									.append($("<p/>").text( 
	        											data[0].distrito != null ? data[0].distrito : 
	        												data[0].distritosLocales != null ? data[0].distritosLocales : 
	        													data[0].municipio != null ? data[0].municipio : ""
	        											
	        									))
	        							)
        								.append(
	        								$("<li/>")
	        									.append($("<p/>").text("Listado nominal: "))
	        									.append($("<p/>").text(data[0].listadoNominal.toLocaleString('en-US')))
	        							)
	        							.append(
	        								$("<li/>")
	        									.append($("<p/>").text("Secciones: "))
	        									.append($("<p/>").text(data[0].secciones.toLocaleString('en-US')))
	        							)
	        					)
	        				)
	        				$("#modalDetalleLayer .scroll").append(	
	        					$("<div/>").addClass("detalles").html(
        							$("<ul/>").addClass("textoDetalleS1")		        								
	        							.append(
	        								$("<li/>")
	        									.append($("<p/>").text("Casillas: "))
	        									.append($("<p/>").text(data[0].casillas.toLocaleString('en-US')))
	        							)
	        							.append(
	        								$("<li/>")
	        									.append($("<p/>").text("Urbanas: "))
	        									.append($("<p/>").text(data[0].urbanas.toLocaleString('en-US')))
	        							)
	        							.append(
	        								$("<li/>")
	        									.append($("<p/>").text("Rurales: "))
	        									.append($("<p/>").text(data[0].rurales.toLocaleString('en-US')))
	        							)
	        							.append(
	        								$("<li/>")
	        									.append($("<p/>").text("Mixtas: "))
	        									.append($("<p/>").text(data[0].mixtas.toLocaleString('en-US')))
	        							)
	        					)
	        				);
	        				$("#modalDetalleLayer .scroll").append(
	        						$("<div/>").addClass("row").append(
	        								$("<div/>").addClass("col-xs-12").css("display", "flex").append(
	        										$("<div/>").addClass("center-block").append(
		        										$("<a/>").html($("<i/>").addClass("fas fa-eye"))
		    				        					.addClass("btn btn-info")
		    				        					
	    				        					.css("margin-top", "10px")
		    				        					.append("Ver capas a detalle.")
		    				        					.click(function(){
		    				        						/*
		    				        						layer.toGeoJson(function(e) {
		    				        							DetalleMapa.loadLayer(e, layer.f.style.fillColor ,circumscription.st.stateSelected);	    				        							
		    				        						});	
		    				        						*/
		    				        						switch (divisionToSend) {
		    				        						case "1":
		    				        						case "2":
		    				        							DetalleMapa.Gmaps.BuscarSeccion(divisionToSend,layer.getProperty("DISTRITO"),state.id);
		    				        							break;
		    				        						case "3":
		    				        							DetalleMapa.Gmaps.BuscarSeccion(divisionToSend,layer.getProperty("MUNICIPIO"),state.id);
		    				        							break;
		    				        						}
		    						        			})
		    						        		)
	        								)
	        						)
	        				);
						});									
						
						break;
    				}
					
    				$("#modalDetalleLayer").show();
    				layoutUtils.unBlockDiv("#modalDetalleCirc");
				});
				allLayersStatesGmaps[idEstateToSend][layerId+"90"].addListener('rightclick', function(event) {
					var layer = event.feature;
					switch (divisionToSend) {
					case "1":
					case "2":
						DetalleMapa.Gmaps.BuscarSeccion(divisionToSend,layer.getProperty("DISTRITO"),state.id);
						break;
					case "3":
						DetalleMapa.Gmaps.BuscarSeccion(divisionToSend,layer.getProperty("MUNICIPIO"),state.id);
						break;
					case "4":
						DetalleMapa.Gmaps.BuscarSeccion(4,layer.getProperty("SECCION"),state.id);
						break;
					case "5":
						DetalleMapa.Gmaps.BuscarSeccion(divisionToSend,layer.getProperty("region"),state.id);
						break;
					case "6":
						DetalleMapa.Gmaps.BuscarSeccion(divisionToSend,layer.getProperty("coord_indigena"),state.id);
						break;
					}
					/*
					if(layer.f.SECCION){
						
    				}else{
    					layer.toGeoJson(function(e) {
							DetalleMapa.loadLayer(e, layer.f.style.fillColor ,circumscription.st.stateSelected);	    				        							
						});
    				}
    				*/
				});
				
				// desactivando submenu click derecho 
				var mapCanvas = document.getElementById(layerId+90);
				$(mapCanvas).on('contextmenu', '.custom-context-menu', function (e) {
				    e.stopPropagation();
				    e.preventDefault();
				    return false;
				});
				
				allLayersStatesGmaps[idEstateToSend][layerId+"90"].addListener('addfeature', function (event) {					
				});
								
				if(divisionToSend == 5 && stateId == 21){
					var centerOfRegion = [
						{type: "Feature",geometry:{type:"Point",coordinates:[-98.11545440598726, 18.397818297751595]},properties: {img: "r1"}},
			    		{type: "Feature",geometry:{type:"Point",coordinates:[-97.16467380523683, 18.33982062268129 ]},properties: {img: "r2"}},
			    		{type: "Feature",geometry:{type:"Point",coordinates:[-98.51590633392334, 18.727825476698538]},properties: {img: "r3"}},
			    		{type: "Feature",geometry:{type:"Point",coordinates:[-97.41027832031251, 19.33706180106997 ]},properties: {img: "r4"}},
			    		{type: "Feature",geometry:{type:"Point",coordinates:[-98.2156276702881 , 19.0130305040104, ]},properties: {img: "r5"}},
			    		{type: "Feature",geometry:{type:"Point",coordinates:[-97.912135,         20.433149474696982]},properties: {img: "r6"}},
			    		{type: "Feature",geometry:{type:"Point",coordinates:[-98.51315975189209, 19.219748092945334]},properties: {img: "r7"}},
			    		{type: "Feature",geometry:{type:"Point",coordinates:[-97.63343811035158, 18.544557893930207]},properties: {img: "r8"}},
			    		{type: "Feature",geometry:{type:"Point",coordinates:[-97.88131713867189, 19.017980467662962]},properties: {img: "r9"}},
			    		{type: "Feature",geometry:{type:"Point",coordinates:[-97.3828125       , 19.944951054874977]},properties: {img: "r10"}},
			    		{type: "Feature",geometry:{type:"Point",coordinates:[-97.868155        , 19.825645593363205]},properties: {img: "r11"}}
			    	];	
					allLayersStatesGmaps[idEstateToSend][layerId+"91"] = new google.maps.Data();
					allLayersStatesGmaps[idEstateToSend][layerId+"91"].setStyle(function(feature) {
						var icon = {
						        url: 'img/'+feature.getProperty('img')+'.svg', // url
						        scaledSize: new google.maps.Size(30, 50), // size
						    };
						return {
							icon: icon
	            		};
			        });
					allLayersStatesGmaps[idEstateToSend][layerId+"91"].addListener('addfeature', function (event) {
						if (event.feature.getGeometry().getType() === 'Point') {
			        		var marker = new google.maps.Marker({
			        			position: event.feature.getGeometry().get(),
			        			identificador: event.feature.getProperty('img'),
			        			title: event.feature.getProperty('img'),
			        	    });
			            }	
					});
					
					var geojson = {"type" : "FeatureCollection","metadata" : {},"features" : centerOfRegion}
					allLayersStatesGmaps[idEstateToSend][layerId+"91"].addGeoJson(geojson);
					allLayersStatesGmaps[idEstateToSend][layerId+"91"].setMap(circumscription.st.globalMapG);
					
					$("#detalleSeccionesAside").show();
				}
				
				var geojson = {"type" : "FeatureCollection","metadata" : {},"features" : res}
				allLayersStatesGmaps[idEstateToSend][layerId+"90"].addGeoJson(geojson);
				allLayersStatesGmaps[idEstateToSend][layerId+"90"].setMap(circumscription.st.globalMapG);

	    	});
	    }else{    
	    	allLayersStatesGmaps[idEstateToSend][layerId+"90"].setMap(circumscription.st.globalMapG);
	    	if(divisionToSend == 5 && stateId == 21){
	    		allLayersStatesGmaps[idEstateToSend][layerId+"91"].setMap(circumscription.st.globalMapG);
	    		$("#detalleSeccionesAside").show();
	    	}
	    	allLayersStatesGmaps[idEstateToSend][layerId+"90"].setStyle(function(feature) {
	    		var style = feature.getProperty('style');
	            var color = "transparent";
	            switch (divisionToSend) {
	    		case "1":
	    		case "2":
	    			color = circumscription.events.colorGL(feature.getProperty('df_GL'));
	    			break;
	    		case "3":
	    			color = circumscription.events.colorGL(feature.getProperty('m_Partido político del presidente municipal'));
	    			break;
	    		case "4":
	    			color = circumscription.events.colorGL(feature.getProperty('PARTIDO_AFIN_PRESIDENTE'));
	    			break;
	    		default:
	    			return /** @type {!google.maps.Data.StyleOptions} */style;
	    			break;
	    		}
	            style = {
	        			 fillColor: color ,
	    				 strokeColor: "#888",
	    				 fillOpacity: 1,
	    				 strokeOpacity: 1,
	    				 strokeWeight: 1,
	        		 };
	            return style;
	        });	
	    }
	    
	    var datos={
	        division:divisionToSend,
	        stateId:idEstateToSend
	    }

	    if(divisionToSend != 5){
	    	$.ajax({
	    		url: "circumscription/getPartidosPoliticosByDivision",
	    		data:datos
	    	}).done(function(data) {
	    		///creating content for main menu circunscription
	    		$('#partidosPorEstado').html('');
	    		for(var i=0;i<data.length;i++){
	    			imgData="";
	    			textoPartido=data[i].party;
	    			if(data[i].party=="PAN"){
	    				imgData="img/icono-pan.svg";
	    			}else if(data[i].party=="PRI"){
	    				imgData="img/icono-pri.svg";
	    			}else if(data[i].party=="MORENA"){
	    				imgData="img/icono-morena.svg";
	    			}else if(data[i].party=="MC"){
	    				imgData="img/icono-mc.svg";
	    			}else if(data[i].party=="CPP"){
	    				imgData="img/icono-cpp.svg";
	    			}else if(data[i].party=="PRD"){
	    				imgData="img/icono-prd.svg";
	    			}else if(data[i].party=="PT"){
	    				imgData="img/icono-pt.svg";
	    			}else if(data[i].party=="PSI"){
	    				imgData="img/icono-psi.svg";
	    			}else if(data[i].party=="PVEM"){
	    				imgData="img/icono-verde.svg";
	    			}else if(data[i].party=="PES"){
	    				imgData="img/icono-encuentro.svg";
	    			}else if(data[i].party=="PANAL"){
	    				imgData="img/icono-nueva.svg";
	    			}
	    			
	    			
	    			var contentCargo= 	'<li>'+
	    			'<div class="item-patido-lista"><img src="'+imgData+'" /></div>'+
	    			textoPartido +
	    			'<div class="checkbox">'+
	    			'<label>'+
	    			'<input name="gPartidos" value="" type="radio" id="'+data[i].party+'_'+lastStateSelected+'" onclick="listaGobiernoActual(this)"/>'+
	    			'</label>'+
	    			'</div>'+
	    			'</li>';
	    			
	    			$('#partidosPorEstado').append(contentCargo);
	    		}
	    		
	    	});
	    }

	} 
}

function buscarSeccion () {
	if($("#txtSeccion").val() != ""){
		DetalleMapa.Gmaps.BuscarSeccion(4,$("#txtSeccion").val(),state.id);
	}
	$("#txtSeccion").val("");
}

function listaGobiernoActual(element){
	
	if(element.id == null){
        resetCollapses();
	}
    var contentGobActual = '';
    var element=element.id;
    var pParty=element.substring(0,element.indexOf('_'));
    var state=element.substring(element.indexOf('_')+1,element.length);
    
    allLayersStatesGmaps[circumscription.st.stateSelected][circumscription.st.layerSelected+"90"].setStyle(function(feature) {
    	var color = "transparent";
        switch (divisionToSend) {
		case "1":
		case "2":
			if(feature.getProperty('df_GL') == pParty) {
				color = circumscription.events.colorGL(feature.getProperty('df_GL'));				
			}
			break;
		case "3":
			if(feature.getProperty('m_Partido político del presidente municipal') == pParty) {
				color = circumscription.events.colorGL(feature.getProperty('m_Partido político del presidente municipal'));				
			}
			break;
		case "4":
			if(feature.getProperty('PARTIDO_AFIN_PRESIDENTE') == pParty) {
				color = circumscription.events.colorGL(feature.getProperty('PARTIDO_AFIN_PRESIDENTE'));				
			}
			break;
		}
        var style = {
    			 fillColor: color ,
				 strokeColor: "#888",
				 fillOpacity: 1,
				 strokeOpacity: 1,
				 strokeWeight: 1,
    		 };
        return style;
    });
    
    $.ajax({
        url: "circumscription/getDataCurrentAdminByStateParty/"+state+"/"+pParty,
    }).done(function(data) {
        $('#listaGobActual').html('');
        if(data.length!= null || data.length!= 0 ) {
            contentGobActual = '<tr>' +
                '<td>Gobernatura</td>' +
                '<td>' + data.actgov.toLocaleString('en-US') + '</td>' +
                '<td>' + data.lnominal.toLocaleString('en-US') + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>Distritos Federales</td>' +
                '<td>' + data.distritos.toLocaleString('en-US') + '</td>' +
                '<td>' + data.lnominal.toLocaleString('en-US') + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>Distritos Locales</td>' +
                '<td>' + data.dlocals.toLocaleString('en-US') + '</td>' +
                '<td>' + data.lnominal.toLocaleString('en-US') + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>Municipios</td>' +
                '<td>' + data.mun.toLocaleString('en-US') + '</td>' +
                '<td>' + data.lnominal.toLocaleString('en-US') + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>Secciones</td>' +
                '<td>' + data.sections.toLocaleString('en-US') + '</td>' +
                '<td>' + data.lnominal.toLocaleString('en-US') + '</td>' +
                '</tr>' ;
        }
        $('#listaGobActual').append(contentGobActual);
    });


}





function cleanStateSelection(){
	$("#initialMap").show();
	$("#googleMap").hide();
	$('#detalleSeccionesAside').hide();
	
	$("#pEstado").css("cursor","auto");
	circumscription.st.globalMap.clearLayers();
    $('#partidosPorEstado').html('');
    $('input[type=checkbox]').prop('checked',false);
	clearTablesView();
    $(".estado").parent().parent().show();
    $("#pEstadoSelec").css("display", "none");
    $("#pPartidos").css("display", "none");
    $("#pCasillas").css("display", "none");
    $('#collapse-13').collapse('hide');
    $('#collapse-14').collapse('hide');
    $('#pPartidos').css("display","none");
    //el colapse 15 es el que muestra el detalle de las casillas
    $('#collapse-15').collapse('hide');
    $('#pCasillas').css("display","none");
    llenarListaCargoByEstado(0);
    $('#contenedorBotones').hide();
    if(globalMarkerClusterByState!=null){
    	circumscription.st.globalMap.removeLayer(globalMarkerClusterByState);
    }
    if (circumscription.st.titleLayer){
    	circumscription.st.globalMap.removeLayer(circumscription.st.titleLayer);    	
    }
    circumscription.events.loadSelectedCircunscription(lastCircunscripcionSelected);
    $('#modalDetalleCirc').hide();
    $('#divLayers').hide();
    $(".info.leaflet-control").css("display", "none");
    ocultarDetalleEstado();
}

function llenarListaCargoByEstado(idState){
    var datos={
        idState:idState
    };

//    $.ajax({
//        url: "circumscription/getCargoBystate",
//        data:datos
//    }).done(function(data) {
//        ///creating content for main menu circunscription
//        $('#listaCargoByEstado').html('');
//        for(var i=0;i<data.length;i++){
//
//            imgData="";
//            if(data[i].name=="Gobernador"){
//                imgData="img/gobernador.svg";
//            }else if(data[i].name=="Diputado Local"){
//                imgData="img/senadores.svg";
//            }else if(data[i].name=="Diputados de la Camara Baja"){
//                imgData="img/senadores.svg";
//            }else if(data[i].name=="Ayuntamientos"){
//                imgData="img/ayuntamientos.svg";
//            }else if(data[i].name=="Presidente de la Republica"){
//                imgData="img/gobernador.svg";
//            }else if(data[i].name=="Senadores"){
//                imgData="img/senadores.svg";
//            }
//
//            var contentCargo='<li>'+
//                '<div class="panel-item">'+
//                '<img src="'+ imgData +'"/>'+
//                '</div>'+
//                '<p class="text-cantidad">'+ data[i].posts +'</p>'+
//                '<p class="text-cargo">'+ data[i].name +'</p>'+
//                '<p class="text-juego">En juego</p>'+
//                '</li>';
//
//            $('#listaCargoByEstado').append(contentCargo);
//        }
//
//        if(data.length==0){
//            var contentCargo=	'<li>'+
//                '<div class="panel-item">'+
//                '<img src="img/gobernador.svg">'+
//                '</div>'+
//                '<p class="text-cantidad">1</p>'+
//                '<p class="text-cargo">Presidente de la Republica</p>'+
//                '<p class="text-juego">En juego</p>'+
//                '</li>'+
//                '<li>'+
//                '<div class="panel-item">'+
//                '<img src="img/senadores.svg">'+
//                '</div>'+
//                '<p class="text-cantidad">128</p>'+
//                '<p class="text-cargo">Senadores de la Republica</p>'+
//                '<p class="text-juego">En juego</p>'+
//                '</li>'+
//                '<li>'+
//                '<div class="panel-item">'+
//                '<img src="img/diputados.svg">'+
//                '</div>'+
//                '<p class="text-cantidad">500</p>'+
//                '<p class="text-cargo">Diputados de la Cámara Baja</p>'+
//                '<p class="text-juego">En juego</p>'+
//                '</li>';
//
//            $('#listaCargoByEstado').append(contentCargo);
//        }
//
//    });

}

function showAllCircunscription(){
	$("#initialMap").show();
	$("#googleMap").hide();
	$("#circunscripcionLabel").css("cursor", "auto");
    $('#partidosPorEstado').html('');
    $('input[type=checkbox]').prop('checked',false);
	clearTablesView();
    $(".circ").show();
    circumscription.st.globalMap.removeLayer(circumscription.st.titleLayer);
    $("#collapse-13").collapse('hide');
    $("#collapse-12").collapse('hide');
    $("#pEstado").css("display", "none");
    $("#pEstadoSelec").css("display", "none");
    $('#selectedCirc').text('');
    $('#collapse-14').collapse('hide');
    $('#pPartidos').css("display","none");
    //el colapse 15 es el que muestra el detalle de las casillas
    $('#collapse-15').collapse('hide');
    $('#pCasillas').css("display","none");

    $('#contenedorBotones').hide();
    //cargamos la barra lateral derecha nuevamente
    llenarListaCargoByEstado(0);
    circumscription.events.loadMapStates();
    if(globalMarkerClusterByState!=null){
    	circumscription.st.globalMap.removeLayer(globalMarkerClusterByState);
    }
    circumscription.st.globalMap.flyTo([23.4219128, -100.05443359375], 5 );
    $('#modalDetalleCirc').hide(); 
    $('#divLayers').hide(); 
}
$(document).ready(function() {
	//initial operations loaded on page ready
	$('#contenedorBotones').hide();
	circumscription.init();
    llenarListaCargoByEstado(0);
    division = 1;
    getPP();
});

function selectPP() {
	pparty = $("#cmbPP option:selected").text();
	if(pparty && pparty !== 'Todos') {
		;
	}else {
		pparty = null;
	}
	if(table) {
		table.destroy();
	}
	if(division === 1) {
		$('#dtableDL').attr('style','display: none');
		$('#dtableM').attr('style','display: none');
		$('#dtableDF').attr('style','display: block');
		
		var c = [
        	{ "data": "estado", "width": "10%" },
        	{ "data": "id", "width": "10%" },
            { "data": "distrito", "width": "20%" },
            { "data": "listadoNominal", "width": "10%", "type": "num", "render": $.fn.dataTable.render.number( ',', '.', 0, '' ) },
            { "data": "secciones", "width": "10%", "type": "num", "render": $.fn.dataTable.render.number( ',', '.', 0, '' ) },
            { "data": "casillas", "width": "10%", "type": "num", "render": $.fn.dataTable.render.number( ',', '.', 0, '' ) },
            { "data": "urbanas", "width": "10%", "type": "num", "render": $.fn.dataTable.render.number( ',', '.', 0, '' ) },
            { "data": "rurales", "width": "10%", "type": "num", "render": $.fn.dataTable.render.number( ',', '.', 0, '' ) },
            { "data": "mixtas", "width": "10%", "type": "num", "render": $.fn.dataTable.render.number( ',', '.', 0, '' ) }
            // { "data": "mapa", "width": "60%" }
        ];
	
		initt('#tableDF', 'circumscription/getViewPollsDependingOnDivision', c);
	}else if(division === 2) {
		$('#dtableDF').attr('style','display: none');
		$('#dtableM').attr('style','display: none');
		$('#dtableDL').attr('style','display: block');
		
		var c = [
        	{ "data": "estado", "width": "10%" },
        	{ "data": "id", "width": "10%" },
            { "data": "distrito", "width": "20%" },
            { "data": "listadoNominal", "width": "10%", "type": "num", "render": $.fn.dataTable.render.number( ',', '.', 0, '' ) },
            { "data": "secciones", "width": "10%", "type": "num", "render": $.fn.dataTable.render.number( ',', '.', 0, '' ) },
            { "data": "casillas", "width": "10%", "type": "num", "render": $.fn.dataTable.render.number( ',', '.', 0, '' ) },
            { "data": "urbanas", "width": "10%", "type": "num", "render": $.fn.dataTable.render.number( ',', '.', 0, '' ) },
            { "data": "rurales", "width": "10%", "type": "num", "render": $.fn.dataTable.render.number( ',', '.', 0, '' ) },
            { "data": "mixtas", "width": "10%", "type": "num", "render": $.fn.dataTable.render.number( ',', '.', 0, '' ) }
            // { "data": "mapa", "width": "60%" }
        ];
	
		initt('#tableDL', 'circumscription/getViewPollsDependingOnDivision', c);
	}else if(division === 3) {
		pagemun = 1;
		$('#dtableDF').attr('style','display: none');
		$('#dtableDL').attr('style','display: none');
		$('#dtableM').attr('style','display: block');
		
		var c = [
        	{ "data": "estado", "width": "10%" },
            { "data": "municipio", "width": "20%" },
            { "data": "listadoNominal", "width": "10%", "type": "num", "render": $.fn.dataTable.render.number( ',', '.', 0, '' ) },
            { "data": "secciones", "width": "10%", "type": "num", "render": $.fn.dataTable.render.number( ',', '.', 0, '' ) },
            { "data": "casillas", "width": "10%", "type": "num", "render": $.fn.dataTable.render.number( ',', '.', 0, '' ) },
            { "data": "urbanas", "width": "10%", "type": "num", "render": $.fn.dataTable.render.number( ',', '.', 0, '' ) },
            { "data": "rurales", "width": "10%", "type": "num", "render": $.fn.dataTable.render.number( ',', '.', 0, '' ) },
            { "data": "mixtas", "width": "10%", "type": "num", "render": $.fn.dataTable.render.number( ',', '.', 0, '' ) }
            // { "data": "mapa", "width": "60%" }
        ];
	
		initt('#tableM', 'circumscription/getViewPollsDependingOnDivision', c);
	}
}

function clearCmb(id, value, strv) {
	$(id).html($("<option/>")
			.attr("value", value)
			.append(strv));
	//$(id).selectpicker('refresh');
}

function getPP() {
	clearCmb("#cmbPP", "", "Todos");
//	var request = $.ajax({
//        url: "promoted/getPartidosPoliticos",
//        method: "GET"
//    });
//
//    request.done(function(data) {
//    	$.each(data, function(k,v){
//    		$("#cmbPP")
//			.append(
//				$("<option/>")
//				.attr("value", v.id)
//				.append(v.short_desc)
//			);
//    	});
//    	//$("#cmbPP").selectpicker('refresh');
//    });
//    
//    request.fail(function() {
//    });
}


function loadGraphByFed() {
	if(gstate) {
		var urlP = "circumscription/getPollingCountByStateDF/"+gstate;
		var request = $.ajax({
	        url: urlP,
	        method: "GET"
	    });

	    request.done(function(data) {
	    	makeChart(data.data, 1);
	    });

	    request.fail(function() {
	    });
	}
}

function loadGraphByLoc() {
	if(gstate) {
		
		var urlP = "circumscription/getPollingCountByStateDL/"+gstate;
//		var request = $.ajax({
//	        url: urlP,
//	        method: "GET"
//	    });
//
//	    request.done(function(data) {
//	    	$.unblockUI();
//	    	makeChart(data.data, 2);
//	    });
//	    
//	    request.fail(function() {
//	    	$.unblockUI();
//	    });		
	}
}

function loadGraphByFedClick() {
	division = 1;
	clickTablas();
	showCollapseByFedClick();
}

function resetCollapses(){
    $('input[type=checkbox]').prop('checked',false);
    $('input[type=radio]').prop('checked',false);
	$('#col-casillas-1').collapse('hide');
	$('#col-casillas-2').collapse('hide');
	$('#col-casillas-3').collapse('hide');
}

function showCollapseByFedClick(){
    $('input[type=checkbox]').prop('checked',false);
	$('#col-casillas-1').collapse('show');
	$('#col-casillas-2').collapse('hide');
	$('#col-casillas-3').collapse('hide');
}

function loadGraphByLocClick() {
	division = 2;
	clickTablas();
	showCollapseByLocClick();
}
function showCollapseByLocClick(){
    $('input[type=checkbox]').prop('checked',false);
	$('#col-casillas-1').collapse('hide');
	$('#col-casillas-2').collapse('show');
	$('#col-casillas-3').collapse('hide');
}
function loadGraphByMunClick() {
	division = 3;
	clickTablas();
	showCollapseByMunClick();
}
function showCollapseByMunClick(){
    $('input[type=checkbox]').prop('checked',false);
	$('#col-casillas-1').collapse('hide');
	$('#col-casillas-2').collapse('hide');
	$('#col-casillas-3').collapse('show');
}

function loadGraphByMun(page, off) {
	if(gstate) {
		var start = 0;
		if(page > 1) {
			start = ((page-1) * 10);
		}
//		var request = $.ajax({
//	        url: "circumscription/"+gstate+"/getPollingCountByStateMun/"+start+"/"+off,
//	        method: "GET"
//	    });
//
//	    request.done(function(data) {
//	    	makeChart(data.data, 3);
//	    });
//	    
//	    request.fail(function() {
//	    });		
	}
}

function clearTablesView() {
	$("#mapatab").addClass("active in");
	$("#tabProgramasSociales").removeClass("active in");
	$("#tablatab").removeClass("active in");
	
	$('#chartdiv').attr('style','display: none');
	$('.cont-mapa').attr('style','display: block');
}

function clickMaps(){
	$("#contenedorBotones button").removeClass("btn-primary");
	$("#btn-mapa").addClass("btn-primary");
	
	$('#btn-trace-route').show();
	clearTablesView();
}

function clickTablas() {
	$("#contenedorBotones button").removeClass("btn-primary");
	$("#btn-tabla").addClass("btn-primary");
    $('#modalDetalleCirc').hide();
    $('#modalDetalleLayer').hide();
    $('#btn-trace-route').hide();
    ocultarDetalleEstado();
	if(table) {
		table.destroy();	
	}
	if(division === 1) {
		loadGraphByFed();
		
		$('#dtableDL').attr('style','display: none');
		$('#dtableM').attr('style','display: none');
		$('#dtableDF').attr('style','display: block');
		var c = [
        	{ "data": "estado", "width": "10%" },
        	{ "data": "id", "width": "10%" },
            { "data": "distrito", "width": "20%" },
            { "data": "listadoNominal", "width": "10%", "type": "num", "render": $.fn.dataTable.render.number( ',', '.', 0, '' ) },
            { "data": "secciones", "width": "10%", "type": "num", "render": $.fn.dataTable.render.number( ',', '.', 0, '' ) },
            { "data": "casillas", "width": "10%", "type": "num", "render": $.fn.dataTable.render.number( ',', '.', 0, '' ) },
            { "data": "urbanas", "width": "10%", "type": "num", "render": $.fn.dataTable.render.number( ',', '.', 0, '' ) },
            { "data": "rurales", "width": "10%", "type": "num", "render": $.fn.dataTable.render.number( ',', '.', 0, '' ) },
            { "data": "mixtas", "width": "10%", "type": "num", "render": $.fn.dataTable.render.number( ',', '.', 0, '' ) }
            // { "data": "mapa", "width": "60%" }
        ];
	
		initt('#tableDF', 'circumscription/getViewPollsDependingOnDivision', c);
	}else if(division === 2){
		loadGraphByLoc();
		
		$('#dtableDF').attr('style','display: none');
		$('#dtableM').attr('style','display: none');
		$('#dtableDL').attr('style','display: block');
		var c = [
        	{ "data": "estado", "width": "10%" },
        	{ "data": "id", "width": "10%" },
            { "data": "distritosLocales", "width": "20%" },
            { "data": "listadoNominal", "width": "10%", "type": "num", "render": $.fn.dataTable.render.number( ',', '.', 0, '' ) },
            { "data": "secciones", "width": "10%", "type": "num", "render": $.fn.dataTable.render.number( ',', '.', 0, '' ) },
            { "data": "casillas", "width": "10%", "type": "num", "render": $.fn.dataTable.render.number( ',', '.', 0, '' ) },
            { "data": "urbanas", "width": "10%", "type": "num", "render": $.fn.dataTable.render.number( ',', '.', 0, '' ) },
            { "data": "rurales", "width": "10%", "type": "num", "render": $.fn.dataTable.render.number( ',', '.', 0, '' ) },
            { "data": "mixtas", "width": "10%", "type": "num", "render": $.fn.dataTable.render.number( ',', '.', 0, '' ) }
            // { "data": "mapa", "width": "60%" }
        ];
	
		initt('#tableDL', 'circumscription/getViewPollsDependingOnDivision', c);
	}else if(division === 3){
		pagemun = 1;
		
		$('#dtableDF').attr('style','display: none');
		$('#dtableDL').attr('style','display: none');
		$('#dtableM').attr('style','display: block');
		var c = [
        	{ "data": "estado", "width": "10%" },
            { "data": "municipio", "width": "20%" },
            { "data": "listadoNominal", "width": "10%", "type": "num", "render": $.fn.dataTable.render.number( ',', '.', 0, '' ) },
            { "data": "secciones", "width": "10%", "type": "num", "render": $.fn.dataTable.render.number( ',', '.', 0, '' ) },
            { "data": "casillas", "width": "10%", "type": "num", "render": $.fn.dataTable.render.number( ',', '.', 0, '' ) },
            { "data": "urbanas", "width": "10%", "type": "num", "render": $.fn.dataTable.render.number( ',', '.', 0, '' ) },
            { "data": "rurales", "width": "10%", "type": "num", "render": $.fn.dataTable.render.number( ',', '.', 0, '' ) },
            { "data": "mixtas", "width": "10%", "type": "num", "render": $.fn.dataTable.render.number( ',', '.', 0, '' ) }
            // { "data": "mapa", "width": "60%" }
        ];
	
		initt('#tableM', 'circumscription/getViewPollsDependingOnDivision', c);
	}

	$("#mapatab").removeClass("active in");
	$("#tabProgramasSociales").removeClass("active in");
  	$("#tablatab").addClass("active in");
  		
  	$('#chartdiv').attr('style','display: block');
    $('.cont-mapa').attr('style','display: none');
}

function makeChart(array, idDiv) {
	if(idDiv === 3) {
		var chart = AmCharts.makeChart( "chartdiv", {
			  "type": "serial",
			  "theme": "light",
			  "dataProvider": array,
			  "valueAxes": [ {
			    "gridColor": "#FFFFFF",
			    "gridAlpha": 0.2,
			    "dashLength": 0
			  } ],
			  "gridAboveGraphs": true,
			  "startDuration": 1,
			  "graphs": [ {
			    "balloonText": "[[category]]: <b>[[value]]</b>",
			    "fillAlphas": 0.8,
			    "lineAlpha": 0.2,
			    "type": "column",
			    "valueField": "total"
			  } ],
			  "categoryField": "_id",
			  "categoryAxis": {
			    "gridPosition": "start",
			    "gridAlpha": 0,
			    "tickPosition": "start",
			    "tickLength": 20,
			    "autoWrap": true
			  },
			  "export": {
			    "enabled": true
			  }

			} );
	}else {
		var chart = AmCharts.makeChart( "chartdiv", {
			  "type": "serial",
			  "theme": "light",
			  "dataProvider": array,
			  "valueAxes": [ {
			    "gridColor": "#FFFFFF",
			    "gridAlpha": 0.2,
			    "dashLength": 0
			  } ],
			  "autoMarginOffset": 25,
			  "gridAboveGraphs": true,
			  "startDuration": 1,
			  "graphs": [ {
			    "balloonText": "[[_id]]: <b>[[total]]</b>",
			    "fillAlphas": 0.8,
			    "lineAlpha": 0.2,
			    "type": "column",
			    "valueField": "total"
			  }],
			  "chartCursor": {
			    "categoryBalloonEnabled": true,
			    "categoryBalloonFunction": function( value, valueText, valueAxis ) {
			    	for(var i = 0; i < array.length; i++) {
			    	  if(array[i]._id === Number(value)) {
			    	    return array[i].name;
			    	  }
			    	}	
			    }
			  },
			  "categoryField": "_id",
			  "categoryAxis": {
			    "gridPosition": "start",
			    "gridAlpha": 0,
			    "tickPosition": "start",
			    "tickLength": 20
			  },
			  "export": {
			    "enabled": true
			  }

			} );
	}
}

var table;
var currentp = 0;
var pparty;
var division;
var pagemun = 1;
var offset = 10;
var gstate;

function initt(tablename, urlstr, cols) {
	currentp = 0;
	$.extend( $.fn.dataTable.defaults, {
	    scrollX: false,
	    lengthChange:false,
	    autoWidth: false,
		processing: true,
        serverSide: true,
        searching: false,
        ordering: false,
        scrollX: false,
        paging: true,
	});
	
	var data = getDataToPost();
	table = $(tablename).DataTable({
        ajax: {
        	url: urlstr,
        	type: 'POST',
            contentType: 'application/json',
            dataType: 'json',
            data: function ( d ) {
            	data.pageNumber = currentp+1;
            	if(division === 3) {
                	loadGraphByMun(data.pageNumber, 10);            		
            	}
            	return JSON.stringify(data);
            }
        },
        pageLength: 10,
        columns: cols,
		language: {
	    	"info": "_START_ a _END_ filas de _TOTAL_",
	    	"infoEmpty": "Mostrando 0 de 0 de 0 entradas",
	    	"emptyTable": "No hay informaci&oacute;n",
	        paginate: {
	            previous: '<',
	            next:     '>'
	        },
	        aria: {
	            paginate: {
	                previous: '<',
	                next:     '>'
	            }
	        }
	    }
	});
	
	$(tablename).on( 'page.dt',   function (e) {
		currentp = table.page.info().page;
	});
	
}

function getDataToPost() {
	var data = {};
	//"localDistrictFilterIds" : [1,2,3,4,5],
	data.stateId = gstate;
	data.division = division;
	// data.localDistrictFilterIds = 0;
	data.pageNumber = 1;
	if(pparty) {
		data.party = pparty;		
	}

	return data;
}
function detalleEstado() {
    //$("#datosEstado").show();
    $("#textoDetalleS1").hide();
    $("#textoDetalleS2").hide();
    $("#textoDetalleS3").hide();
    $("#textoDetalleS4").hide();
    $("#textoDetalleS5").show();
    $("#textoDetalleS6").show();
    $("#textoDetalleS7").show();
    $("#textoDetalleS8").show();
}

function ocultarDetalleEstado() {
    //$("#datosEstado").show();
    $("#textoDetalleS1").show();
    $("#textoDetalleS2").show();
    $("#textoDetalleS3").show();
    $("#textoDetalleS4").show();
    $("#textoDetalleS5").hide();
    $("#textoDetalleS6").hide();
    $("#textoDetalleS7").hide();
    $("#textoDetalleS8").hide();
}


function datosEstado(element){
    //var idStateSelected=element.id.substring(0,element.id.indexOf('_'));
   // gstate = idStateSelected;
   // $('#modalDetalleCirc').hide();
  //  circumscription.events.getPollingLayerByState(idStateSelected);
    var state=element;
    var datos={
        stateId:state
    };
    
    $.ajax({
        url: "layout/getSummary",
        data:datos,
        beforeSend : function() {
        	layoutUtils.blockDiv("#modalDetalleCirc");
         },
    }).done(function(data) {    	
        $('#datosEstado').html('');
        if (data.length != null || data.length != 0) {

            $('#textoDetalleS5').html('');
            $('#textoDetalleS6').html('');
            $('#textoDetalleS7').html('');
            $('#textoDetalleS8').html('');


            $('.tituloModalDetalleCirc').html('');

            $('.tituloModalDetalleCirc').append(data.Estado +'&nbsp;'+ data.GrupoLegislativo);
            contentS5 = '<li>' +
                '<p>Gobernador:</p><p>' + data.Gobernador + '</p>' +
                '</li>'+
                '<li>' +
                '<p>Grupo Legislativo:</p><p>' + data.GrupoLegislativo + '</p>' +
                '</li>'+
                '<li>' +
                '<p>Periodo:</p><p>' + data.Periodo + '</p>' +
                '</li>' +
                '<li>' +
                '<p>Fecha:</p>' + data.Fecha +
                '</li>';
            $('#textoDetalleS5').append(contentS5);

            contentS6 = '<li>'+
                '<p>En funciones</p>'+
                '</li>'+
                '<li>'+
                '<p>Poblacion:</p><p>'+data.Poblacion.toLocaleString('en-US')+'</p>'+
                '</li>'+
                '<li>'+
                '<p>Superficie:</p><p>'+data.Superficie.toLocaleString('en-US')+'</p>'+
                '</li>';
            $('#textoDetalleS6').append(contentS6);

            contentS7 = '<li>'+
                '<p>Circunscripcion:</p><p>'+data.Circunscripciones+'</p>'+
                '</li>'+
                '<li>'+
                '<p>Distritos Federales:</p><p>'+data.DistritosFederales.toLocaleString('en-US')+'</p>'+
                '</li>'+
                '<li>'+
                '<p>Distritos Locales:</p><p>'+data.DistritosLocales.toLocaleString('en-US')+'</p>'+
                '</li>'+
                '<li>'+
                '<p>Municipios:</p><p>'+data.Municipios.toLocaleString('en-US')+'</p>'+
                '</li>'+
                '<li>'+
                '<p>Secciones:</p><p>'+data.Secciones.toLocaleString('en-US')+'</p>'+
                '</li>';

            $('#textoDetalleS7').append(contentS7);

            contentS8 = '<li>'+
                '<p>Lista Nominal:</p><p>'+data.ListaNominal.toLocaleString('en-US')+'</p>'+
                '</li>'+
                '<li>'+
                '<p>Padrón Electoral:</p><p>'+data.PadronElectoral.toLocaleString('en-US')+'</p>'+
                '</li>';
            $('#textoDetalleS8').append(contentS8);

            $('#modalDetalleCirc').show();
            detalleEstado();
           layoutUtils.unBlockDiv("#modalDetalleCirc");
        }
    });
}


loadLayer = function(state, layerParam){
	if(!allLayersStates[state][layerParam]){
		getLayer(state, layerParam);
	}else{		
		allLayersStates[state][layerParam].addTo(circumscription.st.globalMap);
	}
};
deleteLayer = function(state, layer){
	circumscription.st.globalMap.removeLayer(allLayersStates[state][layer]);
};


getLayer = function(stateId, layerId){
	if(layerId !== 49 && layerId !== 50){
		layoutUtils.progressDownload( layerId,"Descargando ","state/getLayerById?layerId=" + layerId + "&stateId=" + stateId, function (data, textStatus, jqxhr) {
			var response = data.capa;
			printLayerInMap(stateId, layerId, response);
		});
	}else{
		layoutUtils.progressDownload( layerId,"Descargando ","state/getLayerById?layerId=" + layerId + "&stateId=" + stateId, function (data, textStatus, jqxhr) {
			var response = data.capa;

			$(".gradiente-cont p").html("Población de 15 años y más alfabeta");
			$(".gradiente-cont span").html("0%");
			$(".gradiente-cont .span2").html("100%");
			$(".gradiente-cont").show();
			allLayersStates[stateId][layerId] = L.geoJSON(response , {
	             style: function(layer){
	            	 
	            	 var percent = layer.properties.EDU25_R;
	            	 var color = percent <= 90 ? "rgb(255, "+(percent*2.55*1.11)+", 0)":"rgb("+((100-percent)/10*255)+", 255, 0)";
	               return {
	                 fillColor: (typeof layer.properties.EDU25_R !== 'undefined')? color: "#ccc",
	                 weight: 1, 
	                 color: (typeof layer.properties.EDU25_R !== 'undefined')? color: "#ccc",
	                 opacity: 1,
	                 fillOpacity: 0.7
	               };
	             },

		           onEachFeature: function (feature, layer) {
		        		layer.on({
				             mouseover: function (e) {
					 				var layer = e.target.feature;
					 				if(typeof layer.properties.EDU25_R !== 'undefined'){
					 					$(".info.leaflet-control").css("display", "block").html('<h4>Población de 15 años y más alfabeta: '+layer.properties.EDU25_R+'%</h4>');
					 				}else{
					 					$(".info.leaflet-control").css("display", "block").html('<h4>Población con discapacidad: '+layer.properties.DISC1+'</h4>');
					 				}
					 			},
				 	        mouseout: function (e) {
				 	        	$(".info.leaflet-control").css("display", "none");
					 			}
			             });
	       		}	
	           });

			allLayersStates[stateId][layerId].addTo(circumscription.st.globalMap);
		});
	}
	
};


printLayerInMap= function(state, layer, geoJsonData){
	if(geoJsonData[0].geometry.type === "Point"){
          var cluster = L.markerClusterGroup();
          geoJsonData.forEach(function(item, index){
            cluster.addLayer(
            		L.marker(
        				new L.LatLng(item.geometry.coordinates[1],item.geometry.coordinates[0]),
        				{icon: L.AwesomeMarkers.icon(item.icon)} 
            		).bindPopup(
							(item.properties.img ? "<img src='img/" + item.properties.img+"'/>": "") +
            				(item.properties.NOMBRE?"<br/>Nombre: "+item.properties.NOMBRE: "")+
            				(item.properties.elector?"<br/>Elector: "+item.properties.elector: "")+
            				(item.properties.telefono?"<br/>Teléfono: "+item.properties.telefono: "")+
            				(item.properties.nom_estab?"<br/>Nombre: "+item.properties.nom_estab: "")+
            				(item.properties.nom_vial?"<br/>Dirección: "+item.properties.nom_vial: "")+
            				(item.properties.fecha_alta?"<br/>Fecha Alta: "+item.properties.fecha_alta: "")+
            				(item.properties.municipio?"<br/>Municipio: "+item.properties.municipio: "")+
            				(item.properties.AGRUPADO?"<br/>AGRUPADO: "+item.properties.AGRUPADO: "")+
            				(item.properties.DOMICILIO?"<br/>Domicilio: "+item.properties.DOMICILIO: "")+
            				(item.properties["DIRECCIóN"]?"<br/>Domicilio: "+item.properties["DIRECCIóN"]: "")+
            				(item.properties.CAT?"<br/>Categoría: "+item.properties.CAT: "")+
            				(item.properties.MUNICIPIO?"<br/>Municipio: "+item.properties.MUNICIPIO: "")+
            				(item.properties.NOM_MPIO?"<br/>Municipio: "+item.properties.NOM_MPIO: "")+
            				(item.properties.PADRON?"<br/>Padrón: "+item.properties.PADRON: "")+
            				(item.properties.SECCION?"<br/>Sección: "+item.properties.SECCION: "")+
            				(item.properties.TIPO?"<br/>Tipo: "+item.properties.TIPO: "")+
            				(item.properties.TIPO_CA?"<br/>Tipo casilla: "+item.properties.TIPO_CA: "")+
            				(item.properties.edad?"<br/>Edad: "+item.properties.edad: "")+
            				(item.properties.ocupacion?"<br/>Ocupación: "+item.properties.ocupacion: "")+
            				(item.properties.UBIC?"<br/>Ubicación: "+item.properties.UBIC: "")
            				)
            .openPopup());
          });
          cluster.addTo(circumscription.st.globalMap);
          allLayersStates[state][layer] = cluster;
    }else{
    	allLayersStates[state][layer] = L.geoJSON(geoJsonData , {
             style: function(layer){
               return layer.style;
             },

	           onEachFeature: function (feature, layer) {
	        		layer.on({
			             mouseover: function (e) {
				 				var layer = e.target;
			
				 				var name = false;
				 			    if(layer.feature.properties.df_Cabecera){
				 			    	name = layer.feature.properties.df_Cabecera; 
				 			    }else if(layer.feature.properties.DISTRITO){
				 			    	name = "Distrito: "+layer.feature.properties.DISTRITO;
				 			    }else if(layer.feature.properties.SECCION){
				 			    	name = "Sección: "+layer.feature.properties.SECCION;
				 			    }else if(layer.feature.properties.NOMBRE){
				 			    	name = layer.feature.properties.NOMBRE;
				 			    }
				 			    if(layer.feature.properties.SS_MUNICIPIO){
				 			    	name += "<br/>Municipio: "+layer.feature.properties.SS_MUNICIPIO;
				 			    }
				 			    

					 			   $("#detallePoblacion").html("");
					 			   $("#detalleGenero").html("");
			        			    if(layer.feature.properties.LN160318){
			        			    	$("#detallePoblacion").append(
			        			    			$("<div/>").html($("<b/>").html("Listado nominal:")).append(layer.feature.properties.LN160318)
			        			    	);
			        			    }
			        			    if(layer.feature.properties.HAB2015INEGI){
			        			    	$("#detallePoblacion").append(
			        			    			$("<div/>").html($("<b/>").html("Habitantes INEGI 2015:")).append(layer.feature.properties.HAB2015INEGI)
			        			    	);
			        			    }
			        			    if(layer.feature.properties.HOMBRES){
			        			    	$("#detalleGenero").append(
			        			    			$("<div/>").html($("<b/>").html("Hombres:")).append(layer.feature.properties.HOMBRES)
			        			    	);
			        			    }
			        			    if(layer.feature.properties.MUJERES){
			        			    	$("#detalleGenero").append(
			        			    			$("<div/>").html($("<b/>").html("Mujeres:")).append(layer.feature.properties.MUJERES)
			        			    	);
			        			    }
				 			    
				 			    if(name){
				 			    	 layer.setStyle({
				 	 			        weight: 3,
				 	 			        color: '#666'
				 	 			    });
				 	
				 	 			    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
				 	 			        layer.bringToFront();
				 	 			    }
				 	 			    $(".info.leaflet-control").css("display", "block").html('<h4>'+name+'</h4>');
				 			    }
				 			},
				 	        mouseout: function (e) {

					 			   $("#detallePoblacion").html("");
					 			   $("#detalleGenero").html("");
					 	        	var layer = e.target;
					 	        	var name = false;
					 			    if(layer.feature.properties.df_Cabecera){
					 			    	name = layer.feature.properties.df_Cabecera; 
					 			    }else if(layer.feature.properties.DISTRITO){
					 			    	name = "Distrito: "+layer.feature.properties.DISTRITO;
					 			    }else if(layer.feature.properties.SECCION){
					 			    	name = "Sección: "+layer.feature.properties.SECCION;
					 			    }
					 			    if(layer.feature.properties.SS_MUNICIPIO){
					 			    	name += "<br/>Municipio: "+layer.feature.properties.SS_MUNICIPIO;
					 			    }
					 			    if(name){
						 			    layer.setStyle({
						 			        weight: 1,
						 			        color: '#888'
						 			    });
						 	        	$(".info.leaflet-control").css("display", "none");
					 			    }
					 			}
		             });
       		}	
           });
    }

	allLayersStates[state][layer].addTo(circumscription.st.globalMap);
};






var programasSoc = {
		clickProgramas: function(){
			$("#contenedorBotones button").removeClass("btn-primary");
			$("#btn-programas").addClass("btn-primary");			

	$("#mapatab").removeClass("active in");
	$("#tablatab").removeClass("active in");
    $('#tabProgramasSociales').addClass("active in");
    $('#modalDetalleCirc').hide();
    $('#btn-trace-route').hide();
    programasSoc.changeProgramLevel();
	
}, 
refreshTable : function(idTable){
	try {
		$(idTable).DataTable({
			"language": {
	            "lengthMenu": "Mostrar _MENU_ registros por pag.",
	            "zeroRecords": "No hay datos para mostrar",
	            "info": "Mostrando _PAGE_ de _PAGES_ páginas",
	            "infoEmpty": "No hay datos para mostrar",
	            "infoFiltered": "(Filtrado de  _MAX_ registros)",
	            "sSearch": "Buscar",
	            "oPaginate": {
	        		"sFirst":    	"Primero",
	        		"sPrevious": 	"Anterior",
	        		"sNext":     	"Siguiente",
	        		"sLast":     	"Último"
	        	}
	        }
		});
	}
	catch(err) {
		console.log(err);
	}
}, 
limpiaTabla: function (idTabla){
	if ( $.fn.dataTable.isDataTable( idTabla ) ) {
		$(idTabla).DataTable().destroy();
	}
	$(idTabla+" tbody").html("");
},
getEscolaridad: function (){
	var level = $("#cmbProgramasLevel").val();
	$.getJSON("state/getTotProgramaSocial", {layerId:50,stateId :circumscription.st.stateSelected, level: level}, function(response){
		var chartArray = [];
		for(var x = 0; x < 26 && x<response.length; x++){
			chartArray.push(response[x]);
		}
		
		var chart = AmCharts.makeChart( "chartProgram", {
			  "type": "serial",
			  "theme": "light",
			  "dataProvider": chartArray,
			  "valueAxes": [ {
			    "gridColor": "#FFFFFF",
			    "gridAlpha": 0.2,
			    "dashLength": 0
			  } ],
			  "gridAboveGraphs": true,
			  "startDuration": 1,
			  "graphs": [ {
			    "balloonText": "[[category]]: <b>[[value]]</b>",
			    "fillAlphas": 0.8,
			    "lineAlpha": 0.2,
			    "type": "column",
			    "valueField": "asiste_3_5"
			  } ],
			  "chartCursor": {
			    "categoryBalloonEnabled": false,
			    "cursorAlpha": 0,
			    "zoomable": false
			  },
			  "categoryField": "_id",
			  "categoryAxis": {
			    "gridPosition": "start",
			    "gridAlpha": 0,
			    "tickPosition": "start",
			    "tickLength": 20
			  },
			  "export": {
			    "enabled": true
			  }

			} );
		$("#tblProgram thead").html(
				$("<tr/>")
				.append(
						$("<td/>").html("Municipio")	
				)
				.append(
						$("<td/>").html("Asiste a la escuela 3-5 a&ntilde;os")	
				)
				.append(
						$("<td/>").html("Asiste a la escuela 6-11 a&ntilde;os")	
				)
				.append(
						$("<td/>").html("Asiste a la escuela 12-15 a&ntilde;os")	
				)
				.append(
						$("<td/>").html("15 a&ntilde;os y m&aacute;s con edu. b&aacute;sica.")	
				)
			);
		var tbody = $("#tblProgram tbody");
		programasSoc.limpiaTabla("#tblProgram");
		$.each(response, function(k,v){
			tbody.append(
					$("<tr/>")
					.append(
							$("<td/>").html(v._id)	
					)
					.append(
							$("<td/>").html(v.asiste_3_5.toLocaleString("en-US"))	
					)
					.append(
							$("<td/>").html(v.asiste_6_11.toLocaleString("en-US"))	
					)
					.append(
							$("<td/>").html(v.asiste_12_15.toLocaleString("en-US"))	
					)
					.append(
							$("<td/>").html(v.asiste_15_mas.toLocaleString("en-US"))	
					)
			);
		});
		programasSoc.refreshTable("#tblProgram");
	})
},
getDiscapacitados: function (){
	var level = $("#cmbProgramasLevel").val();
	
	
	$.getJSON("state/getTotProgramaSocial", {layerId:49, stateId :circumscription.st.stateSelected, level: level}, function(response){
		var chartArray = [];
		for(var x = 0; x < 26 && x<response.length; x++){
			chartArray.push(response[x]);
		}
		
		var chart = AmCharts.makeChart( "chartProgram", {
			  "type": "serial",
			  "theme": "light",
			  "dataProvider": chartArray,
			  "valueAxes": [ {
			    "gridColor": "#FFFFFF",
			    "gridAlpha": 0.2,
			    "dashLength": 0
			  } ],
			  "gridAboveGraphs": true,
			  "startDuration": 1,
			  "graphs": [ {
			    "balloonText": "[[category]]: <b>[[value]]</b>",
			    "fillAlphas": 0.8,
			    "lineAlpha": 0.2,
			    "type": "column",
			    "valueField": "total"
			  } ],
			  "chartCursor": {
			    "categoryBalloonEnabled": false,
			    "cursorAlpha": 0,
			    "zoomable": false
			  },
			  "categoryField": "_id",
			  "categoryAxis": {
			    "gridPosition": "start",
			    "gridAlpha": 0,
			    "tickPosition": "start",
			    "tickLength": 20
			  },
			  "export": {
			    "enabled": true
			  }

			} );
		$("#tblProgram thead").html(
				$("<tr/>")
				.append(
						$("<td/>").html("Municipio")	
				)
				.append(
						$("<td/>").html("Total")	
				)
				.append(
						$("<td/>").html("Hombres")	
				)
				.append(
						$("<td/>").html("Mujeres")	
				)
				.append(
						$("<td/>").html("0-14 a&ntilde;os")	
				)
				.append(
						$("<td/>").html("15-59 a&ntilde;os")	
				)
				.append(
						$("<td/>").html("M&aacute;s de 60 a&ntilde;os")	
				)
			);
		var tbody = $("#tblProgram tbody");
		programasSoc.limpiaTabla("#tblProgram");
		$.each(response, function(k,v){
			tbody.append(
					$("<tr/>")
					.append(
							$("<td/>").html(v._id)	
					)
					.append(
							$("<td/>").html(v.total.toLocaleString("en-US"))	
					)
					.append(
							$("<td/>").html(v.hombres.toLocaleString("en-US"))	
					)
					.append(
							$("<td/>").html(v.mujeres.toLocaleString("en-US"))	
					)
					.append(
							$("<td/>").html(v.tot_0_14.toLocaleString("en-US"))	
					)
					.append(
							$("<td/>").html(v.tot_15_59.toLocaleString("en-US"))	
					)
					.append(
							$("<td/>").html(v.tot_60_mas.toLocaleString("en-US"))	
					)
			);
		});
		programasSoc.refreshTable("#tblProgram");
	})
},
getAdultosMay: function (){
	var level = $("#cmbProgramasLevel").val();
	
	$.getJSON("state/getTotProgramaSocial", {layerId:99,stateId :circumscription.st.stateSelected, level: level}, function(response){
		var chartArray = [];
		for(var x = 0; x < 26 && x<response.length; x++){
			chartArray.push(response[x]);
		}
		
		var chart = AmCharts.makeChart( "chartProgram", {
			  "type": "serial",
			  "theme": "light",
			  "dataProvider": chartArray,
			  "valueAxes": [ {
			    "gridColor": "#FFFFFF",
			    "gridAlpha": 0.2,
			    "dashLength": 0
			  } ],
			  "gridAboveGraphs": true,
			  "startDuration": 1,
			  "graphs": [ {
			    "balloonText": "[[nombre]]: <b>[[value]]</b>",
			    "fillAlphas": 0.8,
			    "lineAlpha": 0.2,
			    "type": "column",
			    "valueField": "total"
			  } ],
			  "chartCursor": {
			    "categoryBalloonEnabled": false,
			    "cursorAlpha": 0,
			    "zoomable": false
			  },
			  "categoryField": "id",
			  "categoryAxis": {
			    "gridPosition": "start",
			    "gridAlpha": 0,
			    "tickPosition": "start",
			    "tickLength": 20
			  },
			  "export": {
			    "enabled": true
			  }

			} );
		
		$("#tblProgram thead").html(
				$("<tr/>")
				.append(
						$("<td/>").html("Estado")	
				)
				.append(
						$("<td/>").html("id")	
				)
				.append(
						$("<td/>").html("Nombre")	
				)
				.append(
						$("<td/>").html("L.N.")	
				)
				.append(
						$("<td/>").html("60-75 a&ntilde;os")	
				)
				.append(
						$("<td/>").html("76-90 a&ntilde;os")	
				)
				.append(
						$("<td/>").html("91-105 a&ntilde;os")	
				)
				.append(
						$("<td/>").html("M&aacute;s de 106 a&ntilde;os")	
				)
				.append(
						$("<td/>").html("Total")	
				)
			);
		
		var tbody = $("#tblProgram tbody");
		programasSoc.limpiaTabla("#tblProgram");
		$.each(response, function(k,v){
			tbody.append(
					$("<tr/>")
					.append(
							$("<td/>").html(v.entidad == 21 ? "Puebla": "")	
					)
					.append(
							$("<td/>").html(v.id)	
					)
					.append(
							$("<td/>").html(v.nombre)	
					)
					.append(
							$("<td/>").html(v.ln.toLocaleString("en-US"))	
					)
					.append(
							$("<td/>").html(v.edad_60_75.toLocaleString("en-US"))	
					)
					.append(
							$("<td/>").html(v.edad_76_90.toLocaleString("en-US"))	
					)
					.append(
							$("<td/>").html(v.edad_91_105.toLocaleString("en-US"))	
					)
					.append(
							$("<td/>").html(v.edad_mas_106.toLocaleString("en-US"))	
					)
					.append(
							$("<td/>").html(v.total.toLocaleString("en-US"))
							.append(
									$("<a/>")
									.addClass('btn')
									.append("<i class='fa fa-eye'></i>")
									.click(function(){
										$("#modTblPrograma").modal("show");
										switch ($("#cmbProgramasLevel").val()) {
										case "CAB_DTTO":
											$("#modTblPrograma h5").html("Detalle de Distrito Federal: "+v.nombre);
											break;
										case "CVE_LOC":
											$("#modTblPrograma h5").html("Detalle de Distrito Local: "+v.nombre);
											break;
										default:
											$("#modTblPrograma h5").html("Detalle de Municipio: "+v.nombre);
											break;
										}
										
										$.getJSON("state/getPersonasPrograma", {layerId:99,stateId :21,level: $("#cmbProgramasLevel").val(),idLevel: v.id }, function(response){
											var tbody = $("#modTblPrograma tbody");
											programasSoc.limpiaTabla("#modTblPrograma table");
											$.each(response, function(k,v){
												tbody.append(
														$("<tr/>")
														.append(
																$("<td/>").html(v.elector)	
														)
														.append(
																$("<td/>").html(v.ape_pat)	
														)
														.append(
																$("<td/>").html(v.ape_mat)	
														)
														.append(
																$("<td/>").html(v.nombre)	
														)
														.append(
																$("<td/>").html(v.sexo)	
														)
														.append(
																$("<td/>").html(v.ocupacion)	
														)
														.append(
																$("<td/>").html(v.calle)	
														)
														.append(
																$("<td/>").html(v.num_ext)	
														)
														.append(
																$("<td/>").html(v.colonia)	
														)
														.append(
																$("<td/>").html(v.codpos)	
														)
														.append(
																$("<td/>").html(v.seccion)	
														)
														.append(
																$("<td/>").html(v.edad)	
														)
												);
											});
											programasSoc.refreshTable("#modTblPrograma table");
										});
										
									})
								)
					)
			);
		});
		programasSoc.refreshTable("#tblProgram");
	})
},
changeProgramLevel: function(){
	switch ($("#cmbProgramasSoc").val()) {
	case "99":
		programasSoc.getAdultosMay()
		break;
	case "49":
		programasSoc.getDiscapacitados()
		break;
	case "50":
		programasSoc.getEscolaridad()
		break;
	default:
		break;
	}
}
}




var Viviendas ={
	ColorVivienda: function(campo, maximo, descrip, perc, mapa, estado, layerId){
		$(".gradiente-cont p").html(descrip+(perc? " (Porcentaje)":""));
		$(".gradiente-cont span").html("0"+ (perc? "%": ""));
		$(".gradiente-cont .span2").html(maximo+ (perc? "%": ""));
		$(".gradiente-cont").show();
		$.blockUI();
		setTimeout(function(){
			$.unblockUI();
		}, 700);
		allLayersStates[estado][layerId] = L.geoJSON(allLayersStates[estado]["response"+layerId] , {
	        style: function(layer){
	
	       	 var minimo = 0;
	       	 
	       	 var percent = layer.properties[campo] * 100 / maximo;
	       	 var color = percent <= 90 ? "rgb(255, "+(percent*2.55*1.11)+", 0)":"rgb("+((100-percent)/10*255)+", 255, 0)";
	          return {
	            fillColor: (typeof layer.properties[campo] !== 'undefined')? color: "#ccc",
	            weight: 1, 
	            color: (typeof layer.properties[campo] !== 'undefined')? color: "#ccc",
	            opacity: 1,
	            fillOpacity: 0.7
	          };
	        },
	
	          onEachFeature: function (feature, layer) {
	       		layer.on({
			             mouseover: function (e) {
				 				var layer = e.target.feature;
				 				
				 				if(campo !== undefined){
				 					$(".info.leaflet-control").css("display", "block").html('<h4>'+descrip+': '+(layer.properties[campo]>0?layer.properties[campo]: 0)+ (perc? "%": "")+'</h4>');
				 				}
				 			},
			 	        mouseout: function (e) {
			 	        	$(".info.leaflet-control").css("display", "none");
				 			}
		             });
	  		}	
	      });
		allLayersStates[estado][layerId].addTo(mapa);
	}
}

$(function () {
	  $('[data-toggle="tooltip"]').tooltip()
	})