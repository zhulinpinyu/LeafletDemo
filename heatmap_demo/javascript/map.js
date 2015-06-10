var HOST_IP = "10.211.55.21";
var osm_layer;
var wms_layer;
var heatmap_layer;
var map;


osm_layer = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
  maxZoom: 18
});

wms_layer = L.tileLayer.wms("http://"+HOST_IP+":8080/geoserver/test/wms", {
  layers: 'test:stores_geoosm',
  format: 'image/png',
  transparent: true,
  pointerCursor: true
});

var cfg = {
  "radius": 30,
  "maxOpacity": .9,
  "scaleRadius": false,
  "useLocalExtrema": true,
  blur: 1,
  latField: 'lat',
  lngField: 'lng',
  valueField: 'count'
};

heatmap_layer = new HeatmapOverlay(cfg);

map = L.map('map',{
  layers:[osm_layer]
}).setView([22.53,114.03],12);

setup_map_control()

map.on('click', Identify);

function Identify (e) {
  var BBOX = map.getBounds().toBBoxString();
  var WIDTH = map.getSize().x;
  var HEIGHT = map.getSize().y;
  var X = map.layerPointToContainerPoint(e.layerPoint).x;
  var Y = map.layerPointToContainerPoint(e.layerPoint).y;
  var URL = "http://"+HOST_IP+":8080/geoserver/test/wms?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetFeatureInfo&FORMAT=image%2Fpng&TRANSPARENT=true&QUERY_LAYERS=test%3Astores_geoosm&LAYERS=test%3Astores_geoosm&STYLES&INFO_FORMAT=application/json&FEATURE_COUNT=1&X="+X+"&Y="+Y+"&SRS=EPSG%3A4326&WIDTH="+WIDTH+"&HEIGHT="+HEIGHT+"&BBOX="+BBOX

  $.ajax({
    url:URL,
    datatype: "html",
    type: "GET",
    contentType: 'application/json; charset=UTF-8',
    success: function(data) {
      store = data.features[0]
      if(store != undefined){
        popup = L.popup()
                 .setLatLng(e.latlng)
                 .setContent("<table>"+
                             "<tr><td>BizName:</td><td>"+store.properties.lgl_biz_name+"</td></tr>"+
                             "<tr><td>StoreName:</td><td>"+store.properties.lgl_name_local+"</td></tr>"+
                             "<tr><td>Address:</td><td>"+store.properties.lgl_raw_address+"</td></tr>"+
                             "</table>");
        map.openPopup(popup);
      }
      //alert(JSON.stringify(data));
    }
 });
}

function setup_map_control(){
  baseMaps = {
    "Mapbox": osm_layer
  };
  overlays = {
    "HeatMap": heatmap_layer,
    "WMS": wms_layer
  };
  map.addControl(new L.control.layers(baseMaps, overlays, {collapsed: true}));
}

map.on('overlayadd', setup_heatmap)

function setup_heatmap(){
  if(map.getZoom() > 10){
    $.ajax({
      url:get_url(),
      datatype: "html",
      type: "GET",
      contentType: 'application/json; charset=UTF-8',
      success: load_heat
    });
  }
}

function load_heat(data) {
  var heat_data = []
  $.each(data.features, function(key, val){
    var lat = val.geometry.coordinates[1];
    var lng = val.geometry.coordinates[0];
    var latLng = {
      lat: lat,
      lng: lng,
      count: 1
    };
    heat_data.push(latLng);
  });
  console.log(heat_data.length);
  heatmap_layer.setData({max: 8, data: heat_data});
}

function get_url() {
  var BBOX = map.getBounds().toBBoxString();
  var WIDTH = map.getSize().x;
  var HEIGHT = map.getSize().y;
  return "http://"+HOST_IP+":8080/geoserver/test/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=test:stores_geoosm&minFeatures=0&outputFormat=application%2Fjson&SRS=EPSG%3A4326&WIDTH="+WIDTH+"&HEIGHT="+HEIGHT+"&BBOX="+BBOX
}