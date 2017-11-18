'use strict';

angular.module('myApp.swf', ['ngRoute', 'angular-json-tree'])

  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/swf', {
      templateUrl: 'views/swf/swf.html',
      controller: 'SwfCtrl as swf',
			css: 'views/swf/swf.css'
    });
  }])

  .controller('SwfCtrl', [
    '$http',
    function($http) {

      // metadata for angular templates
      this.title = 'SWF'
      this.details = 'Simple Weather Forecast (SWF).  A simple daily forecast.  Data harvested from weather.gov\'s API.';

      // empty object for weatherData
      this.weatherData = {};

      // compile data settings
      const settings = {
        valuesToPull: [
          'temperature',
          'probabilityOfPrecipitation',
          'quantitativePrecipitation',
          'dewpoint',
          'maxTemperature',
          'minTemperature']
      }

      // config for http requests
      this.config = {
        progress: {
          value: 0,
          status: '',
          buildUrl: {},
          getGeoCoords: {},
          getGridData: {},
          getForecastData: {}
				},
        user_zip: '',
        location: {
          city: null,
          state: null,
          geoCoords: {
            lat: '',
            lng: ''
          }
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
          // append zip to config object
          config.user_zip = zip;

          //build google url
          config.google.full_url = config.google.base_url + config.user_zip + config.google.key
          
          //update progress
          config.progress.buildUrl.value = 15;
          config.progress.buildUrl.status ='Asking google for things.';
          
          $http({method: 'GET', url: config.google.full_url})
          // GET GEOCOORDS
            .then(function(responseGeo) {
              // assign lat and lon to config
              //console.log('google response: ', responseGeo)
              config.location.geoCoords.lat = responseGeo.data.results[0].geometry.location.lat;
              config.location.geoCoords.lng = responseGeo.data.results[0].geometry.location.lng;

              // assign location values
              config.location.city  = responseGeo.data.results[0].address_components[1].long_name;
              config.location.state = responseGeo.data.results[0].address_components[2].long_name;

              // build and assign wGov Url
              config.wGov.full_url = config.wGov.base_url + config.location.geoCoords.lat + ',' + config.location.geoCoords.lng;
							
              //update progress
							config.progress.getGeoCoords.value = 25;
							config.progress.getGeoCoords.status = 'GeoCoords obtained...'
							
              return $http({method: 'GET', url: config.wGov.full_url})
            })
            .then(function(responseGov) {
              config.wGov.grid_url = responseGov.data.properties.forecastGridData

							//update progress
							config.progress.getGridData.value = 25;
              config.progress.getGridData.status = 'GRID complete!  Getting weather data...'
	
							return $http({method: 'GET', url: config.wGov.grid_url })
            })
            .then(function(responseData) {
              if(!responseData){
                return reject("Something went wrong")
              }
              //console.log('responseData: ', responseData.data.properties)
              //console.log(this.weatherData) this is a test
              weatherData.weatherData = responseData.data.properties
              //console.log('weatherData: ', weatherData)
              //config.weatherData = responseData.data.properties
              
							//update progress
							config.progress.getForecastData.value = 35;
              config.progress.getForecastData.status = 'Weather data obtained.  Pull Complete!!'

              processData(settings, weatherData.weatherData)
							resolve (responseData.data.properties)

            });
        });
      };

      function testTime() {
        let isoStr = '2017-11-17T08:00:00+00:00/P7DT17H';

        // test isoStr
        // console.log('to UTC', moment(isoStr).format())
        // console.log('is duration', moment.duration(isoStr).toJSON())
        let parsedDate = isoStr.substring(0, isoStr.indexOf('/'))

        // console.log('parsed Data:', parsedDate);
        // console.log('check with moment: ', moment(isoStr));
        // console.log('check newData: ', moment(parsedDate));
      }

      function processData (settings, weatherData) {
        // console.log('settings: ', settings)
        console.log('weatherData: ', weatherData)
        let parsedWeatherData = {};

        // ForEach entry in the valuesToPull array
        angular.forEach(settings.valuesToPull, (pullProp, k) => {
          // if weatherData has a matching property
          if (weatherData.hasOwnProperty(pullProp)) {

            // Assign keys to parsedWeatherData
            //parsedWeatherData[pullProp] = parsedWeatherData[pullProp]
            //console.log('parsedweatherdata ', parsedWeatherData)

            // this strips all the ISO8601 php duration timestamp nonsense from the validTime values
            angular.forEach(weatherData[pullProp].values, (v, k) => {
              let newTime = v.validTime.substring(0, v.validTime.indexOf('/'))
              //console.log('value: ', v, k);
              v.validTime = newTime
              console.log('valid? ', moment(newTime).isValid());

              //console.log('pullprop', pullProp);
              //parsedWeatherData[pullProp][k] = weatherData[pullProp][v]
            });
          }
        });

        // assign valuesToPull to new object.
        angular.forEach(settings.valuesToPull, (pullProp, k) => {
          parsedWeatherData[pullProp] = Object.assign({}, weatherData[pullProp])
        })

        //this.finalWeather = parsedWeatherData
        console.log('new weatherData: ', weatherData)
        console.log('parsedWeatherData: ', parsedWeatherData)
      }
    }]);