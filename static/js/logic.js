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

            // Calculate marker radius based on magnitude
            let radius = Math.sqrt(feature.properties.mag) * 5;

             // Calculate marker color based on depth
             let depth = feature.geometry.coordinates[2];
             let color = depth > 70 ? 'red' : depth > 30 ? 'orange' : 'lime';
             

            return L.circleMarker(latlng, {
                radius: radius,
                fillColor: color,
                color: 'black', // Border color
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            }).bindPopup('Magnitude: ' + feature.properties.mag + '<br>Location: ' + feature.properties.place);
        }
    }).addTo(myMap);
})
.catch(error => console.error('Error loading GeoJSON data:', error));