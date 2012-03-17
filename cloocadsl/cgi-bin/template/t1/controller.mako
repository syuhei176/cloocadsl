//Root Diagram
//${root.root.id}

//Objects
% for i in root.root.objects:
//(${i.x}, ${i.y})
#define STATE_${i.id} ${i.id}
%  for p in i.properties:
  ${p.value}
% endfor
%endfor

Relationships
% for i in root.root.relationships:
#define EVENT_${i.id}
 (${i.src}, ${i.dest})
%  for p in i.properties:
  ${p.value}
%  endfor
%endfor


<%
matrix = []
for i in root.root.objects:
	for j in root.root.relationships:
		if i.id == j.src:
			matrix.append('STATE_'+j.dest)
		else:
			matrix.append('STATE_IGNORE')
%>

int matrix[] = {
% for i in matrix:
${i},
% endfor
};

% for i in root.root.relationships:
void event_${i.id}() {

}
 (${i.src}, ${i.dest})
%  for p in i.properties:
  ${p.value}
%  endfor
%endfor

int current_state = STATE_IGNORE;
int state_num = 0;

void execute(int event) {
	current_state = matrix[current_state * state_num + event];
	switch() {
% for i in root.root.objects:
//(${i.x}, ${i.y})
	case STATE_${i.id}:
%  for p in i.properties:
		${p.value}();
%  endfor
	break;
% endfor
	}
}