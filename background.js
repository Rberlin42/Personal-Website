var header;
var canvas;

var width;
var height;
const MAX_DIST = 100;
var color = "rgb(20, 180, 185)";
var lineColor = "rgba(20, 180, 185, .5)";

var board;
var points = [];

function startBackground(){
	header = document.getElementsByTagName("header")[0];
	canvas = document.getElementById("background");

	width = header.offsetWidth;
	height = header.offsetHeight;

	//initialize 
	canvas.width = width;
	canvas.height = height;
	board = canvas.getContext("2d");
	setInterval(update, 25);
}

function calcNumPoints(){
	return width*height/7500;
}

function Point(){
	this.x = Math.random()*width;
	this.y = Math.random()*height;
	this.speed = Math.random()/4;
	this.direction = Math.random()*2*Math.PI;
	this.radius = Math.random()*3;

	this.draw = function(){
		board.fillStyle = color;
		board.strokeStyle = color;
		board.beginPath();
		board.arc(this.x, this.y, this.radius, 0, 2*Math.PI);
		board.stroke();
		board.fill();
	}

	//updates position and returns false if out of bounds
	this.update = function(){
		this.y -= this.speed*Math.sin(this.direction);
		this.x += this.speed*Math.cos(this.direction);

		if(this.y < 0 || this.y > height || this.x < 0 || this.x > width)
			return false;
		return true;
	}
}

function dist(p1, p2){
	return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2))
}

function drawLine(p1, p2){
	board.fillStyle = color;
	board.strokeStyle = lineColor;
	board.beginPath();
	board.moveTo(p1.x, p1.y);
	board.lineTo(p2.x, p2.y);
	board.stroke();
}

function drawNet(){
	//loop through all pairs
	for(var i = 0; i < points.length-1; i++){
		for(var j = i+1; j < points.length; j++){
			var p1 = points[i];
			var p2 = points[j];

			//check if we are close enough
			if(dist(p1, p2) <= MAX_DIST){
				drawLine(p1, p2);
			}
		}
	}
}


function update(){
	var width = header.offsetWidth;
	var height = header.offsetHeight;
	canvas.width = width;
	canvas.height = height;
	var board = canvas.getContext("2d");

	//update ball pos
	for(var i = 0; i < points.length; i++){
		if(!points[i].update()){
			//out of bounds
			points.splice(i--, 1);
		}
	}

	//too few points
	while(points.length < calcNumPoints()){
		points.push(new Point());
	}

	//draw
	board.clearRect(0, 0, width, height);
	for(var i = 0; i < points.length; i++){
		points[i].draw();
	}

	//draw network
	drawNet();
}
