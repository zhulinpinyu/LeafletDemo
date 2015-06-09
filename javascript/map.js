var map_box_layer = L.tileLayer('https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png',{
  maxZoom: 18,
  id: 'examples.map-i875mjb7'
});

var wms = L.tileLayer.wms("http://mesonet.agron.iastate.edu/cgi-bin/wms/nexrad/n0r.cgi", {
    layers: 'nexrad-n0r-900913',
    format: 'image/png',
    transparent: true
});

var my_wms = L.tileLayer.wms("http://10.211.55.21:8080/geoserver/test/wms", {
    layers: 'test:stores_geoosm',
    format: 'image/png',
    transparent: true
});

var map = L.map('map').setView([22.53,114.03],12);
map.addLayer(map_box_layer);
map.addLayer(wms);
map.addLayer(my_wms)