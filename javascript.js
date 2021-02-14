var map = L.map('map').setView([47.5059367,-122.3519897], 14);
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoidG9tdHJ1b25nMDYyMzk5IiwiYSI6ImNraG13cWVscTB0bWQzNW85YWNrdDN1cHkifQ.yHyazdWzemx0rGc7560vWw', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoidG9tdHJ1b25nMDYyMzk5IiwiYSI6ImNraG13cWVscTB0bWQzNW85YWNrdDN1cHkifQ.yHyazdWzemx0rGc7560vWw'
}).addTo(map);

L.easyButton('fas fa-info', function(){
  alert("The purpose of this map is to record your favorite places to visit in our neighborhood White Center. To use this application, either click on the polygon or point button below to draw or pinpoint places and provide information on the pop-up form.");
}).addTo(map);

var drawnItems = L.featureGroup().addTo(map);

new L.Control.Draw({
  draw: {
    polygon: true,
    polyline: false,
    rectangle: false,
    circle: false,
    circlemarker: false,
    marker: true
  },
  edit: {
    featureGroup: drawnItems
  }
}).addTo(map);

function createFormPopup() {
  var popupContent =
    '<form>' +
    'Name:<br><input type="text" id="input_name"><br>' +
    'Activity:<br><input type="text" id="input_act"><br>' +
    'Description:<br><input type="text" id="input_desc"><br>' +
    '<input type="button" value="Submit" id="submit">' +
    '</form>'
  drawnItems.bindPopup(popupContent).openPopup();
}

map.addEventListener("draw:created", function(e) {
  e.layer.addTo(drawnItems);
  createFormPopup();
});

function setData(e) {
  if(e.target && e.target.id == "submit") {

    // Get user name and description
    var enteredName = document.getElementById("input_name").value;
    var enteredActivity = document.getElementById("input_act").value;
    var enteredDescription = document.getElementById("input_desc").value;

    // Print user name and description
    console.log(enteredName);
    console.log(enteredActivity);
    console.log(enteredDescription);

    // Get and print GeoJSON for each drawn layer
    drawnItems.eachLayer(function(layer) {
      var drawing = JSON.stringify(layer.toGeoJSON().geometry);
      console.log(drawing);
    });

    // Clear drawn items layer
    drawnItems.closePopup();
    drawnItems.clearLayers();
  }
}

document.addEventListener("click", setData);

map.addEventListener("draw:editstart", function(e) {
  drawnItems.closePopup();
});
map.addEventListener("draw:deletestart", function(e) {
  drawnItems.closePopup();
});
map.addEventListener("draw:editstop", function(e) {
  drawnItems.closePopup();
});
map.addEventListener("draw:deletestop", function(e) {
  if(drawnItems.getLayers().length > 0) {
    drawnItems.openPopup();
  }
});
