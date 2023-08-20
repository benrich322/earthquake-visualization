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
             let color = depth >= -10 && depth <= 10 ? 'lime' : 
                depth > 10 && depth <= 30 ? 'yellow' :
                depth > 30 && depth <= 50 ? 'orange' :
                depth > 50 && depth <= 70 ? 'red' : 'purple';
             

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
            { color: 'lime', label: '-10-10', condition: (depth) => depth >= -10 && depth <= 10 },
            { color: '#ADFF2F', label: '10-30', condition: (depth) => depth > 10 && depth <= 30 },
            { color: 'yellow', label: '30-50', condition: (depth) => depth > 30 && depth <= 50 },
            { color: '#FFD700', label: '50-70', condition: (depth) => depth > 50 && depth <= 70 },
            { color: 'orange', label: '70-90', condition: (depth) => depth > 70 && depth <= 90 },
            { color: 'red', label: '90+', condition: (depth) => depth > 90 },
        ];

        legendItems.forEach(item => {
            let legendItem = L.DomUtil.create('div', 'legend-item', div);

            let legendColor = L.DomUtil.create('div', 'legend-square', legendItem); // Use 'legend-square' class
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





