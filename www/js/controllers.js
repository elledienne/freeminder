angular.module('starter.controllers', [])

.controller('TodosCtrl', function($scope, $localstorage, $ionicListDelegate, $cordovaKeyboard) {
  $scope.todos;
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

  $scope.createNewTask = function(){
    $cordovaKeyboard.close();
    var newTask = {
      id: $scope.todos.length !== 0 ? $scope.todos[0].id+1 : 0,
      title: $scope.newTaskInput,
      priority: $scope.priority || 50
    };
    $scope.todos.unshift(newTask);
    $localstorage.setObject('tasks', $scope.todos);
  };

  var loadTasks = function(){
    var tasks = $localstorage.getObject('tasks', 'null');
    // console.log(JSON.stringify(_.flatten(tasks)));
    if(tasks){
      // console.log('here')
      $scope.todos = _.flatten(tasks);
    }
  };

  $scope.removeTask = function(index){
    $scope.todos.splice(index, 1);
    $ionicListDelegate.$getByHandle('listTask').closeOptionButtons();
    $localstorage.setObject('tasks', $scope.todos);
  };

  loadTasks();
})

.controller('CalCtrl', function($scope, $cordovaCalendar, $q, moment, _, $localstorage) {
  var tasksToPlan;
  $scope.hours = [
    {
      cellProp: {
        hour: 8,
        codeTime: 8,
        time: 'AM',
        style: { 'zIndex': 0}
      },
      events: []
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


  var sortTask = function(tasks){
    if(tasks){
      tasks.sort(function(a, b){
        if(a.priority > a.priority){
          return -1;
        } else {
          return 1;
        }
      });
    }
    clj(tasks);
  };


  $scope.$on('$ionicView.enter', function(e) {
    tasksToPlan = $localstorage.getObject('tasks', 'null');
    sortTask(tasksToPlan);
    //addTaskWhenFree(tasksToPlan);
  });
  
  var parseEvent = function(events){
    //console.log('here');
    var freeSpots = [];
    var prevEndDate = null;

    events.forEach(function(event){
      var startHour = new moment.utc(event.startDate, 'YYYY-MM-DD HH:mm:ss').hour();
      var endHour = new moment.utc(event.startDate, 'YYYY-MM-DD HH:mm:ss').hour();
      var startMinute = new moment.utc(event.startDate, 'YYYY-MM-DD HH:mm:ss').minute();
      var endMinute = new moment.utc(event.endDate, 'YYYY-MM-DD HH:mm:ss').minute();

      var startDate = new moment.utc(event.startDate, 'YYYY-MM-DD HH:mm:ss');
      var endDate = new moment.utc(event.endDate, 'YYYY-MM-DD HH:mm:ss');
      var duration = startDate.diff(endDate, 'minutes');

      if(!prevEndDate){
        var height = startMinute !== 0 ? startMinute : 60;
        $scope.hours[0].events.push({
          height: (100 * height)/60+'px',
          marginTop: 0+'px',
          marginLeft: '50px',
          // marginRigth: '20px',
          background: 'blue',
          opacity: 0.7,
          width: '85%',
          position: 'absolute',
          'border-radius': '5px',
          'box-shadow': '0 0 5px #888888'
        });
        freeSpots.push({
          start: new moment.utc('2015-11-10 09:00:00', 'YYYY-MM-DD HH:mm:ss'),
          end: height === 60 ?
            new moment.utc('2015-11-10 10:00:00', 'YYYY-MM-DD HH:mm:ss') :
            new moment.utc('2015-11-10 09:'+ height +':00', 'YYYY-MM-DD HH:mm:ss')
        });
      } else {
        console.log('qui')
        var height = startDate.diff(prevEndDate, 'minutes');
        var prevMinutes = prevEndDate.minute();
        console.log('prevMinutes', prevMinutes);
        var prevHour = prevEndDate.hour();
        console.log('prevHour', prevHour)
        $scope.hours[prevHour-8].events.push({
          height: (100 * Math.abs(height))/60+'px',
          marginTop: (100 * prevMinutes) / 60+'px',
          marginLeft: '50px',
          // marginRigth: '20px',
          background: 'blue',
          opacity: 0.7,
          width: '85%',
          position: 'absolute',
          'border-radius': '5px',
          'box-shadow': '0 0 5px #888888'
        });
        freeSpots.push({
          start: prevEndDate,
          end: startDate
        });
      }
      prevEndDate = endDate || true;
      console.log(prevEndDate);

      $scope.hours[startHour-8].events.push({
        height: (100 * Math.abs(duration))/60+'px',
        marginTop: (100 * startMinute)/60+'px',
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
    
    clj(freeSpots);
    clj($scope.hours)
  };

  // var addTaskWhenFree = function(tasks){

  //   tasks.forEach(function(task){
  //     $scope.hours.some(function(hour){
  //       if(hour.events.length === 0){
  //         hour.events.push({
  //           height: (100 * 50)/60+'px',
  //           marginTop: 0+'px',
  //           marginLeft: '50px',
  //           // marginRigth: '20px',
  //           background: 'blue',
  //           opacity: 0.7,
  //           width: '85%',
  //           position: 'absolute',
  //           'border-radius': '5px',
  //           'box-shadow': '0 0 5px #888888'
  //         });
  //         return true;
  //       }
  //     })
  //   })


    // $scope.hours.forEach(function(hour){
    //   if(hour.events.length === 0){
    //     hour.events.push(
    //       {
    //         height: (100 * 50)/60+'px',
    //         marginTop: '0px',
    //         marginLeft: '50px',
    //         // marginRigth: '20px',
    //         background: 'blue',
    //         opacity: 0.7,
    //         width: '85%',
    //         position: 'absolute',
    //         'border-radius': '5px',
    //         'box-shadow': '0 0 5px #888888'
    //       }
    //   )
    //   }
    // })
  // };

  angular.element(document).ready(function () {
    $scope.listCals();
  });
});
