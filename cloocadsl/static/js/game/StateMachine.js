function StateMachine(stm_data) {
	this.event_num = stm_data.event_num;
	this.matrix = stm_data.matrix;
	this.states = stm_data.states;
	this.current_state = 0;
	this.event_queue = [];
}

StateMachine.prototype.sendEvent = function(event) {
//	console.log('event:'+event);
	this.event_queue.push(event);
}

StateMachine.prototype.execute = function(action_obj) {
	if(this.event_queue.length == 0) return false;
	var event = this.event_queue.shift();
	var next_state = this.matrix[event + this.current_state * this.event_num];
	if(next_state == -1) return false;
	this.current_state = next_state;
	console.log('current state:'+this.current_state);
	if(this.states[this.current_state] == 0) {
		//何もしない
		action_obj.action_stop();
	}else if(this.states[this.current_state] == 1) {
		action_obj.action_go();
	}else if(this.states[this.current_state] == 2) {
		action_obj.action_right();
	}else if(this.states[this.current_state] == 3) {
		action_obj.action_left();
	}
	return true;
}
