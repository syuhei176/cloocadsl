#ifndef _STATEMACHINE_H_
#define _STATEMACHINE_H_

class StateMachine {
	private:
protected:
		int current_state;
	public:
		StateMachine(){}
		~StateMachine(){}
		virtual int execute(int event) = 0;
};

#endif
