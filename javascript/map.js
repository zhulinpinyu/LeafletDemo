var map_box_layer = L.tileLayer('https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png',{
  maxZoom: 18,
  id: 'examples.map-i875mjb7'
});
var HOST_IP = "10.211.55.21"
var my_wms = L.tileLayer.wms("http://"+HOST_IP+":8080/geoserver/test/wms", {
    layers: 'test:stores_geoosm',
    format: 'image/png',
    transparent: true,
    pointerCursor: true
});

var map = L.map('map',{
  layers:[map_box_layer, my_wms]
}).setView([22.53,114.03],12);

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

function get_geojson_url(){
  var BBOX = map.getBounds().toBBoxString();
  var WIDTH = map.getSize().x;
  var HEIGHT = map.getSize().y;
  var wfs_url = "http://"+HOST_IP+":8080/geoserver/test/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=test:stores_geoosm&minFeatures=0&outputFormat=application%2Fjson&SRS=EPSG%3A4326&WIDTH="+WIDTH+"&HEIGHT="+HEIGHT+"&BBOX="+BBOX
  return wfs_url
}

$.ajax({
    url:get_geojson_url(),
    datatype: "html",
    type: "GET",
    contentType: 'application/json; charset=UTF-8',
    success: function(data) {
      console.log(data);
    }
 });
