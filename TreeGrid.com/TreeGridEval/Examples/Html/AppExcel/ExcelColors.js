// -----------------------------------------------------------------------------------------
//       Support script for MS Excel toolbar buttons BORDER, BACKGROUND and COLOR 
// To set border style and color, background color and text color of focused or selected area
// -----------------------------------------------------------------------------------------

// -----------------------------------------------------------------------------------------
// Colors menu assigned to toolbar button popup menu, used for RPOPUP, BPOPUP and CPOPUP cells
// Defined here instead of layout XML because it is used more times the same, just to save and simplify the XML
var MenuColors = [
   {Name:'BWhite',Text:'<div class=\'BWhite BDef\'></div>'}, 
   {Name:'BSilver',Text:'<div class=\'BSilver BDef\'></div>'}, 
   {Name:'BGray',Text:'<div class=\'BGray BDef\'></div>'}, 
   {Name:'BBlack',Text:'<div class=\'BBlack BDef\'></div>'}, 
   {Name:'BYellow',Text:'<div class=\'BYellow BDef\'></div>'}, 
   {Name:'BOrange',Text:'<div class=\'BOrange BDef\'></div>'}, 
   {Name:'BRed',Text:'<div class=\'BRed BDef\'></div>'}, 
   {Name:'BFuchsia',Text:'<div class=\'BFuchsia BDef\'></div>'}, 
   {Name:'BPurple',Text:'<div class=\'BPurple BDef\'></div>'}, 
   {Name:'BMaroon',Text:'<div class=\'BMaroon BDef\'></div>'}, 
   {Name:'BOlive',Text:'<div class=\'BOlive BDef\'></div>'}, 
   {Name:'BGreen',Text:'<div class=\'BGreen BDef\'></div>'}, 
   {Name:'BTeal',Text:'<div class=\'BTeal BDef\'></div>'}, 
   {Name:'BAqua',Text:'<div class=\'BAqua BDef\'></div>'}, 
   {Name:'BBlue',Text:'<div class=\'BBlue BDef\'></div>'}, 
   {Name:'BNavy',Text:'<div class=\'BNavy BDef\'></div>'} 
   ];
// -----------------------------------------------------------------------------------------
// Styles menu assigned to toolbar button popup menu, used in menu RPOPUP cell
// Defined here instead of layout XML because it is used more times the same, just to save and simplify the XML
var MenuStyles = [
   {Name:'SDefault',Text:'<div class=\'BSDefault BSDef1\'></div>'},
   {Name:'SNone',Text:'<div class=\'BSNone BSDef\'></div>'}, 
   {Name:'SSolid1',Text:'<div class=\'BSSolid1 BSDef\'></div>'}, 
   {Name:'SSolid2',Text:'<div class=\'BSSolid2 BSDef\'></div>'}, 
   {Name:'SSolid3',Text:'<div class=\'BSSolid3 BSDef\'></div>'}, 
   {Name:'SDotted1',Text:'<div class=\'BSDotted1 BSDef\'></div>'}, 
   {Name:'SDotted2',Text:'<div class=\'BSDotted2 BSDef\'></div>'}, 
   {Name:'SDashed1',Text:'<div class=\'BSDashed1 BSDef\'></div>'}, 
   {Name:'SDashed2',Text:'<div class=\'BSDashed2 BSDef\'></div>'} 
   ];
// -----------------------------------------------------------------------------------------
// Styles menu assigned to toolbar button popup menu, used in menu RPOPUP cell
var MenuBorders = [
   {Name:'Color',Icon:'Icons/BorderAll.gif',Text:'Color',Menu:1,Items:MenuColors},
   {Name:'Style',Icon:' ',Text:'Style',Menu:1,Items:MenuStyles},
   {Name:'OColor',Icon:'Icons/BorderOuter.gif',Text:'Outer color',Menu:1,Items:MenuColors}, 
   {Name:'OStyle',Icon:' ',Text:'Outer style',Menu:1,Items:MenuStyles}, 
   {Name:'-'},
   {Name:'LOColor',Icon:'Icons/BorderLeft.gif',Text:'Left outer color',Menu:1,Items:MenuColors}, 
   {Name:'LOStyle',Icon:' ',Text:'Left outer style',Menu:1,Items:MenuStyles}, 
   {Name:'ROColor',Icon:'Icons/BorderRight.gif',Text:'Right outer color',Menu:1,Items:MenuColors}, 
   {Name:'ROStyle',Icon:' ',Text:'Right outer color',Menu:1,Items:MenuStyles}, 
   {Name:'TOColor',Icon:'Icons/BorderTop.gif',Text:'Top outer color',Menu:1,Items:MenuColors}, 
   {Name:'TOStyle',Icon:' ',Text:'Top outer style',Menu:1,Items:MenuStyles}, 
   {Name:'BOColor',Icon:'Icons/BorderBottom.gif',Text:'Bottom outer color',Menu:1,Items:MenuColors}, 
   {Name:'BOStyle',Icon:' ',Text:'Bottom outer color',Menu:1,Items:MenuStyles}, 
   {Name:'-'},
   {Name:'IColor',Icon:'Icons/BorderInner.gif',Text:'Inner color',Menu:1,Items:MenuColors}, 
   {Name:'IStyle',Icon:' ',Text:'Inner style',Menu:1,Items:MenuStyles}, 
   {Name:'HIColor',Icon:'Icons/BorderHorz.gif',Text:'Inner horz color',Menu:1,Items:MenuColors}, 
   {Name:'HIStyle',Icon:' ',Text:'Inner horz style',Menu:1,Items:MenuStyles}, 
   {Name:'VIColor',Icon:'Icons/BorderVert.gif',Text:'Inner vert color',Menu:1,Items:MenuColors}, 
   {Name:'VIStyle',Icon:' ',Text:'Inner vert style',Menu:1,Items:MenuStyles}
   ];

// -----------------------------------------------------------------------------------------
// Called on show toolbar button popup menu
Grids.OnShowButtonList = function(G,row,col,M,P){
if(col=="RPOPUP") P.X -= 23; // Shifts the menu below BORDER cell instead of the RPOPUP
}
// -----------------------------------------------------------------------------------------
// Changes background color of all selected cells in grid to clr
// clr is color name like "Red"
// Changes cell attribute Color as cell background color
function ChangeBackground(G,clr){
if(clr=="White") clr = "";
var S = G.GetSelRanges(), update = S.length>0;
if(!G.FRect) S[S.length] = [G.FRow,G.FCol,G.FRow,G.FCol]; // Adds focused cell, because this example does not select one focused cell
if(update) G.StartUpdate();
for(var i=0;i<S.length;i++){
   for(var F=S[i],row=F[0],nrow=G.GetNext(F[2]);row!=nrow;row=G.GetNext(row)){
      for(var col=F[1],ncol=G.GetNextCol(F[3]);col!=ncol;col=G.GetNextCol(col)){
         if(row[col+"Color"]!=clr) G.SetAttribute(row,col,"Color",clr,1,1);
         }
      }
   }
if(update) G.EndUpdate();
}
// -----------------------------------------------------------------------------------------
// Called on click to background color in colors popup menu
function ChooseBackground(I){
var G = Grids.Excel, row = G.GetRowById("Toolbar");
row.BACKGROUNDClassInner = I.Name;
G.RefreshCell(row,"BACKGROUND");
ChangeBackground(G,I.Name.slice(1));
}
// -----------------------------------------------------------------------------------------
// Changes text color of all selected cells in grid to clr
// clr is color name like "Red"
// Adds the color class to cell Class attribute
function ChangeColor(G,clr){
if(clr=="Black") clr = ""; else clr = " Color"+clr;
var S = G.GetSelRanges(), update = S.length>0;
if(!G.FRect) S[S.length] = [G.FRow,G.FCol,G.FRow,G.FCol]; // Adds focused cell, because this example does not select one focused cell
if(update) G.StartUpdate();
for(var i=0;i<S.length;i++){
   var F = S[i];
   for(var row=F[0],nrow=G.GetNext(F[2]);row!=nrow;row=G.GetNext(row)){
      for(var col=F[1],ncol=G.GetNextCol(F[3]);col!=ncol;col=G.GetNextCol(col)){
         var cls = row[col+"Class"];
         if(!cls) cls = ""; else if(cls.indexOf("Color")>=0) cls = cls.replace(/Color\w+\s?/,"").replace(/\s$/,"");
         cls += clr;
         if(row[col+"Class"]!=cls) G.SetAttribute(row,col,"Class",cls,1,1);
         }
      }
   }
if(update) G.EndUpdate();
}
// -----------------------------------------------------------------------------------------
// Called on click to text color in colors popup menu
function ChooseColor(I){
var G = Grids.Excel, row = G.GetRowById("Toolbar");
row.COLORClassInner = I.Name;
G.RefreshCell(row,"COLOR");
ChangeColor(G,I.Name.slice(1));
}
// -----------------------------------------------------------------------------------------
// Changes border of all selected cells in grid
// cls is class as "color style BORDER", where color is "BC"+color name, like "BCRed", style is "BS"+style+width like "BSSolid1"
// ico is icon shown in BORDER cell, used to get the cell edge

// TreeGrid cannot have different border widths for individual cells
// So all cells in this example have left and top border width 2px (by default transparent) and right and bottom width 1px (by default silver)
// The 1px border is set as right (or bottom) of the left side (or above) cell
// The 2px border is set as left (or top) of the right side (or below cell) 
// The 3px border is set as left+right (or top+bottom) of both left and right side (or below and above) cells. 
// The 3px border can be only solid, because dots and dashes are different for 1px and 2px border widths, so they would look weird
function ChangeBorder(G,cls,ico){
if(!cls||!ico) return;
cls = cls.split(" "); 
var clr = cls[0].slice(2), style = cls[1], edge = ico.replace(/^.*Border|\..*$/g,"");
var A = {}; // List of all classes to set at once, to speed up the setting

// --- Sets vertical border between cells [row,col1] and [row,col2] ---
function SetVert(row,col1,col2){
   var id1 = row.id+";"+col1, id2 = row.id+";"+col2;
   var cls1 = A[id1]; if(cls1==null) cls1 = row[col1+"Class"]; 
   var cls2 = A[id2]; if(cls2==null) cls2 = row[col2+"Class"];
   if(cls1) cls1 = cls1.replace(/(RC|RS)\w+\s?/g,"").replace(/\s$/,"");
   if(cls2) cls2 = cls2.replace(/(LC|LS)\w+\s?/g,"").replace(/\s$/,"");
   if(style=="BSNone") cls1 = (cls1?cls1+" ":"")+"RSNone";
   else if(style=="BSSolid1") cls1 = (cls1?cls1+" ":"")+"RC"+clr+" RSSolid";
   else if(style=="BSSolid2") { cls1 = (cls1?cls1+" ":"")+"RSNone"; cls2 = (cls2?cls2+" ":"")+"LC"+clr+" LSSolid"; }
   else if(style=="BSSolid3") { cls1 = (cls1?cls1+" ":"")+"RC"+clr+" RSSolid"; cls2 = (cls2?cls2+" ":"")+"LC"+clr+" LSSolid"; }
   else if(style=="BSDotted1") cls1 = (cls1?cls1+" ":"")+"RC"+clr+" RSDotted";
   else if(style=="BSDotted2") { cls1 = (cls1?cls1+" ":"")+"RSNone"; cls2 = (cls2?cls2+" ":"")+"LC"+clr+" LSDotted"; }
   else if(style=="BSDashed1") cls1 = (cls1?cls1+" ":"")+"RC"+clr+" RSDashed";
   else if(style=="BSDashed2") { cls1 = (cls1?cls1+" ":"")+"RSNone"; cls2 = (cls2?cls2+" ":"")+"LC"+clr+" LSDashed"; }
   A[id1] = cls1; A[id2] = cls2;
   }

// --- Sets horizontal border between cells [row1,col] and [row2,col] ---
function SetHorz(row1,row2,col){
   var id1 = row1.id+";"+col, id2 = row2.id+";"+col;
   var cls1 = A[id1]; if(cls1==null) cls1 = row1[col+"Class"]; 
   var cls2 = A[id2]; if(cls2==null) cls2 = row2[col+"Class"];
   if(cls1) cls1 = cls1.replace(/(BC|BS)\w+\s?/g,"").replace(/\s$/,"");
   if(cls2) cls2 = cls2.replace(/(TC|TS)\w+\s?/g,"").replace(/\s$/,"");
   if(style=="BSNone") cls1 = (cls1?cls1+" ":"")+"BSNone";
   else if(style=="BSSolid1") cls1 = (cls1?cls1+" ":"")+"BC"+clr+" BSSolid";
   else if(style=="BSSolid2") { cls1 = (cls1?cls1+" ":"")+"BSNone"; cls2 = (cls2?cls2+" ":"")+"TC"+clr+" TSSolid"; }
   else if(style=="BSSolid3") { cls1 = (cls1?cls1+" ":"")+"BC"+clr+" BSSolid"; cls2 = (cls2?cls2+" ":"")+"TC"+clr+" TSSolid"; }
   else if(style=="BSDotted1") cls1 = (cls1?cls1+" ":"")+"BC"+clr+" BSDotted";
   else if(style=="BSDotted2") { cls1 = (cls1?cls1+" ":"")+"BSNone"; cls2 = (cls2?cls2+" ":"")+"TC"+clr+" TSDotted"; }
   else if(style=="BSDashed1") cls1 = (cls1?cls1+" ":"")+"BC"+clr+" BSDashed";
   else if(style=="BSDashed2") { cls1 = (cls1?cls1+" ":"")+"BSNone"; cls2 = (cls2?cls2+" ":"")+"TC"+clr+" TSDashed"; }
   A[id1] = cls1; A[id2] = cls2;
   }

// --- Iterates the focused area and sets the borders to A ---
var S = G.GetSelRanges(0,1);
if(!G.FRect) S[S.length] = [G.FRow,G.FCol,G.FRow,G.FCol]; // Adds focused cell, because this example does not select one focused cell
for(var i=0;i<S.length;i++){
   var F = S[i];
   var prow = G.GetPrev(F[0]), nrow = G.GetNext(F[2]), pcol = G.GetPrevCol(F[1]), ncol = G.GetNextCol(F[3]);
   if(!prow) prow = F[0]; if(!pcol) pcol = F[1];
   if(edge=="All"||edge=="Outer"||edge=="Left") for(var row=F[0];row!=nrow;row=G.GetNext(row)) SetVert(row,pcol,F[1]);
   if(edge=="All"||edge=="Outer"||edge=="Right") for(var row=F[0];row!=nrow;row=G.GetNext(row)) SetVert(row,F[3],ncol);
   if(edge=="All"||edge=="Outer"||edge=="Top") for(var col=F[1];col!=ncol;col=G.GetNextCol(col)) SetHorz(prow,F[0],col);
   if(edge=="All"||edge=="Outer"||edge=="Bottom") for(var col=F[1];col!=ncol;col=G.GetNextCol(col)) SetHorz(F[2],nrow,col);
   if((edge=="All"||edge=="Inner"||edge=="Vert") && F[1]!=F[3]) {
      for(var row=F[0];row!=nrow;row=G.GetNext(row)){
         for(var pcol=F[1],col=G.GetNextCol(pcol);col!=ncol;pcol=col,col=G.GetNextCol(col)) SetVert(row,pcol,col);
         }
      }
   if((edge=="All"||edge=="Inner"||edge=="Horz") && F[0]!=F[2]) {
      for(var prow=F[0],row=G.GetNext(prow);row!=nrow;prow=row,row=G.GetNext(row)){
         for(var col=F[1];col!=ncol;col=G.GetNextCol(col)) SetHorz(prow,row,col);
         }
      }
   }

// --- Writes the changed classes from A to grid ---
G.StartUpdate();
for(var id in A){
   var ida = id.split(";"), row = G.GetRowById(ida[0]), col = ida[1], cls = A[id];
   if(cls!=row[col+"Class"]) G.SetAttribute(row,col,"Class",cls,1,1);
   }
G.EndUpdate();
}

// -----------------------------------------------------------------------------------------
// Called on click to border color or border style in borders popup menu
function ChooseBorder(I){
var G = Grids.Excel, row = G.GetRowById("Toolbar");
row.BORDERIcon = "Icons/Border"+{"":"All","O":"Outer","LO":"Left","RO":"Right","TO":"Top","BO":"Bottom","I":"Inner","HI":"Horz","VI":"Vert"}[I.Parent.Name.replace(/Color|Style/,"")]+".gif";
var cls = row.BORDERClass; { if(!cls) cls = "BCBlack BSSolid1 BORDER"; row.BORDERHeight = 13; }
cls = cls.split(" ");
if(I.Parent.Name.indexOf("Color")>=0) cls[0] = "BC"+I.Name.slice(1);
else { cls[1] = "BS"+I.Name.slice(1); row.BORDERHeight = 14 - cls[1].replace(/[^0-9]*/g,""); }
row.BORDERClass = cls.join(" ");
G.RefreshCell(row,"BORDER");
ChangeBorder(G,row.BORDERClass,row.BORDERIcon);
}
// -----------------------------------------------------------------------------------------
