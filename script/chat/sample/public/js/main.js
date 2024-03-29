//
//	noco-tv client main
//	by @tommie_nico
//	this code is based on XXXX
//	$Id: public/js/main.js 2014-07-20 03:11:26+09:00 tommie $

$(function() {
	function log( str) {
		console.log( str);
	}
	log("main start");
	log("id=$Id: public/js/main.js 2014-07-20 03:11:26+09:00 tommie $");
	var g_message = "";
	var g_maxMessage = 100;
	// Initialize varibles
	var $window = $(window);
	var $usernameInput = $('.usernameInput'); // Input for username
	var $messages = $('.messages'); // Messages area
	var $inputMessage = $('#inputMessage'); // Input message input box
	// Prompt for setting a username
	var username;
	var connected = false;
	var $currentInput = $usernameInput.focus();
	var g_socket = io();
	var g_loadedMetaData = { 
		func: null,
		data: null
	};

	function addLoadedMetaData( p_func, p_data) {
		g_loadedMetaData = {
			func: p_func,
			data: p_data
		};
	}
	function loadedMetaData() {
		g_loadedMetaData.func && 
			g_loadedMetaData.func( g_loadedMetaData.data);
	}

	function init() {
		log( "init() start");
	
		function computeDuration(ms){
			var h = String(Math.floor(ms / 3600000) + 100).substring(1);
			var m = String(Math.floor((ms - h * 3600000)/60000)+ 100).substring(1);
			var s = String(Math.round((ms - h * 3600000 - m * 60000)/1000)+ 100).substring(1);
			return h+':'+m+':'+s;
		}   

		var video = document.getElementById("Video1");                                               
		if (!video.canPlayType) {
			log( "再生できない形式");
			return;
		}
	 	video.pause();
	
		video.src = "http://podcast.tommie2.info/movie/watch-1404825242.mp4";
	/*****
		video.src = "watch-1404825242.webm";
		if (video.canPlayType) {
			// CanPlayType returns maybe, probably, or an empty string.
			//var playMsg = video.canPlayType('video/mp4; codecs="avc1.42E01E"');
			var playMsg = video.canPlayType('video/mp4');
			if ("" != playMsg) {
				log( "mp4/H.264 is " + playMsg + " supported ");
				video.src = "watch-1404825242.mp4";
			}
			playMsg = video.canPlayType('video/ogg; codecs="theora"');
			if ("" != playMsg) {
				log( "ogg is " + playMsg + " supported");
			}
			playMsg = video.canPlayType('video/webm; codecs="vp8, vorbis"');
			if ("" != playMsg) {
				log( "webm is " + playMsg + " supported");
			}
		}else {
				log( "no video support");
		}
	*********/
		//var video = document.getElementById("Video1");                                               
		//video.src = data.url;
		video.addEventListener("error", function(err) {
			log( err);
			log( err.stack);
		}, true);
		video.addEventListener("loadstart", function(err) {
			log( "on loadstart, video.src="+video.src);
		}, true);
		video.load(); 
		video.addEventListener("loadedmetadata", function(err) {
			log( "on loadedmetadata, video.src="+video.src);
			log( "video.src="+video.src);
			log( "video.duration="+video.duration);
			loadedMetaData();
		}, true);

		setInterval( function() {
			var ct = video.currentTime;
			//log( "current="+ct);
			//log( "computeDuration="+computeDuration(ct));
			$("#currentTime").text( computeDuration(ct*1000));			
		},100);

		g_socket.emit('add user', "user1");
		$currentInput.focus();

		log( "init() end");
	}

	function addMsg(msg) {
		// xxx g_messageを配列にせよ
		g_message += "\n" + msg;
		var lines = g_message.split("\n");
		if (lines.length > g_maxMessage) {
			lines.splice(0, lines.length - g_maxMessage);
		}
		g_message = lines.join("\n");

		var ta = $("#taMessage");
		ta.val(g_message);
		ta.scrollTop(ta[0].scrollHeight - ta.height());

	}
	addMsg("サーバーへ接続中…");


	// Sets the client's username
	function setUsername() {
		username = "nobody";
		g_socket.emit('add user', username);
	}

	// Sends a chat message
	function sendMessage() {
		var message = $inputMessage.val();
		// Prevent markup from being injected into the message
		message = cleanInput(message);
		// if there is a non-empty message and a socket connection
		if (message && connected) {
			$inputMessage.val('');
			// tell server to execute 'new message' and send along one parameter
			g_socket.emit('new message', message);
		}
	}

	// Adds the visual chat message to the message list
	function addChatMessage(data, options) {
		addMsg(data.time + " " + data.message);

	}

	// Prevents input from having injected markup
	function cleanInput(input) {
		return $('<div/>').text(input).text();
	}

	// Keyboard events

	$window.keydown(function(event) {
		// Auto-focus the current input when a key is typed
		if (!(event.ctrlKey || event.metaKey || event.altKey)) {
			$currentInput.focus();
		}
		// When the client hits ENTER on their keyboard
		if (event.which === 13) {
			sendMessage();
		}
	});

	$inputMessage.on('input', function() {});

	// Focus input when clicking on the message input's border
	$inputMessage.click(function() {
		$inputMessage.focus();
	});

	//--------------------------------------------------------------------------
	// Socket events
	//--------------------------------------------------------------------------

	g_socket.on('connect', function(data) {
		log("onConnect");
	});
	g_socket.on('login', function(data) {
		log("onLogin totalUser=" + data.numUsers);
		connected = true;
		// Display the welcome message
		var message = "ようこそ、暗黒TVへ！";
		addMsg("接続しました！");
		addChatMessage(data);

		$("#totalUser").text(data.numUsers);

	});
	g_socket.on('play', function(data) {
		try {
			log("onPlay"+", url="+data.url+", time="+data.time);
/******************************
			var video = document.getElementById("Video1");                                               
			video.src = data.url;
			video.load(); 
			addLoadedMetaData( function (data) {
				var video = 
					document.getElementById("Video1");                                               
				video.currentTime = data.time;
				video.play();
			}, data);
******************************/
		}
		catch( e) {
			log( "ERROR "+e);
			log( e.stack);
		}
	});

	// Whenever the server emits 'new message', update the chat body
	g_socket.on('new message', function(data) {
		try {
			log("new message");
			//log( "time=" + data.time);
			addChatMessage(data);
			
		}
		catch (e) {
			log("ERROR e=" + e);
		}
	});

	// Whenever the server emits 'user joined', log it in the chat body
	g_socket.on('user joined', function(data) {
		log(data.username + ' joined');
		$("#totalUser").text(data.numUsers);
	});

	// Whenever the server emits 'user left', log it in the chat body
	g_socket.on('user left', function(data) {
		log(data.username + ' left');
		$("#totalUser").text(data.numUsers);
	});


	init();
	log("main end");
});
