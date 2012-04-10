#ifndef _EVENTMANAGER_H_
#define _EVENTMANAGER_H_
#include"StateMachine.h"
#include "main.h"

class Event {
public:
int event_id;
Event *next;
Event(int id) {
	event_id = id;
}
};

class EventManager {
	private:

		Event *head;
		Event *deq()
		{
			if(head == NULL) return NULL;
			Event *p = head;
			head = p->next;
			p->next = NULL;
			return p;
		}
		void enq(Event *new_e) {
			if(head == NULL) {
				head = new_e;
				head->next = NULL;
			}else{
				Event *e = head;
				while(e->next != NULL){
					e->next = new_e;
					e->next->next = NULL;
				}
				
			}
		}
		int stm_len;
		StateMachine *stms[16];
	public:
		EventManager() {
			stm_len = 0;
			head = NULL;
		}
		void addSTM(StateMachine *stm) {
			stms[stm_len] = stm;
			stm_len++;
		}

		void sendEvent(int event_id) {
			Event *e = new Event(event_id);
			enq(e);
		}

		void execute() {
			int ret_code = 0;
			while(ret_code == 0) {
				Event *e = deq();
				if(e != NULL) {
					for(int i=0;i < stm_len;i++) {
						ret_code = stms[i]->execute(e->event_id);
					}
				}else{
					clock_wait(20);
				}
			}
		}
};

#endif
