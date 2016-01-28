Parse.Cloud.job("breathingReminders", function(request,response){
 
  //When to schedule the push notifications for. So if the job is run on Sunday, it will add couple more days 
  //to schedule it to be run on a Tuesday. 
  var scheduleForThisManyDaysOut = 2;

  Parse.Cloud.useMasterKey();

  // Today's Date
  var now = new Date();

  // Quick function to add days to a date
  Date.prototype.addDays = function(days)
  {
    var dat = new Date(this.valueOf());
    dat.setDate(dat.getDate() + days);
    return dat;
  };

  // only run this once a week. Since Parse doesnt allow scheduling weekly jobs
  if (now.getDay() != 1){
    return;
  }
  
  // Schedule the push this many days out. 
  var neededDate = now.addDays(scheduleForThisManyDaysOut);
  // The following code is to get the date to a format like "2016-01-15T11:00:00"
  var neededMonth = neededDate.getMonth()+1;
  neededMonth = neededMonth + "";

  if (neededMonth.length == 1){
      neededMonth = "0" + neededMonth;
  }
  
  var neededDay = neededDate.getUTCDate()+"";
  if (neededDay.length == 1){
      neededDay = "0" + neededDay;
  }

  // eg "2016-01-01T12:00:00"
  var scheduledDate = neededDate.getFullYear() + "-" + neededMonth + "-" + neededDay + "T11:00:00";

  // In our Parse Database we have a table called NotificationMessage with a column called message
  // We randomize a message to be sent everytime, so user doesnt see same message everytime. 

  var notificationMessage = Parse.Object.extend("NotificationMessage");
  var messageQuery = new Parse.Query(notificationMessage);
  messageQuery.notEqualTo("inactive", true);


  // Actual Push Notification Job to be sent 
  var pushQuery = new Parse.Query(Parse.Installation);
  // You can add additional parameters to target push notifications
  pushQuery.equalTo('deviceType', 'ios');
  

  messageQuery.find().then(function(messages){
      // now we have messages to pick from. pick a random one. 
      var message = messages[Math.floor(Math.random() * messages.length)];
      if (message.length > 0){

        // Schedule the Push
        Parse.Push.send({
          where: pushQuery,
          push_time: scheduledDate,
          data: {
             alert: message
          }
        }, {
              success: function() {
              //Success
              console.log ('send notification successfully');
           },
              error: function(error) {
              //Oops
              console.log ('something went wrong sending push: ' + error.message + 'code:' + error.code);
            }
          });
      }

  }, function(error) {
    // Set the job's error status
    console.log ('something went wrong scheduling push: ' + error.message + 'code:' + error.code);
  });


});