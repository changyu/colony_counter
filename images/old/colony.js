var gPx=0;
var gPy=0;
var gDeg=0;
var gCell=36;
var gScale=1;
var gThreshold=120;
var gScoreBar=100;
var gPType=new Array(12,8);
var gCanvas=new Array(0,0,608,460);
var gPView=new Array(25,20,530,410);
var gGView=new Array(80,60,gPType[0]*gCell,gPType[1]*gCell,gCell);
var gCArr= new Array();
var gCvs1=null;
var gCtx1=null;
var gCvs2=null;
var gCtx2=null;
var gAjax=null;
var gImgName=null;
var gSrcImg=new Image();
var gnotice="Drag & drop a plate image into above panel.";

function initImg(cvs1,cvs2,psrc){ 
    gSrcImg= document.getElementById(psrc);
    gImgName=gnotice;
    gCvs1=document.getElementById(cvs1);
    gCvs2=document.getElementById(cvs2);
	 document.getElementById('checkit').style.visibility='hidden';
    if (gCvs1.getContext){
        gCtx1 = gCvs1.getContext('2d');
        gCtx2 = gCvs2.getContext('2d');
	gSrcImg.onload = function() {  drawImg()};
        drawGrid(gCtx2);
	if(gCArr.length==0) makeWell();
	gCvs2.addEventListener("click", colonyOnClick, false);
	gCvs2.addEventListener("dragover",dropOver,false);
	gCvs2.addEventListener("drop", addImages, false);
	gCvs2.addEventListener("dragleave", dragExit, false);
    }else{alert('You need Safari or Firefox 1.5+ to see this demo.');}
}

function resetImg(){
    gCArr= new Array();
    gCvs1=null;
    gCtx1=null;
    gCvs2=null;
    gCtx2=null;
    gAjax=null;
    gImgName=null;
    gSrcImg=new Image();
}
function dragExit(ev) {
        ev.stopPropagation();
        ev.preventDefault();
       	//this.style["backgroundColor"] = "#FEFEFE";
	//this.style["color"] = "#CCC";
        //this.style["borderColor"] = "#ffffff";
}

function dropOver(ev) {
        ev.stopPropagation();
        ev.preventDefault();
	//var files = ev.dataTransfer.files;
	//drawFileName(gCtx2,getFileName(files[0]));
        //this.style["borderColor"] = "#3DD13F";
}

function addFiles(ev) {
  ev.stopPropagation();
    ev.preventDefault();
   var files = ev.dataTransfer.files;
	gSrcImg.src="./plate_images/"+files[0].name;
}
function addImages(ev){
    ev.stopPropagation();
    ev.preventDefault();
    var plates = ev.dataTransfer.files;
    addPlateListItems(plates);
}

function  addPlateListItems(plates) {
    var len=plates.length;
    len=1;
    for (var i = 0; i < len; i++) {
        var fr = new FileReader();
        fr.file = plates[i];
        fr.onloadend = showPlateInList;
        fr.readAsDataURL(plates[i]);
    }
}

function showPlateInList(ev) {
    var plate = ev.target.file;
    if (plate){
	if(plate.size < 1048576) {
            uploadFile(plate); 
            if (plate.type.search(/image\/.*/) != -1) {
		gSrcImg.src= ev.target.result;
		gSrcImg.onload = function() { paintIt();}
		drawGrid(gCtx2);
            }
	}else {
            alert("File is too large!");
	}
    }
}

function makeWell(){
	for(var i=0; i<gPType[1]; i++){
	    for(var j=0; j<gPType[0]; j++){
		gCArr.push(new well(i,j));
	    }
	}
}

function set1WVal(ex,ey){
    var col=Math.floor((ex-gGView[0])/gGView[4]);
    var row=Math.floor((ey-gGView[0])/gGView[4]);
    var nm=row*gPType[0]+col;    
}

function setWValue(ctx){
    cImgData=gCtx1.getImageData(gGView[0] , gGView[1] , gGView[2] , gGView[3]);
    for(var nm=0; nm<gCArr.length; ++nm) {
	gCArr[nm].setval(cImgData.data);
	gCArr[nm].paint(ctx);
    }
}

function getWStr(){
    var str="";
    for(var nm=0; nm<gCArr.length; ++nm) {
	str+="W"+gCArr[nm].row+":"+gCArr[nm].col+":"+gCArr[nm].avalue+":"+gCArr[nm].bscore;	
    }
    return str;
}

function paintWell(ctx){
    for(var nm=0; nm<gCArr.length; ++nm) {
	gCArr[nm].paint(ctx);
    }
}

function getPixelBlkVal(r,g,b,bar){
    bar= (typeof(bar) != 'undefined') ? bar : gThreshold;
    return (r*0.3+g*0.59+b*0.11>bar)?1:0;
}

function rotateImg(dg) {
    gDeg += (typeof(dg) != 'undefined' ? dg : 0.1);     
    drawImg();
}

function drawImg(dx,dy){
    gPx-=(typeof(dx) != 'undefined') ? dx : 0;
    gPy-=(typeof(dy) != 'undefined') ? dy : 0;
    if((Math.abs(dx)+Math.abs(dy))!=0 ){
	gCtx1.clearRect(gPView[0],gPView[1],gPView[2],gPView[3]);
    gCtx1.save();
    gCtx1.translate(gPx+gCanvas[2]/2,gPy+gCanvas[3]/2);
    gCtx1.rotate(gDeg*Math.PI/180);
    gCtx1.scale(gScale,gScale);
    gCtx1.translate(-gCanvas[2]/2,-gCanvas[3]/2);
	paintIt();
     gCtx1.restore();
    }
}

function paintIt(){
    try{
	gCtx1.drawImage(gSrcImg,gCanvas[0], gCanvas[1]+2,gCanvas[2], gCanvas[3]);
    }catch (exception) {gSrcImg.src= 'Hi, Drop an JPG here!';}
}

function zoomImg(inout){
    gScale+=inout; 
    drawImg();
}

function labelImg(cvsid,x,y,str){
    var cvs=document.getElementById(cvsid);
    var ctx = cvs.getContext('2d');
    ctx.font = "11pt Arial";
    ctx.fillStyle = "#FF0000";
    ctx.clearRect(x-10,y-10,200,30)
    ctx.fillText(str,x+16,y+20);
}

function drawGrid(ctx,dx,dy,bl){
    if(typeof(bl)=='undefined'){
	ctx.fillStyle   = '#FFFFFF';
	ctx.fillRect(gCanvas[0]-4,gCanvas[1]-4, gCanvas[2]+40,gCanvas[3]+60);
	ctx.clearRect(gPView[0],gPView[1], gPView[2],gPView[3]);
	ctx.globalAlpha=0.5;
	ctx.fillStyle   = '#669';
	ctx.fillRect(gPView[0],gPView[1],gPView[2],gPView[3]);
	ctx.clearRect(gGView[0], gGView[1], gGView[2], gGView[3]);
    }
    ctx.globalAlpha=1;
    ctx.lineWidth = 1;
    ctx.strokeRect(gPView[0]-2, gPView[1]-2, gPView[2]+4, gPView[3]+4); 
    ctx.beginPath();
    ctx.font = "14pt Arial";
    ctx.fillStyle = "#FFF000";
    gGView[0]+= (typeof(dx) != 'undefined') ? dx : 0;
    gGView[1]+= (typeof(dy) != 'undefined') ? dy : 0;     
    var x=gGView[0];
    var y=gGView[1];
    var rowid=new Array('A','B','C','D','E','F','G','H');
    for (i=0;i<gPType[0]+1;i++){
	if(i<12){ctx.fillText(i+1,x+i*gGView[4]+10,y-10);}	
	ctx.moveTo(x+i*gGView[4],y);
	ctx.lineTo(x+i*gGView[4],gGView[3]+y);
	for (j=0;j<gPType[1]+1;j++){
	    if(i<12 && j<8 && 0){
		ctx.font = "6pt Arial";
 		ctx.fillStyle = "#FFF000";
		ctx.fillText('x',x+i*gGView[4]+16,y+j*gGView[4]+20);}
	    if(i==0){		
		if(j<8){ctx.fillText(rowid[j],x-gGView[4],y+j*gGView[4]+25);	}
		ctx.moveTo(x,y+j*gGView[4]);
		ctx.lineTo(gGView[2]+x,y+j*gGView[4]);
	    }
	}
	ctx.closePath();
	ctx.strokeStyle = '#999000';
	ctx.stroke();
    }
    drawFileName(ctx,gImgName);
    
}

function drawFileName(ctx,fname,color){
    var clr=(color==null)?"#246":color;
    ctx.fillStyle = "#fff";
    ctx.fillRect(gCanvas[0],gCanvas[3]-20,gCanvas[2],30);
    writeNote(ctx,gGView[2]/5,gCanvas[3],fname, clr);
    //ctx.font = "bold 14px sans-serif";
    //ctx.fillStyle = "#300";
    //ctx.fillText(fname,gGView[2]/5,gCanvas[3]+0);
}

function getFileName(url){
    var m = url.match(/(.*)[\/\\]([^\/\\]+\.\w+)$/);
              //return {path: m[1], m[2]}
    return (m)?m[2]:url;
}

function drawEdge(){
    var ImDat=gCtx1.getImageData(gGView[0] , gGView[1] , gGView[2] , gGView[3]);
    var inputData=ImDat.data;
    var output = gCtx1.createImageData(gGView[2] , gGView[3]);
    var outputData = output.data;
    var w= gGView[2];
    var h= gGView[3];
    for (var y = 1; y < h-1; y += 1) {
	for (var x = 1; x < w-1; x += 1) {
            for (var c = 0; c < 3; c += 1) {
		var i = (y*w + x)*4 + c;
		outputData[i] = 127 + -inputData[i - w*4 - 4] -   inputData[i - w*4] - inputData[i - w*4 + 4] +
                    -inputData[i - 4]       + 8*inputData[i]       - inputData[i + 4] +
                    -inputData[i + w*4 - 4] -   inputData[i + w*4] - inputData[i + w*4 + 4];
            }
            outputData[(y*w + x)*4 + 3] = 128; // alpha
	}
    }
    gCtx1.putImageData(output,gGView[0] , gGView[1] );
}

function setPixel(imageData, x, y, r, g, b, a) {
    index = (x + y * imageData.width) * 4;
    imageData.data[index+0] = r;
    imageData.data[index+1] = g;
    imageData.data[index+2] = b;
    imageData.data[index+3] = a;
}

function getR(x1,y1,x2,y2){
    return Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2));
}

function drawBImg(bar) {
    gThreshold= (typeof(bar) != 'undefined') ? bar : gThreshold;
    var imageData = gCtx1.getImageData( gGView[0] , gGView[1] , gGView[2] , gGView[3]);
    var pixels = imageData.data;
    for (var i = 0; i < pixels.length; i += 4) {
	pixels[i]=pixels[i+1]=pixels[i+2]=getPixelBlkVal(pixels[i],pixels[i+1],pixels[i+2])*255;
	}
	// overwrite original image
	gCtx1.putImageData(imageData, gGView[0] , gGView[1]);
}

function drawInvertedImage() {
    var imageData =gCtx1.getImageData(gGView[0] , gGView[1] , gGView[2] , gGView[3]);
    var pixels = imageData.data;
    for (var i = 0;i < pixels.length; i += 4) {
		pixels[i  ] = 255 - pixels[i  ]; // red
		pixels[i+1] = 255 - pixels[i+1]; // green
		pixels[i+2] = 255 - pixels[i+2]; // blue
	}
    gCtx1.putImageData(imageData,gGView[0] , gGView[1]);
}

function darkenImg(val) {
    var imageData =gCtx1.getImageData(gGView[0] , gGView[1] , gGView[2] , gGView[3]);
    var pixels = imageData.data;
    for (var i = 0;i < pixels.length; i += 4) {
	pixels[i  ] = val*pixels[i  ]; // red
	pixels[i+1] = val*pixels[i+1]; // green
	pixels[i+2] = val*pixels[i+2]; // blue
    }   
    gCtx1.putImageData(imageData,gGView[0] , gGView[1]);
}

function well(row, col) {
    this.row = row;
    this.col = col;
    this.w=gGView[4];
    this.x=gGView[0]+this.col*this.w;
    this.y=gGView[1]+this.row*this.w;
    this.avalue=-1;
    this.bscore=-1;
    this.setval=function(idata) {
	var index= r= g= b= a=0; 
	this.avalue=0;
	for (var yi = 1; yi <this.w-1; yi += 1) {
	    for (var xi = 1; xi < this.w-1; xi += 1){
		index = (this.col*this.w+xi + (this.row*this.w+yi) *gGView[2]) * 4;
    		r=idata[index+0];g=idata[index+1]; b=idata[index+2];
		this.avalue+=getPixelBlkVal(r,g,b);
	    }	
	}
	this.bscore=(this.avalue>gScoreBar)?1:-1;
    }
    
    this.paint=function(ctx){
	if(typeof(ctx)=='undefined'){
	    ctx=gCtx2;
	    ctx.clearRect(this.x+2,this.y+2,this.w-4,this.w-4);
	}
	if(this.bscore>0){
	    ctx.lineWidth = 1;
	    ctx.beginPath();
	    ctx.arc(gGView[0]+(this.col+0.5)*gGView[4],gGView[1]+(this.row+0.5)*gGView[4], 0.4*gGView[4], 6.2831852,0, true);
	    ctx.closePath();
	    ctx.strokeStyle = "#00ff00";
	    ctx.stroke();
	}
	ctx.globalAlpha=1;
	ctx.font = "bold 10px sans-serif";
	ctx.fillStyle = "#ff0000";
	if(this.avalue>0) {ctx.fillText(this.avalue, gGView[0]+this.col*gGView[4]+8,gGView[1]+this.row*gGView[4]+20);}
    }
}

function colonyOnClick(e) {
    if(gImgName==gnotice)return false;
    var pos = getCursorPosition(e);
    if( pos>=0 && pos<=gPType[0]*gPType[1]){
//	alert(pos+" "+gCArr[pos].col);

	if(gCArr[pos].avalue<0){ 
	    cImgData=gCtx1.getImageData(gGView[0] , gGView[1] , gGView[2] , gGView[3]);
	    gCArr[pos].setval(cImgData.data);
	}
    	gCArr[pos].bscore=-gCArr[pos].bscore;
    	gCArr[pos].paint();
    }
}

function getCursorPosition(e) {
    /* returns Cell with .row and .column properties */
    var x;
    var y;
    if (e.pageX != undefined && e.pageY != undefined) {
	x = e.pageX;
	y = e.pageY;
    }else {
	x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
	y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    x -= gCvs2.offsetLeft;
    y -= gCvs2.offsetTop;
    var col=Math.floor((x-gGView[0])/gGView[4]);
    var row=Math.floor((y-gGView[1])/gGView[4]);
   // alert(x+" "+y +"-- R&C=" +row +"  "+col+" == "+gGView[0]+","+gGView[1]+"\n"+gCvs2.offsetTop);
    return (row*col>=0&&col<gPType[0]&&row<=gPType[1])?row*gPType[0]+col:-1;
}
function getParam(){
    return "gPx="+gPx+";gPy="+gPy+";gDeg="+gDeg+";gCell="+gCell+";gScale="+gScale+";gThreshold="+gThreshold+";gScoreBar="+gScoreBar+";gPType="+gPType.join()+";gCanvas="+gCanvas.join()+";gPView="+gPView.join()+";gGView="+gGView.join();
}
function saveIt()
{
    if(gImgName==gnotice) return false;
    paintWell(gCtx1);
    drawGrid(gCtx1,0,0,1);
    var winfo=getWStr();
    var note= document.getElementById('comment').value;
    var canvasData = gCvs1.toDataURL("image/png");
    var postData =getParam()+"&note="+note+"&pname=sc_"+gImgName+"&winfs="+winfo+"&canvasData="+canvasData;
    if(gAjax==null){gAjax= new XMLHttpRequest();}
    gAjax.open("POST",'save_img.php',true);
    gAjax.setRequestHeader('Content-Type', 'canvas/upload');
    gAjax.setRequestHeader('Content-Length', postData.length);
    gAjax.onreadystatechange=function(){
	if (gAjax.readyState == 4 && gAjax.status==200 ){
	var rtext=gAjax.responseText.split('|');		
	    gCtx2.clearRect(gPView[0],gPView[1], gPView[2],gPView[3]);
	    writeNote(gCtx2,gGView[2]/3,gCanvas[3]/2+20, rtext[0], "#fff000");
	    document.getElementById('checkit').href=rtext[1];
	    document.getElementById('checkit').style.visibility='visible';
	    drawFileName(gCtx2,"Click Reset2 button to start again!","#f00");
	    resetImg();
	    document.getElementById('comment').value="";
	}
    }
    gAjax.send(postData);
}

function uploadFile(file) {
    if (file) {
	gImgName =  file.name.replace(/[^a-zA-Z_0-9\\.]+/g,'');
//	alert(fname);
	if(gAjax==null){gAjax= new XMLHttpRequest();}
        upload = gAjax.upload;
        gAjax.open("POST", "upload.php" );
	upload.addEventListener("error", function (ev) {console.log(ev);}, false);
        gAjax.setRequestHeader("Cache-Control", "no-cache");
        gAjax.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        gAjax.setRequestHeader("X-File-Name", gImgName);
        gAjax.send(file);
    }
     gAjax.onreadystatechange=function() {
	 var note= gImgName+ "   ("
		+ file.type + ") - " +
            Math.round(file.size / 1024) + "KB";
	    drawFileName(gCtx2,note);
    }
}

function writeNote(ctx,x,y, note, color){
	   ctx.font = "bold 14px sans-serif";
	   ctx.fillStyle = (typeof(color)=='undefined')?"#ff0":color;
	   ctx.fillText(note,x,y);
}