var conn, playerSign;
var guestID = 'player'+(Math.floor(Math.random() * 9000)+1);
var peer = new Peer(guestID, {key: '41d2uxazy7kl0udi', debug: 3});

peer.on('open', function(id){
	$('#yid').text(id);
	$('#qrCodeImg').attr('src', 'http://api.qrserver.com/v1/create-qr-code/?color=000000&bgcolor=FFFFFF&qzone=1&margin=0&size=250x250&ecc=L&data='+id);
});

peer.on('connection', connect);

function connect(c) {
	conn = c;
	playerSign = 'o';
	$('#ySign').text(playerSign);
	playersTurn();
	$('#toolbarpid').text(c.peer);
	$('#gameTable').addClass('visible');
	$('section.score').addClass('visible');
	$('#connectp').removeClass('visible');
	$('.logo').removeClass('visible');
	conn.on('data', function(data){
		makeMove(data);
	});
	conn.on('close', function(err){
		$('#pid').val('Disconnected!');
	});
}

$(function(){
	// Conect to a peer
	$('#connect').click(function(){
		var c = peer.connect($.trim($('#pid').val()));
		c.on('open', function(){
			connect(c);
			playerSign = 'x';
			$('#ySign').text(playerSign);
			playersTurn();
		});
		c.on('error', function(err){ alert(err) });
	});

	$score = new Array;
	$score['x'] = 0;
	$score['o'] = 0;
	updateScore();

	resetGame();
	//$('#msgBoard').fadeOut();

	$(window).keypress(function(event) {
		//ENTER
		if ($isEndOfGame == true && event.which == 13){
			resetGame();
		}

		// QWEASDZXC
		switch(event.which){
			case 122:
				$('#x1y3').click();
				break;
			case 120:
				$('#x2y3').click();
				break;
			case 99:
				$('#x3y3').click();
				break;
			case 97:
				$('#x1y2').click();
				break;
			case 115:
				$('#x2y2').click();
				break;
			case 100:
				$('#x3y2').click();
				break;
			case 113:
				$('#x1y1').click();
				break;
			case 119:
				$('#x2y1').click();
				break;
			case 101:
				$('#x3y1').click();
				break;
		}

		// NUMPAD
		switch(event.which){
			case 49:
				$('#x1y3').click();
				break;
			case 50:
				$('#x2y3').click();
				break;
			case 51:
				$('#x3y3').click();
				break;
			case 52:
				$('#x1y2').click();
				break;
			case 53:
				$('#x2y2').click();
				break;
			case 54:
				$('#x3y2').click();
				break;
			case 55:
				$('#x1y1').click();
				break;
			case 56:
				$('#x2y1').click();
				break;
			case 57:
				$('#x3y1').click();
				break;
		}
	})

	$('td').click(function(){
		if(!$isEndOfGame && ($player == playerSign)){
			$id = this.id;
			conn.send($id);
			makeMove($id);
		}
	});
});

function resetGame(){
	for (var y=1; y<=3 ; y++){
		for (var x=1; x<=3; x++){
			$('#x' + x + 'y' + y).removeClass();
		}
	}

	$playerCount = 0;
	$playsCount = 0;
	playersTurn();
	$coords = new Array();
	$('#msgBoard').css('visibility', 'hidden');
	$('#msgBoard').html('');
	updateScore();
	$isEndOfGame = false;
}

function playersTurn(){
	if ( $playerCount == 0 ){
		$player = 'x';
		if ($player == playerSign) {
			$('#playersTurn').text('Your turn!');
			$('#pSign').text('x');
		} else {
			$('#playersTurn').text('Cross\'s turn');
			$('#pSign').text('x');
		}
	} else if( $playerCount == 1 ){
		$player = 'o';
		if ($player == playerSign) {
			$('#playersTurn').text('Your turn!');
			$('#pSign').text('o');
		} else {
			$('#playersTurn').text('Circle\'s turn');
			$('#pSign').text('o');
		}
	}
}

function checkWin(){
	//HORIZONTAL
	if ($coords['x1y1'] == $player && $coords['x2y1'] == $player && $coords['x3y1'] == $player){
		return $player;
		//alert($player + ' wins');
	}
	else if ($coords['x1y2'] == $player && $coords['x2y2'] == $player && $coords['x3y2'] == $player){
		return $player;
	}
	else if ($coords['x1y3'] == $player && $coords['x2y3'] == $player && $coords['x3y3'] == $player){
		return $player;
	}

	//VERTICAL
	else if ($coords['x1y1'] == $player && $coords['x1y2'] == $player && $coords['x1y3'] == $player){
		return $player;
	}
	else if ($coords['x2y1'] == $player && $coords['x2y2'] == $player && $coords['x2y3'] == $player){
		return $player;
	}
	else if ($coords['x3y1'] == $player && $coords['x3y2'] == $player && $coords['x3y3'] == $player){
		return $player;
	}

	//DIAG
	else if ($coords['x1y1'] == $player && $coords['x2y2'] == $player && $coords['x3y3'] == $player){
		return $player;
	}
	else if ($coords['x3y1'] == $player && $coords['x2y2'] == $player && $coords['x1y3'] == $player){
		return $player;
	}

	else {
		return false;
	}
}

function updateScore(){
	$('#xscore').text($score['x']);
	$('#oscore').text($score['o']);

	$('#xscore').css('transition', 'all 2s');
	$('#oscore').css('transition', 'all 2s');

	if ($score['x'] > $score['o']){
		$('#xscore').css('background', 'rgba(0,0,0,0)');
		$('#oscore').css('background', 'rgba(0,0,0,0)');
	}
	else if ($score['o'] > $score['x']){
		$('#oscore').css('background', 'rgba(0,0,0,0)');
		$('#xscore').css('background', 'rgba(0,0,0,0)');
	}
	else if ($score['o'] == $score['x']){
		$('#oscore').css('background', '');
		$('#xscore').css('background', '');
	}
}

function makeMove(id){
	$id = id;
	if(typeof $coords[$id] == 'undefined') {
		$coords[$id] = $player;

		$id = '#' + $id;

		if ( $playerCount == 0 ){
			$($id).addClass("cross");
			$playerCount ++;
		} else if( $playerCount == 1 ){
			$($id).addClass("circle");
			$playerCount = 0;
		}

		$playsCount++;

		if (checkWin() != false){
			if (checkWin() == 'x' || checkWin() == 'o'){
				$isEndOfGame = true;
				++$score[checkWin()];
				updateScore();
				$newGameBtn = '<br /><button onClick="resetGame();" style="bottom:20px;">New Game</button>';
				$('#msgBoard').prepend('<h1 style="font-size:50pt;">'+$player.toUpperCase()+' wins!</h1>'+$newGameBtn);
				$('#msgBoard').css('visibility', 'visible');
				$('#msgBoard').css('opacity', '1');
			}
		}
		else if (checkWin() == false && $playsCount >= 9){
			$isEndOfGame = true;
			$newGameBtn = '<br /><button onClick="resetGame();" style="bottom:20px;">New Game</button>';
			$msgBoardContent = '<h1>YOU BOTH LOSERS!!!1!!11!</h1>' + $newGameBtn;

			$('#msgBoard').prepend($msgBoardContent);

			$('#msgBoard').css('visibility', 'visible');
			$('#msgBoard').css('opacity', '1');
		}
		playersTurn();
	}
}