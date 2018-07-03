//stores the pixel height location of each section in the order they appear
var section_locations = [];

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
	if(scroll >= title.offsetTop && scroll < section_locations[0])
		nav.style.display = "none";
	else
		nav.style.display = "block";

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
	if(scroll >= section_locations[section_locations.length-1])
			links[section_locations.length-1].className = "selected";
		else
			links[section_locations.length-1].className = "";
}