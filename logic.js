$(document).ready(function(){
    //variables
    let yourSpot = "none";
    let player2HasPicked = 2;
    let player1HasPicked = 2;
    var config = {
        apiKey: "AIzaSyAA0RzEX0UfhyC95wT9R4Pd09fEH71n9Cg",
        authDomain: "inclass-e3cb5.firebaseapp.com",
        databaseURL: "https://inclass-e3cb5.firebaseio.com",
        projectId: "inclass-e3cb5",
        storageBucket: "inclass-e3cb5.appspot.com",
        messagingSenderId: "633734926014"
    };
    firebase.initializeApp(config);
    let database = firebase.database();
    database.ref().on("value", function(snapshot) {
        console.log(snapshot);
        if(snapshot.val().player1 == "notJoined" && snapshot.val().player1 !== undefined){
            $("#choicesPlayer1Box").empty();
            $("#statusPlayer1Box").html("player 1 has disconnected, waiting for new player");
            $("#player1Box").append("<p ><button id='joinAsPlayer1Button' value='player1'>Join as player 1</button></p>");
        }
        if(snapshot.val().player2 == "notJoined" && snapshot.val().player1 !== "notJoined" && snapshot.val().player2 !== undefined){
            $("#choicesPlayer2Box").empty();
            $("#statusPlayer2Box").html("player 2 has disconnected, waiting for new player");
            $("#player2Box").append("<p><button id='joinAsPlayer2Button' value='player2'>Join as player 2</button></p>");
        }
        if(snapshot.val().player1 == "joined"){
            $("#player1Box").empty();
            $("#statusPlayer1Box").html("waiting for player 1 to pick...");
            $("#choicesPlayer1Box").html(
                "<button class='choicesButton' value='player1Rock'>Rock</button>" +
                "<button class='choicesButton' value='player1Paper'>Paper</button>" +
                "<button class='choicesButton' value='player1Scissors'>Scissors</button>"
            )
        }
        if(snapshot.val().player2 == "joined"){
            $("#player2Box").empty();
            $("#statusPlayer2Box").html("waiting for player 2 to pick...");
            $("#choicesPlayer2Box").html(
                "<button class='choicesButton' value='player2Rock'>Rock</button>" +
                "<button class='choicesButton' value='player2Paper'>Paper</button>" +
                "<button class='choicesButton' value='player2Scissors'>Scissors</button>"
            )
        }

        if(snapshot.val().player2Pick !== "nothing" && snapshot.val().player2Pick !== undefined){  
            $("#statusPlayer2Box").html("player2 has chosen! waiting on player 1 to choose");
        }
        if(snapshot.val().player1Pick !== "nothing" && snapshot.val().player1Pick !== undefined){
            $("#statusPlayer1Box").html("player1 has chosen! waiting on player 2 to choose");
        }

        if(snapshot.val().player2Pick !== "nothing" && snapshot.val().player1Pick !== "nothing" && snapshot.val().player1Pick !== undefined && snapshot.val().player2Pick !== undefined){
            if(snapshot.val().player1Pick == "Rock"){$("#player1Box").html("<img class='boxImg' src='assets/images/rock.png'/>");};
            if(snapshot.val().player1Pick == "Paper"){$("#player1Box").html("<img class='boxImg' src='assets/images/paper.png'/>");};
            if(snapshot.val().player1Pick == "Scissors"){$("#player1Box").html("<img class='boxImg' src='assets/images/scissors.jpg'/>");};
            if(snapshot.val().player2Pick == "Rock"){$("#player2Box").html("<img class='boxImg' src='assets/images/rock.png'/>");};
            if(snapshot.val().player2Pick == "Paper"){$("#player2Box").html("<img class='boxImg' src='assets/images/paper.png'/>");};
            if(snapshot.val().player2Pick == "Scissors"){$("#player2Box").html("<img class='boxImg' src='assets/images/scissors.jpg'/>");};
            findWinner(snapshot.val().player1Pick,snapshot.val().player2Pick,snapshot)
            resetGame(snapshot);
        }
        
    });
    $("html").on('click','button',function(){

        buttonClicked = $(this).attr("value");
        if( buttonClicked == "player1" && yourSpot == "none"){
            $("#player1Box").css({"border":"8px dashed green"});
            yourSpot = "player1";
            database.ref().update({player1: "joined"})
            database.ref().update({player1Pick: "nothing"})
            database.ref().update({player1Wins: 0})
 
        }
        if( buttonClicked == "player2" && yourSpot == "none" ){
            $("#player2Box").css({"border":"8px dashed green"});
            yourSpot = "player2";
            database.ref().update({player2: "joined"})
            database.ref().update({player2Pick: "nothing"})
            database.ref().update({player2Wins: 0})
        }
        if(yourSpot == "player1"){
            if(buttonClicked == "player1Rock" && player1HasPicked == 2){
                player1HasPicked = 1;
                database.ref().update({player1Pick: "Rock"})
            }
            if(buttonClicked == "player1Paper" && player1HasPicked == 2){
                player1HasPicked = 1;
                database.ref().update({player1Pick: "Paper"})
            }
            if(buttonClicked == "player1Scissors" && player1HasPicked == 2){
                player1HasPicked = 1;
                database.ref().update({player1Pick: "Scissors"})
            }
        }
        if(yourSpot == "player2"){
            if(buttonClicked == "player2Rock" && player2HasPicked == 2){
                player2HasPicked = 1;
                database.ref().update({player2Pick: "Rock"})
            }
            if(buttonClicked == "player2Paper" && player2HasPicked == 2){
                player2HasPicked = 1;
                database.ref().update({player2Pick: "Paper"})
            }
            if(buttonClicked == "player2Scissors" && player2HasPicked == 2){
                player2HasPicked = 1;
                database.ref().update({player2Pick: "Scissors"})
            }
        }
    });
    $(window).on("unload", function(e) {
        if(yourSpot == "player1"){
            database.ref().update({
                player1: "notJoined",
                player1Pick: "nothing",
                player1Wins: 0,
            });
        }
        if(yourSpot == "player2"){
            database.ref().update({
                player2: "notJoined",
                player2Pick: "nothing",
                player2Wins: 0,
            });
        }   
    });
    findWinner = function(player1Choice,player2Choice,snapshot){
        if(player1Choice === "Rock" && player2Choice === "Scissors" || player1Choice === "Scissors" && player2Choice === "Paper" || player1Choice === "Paper" && player2Choice === "Rock"){
            $("#statusPlayer1Box").html("PLAYER 1 WINS, moving to next round");
            $("#statusPlayer2Box").html("PLAYER 2 LOSES, moving to next round");


        }else if(player1Choice === "Scissors" && player2Choice === "Rock" || player1Choice === "Paper" && player2Choice === "Scissors" || player1Choice === "Rock" && player2Choice === "Paper"){
            $("#statusPlayer1Box").html("PLAYER 1 LOSES, moving to next round");
            $("#statusPlayer2Box").html("PLAYER 2 WINS, moving to next round");

        }else{
            $("#statusPlayer1Box").html("You sly devils ended in a draw, moving to next round");
            $("#statusPlayer2Box").html("You sly devils ended in a draw, moving to next round");

        }
        
    }
    resetGame = function(snapshot){
        
        setTimeout(function(snapshot){
            console.log(snapshot);
            if(yourSpot == "player1"){
                player1HasPicked = 2;
                database.ref().update({player1Pick: "nothing"})
                $("#statusPlayer1Box").html("waiting for player 1 to pick...");
            }
            if(yourSpot == "player2"){
                database.ref().update({player2Pick: "nothing"})
                player2HasPicked = 2;
                $("#statusPlayer2Box").html("waiting for player 2 to pick...");
            }

        }, 3000);
        
    }
});

