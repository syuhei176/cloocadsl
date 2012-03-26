package com.clooca.core.client.presenter;

import com.clooca.core.client.model.gopr.element.VersionElement;
import com.clooca.core.client.model.gopr.metaelement.Binding;
import com.clooca.core.client.model.gopr.metaelement.GraphicInfo;
import com.clooca.core.client.model.gopr.metaelement.MetaDiagram;
import com.clooca.core.client.model.gopr.metaelement.MetaModel;
import com.clooca.core.client.model.gopr.metaelement.MetaObject;
import com.clooca.core.client.model.gopr.metaelement.MetaProperty;
import com.clooca.core.client.model.gopr.metaelement.MetaRelation;
import com.clooca.core.client.util.Converter;
import com.clooca.core.client.util.IdGenerator;
import com.clooca.core.client.workbench.presenter.WorkbenchController;
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
public class XMLMetaPresenter {
	
	static public String genModel(MetaModel model) {
		String xml = "<?xml version=\"1.0\" encoding=\"utf-8\"?><MetaModel id=\""+model.id+"\" name=\""+model.name+"\">";
		xml += genDiaram(model.meta_diagram);
		xml += "</MetaModel>";
		return xml;
	}
	
	static String genDiaram(MetaDiagram diagram) {
		String xml = "<MetaDiagram id=\""+diagram.id+"\" name=\""+diagram.name+"\">";
		xml += genVersionElement(diagram.ve);
		for(MetaObject obj : diagram.meta_objects) {
			xml += genObject(obj);
		}
		for(MetaRelation rel : diagram.meta_relations) {
			xml += genRelationship(rel);
		}
		xml += "</MetaDiagram>";
		return xml;
	}
	
	static String genObject(MetaObject obj) {
		String xml = "<MetaObject id=\""+obj.id+"\" name=\""+obj.name+"\" x=\""+obj.pos.x+"\" y=\""+obj.pos.y+"\">";
		xml += genVersionElement(obj.ve);
		xml += genGraphic(obj.graphic);
		for(MetaProperty p : obj.properties) {
			xml += genProperty(p);
		}
		xml += "</MetaObject>";
		return xml;
	}
	
	static String genRelationship(MetaRelation rel) {
		String xml = "<MetaRelationship id=\""+rel.id+"\" name=\""+rel.name+"\" arrow=\""+rel.arrow_type+"\">";
		xml += genVersionElement(rel.ve);
		for(MetaProperty p : rel.properties) {
			xml += genProperty(p);
		}
		for(Binding p : rel.bindings) {
			xml += genBinding(p);
		}
		xml += "</MetaRelationship>";
		return xml;
	}
	
	static String genBinding(Binding binding) {
		String xml = "<Binding src=\""+binding.src.id+"\" dest=\""+binding.dest.id+"\">";
		xml += "</Binding>";
		return xml;
	}
	
	static String genProperty(MetaProperty prop) {
		String xml = "<MetaProperty id=\""+prop.id+"\" name=\""+prop.name+"\" data_type=\""+prop.data_type+"\" widget=\""+prop.widget+"\">";
		xml += "<Exfield>"+Converter.convert_xml(prop.exfield)+"</Exfield>";
		xml += genVersionElement(prop.ve);
		xml += "</MetaProperty>";
		return xml;
	}
	
	static String genGraphic(GraphicInfo g) {
		String xml = "<Graphic id=\""+g.id+"\" shape=\""+g.shape+"\" color=\""+g.color+"\">";
		xml += "</Graphic>";
		return xml;
	}
	
	static String genVersionElement(VersionElement ve) {
		String xml = "<VersionElement version=\""+ve.version+"\" ver_type=\""+ve.ver_type+"\" />";
		return xml;
	}
	
	public static MetaModel parse(String xml) {
		MetaModel model = null;
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
			if(nl.item(i).getNodeName().matches("MetaModel")) {
				model = parseModel(nl.item(i));
			}
		}
		}
		if(model == null) {
			model = new MetaModel();
			model.meta_diagram = new MetaDiagram();
			model.meta_diagram.id = 1;
		}
		return model;
	}
	
	static MetaModel parseModel(Node node) {
		MetaModel model = new MetaModel();
		model.id = Integer.decode(node.getAttributes().getNamedItem("id").getNodeValue());
		model.name = node.getAttributes().getNamedItem("name").getNodeValue();
		NodeList nl = node.getChildNodes();
		for(int i = 0;i < nl.getLength();i++) {
			if(nl.item(i).getNodeName().matches("MetaDiagram")) {
				model.meta_diagram = parseDiagram(nl.item(i));
			}
		}
		return model;
	}

	static MetaDiagram parseDiagram(Node node) {
		MetaDiagram diagram = new MetaDiagram();
		diagram.id = Integer.decode(node.getAttributes().getNamedItem("id").getNodeValue());
		diagram.name = node.getAttributes().getNamedItem("name").getNodeValue();
		NodeList nl = node.getChildNodes();
		for(int i = 0;i < nl.getLength();i++) {
			if(nl.item(i).getNodeName().matches("MetaObject")) {
				diagram.meta_objects.add(parseObject(nl.item(i)));
			}else if(nl.item(i).getNodeName().matches("MetaRelationship")) {
				diagram.meta_relations.add(parseRelationship(nl.item(i), diagram));
			}else if(nl.item(i).getNodeName().matches("VersionElement")) {
				diagram.ve = parseVersionElement(nl.item(i));
			}
		}
		return diagram;
	}
	
	static MetaObject parseObject(Node node) {
		MetaObject diagram = new MetaObject();
		diagram.id = Integer.decode(node.getAttributes().getNamedItem("id").getNodeValue());
		IdGenerator.setOffset(diagram.id);
		diagram.name = node.getAttributes().getNamedItem("name").getNodeValue();
//		double x = Double.valueOf(node.getAttributes().getNamedItem("x").getNodeValue());
//		double y = Double.valueOf(node.getAttributes().getNamedItem("y").getNodeValue());
//		DiagramController.transition(diagram, x, y);
		NodeList nl = node.getChildNodes();
		for(int i = 0;i < nl.getLength();i++) {
			if(nl.item(i).getNodeName().matches("MetaProperty")) {
				diagram.properties.add(parseProperty(nl.item(i)));
			}else if(nl.item(i).getNodeName().matches("VersionElement")) {
				diagram.ve = parseVersionElement(nl.item(i));
			}else if(nl.item(i).getNodeName().matches("Graphic")) {
				diagram.graphic = parseGraphicInfo(nl.item(i));
			}
		}
		return diagram;
	}
	
	static MetaRelation parseRelationship(Node node, MetaDiagram parent) {
		MetaRelation diagram = new MetaRelation();
		diagram.id = Integer.decode(node.getAttributes().getNamedItem("id").getNodeValue());
		IdGenerator.setOffset(diagram.id);
		diagram.name = node.getAttributes().getNamedItem("name").getNodeValue();
		if(node.getAttributes().getNamedItem("arrow") != null) {
			diagram.arrow_type = node.getAttributes().getNamedItem("arrow").getNodeValue();
		}else{
			diagram.arrow_type = "none";
		}
		NodeList nl = node.getChildNodes();
		for(int i = 0;i < nl.getLength();i++) {
			if(nl.item(i).getNodeName().matches("MetaProperty")) {
				diagram.properties.add(parseProperty(nl.item(i)));
			}else if(nl.item(i).getNodeName().matches("VersionElement")) {
				diagram.ve = parseVersionElement(nl.item(i));
			}else if(nl.item(i).getNodeName().matches("Binding")) {
				diagram.bindings.add(parseBinding(nl.item(i), parent));
			}
		}
		return diagram;
	}
	
	static Binding parseBinding(Node node, MetaDiagram parent) {
		int src = Integer.decode(node.getAttributes().getNamedItem("src").getNodeValue());
		int dest = Integer.decode(node.getAttributes().getNamedItem("dest").getNodeValue());
		Binding binding = new Binding(WorkbenchController.getMetaObject(src, parent), WorkbenchController.getMetaObject(dest, parent));
/*		NodeList nl = node.getChildNodes();
		for(int i = 0;i < nl.getLength();i++) {
			if(nl.item(i).getNodeType() == com.google.gwt.xml.client.Node.TEXT_NODE) {
				String value = nl.item(i).getNodeValue();
				property.content = value;
			}else if(nl.item(i).getNodeName().matches("VersionElement")) {
				property.ve = parseVersionElement(nl.item(i));
			}
		}
		*/
		return binding;
	}

	static MetaProperty parseProperty(Node node) {
		MetaProperty property = new MetaProperty();
		property.id = Integer.decode(node.getAttributes().getNamedItem("id").getNodeValue());
		property.name = node.getAttributes().getNamedItem("name").getNodeValue();
		property.data_type = node.getAttributes().getNamedItem("data_type").getNodeValue();
		property.widget = node.getAttributes().getNamedItem("widget").getNodeValue();
		NodeList nl = node.getChildNodes();
		for(int i = 0;i < nl.getLength();i++) {
			if(nl.item(i).getNodeName().matches("Exfield")) {
				NodeList nl2 = nl.item(i).getChildNodes();
				for(int j = 0;j < nl2.getLength();j++) {
					if(nl2.item(j).getNodeType() == com.google.gwt.xml.client.Node.TEXT_NODE) {
						String value = nl2.item(j).getNodeValue();
						property.exfield = Converter.decode_xml(value);
					}
				}
			}
		}
		return property;
	}
	
	static GraphicInfo parseGraphicInfo(Node node) {
		GraphicInfo gi = new GraphicInfo();
		gi.id = Integer.decode(node.getAttributes().getNamedItem("id").getNodeValue());
		gi.shape = node.getAttributes().getNamedItem("shape").getNodeValue();
		if(node.getAttributes().getNamedItem("color") != null) gi.color = node.getAttributes().getNamedItem("color").getNodeValue();
		return gi;
	}
	
	static VersionElement parseVersionElement(Node node) {
		VersionElement ve = new VersionElement();
		ve.version = Integer.decode(node.getAttributes().getNamedItem("version").getNodeValue());
		ve.ver_type = node.getAttributes().getNamedItem("version").getNodeValue();
		return ve;
	}

}
