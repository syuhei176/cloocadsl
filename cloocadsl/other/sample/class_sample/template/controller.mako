//Root Diagram
//${root.id}

//Objects
<% state_no = {} %>\
<% cnt = 0 %>
% for i in root.state:
//(${i.bound.x}, ${i.bound.y})
var STATE_${i.id} = ${cnt};
<% state_no[str(i.id)] = cnt %>\
<% cnt = cnt + 1 %>\
%  for p in i.action:
//  ${p.value}
% endfor
%endfor

var STATE_IGNORE = -1;

var EVENT_none = 0;
var EVENT_touch = 1;
var EVENT_white = 2;
var EVENT_black = 3;

<%
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

var matrix = new Array(
% for i in range(len(matrix)):
%  if i == len(matrix) - 1:
${matrix[i]}
%  else:
${matrix[i]},
%  endif
% endfor
);

var current_state = 0;
var state_num = ${len(root.state)};

function execute(event) {
	var next_state = matrix[current_state * 3 + event];
	print("ns="+next_state);
    if(next_state == -1) return;
    current_state = next_state;
	switch(current_state) {
% for i in root.state:
	case STATE_${i.id}:
		sys_${i.action[0].value}();
	break;
% endfor
	}
}
