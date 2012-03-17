package com.clooca.core.client.listener;

import com.clooca.core.client.model.gopr.element.NodeObject;
import com.clooca.core.client.model.gopr.element.Relationship;

public interface DiagramModificationListener {
	public void onAddObject(NodeObject obj);
	public void onAddRelationship(Relationship rel);
	public void onDeleteObject(NodeObject obj);
	public void onDeleteRelationship(Relationship rel);
	public void onUpdateObject(NodeObject obj);
	public void onUpdateRelationship(Relationship rel);
}
