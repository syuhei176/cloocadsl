
function GameEnvironment(stm_data1, stm_data2) {
	this.player1 = new Player(1, 164, 480, -90, new StateMachine(stm_data1));
	this.player2 = new Player(2, 640 - 164, 60, 90, new StateMachine(stm_data2));
	this.player1.stm.sendEvent(1);
	this.player2.stm.sendEvent(1);
	this.players = [this.player1, this.player2];
	this.pointitems = [];
	this.pointitems.push(new PointItem(200, 200));
	this.pointitems.push(new PointItem(200, 640 - 200));
	this.pointitems.push(new PointItem(640 - 200, 200));
	this.pointitems.push(new PointItem(640 - 200, 640 - 200));
	this.pointitems.push(new PointItem(640 - 100, 320));
	this.pointitems.push(new PointItem(100, 320));
	this.phase = 1;
	this.timer_count = 300;
	var self = this;
	var timeover_cb = function() {
		self.timer_count--;
		if(self.timer_count <= 0 && self.phase == 1) {
			self.battle_finish();
			self.phase = 2;
		}
	}
	timerID = setInterval(timeover_cb, 1000);
}

GameEnvironment.prototype.battle_finish = function() {
	var result = 0;
	if(this.player1.point > this.player2.point) {
		result = 0;
	}else if(this.player1.point < this.player2.point) {
		result = 1;
	}else{
		result = 2;
	}
	battle_result('',g_selected_enemy.user_id, result, function(data){
		alert('終了');
	});
}

GameEnvironment.prototype.step = function() {
	if(this.phase == 1) {
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
			for(var j=0;j < this.pointitems.length;j++) {
				this.pointitems[j].hit(this.players[i]);
			}
		}
		var flg = true;
		for(var j=0;j < this.pointitems.length;j++) {
			if(this.pointitems[j].alive) {
				flg = false;
			}
		}
		if(flg) {
			this.battle_finish();
			this.phase = 2;
		}
	}else{
		
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
		strokeStyle: "#0f0",
		strokeWidth: 3,
		  x: this.player1.x, y: this.player1.y,
		  radius: 12,
		  fromCenter: true,
		  sides: 6,
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
	for(var i=0;i < this.pointitems.length;i++) {
		this.pointitems[i].draw();
	}
	if(this.phase == 1) {
		$("canvas").drawText({
			  fillStyle: "#9cf",
			  strokeStyle: "#25a",
			  strokeWidth: 2,
			  x: 100, y: 60,
			  font: "24pt Verdana, sans-serif",
			  text: "" +this.player1.point+"VS"+this.player2.point + " TIME="+this.timer_count
			});
	}else if(this.phase == 2) {
		var text = '';
		if(this.player1.point > this.player2.point) {
			text = 'WIN';
		}else if(this.player1.point < this.player2.point) {
			text = 'LOST';
		}else{
			text = 'DRAW';
		}
		$("canvas").drawText({
			  fillStyle: "#9cf",
			  strokeStyle: "#25a",
			  strokeWidth: 4,
			  x: 240, y: 200,
			  font: "28pt Verdana, sans-serif",
			  text: text+this.player1.point+"VS"+this.player2.point
			});
	}
}

GameEnvironment.prototype.start = function() {
	
}

function PointItem(x, y) {
	this.x = x;
	this.y = y;
	this.alive = true
}

PointItem.prototype.draw = function() {
	if(this.alive) {
		$("canvas").drawArc({
			strokeStyle: "blue",
			strokeWidth: 4,
			x: this.x, y: this.y,
			radius: 20,
			fromCenter: true
			});
	}
}

PointItem.prototype.hit = function(player) {
	if(this.alive) {
		if(player.x-20 < this.x + 10 && this.x - 10 < player.x + 20) {
			if(player.y -20 < this.y + 10 && this.y - 10 < player.y + 20) {
				player.point++;
				this.alive = false;
			}
		}
	}
}
