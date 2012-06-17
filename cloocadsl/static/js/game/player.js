function Player(id, x, y, direction, stm) {
	this.id = id;
	this.x = x;
	this.y = y;
	this.stm = null;
	this.motor_r_pwr = 0;
	this.motor_l_pwr = 0;
	this.direction = direction;
	this.stm = stm;
	//
	this.prev_light_state = 1;
}

Player.prototype.step = function() {
	var self = this;
	//event
	$("canvas").draw(function(ctx) {
		var image = ctx.getImageData(0,0,640,640);
		var r = image.data[(Math.floor(self.x) + 640 * Math.floor(self.y)) * 4 + 0];
		var g =image.data[(Math.floor(self.x) + 640 * Math.floor(self.y)) * 4 + 1];
		var b =image.data[(Math.floor(self.x) + 640 * Math.floor(self.y)) * 4 + 2];
		var a =image.data[(Math.floor(self.x) + 640 * Math.floor(self.y)) * 4 + 3];
//		if(self.id == 1) console.log('color:' + r);
		if(r < 5 && g < 5 && b < 5) {
			if(self.prev_light_state != 0) {
				self.prev_light_state = 0;
				self.stm.sendEvent(3);
			}
		}
		if(r > 250 && g > 250 && b > 250) {
			if(self.prev_light_state != 1) {
				self.prev_light_state = 1;
				self.stm.sendEvent(2);
			}
		}
	});
	//
	this.stm.execute(this);
	if(this.motor_r_pwr > this.motor_l_pwr) {
		this.direction -= 4;
	}else if(this.motor_r_pwr < this.motor_l_pwr) {
		this.direction += 4;
	}
	var pwr = (this.motor_r_pwr + this.motor_l_pwr) / 2;
	var vx = pwr * Math.cos(Math.PI / 180 * this.direction);
	var vy = pwr * Math.sin(Math.PI / 180 * this.direction);
	this.x += vx;
	this.y += vy;
}

Player.prototype.action_stop = function() {
	console.log('id:'+this.id+',action:stop');
	this.motor_r_pwr = 0;
	this.motor_l_pwr = 0;
}

Player.prototype.action_go = function(pwr) {
	if(pwr >= 0 && pwr < 128) {
//		console.log('id:'+this.id+',action:go ' + pwr);
		this.motor_r_pwr = 4 + pwr;
		this.motor_l_pwr = 4 + pwr;
	}
}

Player.prototype.action_right = function(pwr) {
//	console.log('id:'+this.id+',action:right');
	this.motor_r_pwr = 0;
	this.motor_l_pwr = 4 + pwr;
}

Player.prototype.action_left = function(pwr) {
//	console.log('id:'+this.id+',action:left');
	this.motor_r_pwr = 4 + pwr;
	this.motor_l_pwr = 0;
}

Player.prototype.action_attack = function() {
//	console.log('id:'+this.id+',action:left');
}
