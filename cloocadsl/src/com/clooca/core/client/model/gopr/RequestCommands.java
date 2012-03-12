package com.clooca.core.client.model.gopr;

import java.util.ArrayList;
import java.util.List;

import com.google.gwt.core.client.GWT;

/**
 * 
 * @author Syuhei Hiya
 *
 */
public class RequestCommands {
	
	List<Command> commands = new ArrayList<Command>();
	
	public void addObject(int metaobject_id, int x, int y, int diagram_id, int local_id) {
		commands.add(new AddObjectCommand(metaobject_id, x, y, diagram_id, local_id));
	}
	
	public void updateObject(int object_id, int x, int y, int diagram_id) {
		/*
		 * リクエストコマンドの最適化
		 */
		for(Command c : commands) {
			if(c instanceof AddObjectCommand) {
				AddObjectCommand aoc = (AddObjectCommand)c;
				if(aoc.getLocal_id() == object_id) {
					aoc.update(x, y);
					return;
				}
			}
			if(c instanceof UpdateObjectCommand) {
				UpdateObjectCommand uoc = (UpdateObjectCommand)c;
				if(uoc.getObject_id() == object_id) {
					uoc.update(x, y);
					return;
				}
			}
		}
		/*
		 * アップデートコマンドの追加
		 */
		commands.add(new UpdateObjectCommand(object_id, x, y, diagram_id));
	}
	
	public void addProperty(int id, int metaproperty_id, int object_id, String value) {
		commands.add(new AddPropertyCommand(id, metaproperty_id, object_id, value));
	}
	
	public void updateProperty(int id, int object_id, String value) {
		commands.add(new UpdatePropertyCommand(id, object_id, value));
	}

	public void deleteObject(int object_id, int diagram_id) {
		commands.add(new DeleteObjectCommand(object_id, diagram_id));
	}
	
	public void addRelationship(int metaobject_id, int x, int y, int diagram_id, int local_id) {
		commands.add(new AddRelationshipCommand(metaobject_id, x, y, diagram_id, local_id));
	}
	
	public void deleteRelationship(int object_id, int diagram_id) {
		commands.add(new DeleteRelationshipCommand(object_id, diagram_id));
	}
	
	public String getXML() {
		String ret = "<Command>";
		for(Command c : commands) {
			ret += c.toXML();
		}
		ret += "</Command>";
		GWT.log(ret);
		return ret;
	}
	
	public void clear() {
		commands.clear();
	}
	
	abstract private class Command {
		abstract public String toXML();
	}
	
	private class AddObjectCommand extends Command {
		int metaobject_id, x, y, diagram_id;
		private int local_id;
		public AddObjectCommand(int metaobject_id, int x, int y, int diagram_id, int local_id) {
			this.metaobject_id = metaobject_id;
			this.x = x;
			this.y = y;
			this.diagram_id = diagram_id;
			this.local_id = local_id;
		}
		public int getMetaobject_id() {
			return metaobject_id;
		}
		public int getX() {
			return x;
		}
		public int getY() {
			return y;
		}
		public int getDiagram_id() {
			return diagram_id;
		}
		@Override
		public String toXML() {
	        return "<AddObject metaobject_id=\""+getMetaobject_id()+"\" x=\""+getX()+"\" y=\""+getY()+"\" diagram_id=\""+getDiagram_id()+"\" local_id=\""+getLocal_id()+"\"/>";
		}
		public int getLocal_id() {
			return local_id;
		}
		public void update(int x, int y) {
			this.x = x;
			this.y = y;
		}
	}
	
	private class UpdateObjectCommand extends Command {
		int object_id, x, y, diagram_id;
		public UpdateObjectCommand(int object_id, int x, int y, int diagram_id) {
			this.object_id = object_id;
			this.x = x;
			this.y = y;
			this.diagram_id = diagram_id;
		}
		public int getObject_id() {
			return object_id;
		}
		public int getX() {
			return x;
		}
		public int getY() {
			return y;
		}
		@Override
		public String toXML() {
	        return "<UpdateObject object_id=\""+getObject_id()+"\" x=\""+getX()+"\" y=\""+getY()+"\" diagram_id=\""+diagram_id+"\"/>";
		}
		public void update(int x, int y) {
			this.x = x;
			this.y = y;
		}
	}
	
	private class DeleteObjectCommand extends Command {
		private int object_id;
		private int diagram_id;
		public DeleteObjectCommand(int object_id, int diagram_id) {
			this.object_id = object_id;
			this.diagram_id = diagram_id;
		}
		public int getObject_id() {
			return object_id;
		}
		@Override
		public String toXML() {
	        return "<DeleteObject object_id=\""+getObject_id()+"\" diagram_id=\""+diagram_id+"\"/>";
		}
	}
	
	private class AddRelationshipCommand extends Command {
		int metarelationship_id, src, dest, diagram_id;
		private int local_id;
		public AddRelationshipCommand(int metarelationship_id, int src, int dest, int diagram_id, int local_id) {
			this.metarelationship_id = metarelationship_id;
			this.src = src;
			this.dest = dest;
			this.diagram_id = diagram_id;
			this.local_id = local_id;
		}
		public int getMetarelationship_id() {
			return metarelationship_id;
		}
		public int getSrc() {
			return src;
		}
		public int getDest() {
			return dest;
		}
		public int getDiagram_id() {
			return diagram_id;
		}
		@Override
		public String toXML() {
	        return "<AddRelationship metarelationship_id=\""+getMetarelationship_id()+"\" src=\""+getSrc()+"\" dest=\""+getDest()+"\" diagram_id=\""+getDiagram_id()+"\" local_id=\""+getLocal_id()+"\"/>";
		}
		public int getLocal_id() {
			return local_id;
		}
	}
	
	private class UpdateRelationshipCommand extends Command {
		int object_id, x, y, diagram_id;
		public UpdateRelationshipCommand(int object_id, int x, int y, int diagram_id) {
			this.object_id = object_id;
			this.x = x;
			this.y = y;
			this.diagram_id = diagram_id;
		}
		public int getObject_id() {
			return object_id;
		}
		public int getX() {
			return x;
		}
		public int getY() {
			return y;
		}
		@Override
		public String toXML() {
	        return "<UpdateRelationship relationship_id=\""+getObject_id()+"\" src=\""+getX()+"\" dest=\""+getY()+"\" diagram_id=\""+diagram_id+"\"/>";
		}
		public void update(int x, int y) {
			this.x = x;
			this.y = y;
		}
	}
	
	private class DeleteRelationshipCommand extends Command {
		private int object_id;
		private int diagram_id;
		public DeleteRelationshipCommand(int object_id, int diagram_id) {
			this.object_id = object_id;
		}
		public int getObject_id() {
			return object_id;
		}
		@Override
		public String toXML() {
	        return "<DeleteRelationship relationship_id=\""+getObject_id()+"\" diagram_id=\""+diagram_id+"\"/>";
		}
	}
	
	private class UpdatePropertyCommand extends Command {
		private int id;
		int object_id;
		private String value;
		public UpdatePropertyCommand(int id, int object_id, String value) {
			this.id = id;
			this.object_id = object_id;
			this.value = value;
		}
		public int getObject_id() {
			return object_id;
		}
		@Override
		public String toXML() {
	        return "<UpdateProperty id=\""+getId()+"\" object_id=\""+getObject_id()+"\" value=\""+getValue()+"\"/>";
		}
		public void update(String value) {
			this.value = value;
		}
		public int getId() {
			return id;
		}
		public String getValue() {
			return value;
		}
	}
	
	private class AddPropertyCommand extends Command {
		private int id;
		private int metaproperty_id;
		int object_id;
		private String value;
		public AddPropertyCommand(int id, int metaproperty_id, int object_id, String value) {
			this.id = id;
			this.metaproperty_id = metaproperty_id;
			this.object_id = object_id;
			this.value = value;
		}
		public int getObject_id() {
			return object_id;
		}
		@Override
		public String toXML() {
	        return "<UpdateProperty id=\""+getId()+"\" metaproperty_id=\""+getMetaproperty_id()+"\" object_id=\""+getObject_id()+"\" value=\""+getValue()+"\"/>";
		}
		public int getId() {
			return id;
		}
		public String getValue() {
			return value;
		}
		public int getMetaproperty_id() {
			return metaproperty_id;
		}
	}
	
}