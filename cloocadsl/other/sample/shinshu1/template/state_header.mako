#ifndef c_${root.id}_H_
#define c_${root.id}_H_

#include "main.h"
#include"StateMachine.h"

<% state_no = {} %>\
<% cnt = 1 %>
% for i in root.state:
#define c${root.id}_STATE_${i.id} ${cnt}
<% state_no[str(i.id)] = cnt %>\
<% cnt = cnt + 1 %>\
%endfor

#define c${root.id}_STATE_IGNORE -1

class c_${root.id} : public StateMachine {
	public:
		c_${root.id}();
		~c_${root.id}();
		int execute(int event);
};

#endif