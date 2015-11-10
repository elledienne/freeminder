angular.module('starter.services', [])

.factory('Calendar', function() {
  
 return {
  err: function(err){
    console.log('ERROR: ', err);
  }

 };

});
