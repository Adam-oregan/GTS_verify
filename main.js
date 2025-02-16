console.log("The extension is up and running");

let mode = "Gen V";

let address = (mode == "Gen V") ? 'compatibility_GenV.csv' : 'compatibility_GenIV.csv';

const FILE = chrome.runtime.getURL(address);

let allPkmn = {};

'use strict'
fetch(FILE).then(response => response.text()).then(data => {
	//------------------------------------------------
	// creating the array
    var csvArrays = ( data.split("\n") ).map(line => line.slice(0,-1).split(","));
	
	var pokeballs = csvArrays[0].slice(2);
	
	for(var x=1; x < csvArrays.length; x++){
		var ASSIGN_TO_allPkmn = {};
		
		var currentROW = csvArrays[x];
		
		var nameInRow  = currentROW[1];
		var lvValues   = currentROW.slice(2);
		
		pokeballs.forEach((key, index) => {
		  ASSIGN_TO_allPkmn[key] = lvValues[index];
		});
		
		allPkmn[nameInRow] = ASSIGN_TO_allPkmn;
	}

	//------------------------------------------------
	//parsing the table

	let pokemonToTrade = document.getElementsByClassName("gtsOffer");

	for(var x=0; x < pokemonToTrade.length; x++){
		var pkmnToTest = pokemonToTrade[x];
		
		var list = E(pkmnToTest, "li");
		
		var pkmnImg  = E(list[0], "img")[0];
		var pkmnNum  = pkmnImg.src; // parse to just image name
		var pkmnName = pkmnImg.alt;
		
		var pokeball = (E(list[1], "img")[0]).alt;
		
		var lvtext = (list[1].innerText).slice(5);
		var num = lvtext.indexOf(" ");
		var actualLV = parseInt(((num > 0) ? lvtext.slice(0, num) : lvtext));
		
		/////////////////////////////
		// legality test
		
		var isLegit = true;
		
		let minLV = allPkmn[pkmnName][pokeball];
		
		if(minLV == "XXX") 	isLegit = false;
		else 				isLegit = !(actualLV < minLV);
		
		if(!isLegit) console.log(pkmnName + " is FAKE! \n" + actualLV + " is LESS than " + minLV);
		
		//////////////////////////////////////
		// print result on page
		
		var resultCell = (E( (E(pkmnToTest, "tr")[2]), "td" ))[1];
		resultCell.innerText = isLegit.toString().toUpperCase();
		
		var rcs = S(resultCell);
		
		rcs.backgroundColor = isLegit ? "green" : "red" ;
		rcs.color 			= "white";
		rcs.textAlign 		= "center";
	}

})
  .catch(error => console.error("An error occurred:", error));


function E(object, i){ return object.getElementsByTagName(i); }

function S(i){ return i.style; }

/*
data we have

pkmnName & pkmnNum

pokeball

actualLV

--------------------------

https://www.serebii.net/games/pokeball.shtml

POSSIBLE updates

whether the asked pokemon is possible
(when lv 1-9 -> check if <= lv9 possible

accounting for shiny lock

accounting for wiimmfi events
lv 80 arceus

account for cases where min level was reduced in gen v

abilities
*/

/*
Amendments to source data

starly - safari ball  xxx to lv 20

feraligatr - wrong evo level?
poke 36 -> 30 , rest 36 -> 31
*/