/*
document.addEventListener('DOMContentLoaded', function(){
	document.querySelector('button').addEventListener('click', onclick, false)
	
	function onclick(){
		chrome.tabs.query({currentWindow: true, active: true},
		function(tabs){
			chrome.tabs.sendMessage(tabs[0].id, 'hi')
		})
	}
}, false)
*/

var cardBack = "../images/card_back.png";
var cardSolved = "../images/card_solved.png";
//global variable to hold the current deck
var deck = [];
//global variable to hold flipped cards
var flippedCards = [];
//global variable to hold solved cards
var solvedCards = [];

//On the window load, set the deck of cards
$(document).ready(function(){
	deck = getDeck();
	
	var cardsDisplay = document.getElementById('cardsDisplay');
	
	for(var i = 0; i < deck.length; i++){
		var card = deck[i];
		
		var img = document.createElement('img');
		var cardId = "card-" + i;
		img.setAttribute('id', cardId);
		img.setAttribute('class', 'card');
		img.setAttribute('src', card.back);
		img.setAttribute('width', 64);
		img.setAttribute('height', 89);
		
		/*img.onclick = function(){
			alert(`Card ${cardId} clicked!`);
			img.setAttribute('src', card.front);
		};*/
		
		//add the card image to the display
		cardsDisplay.appendChild(img);
	}
	
	//if a card is clicked, flip it and check the game status
	/*$('.card').on('click', function(){
		alert("card clicked");
	});*/
	$(document.body).on('click', '.card', function(e){
		//alert(JSON.stringify($(this)));
		
		var elem = e.target;
		
		//alert(e.target.id);
		//get index of card by splitting string
		var index = elem.id.split("-")[1];
		
		//alert(elem.src);
		//elem.src example: chrome-extension://fcfladmhcmemloiajnoigdccnoikjjlj/images/card_back.png
		//var elementStringArray = elem.src.split("/");
		//var elementImageUrl = "../" + elementStringArray[elementStringArray.length - 2] + "/" + elementStringArray[elementStringArray.length-1];
		var elementImageUrl = extractSrc(elem.src);
		//alert(elementImageUrl);
		
		//if the card is faceDown, flip it up
		if(elementImageUrl == cardBack && flippedCards.length < 2){
			elem.src = deck[index].front;
			
			//add the element to the flippedCards variable
			flippedCards.push(elem);
		}
		checkGame();
	});
});

function getDeck(){
	var cards = [
		{
			"back": cardBack,
			"front": "../images/cards/2C.png",
			"solved": cardSolved,
		},
		{
			"back": cardBack,
			"front": "../images/cards/4D.png",
			"solved": cardSolved,
		},
		{
			"back": cardBack,
			"front": "../images/cards/AH.png",
			"solved": cardSolved,
		},
		{
			"back": cardBack,
			"front": "../images/cards/10S.png",
			"solved": cardSolved,
		}
	];
	
	var deck = [];
	/*cards.forEach((card) =>{
		//push two of each card into the deck
		deck.push(card);
		deck.push(card);
	});*/
	for (var i = 0; i< cards.length; i++){
		deck.push(cards[i]);
		deck.push(cards[i]);
	}
	
	//rearrange the deck
	deck = shuffle(deck);
	
	return deck
}

//rearrange the deck
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

//check the state of the game to see what cards are faceup
function checkGame(){
	//if the user has revealed 2 cards
	if (flippedCards.length >= 2){
		//alert(flippedCards[0].src);
		
		//show the cards for one second
		setTimeout(function(){
			//if the cards match
			if (flippedCards[0].src == flippedCards[1].src){
				
				//set both cards to solved states
				flippedCards[0].src = cardSolved;
				flippedCards[1].src = cardSolved;
				
				//add both cards to the array of solved cards;
				solvedCards.push(flippedCards[0]);
				solvedCards.push(flippedCards[1]);
				
				//if all cards are solved, move to solved page
				if (solvedCards.length == deck.length){
					window.location.href = "solved.html";
				}
			}
			else{
				var displayedCards = document.getElementsByClassName("card");
				for (var i=0; i<displayedCards.length; i++){
					var currentSrc = extractSrc(displayedCards[i].src);
					//if the cards are flipped face up
					if (currentSrc != cardBack && currentSrc != cardSolved){
						displayedCards[i].src = cardBack;
					}
				}
			}
			
			//clear flippedCards array
			flippedCards = [];
		}, 500);
	}
}

//ensure that the source url only gets the last few values
function extractSrc(src){
	var elementStringArray = src.split("/");
	var elementImageUrl = "../" + elementStringArray[elementStringArray.length - 2] + "/" + elementStringArray[elementStringArray.length-1];
	
	return elementImageUrl;
}