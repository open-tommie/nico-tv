// Setup basic express server
var util = require('util');
var log4js = require('log4js');
log4js.configure({
  appenders: [
    { type: 'console' },
    { type: 'file', filename: 'logs/log1.log', category: 'log1' }
  ]
});
var logger = log4js.getLogger("log1");
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 8000;

function _debug() {
	// xxx もっと良い方法があるはず
	switch ( arguments.length) {
	case 1:
		logger.debug( arguments[0]);
		break;
	case 2:
		logger.debug( arguments[0], arguments[1]);
		break;
	case 3:
		logger.debug( arguments[0], arguments[1], arguments[ 2]);
		break;
	}
}
function _error( msg) {
	switch ( arguments.length) {
	case 1:
		logger.error( arguments[0]);
		break;
	case 2:
		logger.error( arguments[0], arguments[1]);
		break;
	case 3:
		logger.error( arguments[0], arguments[1], arguments[ 2]);
		break;
	}
}
function _debug_ip( msg, socket) {
  var address = socket.handshake.address;
  _debug( "ip="+address.address+", "+msg);
  //_debug( "ip="+address.address+":"+address.port+", "+msg);
}

_debug( "---------------------------------------------------------------");
_debug( "main start");

server.listen(port, function () {
  _debug('port=%d', port);
});

// Routing
app.use(express.static(__dirname + '/public'));

// Chatroom

// usernames which are currently connected to the chat
var usernames = {};
var usrIP = [];
var numUsers = 0;

function currentTimeStr() {
	// current time
	var DD = new Date();
	var hour = DD.getHours();
	hour = ("0"+hour).slice(-2)
	var min = DD.getMinutes();
	min = ("0"+min).slice(-2)
	var sec = DD.getSeconds();
	sec = ("0"+sec).slice(-2)
	return hour + ":" + min + ":" + sec;
}

io.on('connection', function (socket) {
  _debug_ip( "connect", socket);
  var addedUser = false;

  // when the client emits 'new message', this listens and executes
  socket.on('new message', function (data) {
    _debug_ip( "message='"+data+"'", socket);
    // we tell the client to execute 'new message'

    io.sockets.emit('new message', {
      username: socket.username,
      message: data,
      time: currentTimeStr()
    });
  });

  // when the client emits 'add user', this listens and executes
  socket.on('add user', function (username) {
    _debug_ip( "add user", socket);
    // we store the username in the socket session for this client
    socket.username = username;
    // add the client's username to the global list
    usernames[username] = username;
    ++numUsers;
    _debug( "totalUser="+numUsers);
    addedUser = true;
 
    socket.emit('login', {
      numUsers: numUsers,
      username: socket.username,
      message: "*** 暗黒TVへ、ようこそ! ***",
      time: currentTimeStr()
    });
    // echo globally (all clients) that a person has connected
    socket.broadcast.emit('user joined', {
      username: socket.username,
      numUsers: numUsers
    });
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', function () {
    _debug_ip( "disconnect", socket);
    // remove the username from global usernames list
    if (addedUser) {
      delete usernames[socket.username];
      --numUsers;
      _debug( "totalUser="+numUsers);

      // echo globally that this client has left
      socket.broadcast.emit('user left', {
        username: socket.username,
        numUsers: numUsers
      });
    }
  });
});
_debug("main end");

