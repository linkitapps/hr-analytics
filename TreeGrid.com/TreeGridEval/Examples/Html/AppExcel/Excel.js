// -----------------------------------------------------------------------------------------
//                     Support script for TreeGrid MS Excel sheet example
// -----------------------------------------------------------------------------------------


// -----------------------------------------------------------------------------------------
// Called whenever the grid is scrolled, used to add row and column pages
Grids.OnScroll = function(G,x,y,ox,oy){

// --- Clears unused row and column pages when scrolled up or left ---
// Clears page if no data, no focus, not displayed in grid scroll area
// Does it in set timeout, because clearing pages directly in API event can cause various access violation
if(y<=oy && x<=ox) {
   if(G.MyTime) clearTimeout(G.MyTime);
   G.MyTime = setTimeout(function(){
      G.MyTime = null;
      var R = G.GetShownRows(), C = G.GetShownCols();
      var A = GetLastCell(G,0,G.FRect?G.FRect[2]:G.FRow,G.FRect?G.FRect[3]:G.FCol,G.ARow,G.ACol,R.length?G.GetNextVisible(R[R.length-1]):null,C.length?G.GetNextCol(C[C.length-1]):null);
      ShrinkRowPages(G,A[0]);
      ShrinkColPages(G,A[1],A[2]);
      },200);
   return;
   }

// --- Adds one new root page when grid is scrolled bottom ---
if(y>oy && y+10 > G.GetBodyScrollHeight()-G.GetBodyHeight()){ 
   G.AddPage(null,"<I/><I/><I/><I/><I/><I/><I/><I/><I/><I/>"); // Here are put directly the page data, not <Grid> tag. Adds 10 rows
   }

// --- Adds one new column page when grid is scrolled right ---
if(x>ox && x+10 > G.GetBodyScrollWidth(1)-G.GetBodyWidth(1)){ 
   var names = [];
   for(var i=1,cnt=0;i<G.ColNames.length-1;i++) cnt += G.ColNames[i].length;
   for(var i=0;i<10;i++) { // Generates 10 column with unique names
      var n = i+cnt;
      names[i] = n>=26*27 ? String.fromCharCode(Math.floor(n/26/26-1)%26+65,Math.floor(n/26-1)%26+65,n%26+65) : String.fromCharCode(Math.floor(n/26-1)%26+65,n%26+65)
      }
   G.AddColPage(names);
   }
}
// -----------------------------------------------------------------------------------------
// Called whenever focused cell(s) are changed
Grids.OnFocus = function(G,row,col,orow,ocol,fpos,rect,orect){
if(!row.Space && (row!=orow||col!=ocol)) {
   CellChanged(Get(row,col),null);                                      // Mirrors actualy focused cell value to top Edit row, EDIT cell
   var r = G.GetRowById("Edit"); 
   r.FOCUS = row&&row.id ? (col+row.id) + (rect ? " => "+rect[1]+rect[0].id+" : "+rect[3]+rect[2].id : "") : ""; G.RefreshCell(r,"FOCUS"); // Sets the focused cell to top Edit row, FOCUS cell
   UpdateToolbar(G);
   }
}
// -----------------------------------------------------------------------------------------
// Updates toolbar buttons B, I, U and alignment according to focused cell attributes
function UpdateToolbar(G){
var r = G.GetRowById("Toolbar"), row = G.FRow, col = G.FCol; 
var va = row[col+"VAlign"]; 
r.VALIGN = va ? {"top":0,"middle":1,"bottom":2}[va.toLowerCase()] : 2; G.RefreshCell(r,"VALIGN");
var aa = row[col+"Align"]; 
r.ALIGN = aa ? {"left":0,"center":1,"right":2}[aa.toLowerCase()] : null; G.RefreshCell(r,"ALIGN");
var cls = row[col+"Class"]; if(!cls) cls = "";
r.BOLD = cls.indexOf("Bold")>=0?1:0; G.RefreshCell(r,"BOLD");
r.ITALIC = cls.indexOf("Italic")>=0?1:0; G.RefreshCell(r,"ITALIC");
r.UNDERLINE = cls.indexOf("Underline")>=0?1:0; G.RefreshCell(r,"UNDERLINE");
}
// -----------------------------------------------------------------------------------------
// Called after editing is finished or cancelled
Grids.OnEndEdit = function(G,row,col,save,val,raw){
if(!save){
   if(!row.Space) CellChanged(Get(row,col),null);                       // If the edit was cancelled, mirrors old value from focused cell to top Edit row
   else if(row.id=="Edit"&&col=="EDIT") EditChanged(Get(row,col),null); // If the edit was cancelled, mirrors old value from Edit row to focused cell
   }
else if(row.id=="Edit" && col=="FOCUS" && val){                         // After editing top Edit row FOCUS cell moves focus to the entered cell or range
   val = val.toUpperCase();
   var M = val.match(/\s*(\d+)([A-z]+)\s*/);
   if(!M){ M = val.match(/\s*([A-z]+)(\d+)\s*/); if(M) M = [null,M[2],M[1]]; }
   if(M) setTimeout(function(){ G.Focus(G.GetRowById(M[1]),M[2],null,0,1); },10);
   }
}
// -----------------------------------------------------------------------------------------
// Called before the cell value is changed.  Used to align numbers right
Grids.OnValueChanged = function(G,row,col,val){
if(!row.Space){
   if(val-0||val==0) row[col+"Align"] = "Right";  // Aligns numbers to right
   else row[col+"Align"] = null;                  // Aligns strings to left as default
   }
}
// -----------------------------------------------------------------------------------------
// Called when filling cell values by mouse dragging the focus corner. Used to align numbers right
Grids.OnAutoFillValue = function(G,row,col,orow,ocol,val){ return Grids.OnValueChanged(G,row,col,val); }
// -----------------------------------------------------------------------------------------
// Called after moved focused area by mouse to copy the cells
// Here used only to move the border around the cells that is set in cells outside adjacent the moved area
// This code clears the source borders and stores the new borders that are filled in OnMoveFocusFinish (it is required if the source and destination areas overlay)
Grids.OnMoveFocus = function(G,rect,orect,V,R,C,OR,OC){ 
var N = [G.GetPrevVisible(R[0]),G.GetNextVisible(R[R.length-1]),G.GetPrevCol(C[0]),G.GetNextCol(C[C.length-1])], NN = [C,C,R,R];
var O = [G.GetPrevVisible(OR[0]),G.GetNextVisible(OR[OR.length-1]),G.GetPrevCol(OC[0]),G.GetNextCol(OC[OC.length-1])], OO = [OC,OC,OR,OR];
var Edge = ["B","T","R","L"], Q = [];
G.StartUpdate();
for(var i=0;i<4;i++){
   var n = N[i], o = O[i]; if(!n||!o) continue;
   var nn = NN[i], oo = OO[i];
   for(var j=0;j<nn.length;j++){
      if(i<2) { var r = n, c = nn[j], or = o, oc = oo[j]; }
      else { var r = nn[j], c = n, or = oo[j], oc = o; }
      if(!or || !r) continue;                                    // Can be null on spanned cells
      var b = or[oc+"Class"]; if(!b) continue;
      var regex = new RegExp("\\b"+Edge[i]+"[CS]\\w+\\b","g");
      var d = b.match(regex); if(!d||!d.length) continue;
      d = d.join(" ");
      b = b.replace(regex,"").replace(/^\s+|\s+$|\s+(?=\s)/g,"");
      G.SetAttribute(or,oc,"Class",b,1,1);                       // Clears the source cell edge borders
      Q[Q.length] = [r,c,regex,d];
      }
   }
G.EndUpdate();
G.TmpToSet = Q;
}
// -----------------------------------------------------------------------------------------
// Called after the moving focused cells finishes. Sets the border stored in OnMoveFocus to destination cells
Grids.OnMoveFocusFinish = function(G,rect,orect,V,R,C,OR,OC){ 
var Q = G.TmpToSet; G.TmpToSet = null;
G.StartUpdate();
for(var i=0;i<Q.length;i++) {
   var r = Q[i][0], c = Q[i][1], a = r[c+"Class"];
   if(a) a = a.replace(Q[i][2],"").replace(/^\s+|\s+$|\s+(?=\s)/g,""); a = (a ? a+" ":"") + Q[i][3];
   G.SetAttribute(r,c,"Class",a,1,1);
   }
G.EndUpdate();
G.MergeUndo(); G.MergeUndo(); // Merges undo for the border clear, moving values and border set
}
// -----------------------------------------------------------------------------------------
// Called for every value when moved focused area by dragging. Can be called twice, once for setting destination value and next for clearing the source cell.
// Used to copy other cell attributes (Color,Class,Align and VAlign)
Grids.OnMoveFocusValue = function(G,row,col,orow,ocol,val){ 
var A = ["Color","Class","Align","VAlign"];
for(var i=0;i<A.length;i++){
   var a = A[i], n = row[col+a], o = orow ? orow[ocol+a] : null;
   if(n!=o) G.SetAttribute(row,col,a,o,1,1);
   }
return Grids.OnValueChanged(G,row,col,val); 
}
// -----------------------------------------------------------------------------------------
// Called on undo to update cell align and row height according to the cell value
Grids.OnUndo = function(G,action,a,b,c,d,e){
if(action=="Change") { Grids.OnValueChanged(G,a,b,c); CellChanged(Get(a,b),c); G.RefreshCell(a,b); G.UpdateRowHeight(a,1); }
}
// -----------------------------------------------------------------------------------------
// Called on redo to update cell align and row height according to the cell value
Grids.OnRedo = function(G,action,a,b,c,d,e){
if(action=="Change") { Grids.OnValueChanged(G,a,b,c); CellChanged(Get(a,b),c); G.RefreshCell(a,b); G.UpdateRowHeight(a,1); }
}
// -----------------------------------------------------------------------------------------
// Called after cell value changed
Grids.OnAfterValueChanged = function(G,row,col,val){
if(row.id=="Toolbar"){
   if(col=="ALIGN") ChangeAttribute(G,"Align",["Left","Center","Right"][val]);   // Changed ALIGN radio on toolbar, sets the Align attribute of all selected cells
   if(col=="VALIGN") ChangeAttribute(G,"VAlign",["Top","Middle","Bottom"][val]); // Changed VALIGN radio on toolbar, sets the VAlign attribute of all selected cells
   }
}
// -----------------------------------------------------------------------------------------
// Changes given attribute attr of all selected cells to val
function ChangeAttribute(G,attr,val){
var S = G.GetSelRanges(), update = S.length>0;
if(!G.FRect) S[S.length] = [G.FRow,G.FCol,G.FRow,G.FCol]; // Adds focused cell, because this example does not select one focused cell
if(update) G.StartUpdate();
for(var i=0;i<S.length;i++){
   var F = S[i];
   for(var row=F[0],nrow=G.GetNext(F[2]);row!=nrow;row=G.GetNext(row)){
      for(var col=F[1],ncol=G.GetNextCol(F[3]);col!=ncol;col=G.GetNextCol(col)) if(Get(row,col+attr)!=val) {
         var v = val; 
         if(val==null&&attr=="Align") { var cv = Get(row,col); if(cv-0||cv==0) v = "Right"; }
         G.SetAttribute(row,col,attr,v,1,1);
         
         }
      }
   }
if(update) G.EndUpdate();
UpdateToolbar(G);
}
// -----------------------------------------------------------------------------------------
// Adds (if not exists) or removes (if exists) the css class from focused cell Class attribute
function ChangeFont(G,css){
var cls = G.FRow[G.FCol+"Class"], val = !cls||cls.indexOf(css)<0;
var S = G.GetSelRanges(), update = S.length>0;
if(!G.FRect) S[S.length] = [G.FRow,G.FCol,G.FRow,G.FCol]; // Adds focused cell, because this example does not select one focused cell
if(update) G.StartUpdate();
for(var i=0;i<S.length;i++){
   var F = S[i];
   for(var row=F[0],nrow=G.GetNext(F[2]);row!=nrow;row=G.GetNext(row)){
      for(var col=F[1],ncol=G.GetNextCol(F[3]);col!=ncol;col=G.GetNextCol(col)){
         var cls = row[col+"Class"];
         if(!cls) cls = ""; else if(cls.indexOf(css)>=0) { if(!val) cls = cls.replace(css+" ","").replace(css,"").replace(/\s$/,""); }
         if(val) cls += " "+css;
         if(row[col+"Class"]!=cls) G.SetAttribute(row,col,"Class",cls,1,1);
         }
      }
   }
if(update) G.EndUpdate();
UpdateToolbar(G);
}
// -----------------------------------------------------------------------------------------
// Mirrors actualy focused cell value to top Edit row 
// Called from OnChange in Edit JSON
function CellChanged(val,old){
var G = Grids.Excel;
var r = G.GetRowById("Edit"); r.EDIT = val; 
r.EDITType = G.FRow[G.FCol+"Type"];
G.RefreshCell(r,"EDIT");
}
// -----------------------------------------------------------------------------------------
// Mirrors top Edit row cell value to actualy focused cell
// Called from OnChange in Edit JSON
function EditChanged(val,old){
var G = Grids.Excel;
G.FRow[G.FCol] = val; G.RefreshCell(G.FRow,G.FCol);
}
// -----------------------------------------------------------------------------------------
// Sets attribute attr for all rows and columns
// sets value rv1 for rows before and on lastrow, value rv0 for rows after lastrow
// sets value rc1 for columns before and on lastsec/lastcol, value cv1 for rows after lastsec/lastcol
function SetAttributeArea(G,lastrow,lastsec,lastcol,attr,rv1,rv0,cv1,cv0){
if(lastrow) { 
   lastrow[attr] = rv1; for(var row=G.GetFirstVisible();row!=lastrow;row=G.GetNextVisible(row)) row[attr] = rv1; 
   for(var row=G.GetNextVisible(lastrow);row;row=G.GetNextVisible(row)) row[attr] = rv0;
   }
for(var i=1;i<G.ColNames.length;i++) for(var N=G.ColNames[i],j=0;j<N.length;j++) G.Cols[N[j]][attr] = i<lastsec||i==lastsec&&j<=lastcol?cv1:cv0;
}
// -----------------------------------------------------------------------------------------
// Called before print report is generated. Used to print only used rows and columns
Grids.OnPrintStart = function(G){
var A = GetLastCell(G,1); SetAttributeArea(G,A[0],A[1],A[2],"CanPrint",1,0,3,0);
}
// -----------------------------------------------------------------------------------------
// Called before XLS or PDF export report is generated
// Used to export only used rows and columns
Grids.OnExportStart = function(G,pdf){
var A = GetLastCell(G,1);
if(pdf) { Grids.OnPrintStart(G); Grids.OnSave(G); } // PDF is done on server side, saves only used rows and columns; The CanPrint attribute is set only to display columns in PrintPDF menu
else SetAttributeArea(G,A[0],A[1],A[2],"CanExport",1,0,2,0);
}
// -----------------------------------------------------------------------------------------
Grids.OnExport = function(G,xml,pdf){
if(pdf) Grids.OnUpload(G,xml); // Clears the NoUpload attributes
}
// -----------------------------------------------------------------------------------------
// Called before data are uploaded to server
// Used to save only used rows and columns
Grids.OnSave = function(G){
var A = GetLastCell(G,1); SetAttributeArea(G,A[0],A[1],A[2],"NoUpload",0,1,0,2);
}
// -----------------------------------------------------------------------------------------
// Called before the changes are uploaded to server
// Clears the NoUpload attributes set in OnSave, because it blocks undo
Grids.OnUpload = function(G,xml){
var A = GetLastCell(G,1); SetAttributeArea(G,A[0],A[1],A[2],"NoUpload",0,0,0,0); 
}
// -----------------------------------------------------------------------------------------
// Support method, returns [lastrow,lastcolsec,lastcolpos] as the last used cell
// If set cls, checks also class
// If set the frow/fcol, arow/acol or vrow/vcol, these cells are taken as used
function GetLastCell(G,cls,frow,fcol,arow,acol,vrow,vcol){
var lastrow = null, lastsec = 0, lastcol = 0;
for(var row=G.GetFirstVisible();row;row=G.GetNextVisible(row)){
   for(var i=1;i<G.ColNames.length;i++){
      for(var N=G.ColNames[i],j=0;j<N.length;j++) if(row[N[j]]||cls&&row[N[j]+"Class"]||row==frow&&N[j]==fcol||row==arow&&N[j]==acol||row==vrow&&N[j]==vcol){
         var col = G.ColNames[i][j], A = G.GetSpanned(row,col), C = G.Cols[A[3]];
         lastrow = A[2];
         if(lastsec<C.Sec){ lastsec = C.Sec; lastcol = C.Pos; }
         else if(lastsec==C.Sec && lastcol<C.Pos) lastcol = C.Pos;
         }
      }
   }
return [lastrow,lastsec,lastcol];
}
// -----------------------------------------------------------------------------------------
// Removes unused bottom side row pages
function ShrinkRowPages(G,lastrow){
var p = G.GetRowPage(lastrow).nextSibling;
for(var i=G.GetPageNum(p);p&&i<4;i++) p = p.nextSibling;         // Lets minimally 5 row pages
while(p){ var lp = p.nextSibling; G.RemovePage(p); p = lp; }     // Removes the empty pages
G.AutoId = G.GetLastVisible().id-0+1;                            // Updates the row id generating
}
// -----------------------------------------------------------------------------------------
// Removes unused right side column pages
function ShrinkColPages(G,lastsec,lastcol){
if(lastsec<5) lastsec = 5;                                       // Lets minimally 5 column pages (col page 0 is the left section)
G.RemoveColPage(lastsec+1,G.ColNames.length-lastsec-2);          // Removes the empty pages
}
// -----------------------------------------------------------------------------------------
// Removes unused right side column pages and bottom side row pages
function ShrinkGrid(G){
G.Focus(); G.Focus(G.GetFirstVisible(),"A"); // Forces scrolling to top left
var A = GetLastCell(G,0);
ShrinkRowPages(G,A[0]); 
ShrinkColPages(G,A[1],A[2]);
return true;
}
// -----------------------------------------------------------------------------------------
// Called after resized any row by a user
Grids.OnRowResize = function(G,row,height,oheight){
if(row.id=="Edit"){ // Resized the Edit row
   if(height<26) height = 26;    // Minimal height of the row is set as 26
   row.MaxHeight = height-13;    // Sets MaxHeight to not resize the EDIT cell due its content. The 13 is top + bottom padding of the cell.
   row.EDITHeight = height-13;   // Sets minimal height of the EDIT cell. The 13 is top + bottom padding of the cell.
   return height;
   }
}
// -----------------------------------------------------------------------------------------
// Called on pressing delete key to delete all selected cells
function ClearSelectedCells(G){
var S = G.GetSelRanges();
if(!G.FRect) S[S.length] = [G.FRow,G.FCol,G.FRow,G.FCol]; // Adds focused cell, because this example does not select one focused cell
G.StartUpdate();
for(var i=0;i<S.length;i++){
   var F = S[i];
   for(var row=F[0],nrow=G.GetNext(F[2]);row!=nrow;row=G.GetNext(row)){
      for(var col=F[1],ncol=G.GetNextCol(F[3]);col!=ncol;pcol=col,col=G.GetNextCol(col)) {
         G.SetValue(row,col,"",1);
         }
      G.UpdateRowHeight(row);
      }
   }
G.EndUpdate();
}
// -----------------------------------------------------------------------------------------
