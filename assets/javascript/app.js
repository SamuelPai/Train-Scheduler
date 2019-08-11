// Steps to complete:

// 1. Create Firebase link
// 2. Create initial train data in database
// 3. Create button for adding new trains - then update the html + update the database
// 4. Create a way to retrieve trains from the trainlist.
// 5. Create a way to calculate the time way. Using difference between start and current time.
//    Then take the difference and modulus by frequency. (This step can be completed in either 3 or 4)

// Initialize Firebase


var firebaseConfig = {
    apiKey: "AIzaSyAT99og06rxoBdPV87Q3E5s2TH6dZXrzXE",
    authDomain: "train-scheduler-edd9f.firebaseapp.com",
    databaseURL: "https://train-scheduler-edd9f.firebaseio.com",
    projectId: "train-scheduler-edd9f",
    storageBucket: "",
    messagingSenderId: "359671324820",
    appId: "1:359671324820:web:d28158e0a9754cc3"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  var trainData = firebase.database();
  // 2. Populate Firebase Database with initial data (in this case, I did this via Firebase GUI)
// 3. Button for adding trains


$("#submit").on("click", function(event){
    event.preventDefault();
    var trainName = $("#train-Name").val().trim();
    var destination1 = $("#destination").val().trim();
    var trainDestination = $("#first-Train").val().trim();
    var frequency1 = $("#frequency").val().trim();



    var newTrain = {
        trainName: trainName,
        destination1: destination1,
        trainDestination: trainDestination,
        frequency1: frequency1 
    }
trainData.ref().push(newTrain);
console.log(newTrain.trainName);
console.log(newTrain.destination1);
console.log(newTrain.trainDestination);
console.log(newTrain.frequency1);
alert("Train successfully added");

//clears text boxes
 $("#train-Name").val("");
 $("#destination").val("");
 $("#first-Train").val("");
 $("#frequency").val("");

 var tMinutes;
 var tArrival;
 trainData.ref().on("child_added", function(childSnapshot, prevChildKey){

    console.log(childSnapshot.val())

    // Store everything into a variable.
    var tName = childSnapshot.val().trainName;

    var tDestination1 = childSnapshot.val().destination1;
    var tFrequency = childSnapshot.val().frequency1;
    var tTrainDestination = childSnapshot.val().trainDestination;
    var tTrainName = childSnapshot.val().trainName;

    var time = tTrainDestination.split(":");
    var trainTime = moment().hours(time[0]).minutes(time[1]);
    var maxMoment = moment.max(moment(),trainTime);
    

    console.log("TEST!!!");
    

// If the first train is later than the current time, sent arrival to the first train time
if (maxMoment === trainTime) {
    tArrival = trainTime.format("hh:mm A");
    tMinutes = trainTime.diff(moment(), "minutes");
  } else {
    // Calculate the minutes until arrival using hardcore math
    // To calculate the minutes till arrival, take the current time in unix subtract the FirstTrain time
    // and find the modulus between the difference and the frequency.
    var differenceTimes = moment().diff(trainTime, "minutes");
    var tRemainder = differenceTimes % tFrequency;
    tMinutes = tFrequency - tRemainder;
    // To calculate the arrival time, add the tMinutes to the current time
    tArrival = moment()
      .add(tMinutes, "m")
      .format("hh:mm A");
  }
  console.log("tMinutes:", tMinutes);
  console.log("tArrival:", tArrival);

    });
    $(".table").append("<tr>" + "<td>" + trainName + "</td>" + "<td>" + destination1 + "</td>" + "<td>" + frequency1 + "</td>" + "<td>" + tArrival + "</td>" + "<td>" + tMinutes + "<td>" + "</tr>");


})



