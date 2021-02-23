//renders the main map
var WorldMap = L.map("mapid", {
    center: [34.0522, -118.2473],
    zoom: 4
  });
// renders an onerlay layer over the main map
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
}).addTo(WorldMap);



var url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson'


d3.json(url, function(data) {
  console.log(data)

  L.geoJSON(data, {
    pointToLayer: function (feature, latlng){
      return L.circleMarker(latlng, {
        color: '#000',
        weight: 1,
        fillColor: assignColor(feature.geometry.coordinates[2]),
        fillOpacity: 0.8,
        radius: feature.properties.mag * 2.6,
      }).bindPopup(feature.properties.place+ "<hr>"+ feature.properties.mag+"<hr>"+new Date(feature.properties.time));
    }}).addTo(WorldMap);
  });
         //defines a function that assigns a color based on a value
function assignColor(depth) {
  switch(depth){
  case 0: depth < 5; 
      return "white";
  case 1: (depth < 10);
      return "green";
  case 2: (depth < 15) ;
      return "yellow";
  case 3: (depth < 20) ;
      return "orange";
  case 4: (depth < 30);
      return "red";
  default: return "thistle";}
}



  //  sets up a legend on the map
   var legend = L.control({ position: "bottomright" });
   legend.onAdd = function() {
       var div = L.DomUtil.create("div", "info legend");
       var depths = [-10, 5, 10, 15, 20, 30];
       var labels = [];

       function LegendColor (d) {
        return d > 30 ? "red" : 
            d > 20 ? "orange" :
            d > 15 ? "yellow" :
            d > 10 ? "green" :
            d > 5 ? "white" :
            "thistle";
       }

       for  (var i = 0; i < depths.length; i++) {
        div.innerHTML +=
        '<i style="background:' + labels.join("") + LegendColor(depths[i] + 1) + '"></i> ' +
        depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+');

    }

    return div;
};legend.addTo(WorldMap);

