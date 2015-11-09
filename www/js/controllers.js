angular.module('starter.controllers', [])

.controller('TodosCtrl', function($scope) {
  $scope.todos = [
    {
      id: 0,
      title: 'Buy stuff',
      priority: 5
    },
    {
      id: 1,
      title: 'Study angular',
      priority: 10
    },
    {
      id: 2,
      title: 'buy coffee',
      priority: 2
    },
    {
      id: 3,
      title: 'Do shits',
      priority: 4
    },
  ];

  $scope.showDetail = null;

  $scope.setDetailToShow = function(id){
    if($scope.showDetail === id){
      $scope.showDetail = null;
    } else {
      $scope.showDetail = id;
    }
  };
})
.controller('CalCtrl', function($scope, $cordovaCalendar, $q) {
  
  var err = function(err){
    console.log('ERROR: ', err);
  };

  var listCals = function(){

    $cordovaCalendar.listCalendars()
      .then(function (result) {
        //console.log('SUCCESS: ', JSON.stringify(result));
        return eventsInCal(result,[]);
      }, err)
      .then(function(result){
        console.log('TEST', JSON.stringify(result));
      });
  };


  var eventsInCal = function(cals) {
    var promises = [];

    cals.forEach(function(cal) {
      if(cal.name !== 'Birthdays'){
        promises.push($cordovaCalendar.findAllEventsInNamedCalendar(cal.name));
      }
    });

    return $q.all(promises);

  };

  $scope.listAllEvents = function() {
    //var events = [];
    listCals();

  };

});
