//Root Diagram
//${root.root.id}

//Objects
<% cnt = 0 %>
% for i in root.root.objects:
//(${i.x}, ${i.y})
var STATE_${i.id} = ${cnt};
<% cnt = cnt + 1 %>
%  for p in i.properties:
//  ${p.value}
% endfor
%endfor
var STATE_IGNORE = -1;

var EVENT_touch = 0;
var EVENT_white = 1;
var EVENT_black = 2;
var EVENT_gray = 3;



<%
matrix = []
for i in root.root.objects:
	for j in root.root.relationships:
		if i.id == j.src:
			if j.properties[0].value == 'touch':
				matrix.append('STATE_'+j.dest)
				break
			else:
				matrix.append('STATE_IGNORE')
				break
	for j in root.root.relationships:
		if i.id == j.src:
			if j.properties[0].value == 'white':
				matrix.append('STATE_'+j.dest)
				break
			else:
				matrix.append('STATE_IGNORE')
				break
	for j in root.root.relationships:
		if i.id == j.src:
			if j.properties[0].value == 'black':
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
var state_num = ${len(root.root.objects)};

function execute(event) {
	var next_state = matrix[current_state * 3 + event];
	print("ns="+next_state);
    if(next_state == -1) return;
    current_state = next_state;
	switch(current_state) {
% for i in root.root.objects:
//(${i.x}, ${i.y})
	case STATE_${i.id}:
%  for p in i.properties:
		sys_${p.value}();
%  endfor
	break;
% endfor
	}
}