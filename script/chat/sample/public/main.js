$(function() {
  console.log( "main start");
  var g_message = "";
  var g_maxMessage = 100;
  
  function addMsg( msg) {
  	// xxx g_messageを配列にせよ
	g_message += "\n"+msg;
	var lines = g_message.split( "\n");
	if ( lines.length > g_maxMessage) {
		lines.splice( 0, lines.length - g_maxMessage);
	}
	g_message = lines.join("\n");
	
	var ta = $("#taMessage");
	ta.val( g_message);
	ta.scrollTop(
		ta[0].scrollHeight - ta.height()
	);

  }
  addMsg( "サーバーへ接続中…");
  
  // Initialize varibles
  var $window = $(window);
  var $usernameInput = $('.usernameInput'); // Input for username
  var $messages = $('.messages'); // Messages area
  var $inputMessage = $('#inputMessage'); // Input message input box

  var $loginPage = $('.login.page'); // The login page
  var $chatPage = $('.chat.page'); // The chatroom page

  // Prompt for setting a username
  var username;
  var connected = false;
  var typing = false;
  var lastTypingTime;
  var $currentInput = $usernameInput.focus();


  var socket = io();

  // Sets the client's username
  function setUsername () {
/***********************************del
    username = cleanInput($usernameInput.val().trim());

    // If the username is valid
    if (username) {
      $loginPage.fadeOut();
      $chatPage.show();
      $loginPage.off('click');
      $currentInput = $inputMessage.focus();

      // Tell the server your username
      socket.emit('add user', username);
    }
*************************************/
      username = "nobody";
      socket.emit('add user', username);
  }


  // Sends a chat message
  function sendMessage () {
    var message = $inputMessage.val();
    // Prevent markup from being injected into the message
    message = cleanInput(message);
    // if there is a non-empty message and a socket connection
    if (message && connected) {
      $inputMessage.val('');
      // tell server to execute 'new message' and send along one parameter
      socket.emit('new message', message);
    }
  }

  // Log a message
  function log (message, options) {
/*******************d
    var $el = $('<li>').addClass('log').text(message);
    addMessageElement($el, options);
*********************/
  }

  // Adds the visual chat message to the message list
  function addChatMessage (data, options) {
	addMsg( data.time + " " + data.message);

  }

  // Prevents input from having injected markup
  function cleanInput (input) {
    return $('<div/>').text(input).text();
  }

  // Keyboard events

  $window.keydown(function (event) {
    // Auto-focus the current input when a key is typed
    if (!(event.ctrlKey || event.metaKey || event.altKey)) {
      $currentInput.focus();
    }
    // When the client hits ENTER on their keyboard
    if (event.which === 13) {
      sendMessage();
    }
  });

  $inputMessage.on('input', function() {
    
  });

  // Focus input when clicking on the message input's border
  $inputMessage.click(function () {
    $inputMessage.focus();
  });

  // Socket events

  socket.on('connect', function (data) {
    console.log( "onConnect");
  });
  socket.on('login', function (data) {
    console.log( "onLogin totalUser="+data.numUsers);
    connected = true;
    // Display the welcome message
    var message = "ようこそ、暗黒TVへ！";
	addMsg( "接続しました！");
	addChatMessage( data);
    
    $("#totalUser").text( data.numUsers);

  });

  // Whenever the server emits 'new message', update the chat body
  socket.on('new message', function (data) {
  	try {
  		console.log( "new message");
		//console.log( "time=" + data.time);
    	addChatMessage(data);
    }
    catch (e) {
    	console.log( "ERROR e="+e);
    }
  });

  // Whenever the server emits 'user joined', log it in the chat body
  socket.on('user joined', function (data) {
    console.log(data.username + ' joined');
    addParticipantsMessage(data);
    $("#totalUser").text( data.numUsers);
  });

  // Whenever the server emits 'user left', log it in the chat body
  socket.on('user left', function (data) {
    console.log(data.username + ' left');
    addParticipantsMessage(data);
    $("#totalUser").text( data.numUsers);
  });

  socket.emit('add user', "user1");
  $currentInput.focus();

  console.log( "main end");
});
