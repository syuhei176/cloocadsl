package com.clooca.core.client.presenter;

import com.clooca.core.client.model.gopr.element.Diagram;
import com.clooca.core.client.model.gopr.element.Model;
import com.clooca.core.client.model.gopr.element.NodeObject;
import com.clooca.core.client.model.gopr.element.Property;
import com.clooca.core.client.model.gopr.element.Relationship;
import com.clooca.core.client.model.gopr.element.VersionElement;
import com.clooca.core.client.util.IdGenerator;
import com.clooca.core.client.util.Point2D;
import com.clooca.core.client.workbench.presenter.MetaModelController;
import com.google.gwt.core.client.GWT;
import com.google.gwt.xml.client.Document;
import com.google.gwt.xml.client.Node;
import com.google.gwt.xml.client.NodeList;
import com.google.gwt.xml.client.XMLParser;

/**
 * 
 * @author Syuhei Hiya
 *
 */
public class XMLPresenter {
	
	static String genModel(Model model) {
		String xml = "<?xml version=\"1.0\" encoding=\"utf-8\"?><Model id=\""+model.id+"\">";
		xml += genDiaram(model.root);
		xml += "</Model>";
		return xml;
	}
	
	static String genDiaram(Diagram diagram) {
		String xml = "<Diagram id=\""+diagram.id+"\" meta_id=\""+diagram.meta.id+"\">";
		xml += genVersionElement(diagram.ve);
		for(NodeObject obj : diagram.nodes) {
			xml += genObject(obj);
		}
		for(Relationship rel : diagram.relationships) {
			xml += genRelationship(rel);
		}
		xml += "</Diagram>";
		return xml;
	}
	
	static String genObject(NodeObject obj) {
		String xml = "<Object id=\""+obj.id+"\" meta_id=\""+obj.meta.id+"\" x=\""+obj.pos.x+"\" y=\""+obj.pos.y+"\">";
		xml += genVersionElement(obj.ve);
		for(Property p : obj.properties) {
			xml += genProperty(p);
		}
		xml += "</Object>";
		return xml;
	}
	
	static String genRelationship(Relationship rel) {
		String xml = "<Relationship id=\""+rel.id+"\" meta_id=\""+rel.meta.id+"\" src=\""+rel.src.id+"\" dest=\""+rel.dest.id+"\">";
		xml += genVersionElement(rel.ve);
		for(Point2D p : rel.points) {
			xml += "<Point x=\""+p.x+"\" y=\""+p.y+"\"/>";
		}
		for(Property p : rel.properties) {
			xml += genProperty(p);
		}
		xml += "</Relationship>";
		return xml;
	}
	
	static String genProperty(Property prop) {
		if(prop.meta == null) return "";
		String xml = "<Property id=\""+prop.id+"\" meta_id=\""+prop.meta.id+"\">";
		xml += prop.content;
		xml += genVersionElement(prop.ve);
		xml += "</Property>";
		return xml;
	}
	
	static String genVersionElement(VersionElement ve) {
		String xml = "<VersionElement version=\""+ve.version+"\" ver_type=\""+ve.ver_type+"\" />";
		return xml;
	}
	
	static Model parse(String xml) {
		Model model = null;
		Document doc = null;
		try {
			doc = XMLParser.parse(xml);
		}catch(Exception e) {
			
		}finally{
			
		}
		if(doc != null) {
		NodeList nl = doc.getChildNodes();
		for(int i = 0;i < nl.getLength();i++) {
			GWT.log("load" + nl.item(i).getNodeName());
			if(nl.item(i).getNodeName().matches("Model")) {
				model = parseModel(nl.item(i));
			}
		}
		}
		if(model == null) {
			model = new Model();
			model.root = new Diagram();
			model.root.meta = MetaModelController.getMetaModel().meta_diagram;
			model.root.id = 1;
		}
		return model;
	}
	
	static Model parseModel(Node node) {
		Model model = new Model();
		model.id = Integer.decode(node.getAttributes().getNamedItem("id").getNodeValue());
		NodeList nl = node.getChildNodes();
		for(int i = 0;i < nl.getLength();i++) {
			if(nl.item(i).getNodeName().matches("Diagram")) {
				model.root = parseDiagram(nl.item(i));
			}
		}
		return model;
	}

	static Diagram parseDiagram(Node node) {
		Diagram diagram = new Diagram();
		diagram.id = Integer.decode(node.getAttributes().getNamedItem("id").getNodeValue());
		IdGenerator.setOffset(diagram.id);
		int meta_id = Integer.decode(node.getAttributes().getNamedItem("meta_id").getNodeValue());
		diagram.meta = MetaModelController.getMetaDiagram(meta_id);
		NodeList nl = node.getChildNodes();
		for(int i = 0;i < nl.getLength();i++) {
			if(nl.item(i).getNodeName().matches("Object")) {
				diagram.nodes.add(parseObject(nl.item(i)));
			}else if(nl.item(i).getNodeName().matches("Relationship")) {
				diagram.relationships.add(parseRelationship(nl.item(i), diagram));
			}else if(nl.item(i).getNodeName().matches("VersionElement")) {
				diagram.ve = parseVersionElement(nl.item(i));
			}
		}
		return diagram;
	}
	
	static NodeObject parseObject(Node node) {
		NodeObject diagram = new NodeObject();
		diagram.id = Integer.decode(node.getAttributes().getNamedItem("id").getNodeValue());
		IdGenerator.setOffset(diagram.id);
		int meta_id = Integer.decode(node.getAttributes().getNamedItem("meta_id").getNodeValue());
		diagram.meta = MetaModelController.getMetaObject(meta_id);
		GWT.log(node.getAttributes().getNamedItem("x").getNodeValue());
		GWT.log(node.getAttributes().getNamedItem("y").getNodeValue());
		double x = Double.valueOf(node.getAttributes().getNamedItem("x").getNodeValue());
		double y = Double.valueOf(node.getAttributes().getNamedItem("y").getNodeValue());
		DiagramController.transition(diagram, x, y);
		NodeList nl = node.getChildNodes();
		for(int i = 0;i < nl.getLength();i++) {
			if(nl.item(i).getNodeName().matches("Property")) {
				diagram.properties.add(parseProperty(nl.item(i)));
			}else if(nl.item(i).getNodeName().matches("VersionElement")) {
				diagram.ve = parseVersionElement(nl.item(i));
			}
		}
		return diagram;
	}
	
	static Relationship parseRelationship(Node node, Diagram parent) {
		Relationship diagram = new Relationship();
		diagram.id = Integer.decode(node.getAttributes().getNamedItem("id").getNodeValue());
		IdGenerator.setOffset(diagram.id);
		int meta_id = Integer.decode(node.getAttributes().getNamedItem("meta_id").getNodeValue());
		diagram.meta = MetaModelController.getMetaRelationship(meta_id);
		diagram.src = DiagramController.getObject(parent, Integer.decode(node.getAttributes().getNamedItem("src").getNodeValue()));
		diagram.dest = DiagramController.getObject(parent, Integer.decode(node.getAttributes().getNamedItem("dest").getNodeValue()));
		NodeList nl = node.getChildNodes();
		for(int i = 0;i < nl.getLength();i++) {
			if(nl.item(i).getNodeName().matches("Property")) {
				diagram.properties.add(parseProperty(nl.item(i)));
			}else if(nl.item(i).getNodeName().matches("Point")) {
				diagram.points.add(parsePoint(nl.item(i)));
			}else if(nl.item(i).getNodeName().matches("VersionElement")) {
				diagram.ve = parseVersionElement(nl.item(i));
			}
		}
		return diagram;
	}
	
	static Point2D parsePoint(Node node) {
		Point2D p = new Point2D(0, 0);
		p.x = Integer.decode(node.getAttributes().getNamedItem("x").getNodeValue());
		p.y = Integer.decode(node.getAttributes().getNamedItem("y").getNodeValue());
		return p;
	}

	static Property parseProperty(Node node) {
		Property property = new Property();
		property.id = Integer.decode(node.getAttributes().getNamedItem("id").getNodeValue());
		int meta_id = Integer.decode(node.getAttributes().getNamedItem("meta_id").getNodeValue());
		property.meta = MetaModelController.getMetaProperty(meta_id);
		NodeList nl = node.getChildNodes();
		for(int i = 0;i < nl.getLength();i++) {
			if(nl.item(i).getNodeType() == com.google.gwt.xml.client.Node.TEXT_NODE) {
				String value = nl.item(i).getNodeValue();
				property.content = value;
			}else if(nl.item(i).getNodeName().matches("VersionElement")) {
				property.ve = parseVersionElement(nl.item(i));
			}
		}
		return property;
	}
	
	static VersionElement parseVersionElement(Node node) {
		VersionElement ve = new VersionElement();
		ve.version = Integer.decode(node.getAttributes().getNamedItem("version").getNodeValue());
		ve.ver_type = node.getAttributes().getNamedItem("version").getNodeValue();
		return ve;
	}

}
