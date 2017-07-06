//express server

//including all of the modules and variables 
var express = require('express'); //express
var app = express();
var server = require('http').createServer(app); //pass the app variable
var io = require('socket.io').listen(server); //socket.io pass the server variable

//two arrays needed
users = [];
connections = [];

//run the server and console log it to make sure it's working. 
server.listen(process.env.PORT || 3000);
console.log ('server running...');

app.use(express.static("public"))

//create a route that will run a function, responding by sending a file passing the index.html
app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

//open a connection with socket.io
io.sockets.on('connection', function(socket){
	connections.push(socket);
	console.log('Connected: %s sockets connected', connections.length);

	//Disconnect, so when a user disconnects, this will tell us how many are still connected.
	socket.on('disconnect', function(data){
		users.splice(users.indexOf(socket.username), 1);
		updateUsernames();
	connections.splice(connections.indexOf(socket), 1);
	console.log('Disconnected: %s sockets connected', connections.length);	
	});
	
	//Send message
	socket.on('send message', function(data){
		console.log(data);
		io.sockets.emit('new message', {msg: data, user: socket.username});
	});

	//New user
	socket.on('new user', function(data, callback){
		callback(true);
		socket.username = data;
		users.push(socket.username);
		updateUsernames();
	});

	function updateUsernames(){
		io.sockets.emit('get users', users);
	}

});



