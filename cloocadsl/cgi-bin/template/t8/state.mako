//Root Diagram
//${root.id}


c_${root.id}::c_${root.id}() {
  current_state = 0;
}

c_${root.id}::~c_${root.id}() {

}


<%

state_no = {}
cnt = 0
for i in root.state:
	state_no[str(i.id)] = cnt
	cnt = cnt + 1
endfor


matrix = ['STATE_IGNORE'] * len(root.state) * 4
for i in root.transition:
	if i.event[0].value == 'none':
		event_no = 0
	elif i.event[0].value == 'touch':
		event_no = 1
	elif i.event[0].value == 'white':
		event_no = 2
	elif i.event[0].value == 'black':
		event_no = 3
	else:
		event_no = 0
	matrix[state_no[str(i.src.id)] * 4 + event_no] = 'STATE_'+str(i.dest.id)
%>

const int matrix_${root.id} = {
% for i in range(len(matrix)):
%  if i == len(matrix) - 1:
c${root.id}_${matrix[i]}
%  else:
c${root.id}_${matrix[i]},
%  endif
% endfor
};

int c_${root.id}::execute(int event) {
	int next_state = matrix_${root.id}[current_state * 4 + event];
	print("ns="+next_state);
    if(next_state == -1) return;
    current_state = next_state;
	switch(current_state) {
% for i in root.state:
	case c${root.id}_STATE_${i.id}:
		sys_${i.action[0].value}();
	break;
% endfor
	}
}