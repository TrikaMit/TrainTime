//configures the first train time picker
$('#first-train').timepicker({
    'scrollDefault': 'now'
});

// Initialize Firebase
var config = {
    apiKey: "AIzaSyCCYLejYySDmZ8qh6oUCCe7sofzYsx2b8w",
    authDomain: "traintime-cb5aa.firebaseapp.com",
    databaseURL: "https://traintime-cb5aa.firebaseio.com",
    projectId: "traintime-cb5aa",
    storageBucket: "",
    messagingSenderId: "270416956034"
};

firebase.initializeApp(config);
var database = firebase.database();

//initial variable values
var trainName = "";
var destination = "";
var firstTrain = "";
var frequency = "";

var now = moment().format('MMMM Do YYYY, h:mm a');
$("#current-time").append(now);

//adds new train
$("#add-train-btn").on('click', function (event) {
    event.preventDefault();
    var now = moment();

    //   variable inputs 
    var trainName = $("#train-name").val().trim();
    var destination = $("#destination").val().trim();
    var firstTrain = $("#first-train").val().trim();
    var frequency = $("#frequency").val().trim();

    console.log(trainName, destination, firstTrain, frequency);

//CONTAINS ALL OF THE MATH
    //variable to convert first Train input to moment value
    var myMoment = moment(firstTrain, 'h:mm a', false).format('MMMM Do YYYY, h:mm:ss a')

    var momentMath = moment(firstTrain, 'h:mm a')
    console.log("desired time: ")
    console.log(momentMath);

    
    console.log("difference: ");
    var difference = moment(momentMath).diff(moment(), "minutes")
    console.log(difference);

    if (difference<=0){
        var change = difference % frequency;
        var nextTrainInt = frequency - (-change)
        var nextTrainMath = moment().add(nextTrainInt,"minutes");
        var nextTrain = moment(nextTrainMath).format("hh:mm a");

        console.log(nextTrainInt);
        console.log(nextTrainMath);
        console.log(nextTrain);        
    }else if (difference>0){
        var nextTrain = firstTrain;
        var nextTrainInt = difference;
    }

    //firebase value assignment
    var newTrain = {
        "trainname": trainName,
        "destination": destination,
        "firsttrain": firstTrain,
        "frequency": frequency,
        "nexttrainint": nextTrainInt,
        "nexttrain": nextTrain,
        "dateAdded": firebase.database.ServerValue.TIMESTAMP
    }

    //Pushes to firebase
    database.ref("/trains").push(newTrain);
    console.log("database" + newTrain.trainname, newTrain.destination, newTrain.firsttrain, newTrain.frequency, newTrain.difference);

    alert("New train added!");

    //clears inputs
    $(".form-control").val("")
});

//after ref need the specific folder TRAINS otherwise all the values are undefined!
database.ref("/trains").orderByChild("dateAdded").on("child_added", function (childSnapshot, prevChildKey) {
    //     // storing the snapshot.val() in a variable for convenience
    var sv = childSnapshot.val();

    console.log(sv)

    //     // Console.loging the last user's data
    console.log(sv.trainname);
    console.log(sv.destination);
    console.log(sv.firsttrain);
    console.log(sv.frequency);
    // console.log(sv.difference);

    $("table > tbody").append("<tr><td>" + sv.trainname + "</td><td>" + sv.destination + "</td><td>" +
        sv.frequency + "</td><td>" + sv.nexttrain + "</td><td>" + sv.nexttrainint + "</td></tr>");


    //     // Handle the errors
}, function (errorObject) {
    console.log("Errors handled: " + errorObject.code);
});


//solving the math part of this


