var myApp = angular.module('myApp', []);
//var myMapApp = angular.module('myMapApp', ['leaflet-directive']);

myApp.controller('mainController', [
  '$scope',
  '$filter',
  '$http',
  function ($scope, $filter, $http) {

    angular.extend($scope, {
      center: {
        lat: 40.095,
        lng: -3.823,
        zoom: 4
      },
      defaults: {
        scrollWheelZoom: false
      }
    });
    $scope.characters = 5;
    //mymap = L.map('mapid').setView([51.505, -0.09], 13);

//Returns weatherData.rawData
    $scope.executePull = function (zip) {
      //CONFIG
      //weatherData = {}
      //this is my change here
      config = {
        zip: $scope.zip,
        geoCoords: {},
        googleBaseUrl: 'https://maps.googleapis.com/maps/api/geocode/json?address=',
        googleFullUrl: '',
        googleKey: '&key=AIzaSyAk8F3D59z5IRwcDfBc0B6eoRpyUx9JSPQ',
        headers: {'User-Agent': 'request', 'Accept': 'application/geo+json', 'version': '1'},
        wgovBaseUrl: 'https://api.weather.gov/points/',
        wgovFullUrl: '',
        wgovGridUrl: '',
      };
      config.googleFullUrl = config.googleBaseUrl + config.zip + config.googleKey;

      // END CONFIG
      console.log('Initiating pull... ')
      console.log('Using zip: ', $scope.zip)
      console.log('Using googleFullUrl: ', config.googleFullUrl)

      $http({method: 'GET', url: config.googleFullUrl})
          .then(function(response){
            // Get geocoordinates from google API
            config.geoCoords.lat = response.data.results[0].geometry.location.lat
            config.geoCoords.lng = response.data.results[0].geometry.location.lng

            //build map
            //var mymap = L.map('mapid').setView([config.geoCoords.lat, config.geoCoords.lng], 13);


            console.log('GeoCoords Acquired: ', config.geoCoords)
            return config.geoCoords

          }).then(function(geoCoords){
        console.log('Building wgovFullUrl... ')
        config.wgovFullUrl = config.wgovBaseUrl + config.geoCoords.lat + ',' + config.geoCoords.lng
        console.log('Using wgovFullUrl: ', config.wgovFullUrl)

        return $http({method: 'GET', url: config.wgovFullUrl })
            .then(function(newResults){
              config.wgovGridUrl = newResults.data.properties.forecastGridData
              console.log('Using wgovGridUrl: ', config.wgovGridUrl)
              //return something with newResults
            })

      }).then(function(finalData){
        return $http({method: 'GET', url: config.wgovGridUrl })
            .then(function(results){
              $scope.fullData = results.data
              //weatherData.rawData = results.data
              console.log('results.data: ', results.data)
              //return something with newResults
              return results
            }).then(function(results, trimmedData){
              console.log('Starting Trim on results... ', results)
              var trimmedData = {
                timestamp: '',
                polygon: [],
                dewpoint: [],
              }

              // MAP AREA
              // build polygon
              var polygonArr = []
              results.data.geometry.coordinates[0].forEach(function(geo) {
                polygonArr.push(geo)
              })
              trimmedData.polygon.push(polygonArr)
              console.log('Adding polygon for mapping... ', trimmedData)


              //build dewpoint
              var dewpointArr = []
              results.data.properties.dewpoint.values.forEach(function(dewpoint) {
                dewpointArr.push(dewpoint)
              })
              trimmedData.dewpoint.push(dewpointArr)
              console.log('Adding dewpoint...', trimmedData)

              $scope.finalData = trimmedData


            })
        //console.log(final)

      })


    }




  }]);

myApp.controller('mapController', [ '$scope', function($scope) {
  angular.extend($scope, {
    center: {
      lat: 40.095,
      lng: -3.823,
      zoom: 4
    },
    defaults: {
      scrollWheelZoom: false
    }
  });
}]);

/*  WORKING COPY
 $scope.executePull = function (zip) {
 //CONFIG
 google = {
 zip: $scope.zip,
 base: 'https://maps.googleapis.com/maps/api/geocode/json?address=',
 key: '&key=AIzaSyAk8F3D59z5IRwcDfBc0B6eoRpyUx9JSPQ',
 headers: {'User-Agent': 'request', 'Accept': 'application/geo+json', 'version': '1'},
 url: '',

 };
 google.url = google.base + google.zip + google.key;

 weatherGov = {
 baseUrl: 'https://api.weather.gov/points/',
 }
 weatherData = {}
 // END CONFIG

 console.log('Using zip: ', $scope.zip)
 console.log()
 $http({method: 'GET', url: google.url})
 .then(function(response){
 var geoCoords = {}
 geoCoords.lat = response.data.results[0].geometry.location.lat
 geoCoords.lng = response.data.results[0].geometry.location.lng
 console.log('GeoCoords Acquired: ', geoCoords)
 return geoCoords
 }).then(function(geoCoords){
 weatherGov.fullUrl = weatherGov.baseUrl + geoCoords.lat + ',' + geoCoords.lng
 console.log('Using weatherGov.fullUrl: ', weatherGov.fullUrl)
 return $http({method: 'GET', url: weatherGov.fullUrl })
 .then(function(newResults){
 weatherGov.gridUrl = newResults.data.properties.forecastGridData
 console.log('Using weatherGov.gridUrl: ', weatherGov.gridUrl)
 //return something with newResults
 })
 }).then(function(finalData){
 return $http({method: 'GET', url: weatherGov.gridUrl })
 .then(function(results){
 weatherData.rawData = results.data
 console.log('weatherData.rawData: ', weatherData.rawData)
 //return something with newResults
 })
 //console.log(final)
 })
 }
 */