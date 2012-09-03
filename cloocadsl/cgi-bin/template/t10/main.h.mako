% for c in root.classdiagram.klass:
#include "c_${c.diagram.id}.h"
% endfor

#define NULL (0)
% for c in root.classdiagram.klass:
#define STATECLASS${c.diagram.id} c_${c.diagram.id}
% endfor

#define STATE_CLASS c_${root.classdiagram.klass[0].diagram.id}
#define EVENT_none 0
#define EVENT_touch 1
#define EVENT_white 2
#define EVENT_black 3
#define EVENT_userdefine1 4
#define EVENT_userdefine2 5
#define EVENT_NUM 6

extern "C"
{
  void sys_stop();
  void sys_go();
  void sys_right();
  void sys_left();
  void sys_();
  void print(char *);
  void clock_wait(int t);
  void sys_userdefine1();
  void sys_userdefine2();
}

void Initialize();