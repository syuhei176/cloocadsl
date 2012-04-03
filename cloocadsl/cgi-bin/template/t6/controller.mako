//Root Diagram
//${root.json.id}

//Objects
<% cnt = 0 %>
% for i in root.json.state:
//(${i.x}, ${i.y})
var STATE_${i.id} = ${cnt};
<% cnt = cnt + 1 %>
%  for p in i.properties:
//  ${p.children[0].value}
% endfor
%endfor
var STATE_IGNORE = -1;

var EVENT_touch = 0;
var EVENT_white = 1;
var EVENT_black = 2;
var EVENT_gray = 3;


<%
matrix = []
for i in root.json.state:
	for j in root.json.transition:
		if i.id == j.src:
			if j.properties[0].children[0].value == 'touch':
				matrix.append('STATE_'+j.dest)
				break
			else:
				matrix.append('STATE_IGNORE')
				break
	for j in root.json.transition:
		if i.id == j.src:
			if j.properties[0].children[0].value == 'white':
				matrix.append('STATE_'+j.dest)
				break
			else:
				matrix.append('STATE_IGNORE')
				break
	for j in root.json.transition:
		if i.id == j.src:
			if j.properties[0].children[0].value == 'black':
				matrix.append('STATE_'+j.dest)
				break
			else:
				matrix.append('STATE_IGNORE')
				break
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
var state_num = ${len(root.json.state)};

function execute(event) {
	var next_state = matrix[current_state * 3 + event];
	print("ns="+next_state);
    if(next_state == -1) return;
    current_state = next_state;
	switch(current_state) {
% for i in root.json.state:
//(${i.x}, ${i.y})
	case STATE_${i.id}:
%  for p in i.properties:
		sys_${p.children[0].value}();
%  endfor
	break;
% endfor
	}
}
