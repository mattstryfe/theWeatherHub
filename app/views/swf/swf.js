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
      this.trimmedData = {};

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


      this.getData = function (zip, config, weatherData, trimmedData) {
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

              weatherData.weatherData = responseData.data.properties
              
							//update progress
							config.progress.getForecastData.value = 35;
              config.progress.getForecastData.status = 'Weather data obtained.  Pull Complete!!'

              // Trim and process data.  Extract only what's needed.  trimmedData is made available here.
              processData(settings, weatherData.weatherData, trimmedData)

              // Prep data for UI.  Establish/mutate objects accordingly.  returns data by date.
              prepData(settings, trimmedData)

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

      function prepData (settings, processedWeatherData) {
        let dailyForecast = {};
        const forecastLength = 5;
        const today = moment().utc();

        // need to convert data from categorically organized to daily organized.
        console.log('data to prep: ', processedWeatherData)

        // create an array of dates starting with now.
        for (let i=0; i < forecastLength; i++) {
          // push UTC to array
          let date = today.clone().add(i, 'days').utc().format('YYYY-MM-DD')
          dailyForecast[date] = dailyForecast[date]
          dailyForecast[date] = {}
          settings.valuesToPull.forEach((category) => {
            dailyForecast[date][category] = [];
          })
        }

        settings.valuesToPull.forEach((category) => {
          let categoryArr = []
          // todo add date loop above category loop
          processedWeatherData.trimmedData[category].values.forEach((element) => {
          //console.log('all elements: ', element)
            if (element.validTime.includes('2017-11-21')) {
              dailyForecast['2017-11-21'][category].push(element)
            }
          });

        })


        console.log('daily forecast obj:', dailyForecast)
        // angular.forEach(settings.valuesToPull, (targetPropVal) => {
        //   console.log(targetPropVal, ':', Object.values(processedWeatherData.trimmedData[targetPropVal].values))
        //
        //   angular.forEach(processedWeatherData.trimmedData[targetPropVal].values, (entry) => {
        //     //console.log('entry', entry)
        //     for (let day in fiveDay) {
        //
        //       if (entry.validTime.includes(day)) {
        //         // console.log('targetPropVal', targetPropVal)
        //
        //         valuesArr.push(entry)
        //         // let tmpObj = {
        //         //   targetPropVal: targetPropVal,
        //         //   values: entry
        //         // }
        //         //categoryArr.push(tmpObj)
        //         //dailyForecast[day] = Object.assign({}, day)
        //       }
        //
        //       fiveDay[day][targetPropVal] = Object.assign({}, valuesArr)
        //     }
        //     // console.log('valuesArray', valuesArr)
        //   })

          // write array to proper object key
          // for (let day in fiveDay){
          //   if (processedWeatherData.trimmedData[targetPropVal].values.includes(day)) {
          //     console.log('hit')
          //   }
          // }
          // console.log('prop.values', prop.values)
          // angular.forEach(processedWeatherData.trimmedData[targetPropVal].values, (v, k) => {
          //   if (v.validTime.includes(day)) {
          //
          //   }
          //   // for (let day in fiveDay){
          //   //   if (v.validTime.includes(day)) {
          //   //     //console.log('day', day)
          //   //     // console.log('targetPropVal', targetPropVal)
          //   //     // console.log('value', v)
          //   //     // console.log('fiveday before', fiveDay)
          //   //     // fiveDay[day] = fiveDay[day]
          //   //     // console.log('fiveday after', fiveDay)
          //   //
          //   //     //fiveDay[day] = Object.assign({}, [targetPropVal])
          //   //     fiveDay[day] = [targetPropVal].v
          //   //
          //   //     //console.log('fiveday before', fiveDay)
          //   //     //fiveDay.day[targetPropVal] = targetPropVal
          //   //     //console.log('new fiveDay', fiveDay)
          //   //
          //   //     // this works but overwrites the object each time.
          //   //     fiveDay[day] = Object.assign({}, v)
          //   //
          //   //     //console.log('5day inside', fiveDay)
          //   //     //fiveDay[day][targetPropVal] = fiveDay[day][targetPropVal][v]
          //   //     //console.log('new fiveDay', day)
          //   //   }
          //   // }
          // })
        // })

        // processedWeatherData.forEach((element, index) => {
        //   console.log('element')
        // })

        //processedWeatherData.trimmedData.forEach()
        // angular.forEach(processedWeatherData.trimmedData, (val, k) => {
        //   console.log('val:', val)
        //   angular.forEach(val.values, (value, key) => {
        //     console.log('match', value.validTime);
        //     for
        //     // angular.forEach(fiveDay, (day, key) => {
        //     //   console.log('day', day)
        //     //   if (value.validTime.includes(day)) {
        //     //    console.log('hit', day)
        //     //   }
        //     // })
        //   })

          // angular.forEach(fiveDay, (v, k) => {
          //   console.log(val.)
          //   if (val.values.validDate === v) {
          //     console.log('match!', v)
          //   }
          // })

        // })
        // angular.forEach(processedWeatherData.trimmedData, (property, key) => {
        //   console.log('property', property)
        //   angular.forEach(property.values, (prop, k) => {
        //     console.log('prop', prop);
        //     if (prop.validTime === true ) {
        //
        //     }
        //   });
        //   // for (let value in property.values) {
        //   //   console.log('match', value);
        //   // }
        // })

        // console.log('5day: ', fiveDay)
        // console.log('array:', categoryArr)
        // console.log('dailyForecast: ', dailyForecast)

      }

      function processData (settings, weatherData, trimmedData) {
        let targetedWeatherData = {};

        // assign valuesToPull to new object.
        angular.forEach(settings.valuesToPull, (targetPropVal, k) => {
          // copy specific target object data to parsedWeatherData
          targetedWeatherData[targetPropVal] = Object.assign({}, weatherData[targetPropVal])

          // this strips all the ISO8601 php duration timestamp nonsense from the validTime values
          angular.forEach(targetedWeatherData[targetPropVal].values, (v, k) => {
            // cut the end off the ISO8601 time and place it with nothing.
            let newTime = v.validTime.substring(0, v.validTime.indexOf('/'))

            // write new time back to object
            v.validTime = newTime;
          });
        });

        trimmedData.trimmedData = targetedWeatherData
      }
}]);