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

.controller('CalCtrl', function($scope, $cordovaCalendar, $q, moment, _) {
  
  var err = function(err){
    console.log('ERROR: ', err);
  };

  var clj = function(message){
    console.log(JSON.stringify(message));
  }

  var listCals = function(){

    $cordovaCalendar.listCalendars()
      .then(function (result) {
        //console.log('SUCCESS: ', JSON.stringify(result));
        return eventsInCal(result);
      }, err)
      .then(function(result){
        console.log('TEST', JSON.stringify(result));
        result = _.flatten(result);
        sortEvents(result);
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

  var sortEvents = function(events){

    events.sort(function(curr, next){
      var currTime = new moment(curr.startDate);
      var nextTime = new moment(next.startDate);
      
      var diff = currTime.diff(nextTime);

      console.log('curr', curr.startDate);
      console.log('next', next.startDate);
      console.log('diff', diff);
      
      
      return diff;

    });

    clj(events);
  };

  $scope.listAllEvents = function() {
    //var events = [];
    listCals();

  };

});
