angular.module('starter.services', [])

.factory('Calendar', function() {
  
 return {
  err: function(err){
    console.log('ERROR: ', err);
  }

 };

})
.factory('$localstorage', ['$window', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key, defaultValue) {
      defaultValue = defaultValue || '[]';
      return JSON.parse($window.localStorage[key] || defaultValue);
    }
  }
}]);
