//Holt alles aus was mit express anfängt.
//Hole also die express() Funktion.
var express = require('express');

//Diese Funktion erstellt eine App.
var app = express();
var server = app.listen(3000);

//Erlaubt im Ordner public alle statischen Dateien zu hosten,
//sprich es werden dem Benutzer die Dateien aus dem Ordner angezeigt.
app.use(express.static('public'));

console.log("My socket server is running!");

var socket = require('socket.io');

var io = socket(server);

//Betrachtet die Ankunft von Nachrichten auf allen Sockets.
io.sockets.on('connection', newConnection);

function newConnection(socket) {
	console.log('new connection: ' + socket.id);
	socket.on('mouse', mouseMsg);
	function mouseMsg(data) {
		socket.broadcast.emit('mouse', data);
		console.log(data);
	}
}