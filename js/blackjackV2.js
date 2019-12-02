////////////////////////////////////////////////////////////////
////// DECLARE GLOBAL VARIABLES, GLOBAL VARS START WITH $ //////
////////////////////////////////////////////////////////////////

////// ARRAYS USED TO BUILD THE DECK //////
var $suits = ["S", "H", "D", "C"];
var $values = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
var $deck = new Array();

////// CREDITS FOR THE PLAYER //////
var $credits = 100;

////// DECK ARRAYS FOR PLAYER & DEALER //////
var $dealercards = [];
var $playercards = [];

////// FLAGS TO INDICATE COMPLETION OF CERTAIN EVENTS //////
var $doubleDown = false;
var $called = false;
var $passed = false;

////// VARS TO LOG CURRENT WEIGHT FOR PLAYER & DEALER //////
var $playerWeight = 0;
var $dealerWeight = 0;

////// TESTING VARS? MIGHT DELETE LATER //////
var $softenrepeats = 0;

/////////////////////////////////////////////////////////////////////
////// VAR DECLARATION ENDS HERE, ACTUAL PROGRAM BEGINS BEYOND //////
/////////////////////////////////////////////////////////////////////

////// BUILD AN ARRAY AND FILL IT WITH A DECK OF CARDS //////
function createDeck(){      // Bouw deck
    $deck = new Array();
    for (var i = 0 ; i < $values.length; i++){
        for(var x = 0; x < $suits.length; x++){
            var weight = parseInt($values[i]);
            if ($values[i] == "J" || $values[i] == "Q" || $values[i] == "K"){
                weight = 10;
            }
            if ($values[i] == "A"){
                weight = 11;
            }
            var card = { Value: $values[i], Suit: $suits[x], Weight: weight };
            $deck.push(card);
        }
    }
}

////// SHUFFLE POSITIONS OF CARDS IN ARRAY //////
function shuffle(){
    // for 1000 turns
    // switch the values of two random cards
    for (var i = 0; i < 1000; i++){
        var location1 = Math.floor((Math.random() * $deck.length));
        var location2 = Math.floor((Math.random() * $deck.length));
        var tmp = $deck[location1];

        $deck[location1] = $deck[location2];
        $deck[location2] = tmp;
    }
}

////// DEAL STARTING CARDS //////
function deal(){
    createDeck();
    shuffle();
    // Deduct round cost
    $credits -= 5;
    // Print credits
    document.getElementById("creditDisplay").innerHTML = ($credits + " credits");
    // Give 2 cards to dealer/player and print results
    for (var i = 0; i <= 1; i++){

        // Dealer segment (also counts weight of cards)
        $dealercards.push($deck.shift());
        document.getElementById(String('dealercard' + i)).src
        = String("media/cards/" + $dealercards[i].Value + $dealercards[i].Suit + ".jpg");
        $dealerWeight += $dealercards[i].Weight;
        document.getElementById("dealerWeight").innerHTML = ($dealerWeight);

        // Player segment (also counts weight of cards)
        $playercards.push($deck.shift());
        document.getElementById(String('playercard' + i)).src
        = String("media/cards/" + $playercards[i].Value + $playercards[i].Suit + ".jpg");
        $playerWeight += $playercards[i].Weight;
        document.getElementById("playerWeight").innerHTML = ($playerWeight);
    }
    // probably not needed yet but kept just in case
    acesTest();
    // Test for a 21
    blackjackTest();
    // Outline button after use
    document.getElementById("btnDeal").classList.remove = 'btn-outline';
    document.getElementById("btnDeal").classList.add = 'btn-outline-primary';

}

////// PLAYER CALLS FOR ADDITIONAL CARD //////
function call(){
    // If the player hasnt passed 21, give another card
    if ($playerWeight < 21){
        $called = true;
        // Push card into player deck and adjust player weight
        $playercards.push($deck.shift());
        var playerDeckSize = Number($playercards.length) -1;
        $playerWeight += $playercards[playerDeckSize].Weight;
        document.getElementById(String('playercard' + playerDeckSize)).src
        = String('media/cards/' + $playercards[playerDeckSize].Value + $playercards[playerDeckSize].Suit + '.jpg');
        document.getElementById("playerWeight").innerHTML = ($playerWeight);
        // Test for a 21
        blackjackTest();
    }
}

////// SIMILAR TO CALL BUT HIGHER STAKES/REWARDS //////
function magnumDongMode(){
    $credits -= 5; // Deduce cost from player credits
    $doubleDown = true;
    if ($called == false){
        call();
    }
}

////// LET DEALER DRAW HIS CARDS //////
function pass(){ // Very similar to call()
    while (($dealerWeight <= 17 || $dealerWeight < playerWeight) && $dealerWeight <= 21){
        $dealercards.push($deck.shift());
        var dealerDeckSize = Number($dealercards.length) -1;
        $dealerWeight += $dealercards[dealerDeckSize].Weight;
        document.getElementById(String('dealercard' + dealerDeckSize)).src
        = String('media/cards/' + $dealercards[dealerDeckSize].Value + $dealercards[dealerDeckSize].Suit + '.jpg');
        document.getElementById("dealerWeight").innerHTML = ($dealerWeight);
        // Test for 21
        blackjackTest();
    }
    wintest();
}

////// CHECK FOR 21 //////
function blackjackTest(){
    if ($playerWeight == 21){
        document.getElementById("playerWeight").innerHTML = 'Blackjack!';
    }
    if ($dealerWeight == 21){
        document.getElementById("dealerWeight").innerHTML = 'Blackjack!';
    }
}

////// SOFTEN ANY ACES IN THE DECKS //////
function acesTest(){
    if ($playerWeight >= 22){
        for (var i = 0; i <= $playercards.length; i++){
            if ($playercards[i].Value == "A"){
                $playercards[i].Weight = 1;
                $playerWeight -= 10;
            }
        }
    }
    if ($dealerWeight >= 22){
        for (var i = 0; i <= $dealercards.length; i++){
            if ($dealercards[i].Value == "A"){
                $dealercards[i].Weight = 1;
                $dealerWeight -= 10;
            }
        }
    }
}

////// VICTORY OR DEATH //////
function wintest(){
    if ($dealerWeight == $playerWeight){ // In case of a draw
        if ($doubleDown == true){
            $credits += 10;
        } else {
            $credits += 5;
        }
        document.getElementById("playerWeight").innerHTML = 'Its a draw'
    } else if ((($dealerWeight < $playerWeight) || ($dealerWeight >= 22)) && ($playerWeight <= 21)){ // In case of win or dealer overdraw
        if ($doubleDown == true){
            $credits += 20;
        } else {
            $credits += 10;
        }
        document.getElementById("playerWeight").innerHTML = 'You won this round';
    } else if ($dealerWeight > $playerWeight){ // In case of loss
        if ($credits < 5){
            document.getElementById("playerWeight").innerHTML = 'Game over';
        } else {
            document.getElementById("playerWeight").innerHTML = 'You lost this round';
        }
    }
}

////// CLEANS UP AND STARTS NEXT ROUND //////
function nextRound(){
    // Clear console in case something has been logged
    console.clear();

    // Reset variables
    $dealercards = [];
    $playercards = [];
    $doubleDown = false;
    $called = false;
    $passed = false;
    $playerWeight = 0;
    $dealerWeight = 0;

    // Set cards on field back to gray
    for (var i = 0; i < 8; i++) {
        document.getElementById(String('dealercard' + i)).src = String("media/cards/Gray_back.jpg");
        document.getElementById(String('playercard' + i)).src = String("media/cards/Gray_back.jpg");
    }
    document.getElementById("creditDisplay").innerHTML = ($credits + " credits");
}
