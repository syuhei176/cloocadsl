# Makefile
#include Makefile.in

# It needs to define this macro to use TOPPERS/JSP
TOPPERS_KERNEL = NXT_JSP

# Target specific macros
TARGET = mdlnxtproj
BUILD_MODE=ROM_ONLY

# C++(.cpp) source files
TARGET_CPP_SOURCES = \
 main.cpp\
 c_${root.statediagram.id}.cpp

# TOPPERS/JSP config file
TOPPERS_JSP_CFG_SOURCE = ./mdlnxtproj.cfg

# don't change this macro
O_PATH ?= build

# makefile for C++(.cpp) build
include ../../ecrobot/ecrobot++.mak