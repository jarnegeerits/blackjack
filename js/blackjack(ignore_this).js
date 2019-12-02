////// DECLARE GLOBAL VARIABLES //////
var suits = ["S", "H", "D", "C"];
var values = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
var deck = new Array();
var credits = 100;
var dealercards = [];
var playercards = [];
var doubleDown = false;
var playerWeight = 0;
var playerTempWeight = 0;
var dealerWeight = 0;
var dealerTempWeight = 0;
var called = false;
var softenrepeats = 0;
////// BUILD AN ARRAY AND FILL IT WITH A DECK OF CARDS //////
function createDeck(){      // Bouw deck
    deck = new Array();
    for (var i = 0 ; i < values.length; i++){
        for(var x = 0; x < suits.length; x++){
            var weight = parseInt(values[i]);
            if (values[i] == "J" || values[i] == "Q" || values[i] == "K"){
                weight = 10;
            }
            if (values[i] == "A"){
                weight = 11;
            }
            var card = { Value: values[i], Suit: suits[x], Weight: weight };
            deck.push(card);
        }
    }
    // Hide button after use
    var x = document.getElementById("btnCreate");
    x.style.display = "none";
    // Hide again button
    var resethide = document.getElementById("btnAgain");
    resethide.style.display = "none";
}
////// SHUFFLE POSITIONS OF CARDS IN ARRAY //////
function shuffle(){
    // for 1000 turns
    // switch the values of two random cards
    for (var i = 0; i < 1000; i++){
        var location1 = Math.floor((Math.random() * deck.length));
        var location2 = Math.floor((Math.random() * deck.length));
        var tmp = deck[location1];

        deck[location1] = deck[location2];
        deck[location2] = tmp;
    }
    // Hide button after use
    var x = document.getElementById("btnShuffle");
    x.style.display = "none";
}
////// DEAL STARTING CARDS //////
function deal(){
    // Process round cost (reduce credits) and report credits
    credits -= 5;
    //document.getElementById("creditCounter").innerHTML = "Remaining credits: <span style='color:red'>" + credits + "</span>";
    console.log(credits + " credits");
    document.getElementById("creditDisplay").innerHTML = (credits + " credits")
    for (var i = 0; i <= 1; i++){   // Give 2 cards to dealer and report draws
        dealercards.push(deck.shift());
        document.getElementById(String('dealercard' + i)).src
        = String("media/cards/" + dealercards[i].Value + dealercards[i].Suit + ".jpg");
        console.log("Dealer has: " + dealercards[i].Value + " of " + dealercards[i].Suit);
    }
    for (var i = 0; i <= 1; i++){   // Give 2 cards to player
        playercards.push(deck.shift())
        document.getElementById(String('playercard' + i)).src
        = String("media/cards/" + playercards[i].Value + playercards[i].Suit + ".jpg");
    }
    playerTempWeight = playercards[0].Weight + playercards[1].Weight;
    dealerTempWeight = dealercards[0].Weight + dealercards[1].Weight;
    // Dealer blackjack
    if (dealerTempWeight == 21){
        console.log("The house wins, as it always does...")
    } else if (dealerTempWeight > 21){
        var overTest = dealerOverDraw();
        if (overTest != "soft"){
            console.log("It seems the house lost this one...");
        }
    }
    // Player blackjack
    if (playerTempWeight == 21){
        console.log("Blackjack baby!")
        credits += 10
    } else if (playerTempWeight > 21){
        var overTest = playerOverDraw();
        if (overTest != "soft"){
            console.log("You played yourself, loser!");
        }
    }
    // Report current situation
    console.log("You have a " + playercards[0].Value + " of " + playercards[0].Suit);
    console.log("And a " + playercards[1].Value + " of " + playercards[1].Suit);
    console.log("You're currently at " + playerTempWeight);
    document.getElementById("playerWeight").innerHTML = (playerTempWeight);
    console.log("Dealer is currently at " + dealerTempWeight);
    document.getElementById("dealerWeight").innerHTML = (dealerTempWeight);
    // Hide button after use
    var x = document.getElementById("btnDeal");
    x.style.display = "none";
}
////// ALLOCATE ADDITIONAL CARD TO PLAYER HAND //////
function call(){
    playerWeight = 0;
    for (var i = 0; i < playercards.length; i++){   // Determine player weight
        playerWeight += Number(playercards[i].Weight);
    }
    called = true;
    console.log(playerWeight + " total weight before new card");
    if (playerWeight < 21){     // If player hasnt overdrawn, give another card
        playercards.push(deck.shift());
        var playerdeck = Number(playercards.length) - 1
        playerWeight += playercards[playerdeck].Weight; // Adjust player weight
        // Report current situation
        console.log("You drew a " + playercards[playerdeck].Value + " of " + playercards[playerdeck].Suit);
        document.getElementById(String('playercard' + playerdeck)).src = String("media/cards/" + playercards[playerdeck].Value + playercards[playerdeck].Suit + ".jpg");
        document.getElementById("playerWeight").innerHTML = (playerWeight);
        document.getElementById("dealerWeight").innerHTML = (dealerTempWeight);
        console.log("You're currently at " + playerWeight);
        console.log("Dealer is still at " + dealerTempWeight);
        if (playerWeight == 21){    // Blackjack
            console.log("That makes 21, neato!");
            credits += 10;
        }
        if (playerWeight > 21){     // Overdraw
            var overTest = String(dealerOverDraw());
            if (overTest != "soft"){
                console.log("You played yourself, loser!");
                resethide = document.getElementById("btnAgain");
                resethide.style.display = "block";
                passhide = document.getElementById("btnPass");
                passhide.style.display = "none";
            } else if (overTest == "soft") {
            console.log("You're currently at " + playerWeight);
            }
        }
    } else {
        console.log("Ya already lost jimbo");
    }
}
////// SAME AS CALL BUT HIGHER COST/REWARDS //////
function magnumDongMode(){
    credits -= 5;   // Remove extra credits
    doubleDown = true;
    if (called == false){
        call();
    }
    doubleDownHide = document.getElementById("btndoubleDown");
    doubleDownHide.style.display = "none";
    /*
    // See function call() for info
    for (var i = 0; i < playercards.length; i++){
        playerWeight += Number(playercards[i].Weight);
    }
    console.log(playerWeight + " total weight before new card");
    if (playerWeight < 21){
        playercards.push(deck.shift());
        var playerdeck = Number(playercards.length) - 1
        console.log("You drew a " + playercards[playerdeck].Value + " of " + playercards[playerdeck].Suit);
        playerWeight += playercards[playerdeck].Weight;
        if (playerWeight == 21){
            console.log("That makes 21, neato!");
            credits += 20;
        }
        if (playerWeight > 21){
            var overTest = dealerOverDraw();
            if (overTest != "soft"){
                console.log("You played yourself, loser!");
            }
        }
        console.log("You're currently at " + playerWeight);
    } else {
        console.log("Ya already lost jimbo");
    }
    */
}
////// DRAW CARDS FOR DEALER //////
function pass(){
    if (softenrepeats <= 4 && dealerWeight <= 22){ // TELLS THE FUNCTION TO GO FUCK ITSELF SIDEWAYS WHEN IT TRIES TO SOFTEN MORE THAN 4 ACES
        if (called == false){ // DETERMINES THE PLAYERWEIGHT IF THE CALL FUNCTION IS SKIPPED.
            for (var i = 0; i < playercards.length; i++){   // Determine player weight
                playerWeight += Number(playercards[i].Weight);
            }
        }
        for (var i = 0; i < dealercards.length; i++){   // Check dealer starting conditions
            console.log("Dealer had: " + dealercards[i].Value + " of " + dealercards[i].Suit);
            dealerWeight += Number(dealercards[i].Weight);  // Determine dealerweight
            if (dealerWeight == 21) {   // Check for dealer blackjack
                console.log("The house wins, as it always does...");
            }
        }
        console.log("Dealer was at: " + dealerWeight);
        while ((dealerWeight <= 17 || dealerWeight < playerWeight) && dealerWeight <= 21){
            if (dealerWeight == 21) {
                console.log("The house wins, as it always does...");
            }
            dealercards.push(deck.shift());
            var dealerdeck = Number(dealercards.length - 1);
            dealerWeight += dealercards[dealerdeck].Weight;
            document.getElementById("dealerWeight").innerHTML = (dealerWeight);
            document.getElementById(String('dealercard' + dealerdeck)).src = String("media/cards/" + dealercards[dealerdeck].Value + dealercards[dealerdeck].Suit + ".jpg");
            console.log("Dealer draws : " + dealercards[dealerdeck].Value + " of " + dealercards[dealerdeck].Suit);
        }
        console.log("Dealer is at: " + dealerWeight);
        if (dealerWeight <= 21){
            if (dealerWeight >= 17){
                if (dealerWeight > playerWeight){
                console.log("The house wins, as it always does...");
                } else if (dealerWeight == playerWeight){
                    credits += 5;
                    console.log("It's a draw...");
                } else {
                    console.log("It seems the house will allow you this victory...");
                }
            }
        }
        if (dealerWeight > 21){
            var overTest = String(dealerOverDraw());
            if (overTest != "soft"){
                console.log("The house lost, for this round at least...");
                if (doubleDown = true){
                    credits += 20;
                } else {
                    credits += 10;
                }
            } else if (overTest == "soft" && softenrepeats < 4){ // if an ace in the dealers hand was softened, restart dealer drawing
                console.log("Attempting soften");
                softenrepeats += 1;
                pass();
            }
        }
    }
    resethide = document.getElementById("btnAgain");
    resethide.style.display = "block";
}

////// SOFTEN ACES IN PLAYER DECK ON OVERDRAW //////
function playerOverDraw(){
    var softened = false;
    for (var i = 0; i <= playercards.length - 1 && softened != true; i++){
        if (playercards[i].Value == "A"){
            playercards[i].Weight = 1;
            playerWeight -= 10;
            softened = true;
            return "soft";
        }
    }
}
////// SOFTEN ACES IN DEALER DECK ON OVERDRAW //////
function dealerOverDraw(){
    var softened = false;
    for (var i = 0; i <= dealercards.length - 1 && softened != true; i++){
        if (dealercards[i].Value == "A"){
            dealercards[i].Weight = 1;
            dealerWeight -= 10;
            softened = true;
            return "soft";
        }
    }
}
////// CLEANS UP AT END OF ROUND AND STARTS NEW ROUND //////
function nextRound(){
    // Count remaining cards and remake deck if lower than 20
    var cardsRemaining = deck.length;
    if (cardsRemaining <= 20){
        createDeck();
        shuffle();
    }
    // Clear console and display cards remaining
    console.clear();
    console.log(cardsRemaining + " cards left in deck");
    // Make deal button visible again
    var x = document.getElementById("btnDeal");
    x.style.display = "block";
    // Reset parameters
    playerWeight = 0;
    playerTempWeight = 0;
    playercards = [];
    dealerWeight = 0;
    dealerTempWeight = 0;
    dealercards = [];
    doubleDown = false;
    called = false;
    softenrepeats = 0;
    // Re-hide again button
    resethide = document.getElementById("btnAgain");
    resethide.style.display = "none";

    doubleDownHide = document.getElementById("btndoubleDown");
    doubleDownHide.style.display = "block";

    passhide = document.getElementById("btnPass");
    passhide.style.display = "block";

    for (var i = 0; i < 8; i++) {
        document.getElementById(String('dealercard' + i)).src = String("media/cards/Gray_back.jpg");
        document.getElementById(String('playercard' + i)).src = String("media/cards/Gray_back.jpg");
    }
}
