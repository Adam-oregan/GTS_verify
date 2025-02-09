console.log("The extension is up and running");

const FILE = chrome.runtime.getURL('compatibility.csv');

fetch(FILE).then(response => response.text()).then(data => {
	//------------------------------------------------
	// creating the array
    var csvArrays = ( data.split("\n") ).map(line => line.slice(0,-1).split(","));
	
	var pokeballs = csvArrays[0].slice(2);
	
	var allPkmn = {};
	
	for(x=1; x < csvArrays.length; x++){
		var ASSIGN_TO_AllPkmn = {};
		
		var currentROW = csvArrays[x]
		
		var nameInRow  = currentROW[1];
		var lvValues   = currentROW.slice(2);
		
		pokeballs.forEach((key, index) => {
		  ASSIGN_TO_AllPkmn[key] = lvValues[index];
		});
		
		allPkmn[nameInRow] = ASSIGN_TO_AllPkmn;
	}

	//------------------------------------------------
	//parsing the table

	let pokemonToTrade = document.getElementsByClassName("gtsOffer");

	for(x = 0; x < pokemonToTrade.length; x++){
		var testPkmn = pokemonToTrade[x];
		
		var list = E(testPkmn, "li");
		
		var pkmnImg  = E(list[0], "img")[0];
		var pkmnNum  = pkmnImg.src; // parse to just image name
		var pkmnName = pkmnImg.alt;
		
		var pokeball = (E(list[1], "img")[0]).alt;
		
		var lvtext = (list[1].innerText).slice(5);
		var num = lvtext.indexOf(" ");
		var actualLV = parseInt(((num > 0) ? lvtext.slice(0, num) : lvtext));
		
		/////////////////////////////
		// legality test
		
		var legit = true;
		
		minLV = allPkmn[pkmnName][pokeball];
		
		if(minLV == "XXX") legit = false;
		else legit = !(minLV > actualLV);
		
		if(!legit) console.log(pkmnName + " is FAKE! \n" + actualLV + " is LESS than " + minLV);
		
		//////////////////////////////////////
		// print result on page
		
		var resultCell = E( ( E(testPkmn, "tr")[2] ), "td" )[1];
		resultCell.innerText = legit.toString().toUpperCase();
		
		var rcs = S(resultCell);
		
		rcs.backgroundColor = legit ? "green" : "red" ;
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

accounting for shiny lock

accounting for wiimmfi events
lv 80 arceus

account for cases where min level was reduced in gen v
*/