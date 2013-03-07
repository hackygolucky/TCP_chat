var net = require('net')
	, count = 0
	, users = {};

// create the server
var server = net.createServer(function (conn) {
	conn.write(
			'\n > welcome to 033\[92mnode-chat\033[39m!' 
		+ '\n > ' + count + ' other people are connected at this time.'
		+ '\n > please write your name and press enter: '
	);
	count++;

	conn.setEncoding('utf8'); // don't need any other data encoding for this project, so this is perfect.

	var nickname;

	function broadcast (msg, exceptMyself) {
		for (var i in users) {
			if (!exceptMyself || i != nickname) {
				users[i].write(msg);
			}
		}
	}

	conn.on('data', function (data) {
		// remove the 'enter' character
		data = data.replace('\r\n', '');

		// expecting nickname
		if (!nickname) {
			if (users[data]) {
				conn.write('\033[93m> nickname already in use. Try again:\033[39m ');
				return;
			} else {
					nickname = data;
					users[nickname] = conn;

					broadcast('\033[90m > ' + nickname + ' joined the room\033[39m\n');
			}
		} else {
			// otherwise it should be a chat message
				broadcast('\033[96m > ' + nickname + ':\033[39m ' + data + '\n');
		}
	});

	conn.on('close', function () {
		count--;
		console.log(nickname + ' has vamoosed!');
		delete users[nickname];
		broadcast('\033[90m > ' + nickname + ' left the room\033')
	});	
});

// Listen
server.listen(3000, function () {
	console.log('\033[96m		server listening on *:3000\033[39m');
});
