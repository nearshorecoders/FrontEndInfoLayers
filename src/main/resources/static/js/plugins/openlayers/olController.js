	  import Map from 'ol/Map.js';
      import View from 'ol/View.js';
      import KML from 'ol/format/KML.js';
      import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';
      import BingMaps from 'ol/source/BingMaps.js';
      import VectorSource from 'ol/source/Vector.js';

      var raster = new TileLayer({
        source: new BingMaps({
          imagerySet: 'Aerial',
          key: 'Your Bing Maps Key from http://www.bingmapsportal.com/ here'
        })
      });

      var vector = new VectorLayer({
        source: new VectorSource({
          url: 'data/kml/2012-02-10.kml',
          format: new KML()
        })
      });

      var map = new Map({
        layers: [raster, vector],
        target: document.getElementById('openLayersMap'),
        view: new View({
          center: [876970.8463461736, 5859807.853963373],
          projection: 'EPSG:3857',
          zoom: 10
        })
      });

      var displayFeatureInfo = function(pixel) {
        var features = [];
        map.forEachFeatureAtPixel(pixel, function(feature) {
          features.push(feature);
        });
        if (features.length > 0) {
          var info = [];
          var i, ii;
          for (i = 0, ii = features.length; i < ii; ++i) {
            info.push(features[i].get('name'));
          }
          document.getElementById('info').innerHTML = info.join(', ') || '(unknown)';
          map.getTarget().style.cursor = 'pointer';
        } else {
          document.getElementById('info').innerHTML = '&nbsp;';
          map.getTarget().style.cursor = '';
        }
      };

      map.on('pointermove', function(evt) {
        if (evt.dragging) {
          return;
        }
        var pixel = map.getEventPixel(evt.originalEvent);
        displayFeatureInfo(pixel);
      });

      map.on('click', function(evt) {
        displayFeatureInfo(evt.pixel);
      });