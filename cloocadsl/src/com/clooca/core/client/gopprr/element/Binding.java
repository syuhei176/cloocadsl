package com.clooca.core.client.gopprr.element;

import java.util.ArrayList;
import java.util.List;

import com.clooca.core.client.diagram.ShapeEdge.LineType;
import com.clooca.core.client.gopprr.metaelement.*;
import com.clooca.core.client.util.*;

public class Binding extends ModelElement {
	
	/**
	 * 
	 */
	private static final long serialVersionUID = -2843496195288700195L;
	
	/*
	long metabinding_id;
	long relation_id;
	long role_id;
	*/
	Relationship relationship;
	List<Role> roles = new ArrayList<Role>();
	Rectangle2D bound = new Rectangle2D();
	
	public Binding(MetaElement metaElem) {
		super(metaElem);
		relationship = (Relationship) ((MetaBinding)this.metaElement).getMetarelation().getInstance();
	}
	
	public Relationship getRelationship() {
		return this.relationship;
	}
	
	/*
	public long getBinding_id() {
		return binding_id;
	}

	public long getMeta() {
		return metabinding_id;
	}

	public long getRelation_id() {
		return relation_id;
	}

	public long getRole_id() {
		return role_id;
	}
	*/

	@Override
	public void draw(GraphicManager gm) {
		relationship.draw(gm);
		for(Role role : roles) {
			role.draw(gm);
		}
		gm.setColor(color);
		gm.beginPath();
		gm.moveTo(roles.get(0).getObj().getLocation());
		gm.LineTo(roles.get(1).getObj().getLocation());
		gm.stroke();
		gm.closePath();
	}

	@Override
	public boolean contains(Point2D aPoint) {
		return relationship.contains(aPoint);
	}
	
	public void connect(Role r1, Role r2) {
		roles.add(r1);
		roles.add(r2);
	}

	public Rectangle2D getBounds() {
		return bound;
	}

	@Override
	public Object clone() {
		// TODO Auto-generated method stub
		return null;
	}
	
}
