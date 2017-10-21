'use strict';

angular.module('myApp.swf', ['ngRoute'])

  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/swf', {
      templateUrl: 'views/swf/swf.html',
      controller: 'SwfCtrl as swf'
    });
  }])

  .controller('SwfCtrl', [
    '$http',
    function($http) {
      this.title = 'SWF'
      this.details = 'Simple Weather Forecast (SWF).  A simple daily forecast.  Data harvested from weather.gov\'s API.';

      // this.testMethod = function () {
      //   this.testData = 'Test data works';
      // };
      this.weatherData = '';
      this.config = {
        user_zip: '',
        geoCoords: {
          lat: '',
          lng: ''
        },
        headers: {'User-Agent': 'request', 'Accept': 'application/geo+json', 'version': '1'},
        google: {
          base_url: 'https://maps.googleapis.com/maps/api/geocode/json?address=',
          full_url: '',
          key: '&key=AIzaSyAk8F3D59z5IRwcDfBc0B6eoRpyUx9JSPQ'
        },
        wGov: {
          base_url: 'https://api.weather.gov/points/',
          full_url: '',
          grid_url: ''
        }
      }


      this.getData = function (zip, config, weatherData) {
        return new Promise(function(resolve, reject) {
          console.log('zip: ', zip, 'config: ', config)

          // append zip to config object
          config.user_zip = zip;

          //build google url
          config.google.full_url = config.google.base_url + config.user_zip + config.google.key

          $http({method: 'GET', url: config.google.full_url})
          // GET GEOCOORDS
            .then(function(responseGeo) {
              // assign lat and lon to config
              config.geoCoords.lat = responseGeo.data.results[0].geometry.location.lat;
              config.geoCoords.lng = responseGeo.data.results[0].geometry.location.lng;

              // build and assign wGov Url
              config.wGov.full_url = config.wGov.base_url + config.geoCoords.lat + ',' + config.geoCoords.lng;
              return $http({method: 'GET', url: config.wGov.full_url})
            })
            .then(function(responseGov) {
              config.wGov.grid_url = responseGov.data.properties.forecastGridData
              console.log('config: ', config)
              return $http({method: 'GET', url: config.wGov.grid_url })
            })
            .then(function(responseData) {
              if(!responseData){
                return reject("Something went wrong")
              }
              console.log('responseData: ', responseData.data.properties)
              //console.log(this.weatherData)
              weatherData = responseData.data.properties
              config.weatherData = responseData.data.properties
              resolve (responseData.data.properties)
            })
        })
      }

      //this.getData.bind(this)

    }]);

// 'use strict';
//
// angular.module('myApp.swf', ['ngRoute'])
//
//     .config(['$routeProvider', function($routeProvider) {
//       $routeProvider.when('/swf', {
//         templateUrl: 'views/swf/swf.html',
//         controller: 'SwfCtrl as swf'
//       });
//     }])
//
//     .controller('SwfCtrl', [
//       '$http',
//       function($http) {
//         this.title = 'SWF'
//         this.details = 'Simple Weather Forecast (SWF).  A simple daily forecast.  Data harvested from weather.gov\'s API.';
//
//         // this.testMethod = function () {
//         //   this.testData = 'Test data works';
//         // };
//
//         this.config = {
//           user_zip: '',
//           geoCoords: {
//             lat: '',
//             lng: ''
//           },
//           headers: {'User-Agent': 'request', 'Accept': 'application/geo+json', 'version': '1'},
//           google: {
//             base_url: 'https://maps.googleapis.com/maps/api/geocode/json?address=',
//             full_url: '',
//             key: '&key=AIzaSyAk8F3D59z5IRwcDfBc0B6eoRpyUx9JSPQ'
//           },
//           wGov: {
//             base_url: 'https://api.weather.gov/points/',
//             full_url: 'https://api.weather.gov/points/38.863,-77.4817',
//           }
//         }
//
//
//         this.getData = function (zip, config) {
//           console.log('zip: ', zip, 'config: ', config)
//
//           // append zip to config object
//           config.user_zip = zip;
//
//           //build google url
//           config.google.full_url = config.google.base_url + config.user_zip + config.google.key
//
//           $http({method: 'GET', url: config.google.full_url})
//
//           // GET GEOCOORDS
//               .then(function(response){
//                 console.log('response from google: ', response)
//                 // assign lat and lon to config
//                 config.geoCoords.lat = response.data.results[0].geometry.location.lat;
//                 config.geoCoords.lng = response.data.results[0].geometry.location.lng;
//
//                 // build and assign wGov Url
//                 config.wGov.full_url = config.wGov.base_url + config.geoCoords.lat + ',' + config.geoCoords.lng;
//                 console.log('wGov Url: ', config.wGov.full_url)
//                 return config
//               })
//
//           // GET weathergrid
//           console.log('config outside of http: ', config)
//           $http({method: 'GET', url: config.wGov.full_url})
//               .then(function(response) {
//                 console.log('wGov response: ', response)
//                 config.wGov.grid_url = response.data.properties.forecaseGridData
//                 console.log('config: ', config)
//                 return config
//               })
//         }
//
//
//       }]);