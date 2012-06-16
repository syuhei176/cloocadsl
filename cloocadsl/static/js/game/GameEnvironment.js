
function GameEnvironment(stm_data1, stm_data2) {
	this.player1 = new Player(1, 60, 480, new StateMachine(stm_data1));
	this.player2 = new Player(1, 480, 60, new StateMachine(stm_data2));
	this.player1.stm.sendEvent(1);
	this.player2.stm.sendEvent(1);
	this.players = [this.player1, this.player2];
}

GameEnvironment.prototype.step = function() {
	this.player1.step();
	this.player2.step();
	for(var i=0;i < this.players.length;i++) {
		if(this.players[i].y < 0) {
			this.players[i].y = 0;
		}
		if(this.players[i].y > 640) {
			this.players[i].y = 640;
		}
		if(this.players[i].x < 0) {
			this.players[i].x = 0;
		}
		if(this.players[i].x > 640) {
			this.players[i].x = 640;
		}
	}
	this.draw();
}

GameEnvironment.prototype.draw = function() {
	$("canvas").drawPolygon({
		strokeStyle: "#0f0",
		strokeWidth: 8,
		  x: this.player1.x, y: this.player1.y,
		  radius: 40,
		  fromCenter: true,
		  sides: 3,
		  angle: this.player1.direction - 30
		});
	$("canvas").drawPolygon({
		strokeStyle: "#f00",
		strokeWidth: 8,
		  x: this.player2.x, y: this.player2.y,
		  radius: 40,
		  fromCenter: true,
		  sides: 3,
		  angle: this.player2.direction - 30
		});
}

GameEnvironment.prototype.start = function() {
	
}
