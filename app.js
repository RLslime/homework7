$(document).ready(function(){
    //FIREBASE
    var config = {
        apiKey: "AIzaSyBKk1qB3lS9G5QSNRHd_8QFyEyziGDqcwc",
        authDomain: "trainzzz-8164b.firebaseapp.com",
        databaseURL: "https://trainzzz-8164b.firebaseio.com",
        projectId: "trainzzz-8164b",
        storageBucket: "trainzzz-8164b.appspot.com",
        messagingSenderId: "753001653944"
      };
      firebase.initializeApp(config);

    //database variable
    var database = firebase.database();
    
    // capture click
    $("#submit").on("click", function() {
    
    //html vals
        var name = $('#nameInput').val().trim();
        var dest = $('#destInput').val().trim();
        var time = $('#timeInput').val().trim();
        var freq = $('#freqInput').val().trim();
    
    // push to firebase
        database.ref().push({
            name: name,
            dest: dest,
            time: time,
            freq: freq,
            timeAdded: firebase.database.ServerValue.TIMESTAMP
        });
        // no refresh
        $("input").val('');
        return false;
    });
    
    //onclick child
    database.ref().on("child_added", function(childSnapshot){
        var name = childSnapshot.val().name;
        var dest = childSnapshot.val().dest;
        var time = childSnapshot.val().time;
        var freq = childSnapshot.val().freq;
    
        console.log("Name: " + name);
        console.log("Destination: " + dest);
        console.log("Time: " + time);
        console.log("Frequency: " + freq);
    
    //convert train time
        var freq = parseInt(freq);
        //current time
        var currentTime = moment();
        console.log("CURRENT TIME: " + moment().format('HH:mm'));
        var dConverted = moment(childSnapshot.val().time, 'HH:mm').subtract(1, 'years');
        console.log("DATE CONVERTED: " + dConverted);
        var trainTime = moment(dConverted).format('HH:mm');
        console.log("TRAIN TIME : " + trainTime);
        
        //the difference
        var tConverted = moment(trainTime, 'HH:mm').subtract(1, 'years');
        var tDifference = moment().diff(moment(tConverted), 'minutes');
        console.log("DIFFERENCE IN TIME: " + tDifference);
        //remainder 
        var tRemainder = tDifference % freq;
        console.log("TIME REMAINING: " + tRemainder);
        //minutes til next choo choo
        var minsAway = freq - tRemainder;
        console.log("MINUTES UNTIL NEXT TRAIN: " + minsAway);
        //next time
        var nextTrain = moment().add(minsAway, 'minutes');
        console.log("ARRIVAL TIME: " + moment(nextTrain).format('HH:mm A'));


    $('#currentTime').text(currentTime);
    $('#trainTable').append(
            "<tr><td id='nameDisplay'>" + childSnapshot.val().name +
            "</td><td id='destDisplay'>" + childSnapshot.val().dest +
            "</td><td id='freqDisplay'>" + childSnapshot.val().freq +
            "</td><td id='nextDisplay'>" + moment(nextTrain).format("HH:mm") +
            "</td><td id='awayDisplay'>" + minsAway  + ' minutes until arrival' + "</td></tr>");
     },
    
    function(errorObject){
        console.log("Read failed: " + errorObject.code)
    });

    
    });