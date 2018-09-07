//stores the pixel height location of each section in the order they appear
var section_locations = [];

function init(){
	setSectionLocations();
	setBarWidths();
	startBackground();
}

/* Called onload and on resize.
Sets variables to store the pixel locations of different sections.
Calls styleChange to change the style if we scrolled into a new section */
function setSectionLocations(){
	section_locations = [];

	//first get the header height
	var height = document.getElementsByTagName("header")[0].offsetHeight;

	//loop through each section
	var sections = document.getElementsByTagName("section");
	for(var i = 0; i < sections.length; i++){
		section_locations.push(height);
		height += sections[i].offsetHeight;
	}
	//footer
	section_locations.push(height);

	//change the style
	styleChange();
}

function styleChange(){
	//get scroll position
	var scroll = document.getElementsByTagName("html")[0].scrollTop;
	//get nav bar
	var nav = document.getElementsByTagName("nav")[0];

	//remove display of nav if it's over the main title
	var title = document.getElementById("title-block");
	if(scroll >= title.offsetTop && scroll < section_locations[0]){
		nav.style.visibility = "hidden";
		nav.style.opacity = "0";
	}
	else{
		nav.style.visibility = "visible";
		nav.style.opacity = "1";
	}

	//set background of nav
	if(scroll >= section_locations[0])
		nav.style.backgroundColor = "#333";
	else
		nav.style.backgroundColor = "rgba(0,0,0,0)";

	//highlight current section on nav
	var links = nav.getElementsByTagName("a");
	for(var i = 0; i < section_locations.length-1; i++){
		if(scroll >= section_locations[i] && scroll < section_locations[i+1])
			links[i].className = "selected";
		else
			links[i].className = "";
	}

}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

//Scroll to the destination over the corse of duration (ms)
async function smoothScroll(dest, duration){
	var target = section_locations[dest];
	var scroll = document.getElementsByTagName("html")[0].scrollTop;
	var delta = (target - scroll) / (duration / 5);

	for(var i = 0; i < duration / 5; i++){
		scroll += delta;
		window.scrollTo(0, scroll);
		await sleep(5);
	}
	window.scrollTo(0, section_locations[dest]);
}

//open a new tab with the resume
function downloadResume(){
	link = document.createElement("a");
	link.setAttribute("href", "Resume.pdf");
	link.setAttribute("target", "_blank");
	link.click();
}

//sets the width of the percents in the skills table
function setBarWidths(){
	rows = document.getElementsByClassName("percent");
	for(var i = 0; i < rows.length; i++){
		rows[i].style.width = "" + rows[i].innerHTML;
	}
}


