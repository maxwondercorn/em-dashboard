import Ember from 'ember';
import { csvJSON } from '../utils/helpers';

let map;
let bounds;

export default Ember.Route.extend({
  model() {
    // Initial Load
    $.get('./data/employees.csv')
        .then((data) => {
          let jsonData = csvJSON(data);
          console.log('Initial employees data Loaded');

          // Display Employee Geospatial View:
          // To avoid `document.getElementById('map-canvas')`
          // return 'null' delay it by 100 milliseconds
          setTimeout(() => {
            createDonutChart(jsonData);
            initializeMap(); // Initialize Google Map once!
            updateMarkers(jsonData)
          }, 100);
          
          return jsonData;
        });

    // Fetch new data every 3 seconds
    // if route changes, it stops polling
    let getHandleEmployeesData = function() {
      setTimeout(() => { // Make sure route changed if changed
        if (window.location.pathname !== '/employees') {
          console.log('Cancelled polling employees data');
          clearInterval(looping);
        } else {
          return $.get('./data/employees.csv')
                  .then((data) => {
                    console.log('Polling employees data');
                    let jsonData = csvJSON(data);

                    setTimeout(() => {
                      createDonutChart(jsonData);
                      updateMarkers(jsonData);
                    }, 100);
                    
                    return jsonData;
                  });
        }
      }, 100);
    };
    let looping = setInterval(getHandleEmployeesData, 3000);

  }
});

// Create Donut Chart of employee numbers of each office in U.S.
function createDonutChart (jsonData) {
  // For DEMO purpose, randomly generates base employee number for each office
  let boston = (Math.floor(Math.random() * 10) + 1);
  let sanfran = (Math.floor(Math.random() * 10) + 1);
  let orlando = (Math.floor(Math.random() * 10) + 1);
  let chicago = (Math.floor(Math.random() * 10) + 1);

  // let boston = 0;
  // let sanfran = 0;
  // let orlando = 0;
  // let chicago = 0;

  jsonData.forEach((employee) => {
    (employee.location === 'Boston') ? boston++ : null;
    (employee.location === 'San Francisco') ? sanfran++ : null;
    (employee.location === 'Chicago') ? chicago++ : null;
    (employee.location === 'Orlando') ? orlando++ : null;
  });

  google.charts.setOnLoadCallback(drawChart);

  // Draw Donut Chart of Employees
  function drawChart() {

    let data = google.visualization.arrayToDataTable([
      ['City', 'Number of Employees'],
      ['Boston', boston],
      ['Orlando', orlando],
      ['Chicago', chicago],
      ['San Francisco', sanfran]
    ]);

    let options = {
      title: 'Number & Percentage of Employees',
      pieHole: 0.5,
      pieSliceText: 'value'
    };

    let chart = new google.visualization.PieChart(document.getElementById('donutchart'));
    chart.draw(data, options);
  }

  // Draw Geographic Map Chart of Employees
  function drawMap() {

    // setTimeout(() => {
      // let bounds = new google.maps.LatLngBounds();
      // const USA = {lat: 37.09024, lng: -95.712891};
      // const map = new google.maps.Map(document.getElementById("map-canvas"), {
      //   zoom: 3,
      //   center: USA
      // });

      /*

      // Markers array
      const markers = [
        ['Boston', boston, 42.3135417, -71.1975856],
        ['Chicago', chicago, 41.8339026, -88.0130316],
        ['San Francisco', sanfran, 37.7578149, -122.507812],
        ['Orlando', orlando, 28.4813986, -81.5091802]
      ];

      // Info Content array of each marker
      function infoWindowContent(name, num) {
        return `<div class="markerInfo"><h5>${name}</h5><p>Number of employees: ${num}</p></div>`;
      };

      // Display multiple markers on a map
      let infoWindow = new google.maps.InfoWindow();
      let marker;

      for (let i = 0; markers.length > i; i++) {
        let position = new google.maps.LatLng(markers[i][2], markers[i][3]);
        bounds.extend(position);

        // Setting each marker location
        marker = new google.maps.Marker({
          position,
          map,
          title: markers[i][0]
        });

        // Setting each marker's info window
        google.maps.event.addListener(marker, 'click', ((marker, i) => {
          return () => {
            infoWindow.setContent(infoWindowContent(markers[i][0], markers[i][1]));
            infoWindow.open(map, marker);
          }
        })(marker, i));

        // Automatically center the map fitting all markers on the screen
        map.fitBounds(bounds);
      }
      */

    // }, 300); // ** For avoiding failing to find the element to attach the map, wait 300ms

  }

  // When window is resized, make sure chart & map + marker is responsive
  $(window).resize(function(){
    drawChart(jsonData);
    updateMarkers(jsonData);
  });
}

// Initialize the map
function initializeMap() {
  bounds = new google.maps.LatLngBounds();
  const USA = {lat: 37.09024, lng: -95.712891};
  map = new google.maps.Map(document.getElementById("map-canvas"), {
    zoom: 3,
    center: USA
  });
}

// Update markers
// It only updates the number of employees.
// Marker's position is fixed to 4 office locations.
function updateMarkers(jsonData) {
  // For DEMO purpose, randomly generates base employee number for each office
  let boston = (Math.floor(Math.random() * 10) + 1);
  let sanfran = (Math.floor(Math.random() * 10) + 1);
  let orlando = (Math.floor(Math.random() * 10) + 1);
  let chicago = (Math.floor(Math.random() * 10) + 1);

  // let boston = 0;
  // let sanfran = 0;
  // let orlando = 0;
  // let chicago = 0;

  // Count each office location's number of employees
  jsonData.forEach((employee) => {
    (employee.location === 'Boston') ? boston++ : null;
    (employee.location === 'San Francisco') ? sanfran++ : null;
    (employee.location === 'Chicago') ? chicago++ : null;
    (employee.location === 'Orlando') ? orlando++ : null;
  });

  // Markers array
  const markers = [
    ['Boston', boston, 42.3135417, -71.1975856],
    ['Chicago', chicago, 41.8339026, -88.0130316],
    ['San Francisco', sanfran, 37.7578149, -122.507812],
    ['Orlando', orlando, 28.4813986, -81.5091802]
  ];

  // Info Content array of each marker
  function infoWindowContent(name, num) {
    return `<div class="markerInfo"><h5>${name}</h5><p>Number of employees: ${num}</p></div>`;
  };

  // Display multiple markers on a map
  let infoWindow = new google.maps.InfoWindow();
  let marker;

  // Go though each markers to add click eventListener to enable infowindows
  for (let i = 0; markers.length > i; i++) {
    let position = new google.maps.LatLng(markers[i][2], markers[i][3]);
    bounds.extend(position);

    // Setting each marker location
    marker = new google.maps.Marker({
      position,
      map,
      title: markers[i][0]
    });

    // Setting each marker's info window
    google.maps.event.addListener(marker, 'click', ((marker, i) => {
      return () => {
        infoWindow.setContent(infoWindowContent(markers[i][0], markers[i][1]));
        infoWindow.open(map, marker);
      }
    })(marker, i));


    //Automatically center the map fitting all markers on the screen on resizing window
    $(window).resize(function(){
      map.fitBounds(bounds);
    });
  }
}