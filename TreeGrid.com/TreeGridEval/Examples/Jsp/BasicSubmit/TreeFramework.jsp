<%@page contentType="text/html"%><%@page pageEncoding="UTF-8"%><%@include file="../Framework/TreeGridFramework.jsp"%><%
/*-----------------------------------------------------------------------------------------------------------------
Example of TreeGrid using synchronous (submit, non AJAX) communication with server
Example of tree table
Uses HSQLDB database Database (.properties and .script) as data and XML file TreeDef.xml as TreeGrid layout
Uses routines in TreeGridFramework.jsp to load and save data
! Check if JAVA application has write access to ../Database.properties and ../Database.script files
! Don't forget to copy hsqldb.jar file to JAVA shared lib directory
------------------------------------------------------------------------------------------------------------------*/

//------------------------------------------------------------------------------------------------------------------
response.addHeader("Cache-Control","max-age=1, must-revalidate");

// --- Database connection ---
java.sql.Statement Cmd = getHsqlStatement(request,out,"../Database","sa","",true);

// --- Save data to database ---
saveTree(request.getParameter("TGOutput"),Cmd,"TreeData","ID","Parent","#Body");

// --- Load data from database ---
String[] Names = {"A","C","D","E","G","H","I","id","Parent","Pos","Def"};
String Str = toHTMLString(getTreeXML(Cmd,"TreeData",Names,"#Body","#Head","#Foot",true));
//------------------------------------------------------------------------------------------------------------------
%><html>
   <head>
      <script src="../../../Grid/GridE.js"> </script>
      <style>
         /* Examples shared styles */
         .ExampleHeader { font:normal 16px Arial; color:blue; }
         .ExampleHeader b { color:#800; }
         .ExampleHeader i { color:black; font-style:normal; font-weight:bold; }
         .ExampleHeader u { text-decoration:none; color:#0B0; font-weight:bold; padding:0px 2px 0px 2px; }
         .ExampleName { font:bold 30px Arial; padding:5px 0px 5px 0px; }
         .ExampleShort { font:italic 15px Arial; margin-bottom:10px; padding-top:5px; }
         .ExampleDesc { margin:0px 5px 10px 5px; padding:5px; border:1px solid #AAA; }
         .ExampleErr { margin:50px auto 10px auto; padding:5px; line-height:30px; border:1px solid black; color:red; width:800px; text-align:center; display:none; }
         .ExampleBorder { margin:0px 5px 5px 5px; clear:both; zoom:1; }
         .ExampleDesc ul { padding:0px 0px 0px 15px; margin:10px 0px 0px 0px; }
         .ExampleDesc li { padding-bottom:8px; line-height:18px; }
         .ExampleDesc h4 { display:inline; font:bold 15px Arial; line-height:20px; padding-left:6px; padding-right:6px; background:#87DAE5; border:1px solid #888; color:black; margin:0px; font-style:normal; }
         .ExampleDesc u { text-decoration:none; font-size:11px; }
         .ExampleDesc .Link { text-decoration:underline; color:blue; cursor:pointer; }
         .ExampleForm input { margin:0px 0px 0px 5px; }
      </style>
   </head>
   <body>
      <center class="ExampleHeader"><script>document.write(location.href.replace(/(.*)(\/Examples\/|\/ExamplesGantt\/)([^\/]+)\/([^\/]+)\/([^\/]+)$/,"$2<b>$3</b>/<i>$4</i>/$5").replace(/([^<]|^)(\/|\.)/g,"$1<u>$2</u>"));</script></center>
      <center class="ExampleName">Tree in SQL database</center>
      <center class="ExampleShort">Tree in database table using Parent / Id relationship, uses <b>form submit</b> and <b>TreeGrid JSP framework</b></center>
      <div class="ExampleErr">
         <script> if(location.protocol=="file:") document.write("<style>.ExampleDesc, .ExampleBorder {display:none;} .ExampleErr { display:block; } </style>"); </script>
         Do <b>not</b> run this file locally!<br />Run it from your local or remote web http server where is installed JAVA JRE.<br>
      </div>
      <div class="ExampleDesc">
         <i>Source files:</i> <h4>TreeFramework.jsp</h4> (this html page and also server script that generates and processes XML data), 
         <a href="TreeDef.xml" target="_blank"><h4>TreeDef.xml</h4></a> (static XML layout), 
         <h4>../Database.*</h4> (source SQL database, table <b>TreeData</b>),
         <h4>../Framework/TreeGridFramework.jsp</h4> (TreeGrid JSP framework support script, included into <b>TreeFramework.jsp</b> script)
      </div>
      <div class="ExampleDesc">
         <h4 style="background:#FCC;">You have to copy file <b style="color:red;">hsqldb.jar</b> to your JRE shared lib directory and <b style="color:red;">restart</b> your http server</h4><br />
         <h4 style="background:#FCC;">The JSP service program must have <b style="color:red;">write</b> access to all files <b style="color:red;">database.*</b></h4><br />
         The <h4>hsqldb.jar</b> is JDBC driver for <a href='http://www.hsqldb.org'><h4>HSQLDB database</h4></a> and is located in TreeGrid distribution in <b>/Server/Jsp/</b> directory.
         <u>The shared lib directory is usually <b><i>jre_install_path</i>/lib/ext</b> and also e.g. in Tomcat is usually <b><i>tomcat_install_path</i>/shared/lib</b>.</u><br>
         You can use any other SQL database instead of HSQLDB (e.g. <h4>Oracle</h4>, <h4>MS SQL server</h4>, <h4>MySQL</h4> ,...), just assign different connection to java.sql.Connection Conn in the Basic.jsp. 
         You can run the ../<b>MySqlUTF8.sql</b> script to create the "TreeGridTest" sample database on your SQL server.
      </div>
      <div class="ExampleBorder">
         <div class="ExampleMain" style="width:100%;height:530px;">
            <bdo 
               Layout_Url='TreeDef.xml' 
               Data_Tag='TGInput' 
               Upload_Tag='TGOutput' Upload_Format='Internal'
               Export_Url="../Framework/Export.jsp" Export_Data="TGData" Export_Param_File="Tree.xls"
               ></bdo>
         </div>
      </div>
      <form method="post" class="ExampleForm">
         <input name="TGInput" type="hidden" value="<%=Str%>">
         <input name="TGOutput" type="hidden">
         <input type="submit" value="Submit changes to server"/>
      </form>
   </body>
</html>