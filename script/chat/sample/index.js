//
//	nico-tv server
//	by @tommie_nico
//	This code is based on XXXX
//
//	Copyright (c) 2014 @tommie_nico
//  $Id: index.js 2014-07-20 02:28:42+09:00 tommie $
//
var util = require('util');
var log4js = require('log4js');
log4js.configure({
	appenders: [
		{
			type: 'console'
		}, {
			type    : 'file',
			filename: 'logs/log1.log',
			category: 'log1'
		}
	]
});
var logger = log4js.getLogger("log1");
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io') (server);
var port = process.env.PORT || 8000;

function _debug() {
	// xxx もっと良い方法があるはず
	switch (arguments.length) {
	case 1:
		logger.debug(arguments[0]);
		break;
	case 2:
		logger.debug(arguments[0], arguments[1]);
		break;
	case 3:
		logger.debug(arguments[0], arguments[1], arguments[2]);
		break;
	}
}
function _error(msg) {
	switch (arguments.length) {
	case 1:
		logger.error(arguments[0]);
		break;
	case 2:
		logger.error(arguments[0], arguments[1]);
		break;
	case 3:
		logger.error(arguments[0], arguments[1], arguments[2]);
		break;
	}
}
function _debug_ip(msg, socket) {
	var address = socket.handshake.address;
	_debug("ip=" + address.address + ", " + msg);
	//_debug( "ip="+address.address+":"+address.port+", "+msg);
}

_debug("---------------------------------------------------------------");
_debug("main start");
_debug("Id=$Id: index.js 2014-07-20 02:28:42+09:00 tommie $");

try {
	server.listen(port, function() {
		_debug('port=%d', port);
	});
}
catch(e) {
	_debug( "ERROR e="+e);
	_debug( e.stack);
}

// Routing
app.use(express.static(__dirname + '/public'));

// Chatroom

// usernames which are currently connected to the chat
var usernames = {};
var usrIP = [];
var numUsers = 0;
var g_timer1 = 0;

function currentTimeStr() {
	// current time
	var DD = new Date();
	var hour = DD.getHours();
	hour = ("0" + hour).slice(-2)
	var min = DD.getMinutes();
	min  = ("0" + min).slice(-2)
	var sec = DD.getSeconds();
	sec  = ("0" + sec).slice(-2)
	return hour + ":" + min + ":" + sec;
}

io.on('connection', function(socket) {
	_debug_ip("connect", socket);
	var addedUser = false;

	// when the client emits 'new message', this listens and executes
	socket.on('new message', function(data) {
		_debug_ip("message='" + data + "'", socket);
		// we tell the client to execute 'new message'

		io.sockets.emit('new message', {
			username: socket.username,
			message : data,
			time    : currentTimeStr()
		});
	});

	function getCurrentTime() {
		var duration = 60*20; // [sec], video duration
		var diff = (new Date()).getTime() % (duration*1000|0);
//		_debug( "diff="+diff);
		var currentTime = diff/1000;	//sec
//		_debug( "currentTime="+currentTime);
		return currentTime;
	}
	function emitPlay( socket, p_url) {
//		_debug( "p_url="+p_url);
		socket.emit('play', {
			url		: p_url,
			time	: getCurrentTime()
		});
	
	}
	function broadcastPlay( socket, p_url) {
//		_debug( "broadcastPlay() p_url="+p_url);
		io.sockets.emit('play', {
			url		: p_url,
			time	: getCurrentTime()
		});
//d		emitPlay( socket, p_url);
	
	}
	// when the client emits 'add user', this listens and executes
	socket.on('add user', function(username) {
		_debug_ip("add user", socket);
		// we store the username in the socket session for this client
		socket.username     = username;
		// add the client's username to the global list
		usernames[username] = username;
		++numUsers;
		_debug("totalUser=" + numUsers);
		addedUser           = true;

		socket.emit('login', {
			numUsers: numUsers,
			username: socket.username,
			message : 
				"\n"+
				"**********************\n"+
				"暗黒TVへ、ようこそ!\n" +
				"server=$Id: index.js 2014-07-20 02:28:42+09:00 tommie $\n"+
				"**********************\n",
			time    : currentTimeStr()
		});

		emitPlay( socket, "http://podcast.tommie2.info/movie/watch-1404825242.mp4");
		
		// echo globally (all clients) that a person has connected
		socket.broadcast.emit('user joined', {
			username: socket.username,
			numUsers: numUsers
		});
	});

	// when the user disconnects.. perform this
	socket.on('disconnect', function() {
		_debug_ip("disconnect", socket);
		// remove the username from global usernames list
		if (addedUser) {
			delete usernames[socket.username];
			--numUsers;
			_debug("totalUser=" + numUsers);

			// echo globally that this client has left
			socket.broadcast.emit('user left', {
				username: socket.username,
				numUsers: numUsers
			});
		}
	});

	var videoCount = 0;
	clearInterval( g_timer1);
	g_timer1 = setInterval( function() {
		videoCount++;
//		_debug( "videoCount="+videoCount);
		if ( (videoCount % 2) == 0) {
			broadcastPlay( socket, "http://podcast.tommie2.info/movie/watch-sm23320645.mp4");
		} else {
			broadcastPlay( socket, "http://podcast.tommie2.info/movie/watch-1404825242.mp4");
		}
	}, 5000);
});
_debug("main end");
