var map_box_layer = L.tileLayer('https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png',{
  maxZoom: 18,
  id: 'examples.map-i875mjb7'
});

var my_wms = L.tileLayer.wms("http://10.211.55.21:8080/geoserver/test/wms", {
    layers: 'test:stores_geoosm',
    format: 'image/png',
    transparent: true
});

var map = L.map('map',{
  layers:[map_box_layer, my_wms]
}).setView([22.53,114.03],12);