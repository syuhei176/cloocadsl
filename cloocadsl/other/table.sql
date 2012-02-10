create table userinfo(
id int(11) NOT NULL auto_increment,
username varchar(32) NOT NULL,
password varchar(32) NOT NULL,
email varchar(128),
role tinyint(4) NOT NULL,
regist_date date,
login_datetime datetime,
detail text,
index(id));

create table projectinfo (
owner varchar(32),
projectname varchar(32),
projectpath varchar(32),
detail text,
canedituser tinytext
);

create table metaobject(
id int(11) NOT NULL auto_increment,
name varchar(32) NOT NULL,
graphic tinyint(4) NOT NULL,
abstract tinyint(1) NOT NULL,
tool tinyint(4) NOT NULL,
index(id));

create table metarelation(
id int(11) NOT NULL auto_increment,
name varchar(32) NOT NULL,
index(id));

create table metarole(
id int(11) NOT NULL auto_increment,
name varchar(32) NOT NULL,
metaobj_id tinyint(11) NOT NULL,
index(id));

create table metabinding(
metabinding_id int(11) NOT NULL,
metarelation_id tinyint(11) NOT NULL,
metarole_id tinyint(11) NOT NULL);

create table object(
id int(11) NOT NULL auto_increment,
metaobj_id tinyint(11) NOT NULL,
name varchar(32) NOT NULL,
index(id));

create table relationship(
id int(11) NOT NULL auto_increment,
metarelation_id tinyint(11) NOT NULL,
name varchar(32) NOT NULL,
index(id));

create table role(
id int(11) NOT NULL auto_increment,
metarole_id tinyint(11) NOT NULL,
obj_id tinyint(11) NOT NULL,
index(id));

create table metabinding(
id int(11) NOT NULL,
metabinding_id int(11) NOT NULL,
relation_id tinyint(11) NOT NULL,
role_id tinyint(11) NOT NULL);

grant select,insert,delete,update,create,drop on cloocadsl.* to cloocadsl identified by 'un1verse';