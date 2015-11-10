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
  $scope.hours = [
    {
      cellProp: {
        hour: 8,
        codeTime: 8,
        time: 'AM',
      },
      events: [
        {
          from: 8.10,
          to: 8.20
        },
        {
          from: 8.40,
          to: 9
        }
      ]
    },
    {
      hour: 9,
      codeTime: 9,
      time: 'AM',
    },
    {
      hour: 10,
      codeTime: 10,
      time: 'AM',
    },
    {
      hour: 11,
      codeTime: 11,
      time: 'AM',
    },
    {
      hour: 12,
      codeTime: 12,
      time: 'AM',
    },
    {
      hour: 1,
      codeTime: 13,
      time: 'PM',
    },
    {
      hour: 2,
      codeTime: 14,
      time: 'PM',
    },
    {
      hour: 3,
      codeTime: 15,
      time: 'PM',
    },
    {
      hour: 4,
      codeTime: 16,
      time: 'PM',
    },
    {
      hour: 5,
      codeTime: 17,
      time: 'PM',
    },
    {
      hour: 6,
      codeTime: 18,
      time: 'PM',
    },
    {
      hour: 7,
      codeTime: 19,
      time: 'PM',
    },
    {
      hour: 8,
      codeTime: 20,
      time: 'PM',
    },
    {
      hour: 9,
      codeTime: 21,
      time: 'PM',
    },
  ];


  var err = function(err){
    console.log('ERROR: ', err);
  };

  var clj = function(message){
    console.log(JSON.stringify(message));
  };

  $scope.listCals = function(){

    $cordovaCalendar.listCalendars()
      .then(function (result) {
        //console.log('SUCCESS: ', JSON.stringify(result));
        return eventsInCal(result);
      }, err)
      .then(function(result){
        console.log('TEST', JSON.stringify(result));
        result = _.flatten(result);
        $scope.calEvents = sortEvents(result);





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
    return events;
  };


});
