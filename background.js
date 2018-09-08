var header;
var canvas;

var width;
var height;
var color = "rgb(20, 180, 185)";

var board;
var points = [];
var lines = [];

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

	this.equals = function(p){
		return this.x == p.x && this.y == p.y && this.speed == p.speed && this.direction == p.direction && this.radius == p.radius;
	}

}

//returns true if the line already exists in lines
function lineExists(p1, p2){	
	for(var i = 0; i < lines.length; i++){
		if(p1.equals(lines[i].p1) && p2.equals(lines[i].p2))
			return true;
		if(p1.equals(lines[i].p2) && p2.equals(lines[i].p1))
			return true;
	}
	return false;
}

function Line(p1, p2){
	this.p1 = p1;
	this.p2 = p2;
	this.alpha = 0;
	this.aDelta = .02;
	this.connected = false;

	this.draw = function(){
		board.strokeStyle = "rgba(20, 180, 185, " + this.alpha + ")";
		board.beginPath();
		board.moveTo(this.p1.x, this.p1.y);
		board.lineTo(this.p2.x, this.p2.y);
		board.stroke();
	}

	this.update = function(){
		if(this.connected && dist(this.p1, this.p2) > 200)
			this.connected = false;
		if(!this.connected && dist(this.p1, this.p2) <= 100)
			this.connected = true;

		if(this.connected && this.alpha < .5)
			this.alpha += this.aDelta;
		if(!this.connected && this.alpha > 0)
			this.alpha -= this.aDelta;
	}
}

function dist(p1, p2){
	return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2))
}

function update(){

	//update ball pos
	for(var i = 0; i < points.length; i++){
		if(!points[i].update()){
			//out of bounds
			points.splice(i--, 1);
		}
	}

	//too few points
	while(points.length < calcNumPoints()){
		var p = new Point();
		points.push(p);
		for(var i = 0; i < points.length-1; i++)
			lines.push(new Line(p, points[i]));
	}

	//remove lines
	for(var i = 0; i < lines.length; i++)
		if((lines[i].p1.y < 0 || lines[i].p1.y > height || lines[i].p1.x < 0 || lines[i].p1.x > width) || (lines[i].p2.y < 0 || lines[i].p2.y > height || lines[i].p2.x < 0 || lines[i].p2.x > width))
			lines.splice(i--, 1);

	//draw points
	board.clearRect(0, 0, width, height);
	for(var i = 0; i < points.length; i++)
		points[i].draw();
	//update and draw lines
	for(var i = 0; i < lines.length; i++){
		lines[i].update();
		lines[i].draw();
	}

}
