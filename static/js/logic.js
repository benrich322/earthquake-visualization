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
             

            let marker = L.circleMarker(latlng, {
                radius: radius,
                fillColor: color,
                color: 'black', // Border color
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            });

            // Create a popup content string with earthquake details
            let popupContent = `
                <b>Magnitude:</b> ${feature.properties.mag}<br>
                <b>Location:</b> ${feature.properties.place}<br>
                <b>Depth:</b> ${depth} km<br>
                <b>Time:</b> ${new Date(feature.properties.time).toLocaleString()}
            `;
            
            marker.bindPopup(popupContent);
            
            return marker;
        }
    }).addTo(myMap);

    // Create the legend control
    let legendControl = L.control({ position: 'bottomright' });

    // Define legend items and their corresponding colors and depth ranges
    legendControl.onAdd = function(map) {
        let div = L.DomUtil.create('div', 'legend');

        let legendItems = [
            { color: 'red', label: 'Depth > 70 km' },
            { color: 'orange', label: '30 km < Depth ≤ 70 km' },
            { color: 'lime', label: 'Depth ≤ 30 km' }
        ];

        legendItems.forEach(item => {
            let legendItem = L.DomUtil.create('div', 'legend-item', div);

            let legendColor = L.DomUtil.create('div', 'legend-color', legendItem);
            legendColor.style.backgroundColor = item.color;

            let legendLabel = L.DomUtil.create('div', 'legend-label', legendItem);
            legendLabel.textContent = item.label;
        });

        return div;
    };

    // Add the legend control to the map
    legendControl.addTo(myMap);

    document.querySelector('.legend').style.backgroundColor = 'rgba(255, 255, 255, 0.9)';

})

.catch(error => console.error('Error loading GeoJSON data:', error));





