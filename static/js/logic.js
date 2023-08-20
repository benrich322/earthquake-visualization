// Creating the map object
let myMap = L.map("map", {
    center: [40, -111],
    zoom: 5
  });
  
  // Adding the tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap);

// Load GeoJSON data using an AJAX request
fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson')
.then(response => response.json())
.then(data => {
    // Create a GeoJSON layer and add it to the map
    L.geoJSON(data, {
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng, {
                radius: feature.properties.mag * 3, // Customize marker size
                fillColor: 'red',
                color: 'red',
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            }).bindPopup('Magnitude: ' + feature.properties.mag + '<br>Location: ' + feature.properties.place);
        }
    }).addTo(myMap);
})
.catch(error => console.error('Error loading GeoJSON data:', error));