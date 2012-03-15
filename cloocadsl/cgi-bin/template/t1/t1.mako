Root Diagram
${root.root.id}

Objects
% for i in root.root.objects:
 ${i.id}
 (${i.x}, ${i.y})
%  for p in i.properties:
  ${p.value}
% endfor
%endfor

Relationships
% for i in root.root.relationships:
 ${i.id}
 (${i.src}, ${i.dest})
%  for p in i.properties:
  ${p.value}
%  endfor
%endfor