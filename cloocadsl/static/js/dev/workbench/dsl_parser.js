

/* Prototype file of JavaScript parser.
 * Written by MORI Koichiro
 * This file is PUBLIC DOMAIN.
 */

var buffer;
var token;
var toktype;

var YYERRTOK = 256;
var STRING = 257;
var NUMBER = 258;
var IDENTIFIER = 259;

  
/*
  #define yyclearin (yychar = -1)
  #define yyerrok (yyerrflag = 0)
  #define YYRECOVERING (yyerrflag != 0)
  #define YYERROR  goto yyerrlab
*/


/** Debug mode flag **/
var yydebug = false;

/** lexical element object **/
var yylval = null;

/** Dialog window **/
var yywin = null;
var yydoc = null;

function yydocopen() {
  if (yywin == null) {
    yywin = window.open("", "yaccdiag", "resizable,status,width=600,height=400");
    yydoc = null;
  }
  if (yydoc == null)
    yydoc = yywin.document;
  yydoc.open();
}

function yyprintln(msg)
{
  if (yydoc == null)
    yydocopen();
  yydoc.write(msg + "<br>");
}

function yyflush()
{
  if (yydoc != null) {
    yydoc.close();
    yydoc = null;
    yywin = null;
  }
}



var yytranslate = [
      0,    9,    9,    9,    9,    9,    9,    9,    9,    9,
      9,    9,    9,    9,    9,    9,    9,    9,    9,    9,
      9,    9,    9,    9,    9,    9,    9,    9,    9,    9,
      9,    9,    9,    9,    9,    9,    9,    9,    9,    9,
      7,    8,    5,    3,    9,    4,    9,    6,    9,    9,
      9,    9,    9,    9,    9,    9,    9,    9,    9,    9,
      9,    9,    9,    9,    9,    9,    9,    9,    9,    9,
      9,    9,    9,    9,    9,    9,    9,    9,    9,    9,
      9,    9,    9,    9,    9,    9,    9,    9,    9,    9,
      9,    9,    9,    9,    9,    9,    9,    9,    9,    9,
      9,    9,    9,    9,    9,    9,    9,    9,    9,    9,
      9,    9,    9,    9,    9,    9,    9,    9,    9,    9,
      9,    9,    9,    9,    9,    9,    9,    9,    9,    9,
      9,    9,    9,    9,    9,    9,    9,    9,    9,    9,
      9,    9,    9,    9,    9,    9,    9,    9,    9,    9,
      9,    9,    9,    9,    9,    9,    9,    9,    9,    9,
      9,    9,    9,    9,    9,    9,    9,    9,    9,    9,
      9,    9,    9,    9,    9,    9,    9,    9,    9,    9,
      9,    9,    9,    9,    9,    9,    9,    9,    9,    9,
      9,    9,    9,    9,    9,    9,    9,    9,    9,    9,
      9,    9,    9,    9,    9,    9,    9,    9,    9,    9,
      9,    9,    9,    9,    9,    9,    9,    9,    9,    9,
      9,    9,    9,    9,    9,    9,    9,    9,    9,    9,
      9,    9,    9,    9,    9,    9,    9,    9,    9,    9,
      9,    9,    9,    9,    9,    9,    9,    9,    9,    9,
      9,    9,    9,    9,    9,    9,    1,    9,    2,    9
  ];

var YYBADCH = 9;
var YYMAXLEX = 260;
var YYTERMS = 9;
var YYNONTERMS = 6;

var yyaction = [
      4,    5,    0,   23,    0,   22,   -3,   15,    3,    0,
      4,    5,    0,    6,    7
  ];

var YYLAST = 15;

var yycheck = [
      3,    4,    0,    2,   -1,    8,    0,    1,    7,   -1,
      3,    4,   -1,    5,    6
  ];

var yybase = [
      6,   -3,    7,    1,    1,    1,    1,    1,    8,    8,
      2,    1,    8,    8
  ];

var YY2TBLSTATE = 3;

var yydefault = [
  32767,32767,    2,32767,32767,32767,32767,32767,    7,    8,
  32767
  ];



var yygoto = [
      1,    8,    9,   20,   21
  ];

var YYGLAST = 5;

var yygcheck = [
      3,    3,    3,    3,    3
  ];

var yygbase = [
      0,    0,    0,   -3,    0,    0
  ];

var yygdefault = [
  -32768,   10,   12,    2,-32768,-32768
  ];

var yylhs = [
      0,    1,    2,    2,    2,    4,    5,    3,    3,    3,
      3,    3,    3
  ];

var yylen = [
      1,    1,    1,    0,    1,    4,    1,    3,    3,    3,
      3,    3,    1
  ];

var YYSTATES = 17;
var YYNLSTATES = 11;
var YYINTERRTOK = 1;
var YYUNEXPECTED = 32767;
var YYDEFAULT = -32766;

/*
 * Parser entry point
 */

function yyparse()
{
  var yyastk = new Array();
  var yysstk = new Array();

  yystate = 0;
  yychar = -1;

  yysp = 0;
  yysstk[yysp] = 0;
  yyerrflag = 0;
  for (;;) {
    if (yybase[yystate] == 0)
      yyn = yydefault[yystate];
    else {
      if (yychar < 0) {
        if ((yychar = yylex()) <= 0) yychar = 0;
        yychar = yychar < YYMAXLEX ? yytranslate[yychar] : YYBADCH;
      }

      if (((yyn = yybase[yystate] + yychar) >= 0
	    && yyn < YYLAST && yycheck[yyn] == yychar
           || (yystate < YY2TBLSTATE
               && (yyn = yybase[yystate + YYNLSTATES] + yychar) >= 0
               && yyn < YYLAST && yycheck[yyn] == yychar))
	  && (yyn = yyaction[yyn]) != YYDEFAULT) {
        /*
         * >= YYNLSTATE: shift and reduce
         * > 0: shift
         * = 0: accept
         * < 0: reduce
         * = -YYUNEXPECTED: error
         */
        if (yyn > 0) {
          /* shift */
          yysp++;

          yysstk[yysp] = yystate = yyn;
          yyastk[yysp] = yylval;
          yychar = -1;
          
          if (yyerrflag > 0)
            yyerrflag--;
          if (yyn < YYNLSTATES)
            continue;
            
          /* yyn >= YYNLSTATES means shift-and-reduce */
          yyn -= YYNLSTATES;
        } else
          yyn = -yyn;
      } else
        yyn = yydefault[yystate];
    }
      
    for (;;) {
      /* reduce/error */
      if (yyn == 0) {
        /* accept */
        yyflush();
        return 0;
      }
      else if (yyn != YYUNEXPECTED) {
        /* reduce */
        yyl = yylen[yyn];
        yyval = yyastk[yysp-yyl+1];
        /* Following line will be replaced by reduce actions */
        switch(yyn) {
        case 2:
{ yyprintanswer("Answer = " + yyastk[yysp-(1-1)]); } break;
        case 3:
{ yyval = "(empty line ignored)<br>"; } break;
        case 4:
{ yyval = ""; } break;
        case 5:
{} break;
        case 7:
{ yyval = yyastk[yysp-(3-1)] + yyastk[yysp-(3-3)]; } break;
        case 8:
{ yyval = yyastk[yysp-(3-1)] - yyastk[yysp-(3-3)]; } break;
        case 9:
{ yyval = yyastk[yysp-(3-1)] * yyastk[yysp-(3-3)]; } break;
        case 10:
{ yyval = yyastk[yysp-(3-1)] / yyastk[yysp-(3-3)]; } break;
        case 11:
{ yyval = yyastk[yysp-(3-2)]; } break;
        case 12:
{ yyval = yyastk[yysp-(1-1)]; } break;
        }
        /* Goto - shift nonterminal */
        yysp -= yyl;
        yyn = yylhs[yyn];
        if ((yyp = yygbase[yyn] + yysstk[yysp]) >= 0 && yyp < YYGLAST
            && yygcheck[yyp] == yyn)
          yystate = yygoto[yyp];
        else
          yystate = yygdefault[yyn];
          
        yysp++;

        yysstk[yysp] = yystate;
        yyastk[yysp] = yyval;
      }
      else {
        /* error */
        switch (yyerrflag) {
        case 0:
          yyerror("syntax error");
        case 1:
        case 2:
          yyerrflag = 3;
          /* Pop until error-expecting state uncovered */

          while (!((yyn = yybase[yystate] + YYINTERRTOK) >= 0
                   && yyn < YYLAST && yycheck[yyn] == YYINTERRTOK
                   || (yystate < YY2TBLSTATE
                       && (yyn = yybase[yystate + YYNLSTATES] + YYINTERRTOK) >= 0
                       && yyn < YYLAST && yycheck[yyn] == YYINTERRTOK))) {
            if (yysp <= 0) {
              yyflush();
              return 1;
            }
            yystate = yysstk[--yysp];
          }
          yyn = yyaction[yyn];
          yysstk[++yysp] = yystate = yyn;
          break;

        case 3:
          if (yychar == 0) {
            yyflush();
            return 1;
          }
          yychar = -1;
          break;
        }
      }
        
      if (yystate < YYNLSTATES)
        break;
      /* >= YYNLSTATES means shift-and-reduce */
      yyn = yystate - YYNLSTATES;
    }
  }
}



/* Lexical analyzer */

var buffer;
var token;
var toktype;

TitleMessage = "Calculator";
FormMessage = "Enter integer expression (ex. 2+3*4):";

function isletter(c)
{
  return ('a' <= c && c <= 'z') || ('A' <= c && c <= 'Z');
}

function isdigit(c)
{
  return ('0' <= c && c <= '9');
}

function yylex()
{
  yylval = null;
  while (buffer != ""
         && (buffer.charAt(0) == ' ' || buffer.charAt(0) == '\t')) {
    buffer = buffer.substr(1);
  }
  if (buffer.length == 0)
    return 0;
  if (isletter(buffer.charAt(0))) {
    var i;
    for (i = 0; i < buffer.length; i++) {
      if (!isletter(buffer.charAt(i)) && !isdigit(buffer.charAt(i)))
        break;
    }
    token = buffer.substr(0, i);
    buffer = buffer.substr(i);
    yylval = token;
    return IDENTIFIER;
  } else if (isdigit(buffer.charAt(0))) {
    var i;
    for (i = 0; i < buffer.length; i++) {
      if (!isdigit(buffer.charAt(i)))
        break;
    }
    token = buffer.substr(0, i);
    buffer = buffer.substr(i);
    yylval = token - 0;
    return NUMBER;
  } else {
    token = buffer.substr(0, 1);
    buffer = buffer.substr(1);
    return token.charCodeAt(0);
  }
}

function yyerror(msg) {
  yyprintln(msg);
}



function main() {
  buffer = document.compiledtext.one.value;
  yyparse();
}
