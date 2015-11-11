angular.module('starter.controllers', [])

.controller('TodosCtrl', function($scope, $localstorage, $ionicListDelegate, $cordovaKeyboard) {
  $scope.todos = null;
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

  var setStarRating = function(rating){
    var star = Math.floor(rating * 5 / 100);
    var starsDiv = '';
    for(var i = 0; i < star; i++){
      starsDiv += '<i class="icon ion-ios-star"></i>';
    }
    if(starsDiv.length === 0){
      starsDiv = '<i class="ion-ios-star-outline"></i>';
    }
    return starsDiv;
  };

  $scope.createNewTask = function(){
    $cordovaKeyboard.close();
    var prior = $scope.priority !== undefined ? parseInt($scope.priority) : 50;
    var newTask = {
      id: $scope.todos.length !== 0 ? $scope.todos[0].id+1 : 0,
      title: $scope.newTaskInput,
      priority: prior,
      stars: setStarRating(prior)
    };
    //console.log(setStarRating(prior))
    $scope.newTaskInput = '';
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
  var freeSpots = [];
  


  var clj = function(message){
    console.log(JSON.stringify(message));
  };

  $scope.listCals = function(callback){
    $cordovaCalendar.listCalendars()
      .then(function (result) {
        //console.log('SUCCESS: ', JSON.stringify(result));
        return eventsInCal(result);
      }, Calendar.err)
      .then(function(result){
        //console.log('TEST', JSON.stringify(result));
        result = _.flatten(result);
        //normalizeEvents(result)
        $scope.calEvents = sortEvents(result);
        parseEvent($scope.calEvents);
        //console.log('PARSE COMPLETED')
        clj(freeSpots);
        callback();
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

      // console.log('curr', curr.startDate);
      // console.log('next', next.startDate);
      // console.log('diff', diff);
      
      
      return diff;

    });
    return events;
  };


  var sortTask = function(tasks){
    if(tasks){
      tasks.sort(function(a, b){
        return b.priority - a.priority;
      });
    }
  };


  $scope.$on('$ionicView.beforeEnter', function(e) {
    angular.element(document).ready(function () {
      freeSpots = [];
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
      $scope.listCals(function(){
        // console.log('READY FOR NEXT OP')
        tasksToPlan = $localstorage.getObject('tasks', 'null');
        sortTask(tasksToPlan);
        addTaskWhenFree(tasksToPlan);
      });
    });
  });
  

  var parseEvent = function(events){
    //console.log('here');
    var prevEndDate = null;

    events.forEach(function(event){
      var startHour = new moment.utc(event.startDate, 'YYYY-MM-DD HH:mm:ss').hour();
      var endHour = new moment.utc(event.startDate, 'YYYY-MM-DD HH:mm:ss').hour();
      var startMinute = new moment.utc(event.startDate, 'YYYY-MM-DD HH:mm:ss').minute();
      var endMinute = new moment.utc(event.endDate, 'YYYY-MM-DD HH:mm:ss').minute();

      var startDate = new moment.utc(event.startDate, 'YYYY-MM-DD HH:mm:ss');
      var endDate = new moment.utc(event.endDate, 'YYYY-MM-DD HH:mm:ss');
      var duration = startDate.diff(endDate, 'minutes');

      var height;

      if(!prevEndDate){
        height = startMinute !== 0 ? startMinute : 60;
        
        freeSpots.push({
          start: new moment.utc('2015-11-11 08:00:00', 'YYYY-MM-DD HH:mm:ss'),
          end: height === 60 ?
            new moment.utc('2015-11-11 09:00:00', 'YYYY-MM-DD HH:mm:ss') :
            new moment.utc('2015-11-11 09:'+ height +':00', 'YYYY-MM-DD HH:mm:ss')
        });
      } else {
        //console.log('qui')
        height = startDate.diff(prevEndDate, 'minutes');
        if(height !== 0){
          var prevMinutes = prevEndDate.minute();
          //console.log('prevMinutes', prevMinutes);
          var prevHour = prevEndDate.hour();
          //console.log('prevHour', prevHour)
          // $scope.hours[prevHour-8].events.push({
          //   height: (100 * Math.abs(height))/60+'px',
          //   marginTop: (100 * prevMinutes) / 60+'px',
          //   marginLeft: '50px',
          //   // marginRigth: '20px',
          //   background: 'blue',
          //   opacity: 0.7,
          //   width: '85%',
          //   position: 'absolute',
          //   'border-radius': '5px',
          //   'box-shadow': '0 0 5px #888888'
          // });
          // addEvent(prevHour-8, height, prevMinutes, 'transparent');
          freeSpots.push({
            start: prevEndDate,
            end: startDate
          });
        }
      }
      prevEndDate = endDate || true;
      // console.log(prevEndDate);

      // $scope.hours[startHour-8].events.push({
      //   height: (100 * Math.abs(duration))/60+'px',
      //   marginTop: (100 * startMinute)/60+'px',
      //   marginLeft: '50px',
      //   // marginRigth: '20px',
      //   background: 'red',
      //   opacity: 0.7,
      //   width: '85%',
      //   position: 'absolute',
      //   'border-radius': '5px',
      //   'box-shadow': '0 0 5px #888888'
      // });
      
      var isDuplicate = $scope.hours[startHour-8].cellProp.eventTitle === event.title;
      // console.log(isDuplicate);
      //isDuplicate = false;
      if(!isDuplicate){
        addEvent(startHour-8, duration, startMinute, 'red');
        $scope.hours[startHour-8].cellProp.eventTitle = event.title;
      }
      
    });
    
    //detect free space at the end of the day
    var prevMinutes = prevEndDate.minute();
    var prevHour = prevEndDate.hour();
    var lastHour = new moment.utc('2015-11-11 21:00:00', 'YYYY-MM-DD HH:mm:ss');
    var height = lastHour.diff(prevEndDate, 'minutes');
    if(prevHour < 21){
      // $scope.hours[prevHour-8].events.push({
      //   height: (100 * Math.abs(height))/60+'px',
      //   marginTop: (100 * prevMinutes) / 60+'px',
      //   marginLeft: '50px',
      //   // marginRigth: '20px',
      //   background: 'blue',
      //   opacity: 0.7,
      //   width: '85%',
      //   position: 'absolute',
      //   'border-radius': '5px',
      //   'box-shadow': '0 0 5px #888888'
      // });
      // addEvent(prevHour-8, height, prevMinutes, 'transparent');
      freeSpots.push({
        start: prevEndDate,
        end: lastHour
      });
    }

    // clj(freeSpots);
    // clj($scope.hours);
  };


  var addEvent = function(index, height, top, color){
    $scope.hours[index].events.push({
      height: (100 * Math.abs(height))/60+'px',
      marginTop: (100 * top) / 60+'px',
      marginLeft: '50px',
      // marginRigth: '20px',
      background: color,
      opacity: 0.7,
      width: '85%',
      position: 'absolute',
      'border-radius': '5px',
      'box-shadow': '0 0 5px #888888'
    });
  };

  var addTaskWhenFree = function(tasks){
    var spotToAssign;
    //tasks.forEach(function(task){
    for(var i = 0; i < tasks.length; i++){
      var task = tasks[i];

      if(freeSpots.length > 0){
        spotToAssign = freeSpots.shift();
        var start = new moment.utc(spotToAssign.start);
        var startHour = start.hour();
        var startMinute = start.minute();
        var end = new moment.utc(spotToAssign.end);
        var endHour = end.hour();
        var endMinute = end.minute();
        var diff = end.diff(start, 'minutes');

        if(diff <= 60 && diff >= 30) {
          addEvent(startHour-8, diff, startMinute, 'green');
          $scope.hours[startHour-8].cellProp.eventTitle = task.title;
        } else if(diff % 60 === 0){
          // var newSize = diff;
          // while(newSize >= 70){
          //   newSize /= 2;
          // }
          // console.log('New SIZE: ', newSize);
          var numberOfFreeSpots = diff / 60;
          //console.log('NEW SPOTS:', numberOfFreeSpots)
          var newSpots = [];
          for(var g = 0; g < numberOfFreeSpots; g++){

            addEvent(startHour-8, 60, endMinute, 'green');
            $scope.hours[startHour-8].cellProp.eventTitle = task.title;
            //console.log(startHour, endMinute)
            endMinute = endMinute;
            // console.log(JSON.stringify(task),i)
            i = i+1;
            task = tasks[i];
            // console.log(JSON.stringify(task),i);
            startHour++;
            var f = g;
            //console.log('TASKS #######################',tasks);
            if(task === undefined){
              break;
            } else if(i+1 === tasks.length || g+1 === numberOfFreeSpots){
              //tasks.unshift(task);
              i = i-1;
              // console.log('TASKS #######################',tasks);
            }
            // console.log(startHour, endMinute)
            //start;
          }
          
        } else {
          // console.log('HERE', diff)
          while(startHour !== endHour){
            addEvent(startHour-8, 60-startMinute, startMinute, 'green');
            $scope.hours[startHour-8].cellProp.eventTitle = task.title;
            // console.log('START',startHour);
            startHour++;
            startMinute = 0;
            i++;
            task = tasks[i];
            if(task === undefined){
              break;
            } else if(i === tasks.length){
              //tasks.unshift(task);
              i = i-1;
              break;
              // console.log('TASKS #######################',tasks);
            }
          }

          //addEvent(startHour-8, diff, startMinute, 'green');
        }

        // clj(spotToAssign);
      } else {
        // console.log('No more free spots for today');
      } 
    }

    // console.log($scope.hours)
  };


  angular.element(document).ready(function () {
    // $scope.listCals();
  });
});
