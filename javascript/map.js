var map_box_layer = L.tileLayer('https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png',{
  maxZoom: 18,
  id: 'examples.map-i875mjb7'
});
var map = L.map('map').setView([22.53,114.03],12);
map.addLayer(map_box_layer);