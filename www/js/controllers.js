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

  $scope.rate = 3;
  $scope.max = 5;
  
})

.controller('CalCtrl', function($scope, $cordovaCalendar, $q, moment, _) {
    
  // $scope.zIndex = 0;
  // $scope.getZIndex = Calendar.getZIndex;
    // $scope.getZIndex = function(){
    //   $scope.zIndex--;
    //   return {'z-index': $scope.zIndex};
    // };
  
  $scope.hours = [
    {
      cellProp: {
        hour: 8,
        codeTime: 8,
        time: 'AM',
        style: { 'zIndex': 0}
      },
      events: [
        // {
        //   height: '100px',
        //   marginTop: '40px',
        //   background: 'red',
        //   width: '100%',
        //   position: 'absolute',
        //   opacity: 0.7
        // }
      ]
    },
    {
      cellProp: {
        hour: 9,
        codeTime: 9,
        time: 'AM',
        style: { 'zIndex': -1}
      },
      events: []
    },
    {
      cellProp: {
        hour: 10,
        codeTime: 10,
        time: 'AM',
        style: { 'zIndex': -2}      
      },
      events: []
    },
    {
      cellProp: {
        hour: 11,
        codeTime: 11,
        time: 'AM',
        style: { 'zIndex': -3}
      },
      events: []
    },
    {
      cellProp: {
      hour: 12,
      codeTime: 12,
      time: 'AM',
      style: { 'zIndex': -4}
      },
      events: []
    },
    {
      cellProp: {
        hour: 1,
      codeTime: 13,
      time: 'PM',
      style: { 'zIndex': -5}
      },
      events: []
    },
    {
      cellProp: {
      hour: 2,
      codeTime: 14,
      time: 'PM',
      style: { 'zIndex': -6}
      },
      events: []

    },
    {
      cellProp: {
      hour: 3,
      codeTime: 15,
      time: 'PM',
      style: { 'zIndex': -7}
      },
      events: []

    },
    {
      cellProp: {
      hour: 4,
      codeTime: 16,
      time: 'PM',
      style: { 'zIndex': -8}
      },
      events: []

    },
    {
      cellProp: {
      hour: 5,
      codeTime: 17,
      time: 'PM',
      style: { 'zIndex': -9}
      },
      events: []

    },
    {
      cellProp: {
      hour: 6,
      codeTime: 18,
      time: 'PM',
      style: { 'zIndex': -10}
      },
      events: []

    },
    {
      cellProp: {
      hour: 7,
      codeTime: 19,
      time: 'PM',
      style: { 'zIndex': -11}
      },
      events: []

    },
    {
      cellProp: {
      hour: 8,
      codeTime: 20,
      time: 'PM',
      style: { 'zIndex': -12}
      },
      events: []

    },
    {
      cellProp: {
      hour: 9,
      codeTime: 21,
      time: 'PM',
      style: { 'zIndex': -13}
      },
      events: []

    },
  ];


  // var err = function(err){
  //   console.log('ERROR: ', err);
  // };

  var clj = function(message){
    console.log(JSON.stringify(message));
  };

  $scope.listCals = function(){
    $cordovaCalendar.listCalendars()
      .then(function (result) {
        //console.log('SUCCESS: ', JSON.stringify(result));
        return eventsInCal(result);
      }, Calendar.err)
      .then(function(result){
        console.log('TEST', JSON.stringify(result));
        result = _.flatten(result);
        //normalizeEvents(result)
        $scope.calEvents = sortEvents(result);
        parseEvent($scope.calEvents);
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

  var parseEvent = function(events){
    console.log('here');
    events.forEach(function(event){
      var startHour = new moment.utc(event.startDate, 'YYYY-MM-DD HH:mm:ss').hour();
      var endHour = new moment.utc(event.startDate, 'YYYY-MM-DD HH:mm:ss').hour();
      var startMinute = new moment.utc(event.startDate, 'YYYY-MM-DD HH:mm:ss').minute();
      var endMinute = new moment.utc(event.endDate, 'YYYY-MM-DD HH:mm:ss').minute();

      var startDate = new moment.utc(event.startDate, 'YYYY-MM-DD HH:mm:ss');
      var endDate = new moment.utc(event.endDate, 'YYYY-MM-DD HH:mm:ss');
      
      var duration = startDate.diff(endDate, 'minutes');
      
      $scope.hours[startHour-8].events.push({
          height: (100 * Math.abs(duration))/60+'px',
          marginTop: startMinute+'px',
          marginLeft: '50px',
          // marginRigth: '20px',
          background: 'red',
          opacity: 0.7,
          width: '85%',
          position: 'absolute',
          'border-radius': '5px',
          'box-shadow': '0 0 5px #888888'
        });
      $scope.hours[startHour-8].cellProp.eventTitle = event.title;
      
    });

    clj($scope.hours)
  };

  angular.element(document).ready(function () {
    $scope.listCals();
  });
});
