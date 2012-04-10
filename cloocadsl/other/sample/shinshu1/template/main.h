#include "c_${root.statediagram.id}.h"

#define STATE_CLASS c_${root.statediagram.id}
#define EVENT_none 0
#define EVENT_touch 1
#define EVENT_white 2
#define EVENT_black 3

extern "C"
{
	void sys_stop();
	void sys_go();
	void sys_right();
	void sys_left();
	void print(char *);
	void clock_wait(int t);
}