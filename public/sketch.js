var images = document.getElementsByClassName("popular_image_item");

var imgCanvas = document.getElementById("imgCanvas");
var cv_context = imgCanvas.getContext("2d");

for (var i=0; i < images.length; i++) {
	images[i].addEventListener("click", function() {
		var width = this.width;
		var height = this.height;
		imgCanvas.setAttribute("style", "display: initial;");
		imgCanvas.setAttribute("width", width);
		imgCanvas.setAttribute("height", height);
		cv_context.drawImage(this, 0, 0, width, height);
	});
}


// Keep everything in anonymous function, called on window load.
if(window.addEventListener) {
	window.addEventListener('load', function () {
		var canvas, context, tool, socket;
		
		socket = io.connect('http://localhost:3000');
		
		console.log('check 1', socket.connected);
		socket.on('connect', function() {
			console.log('check 2', socket.connected);
		});

  // Initialization sequence.
  function init () {
    // Find the canvas element.
    canvas = document.getElementById('drawCanvas');

    var container = document.getElementsByClassName("container")[2];
    var width = 1140;
    var height = images[0].height * 2;
    console.log(width, height);
    canvas.setAttribute("width", width);
    canvas.setAttribute("height", height);

    getCaddEL(canvas);
    //window.addEventListener("resize", resizeCanvas, false);
    //Creates an instance of the tool pencil.
    tool = new tool_pencil();
    
    
}
function getCaddEL(canvas) {
	if (!canvas) {
    	alert('Error: I cannot find the canvas element!');
    	return;
    }

    if (!canvas.getContext) {
    	alert('Error: no canvas.getContext!');
    	return;
    }

    // Get the 2D canvas context.
    context = canvas.getContext('2d');
    if (!context) {
    	alert('Error: failed to getContext!');
    	return;
    }

	// Attach the mousedown, mousemove and mouseup event handler.
	canvas.addEventListener('mousedown', ev_canvas, false);
	canvas.addEventListener('mousemove', ev_canvas, false);
	canvas.addEventListener('mouseup', ev_canvas, false);
}

function removeEL(canvas) {
	// Remove the mousedown, mousemove and mouseup event handler.
	canvas.removeEventListener('mousedown', ev_canvas, false);
	canvas.removeEventListener('mousemove', ev_canvas, false);
	canvas.removeEventListener('mouseup', ev_canvas, false);
}

function resizeCanvas() {

	if ((canvas.width < container.offsetWidth) || canvas.width > container.offsetWidth) {
		var ctx;
		const newCanvas = document.createElement("canvas");
		newCanvas.setAttribute("id", "drawCanvas");
		newCanvas.setAttribute("width", container.offsetWidth);
		newCanvas.setAttribute("height", canvas.height);
		ctx = newCanvas.getContext("2d");



		ctx.drawImage(canvas, 0, 0);

		ctx.imageSmoothingEnabled = false;
		context.imageSmoothingEnabled = false;

		removeEL(canvas);

		$("#drawCanvas").remove();
		$("#imgCanvas").before(newCanvas);

		canvas = document.getElementById('drawCanvas');
		getCaddEL(canvas);

}
}

socket.on('mouse', newMousemove);

function newMousemove(data) {

	context.lineTo(data.x, data.y);
	context.stroke();
}

function tool_pencil() {
	var tool = this;
	this.started = false;


//This is called when you hold down your mouse button.
//It starts the pencil drawing.
this.mousedown = function (ev) {
	context.beginPath();
	context.moveTo(ev._x, ev._y);
	tool.started = true;
};

	//This function is called every time you move your mouse.
	//It only draws, when the tool is started(when holding down the mouse button).
	this.mousemove = function (ev) {

		if (tool.started) {

			//data ist ein Object, x und y sind keys/properties.
			var data = {x:ev._x, y:ev._y};
			context.lineTo(ev._x, ev._y);
			context.stroke();
			console.log(ev._x + ',' + ev._y);
			socket.emit('mouse', data);
		}
	};

	this.mouseup = function (ev) {
		if (tool.started) {
			tool.mousemove(ev);
			tool.started = false;
		}
	};
}


function ev_canvas (ev) {

    // Get the mouse position relative to the canvas element.
    if (ev.layerX || ev.layerX == 0) { // Firefox
    	ev._x = ev.layerX;
    	ev._y = ev.layerY;
    } else if (ev.offsetX || ev.offsetX == 0) { // Opera
    	ev._x = ev.offsetX;
    	ev._y = ev.offsetY;
    }

    // The event handler works like a drawing pencil which tracks the mouse 
    // movements. We start drawing a path made up of lines.
    var func = tool[ev.type];
    if (func) {
    	func(ev);
    }
}

init();
}, false); }

// vim:set spell spl=en fo=wan1croql tw=80 ts=2 sw=2 sts=2 sta et ai cin fenc=utf-8 ff=unix:




