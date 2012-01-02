/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
var slider=new Array();
slider[1]=new Object();
slider[1].min=0;
slider[1].max=255;
slider[1].val=120;
slider[1].onchange=setBoxValue;
slider[2]=new Object();
slider[2].min=0;
slider[2].max=1296;
slider[2].val=100;
slider[2].onchange=setBoxValue;
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
function setBoxValue(val, box) {
    var b=document.getElementById('output'+box);
	val=Math.round(val*1)/1;
	b.value=val;
    if(box==1) gThreshold=val;
    if(box==2) gScoreBar=val;
}
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

