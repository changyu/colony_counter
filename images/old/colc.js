addAnEvent(window, 'load', attachSliderEvents);
addAnEvent(document, 'mousemove', sliderMouseMove);
var activeSlider=-1;

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


function addAnEvent(el, evname, func) {
    if (el.attachEvent) { 
        el.attachEvent("on" + evname, func);
    } else if (el.addEventListener) { 
        el.addEventListener(evname, func, true);
    } else {
        el["on" + evname] = func;
    }
}
function drawSliderByVal(slider) {
	var knob=slider.getElementsByTagName('img')[0];
	var p=(slider.val-slider.min)/(slider.max-slider.min);
	var x=(slider.scrollWidth-30)*p;
	knob.style.left=x+"px";
}
function setSliderByClientX(slider, clientX) {
	var p=(clientX-slider.offsetLeft-30)/(slider.scrollWidth-30);
	slider.val=(slider.max-slider.min)*p + slider.min;
	if (slider.val>slider.max) slider.val=slider.max;
	if (slider.val<slider.min) slider.val=slider.min;

	drawSliderByVal(slider);
	slider.onchange(slider.val, slider.num);
}

function sliderClick(e) {
	var el=sliderFromEvent(e);
	if (!el) return;

	setSliderByClientX(el, e.clientX);
}

function sliderMouseMove(e) {
	var el=sliderFromEvent(e);
	if (!el) return;
	if (activeSlider<0) return;

	setSliderByClientX(el, e.clientX);
	stopEvent(e);
}

function sliderFromEvent(e) {
	if (!e && window.event) e=window.event;
	if (!e) return false;

	var el;
	if (e.target) el=e.target;
	if (e.srcElement) el=e.srcElement;

	if (!el.id || !el.id.match(/slider\d+/)) el=el.parentNode;
	if (!el) return false;
	if (!el.id || !el.id.match(/slider\d+/)) return false;

	return el;
}

function attachSliderEvents() {
	var divs=document.getElementsByTagName('div');
	var divNum;
	for(var i=0; i<divs.length; i++) {
		if (divNum=divs[i].id.match(/\bslider(\d+)\b/)) {
			divNum=parseInt(divNum[1]);
			divs[i].min=slider[divNum].min;
			divs[i].max=slider[divNum].max;
			divs[i].val=slider[divNum].val;
			divs[i].onchange=slider[divNum].onchange;
			divs[i].num=divNum;
			drawSliderByVal(divs[i]);
			divs[i].onchange(divs[i].val, divNum);

			addAnEvent(divs[i], 'mousedown', function(e){
				sliderClick(e);
				var el=sliderFromEvent(e);
				if (!el) return;
				activeSlider=el.num;
				stopEvent(e);
			});
			addAnEvent(divs[i], 'mouseup', function(e){
				activeSlider=-1;
				stopEvent(e);
			});
		}
	}
}

function stopEvent(event) {
	if (event.preventDefault) {
		event.preventDefault();
		event.stopPropagation();
	} else {
		event.returnValue=false;
		event.cancelBubble=true;
	}
}


function setBoxValue(val, box) {
    var b=document.getElementById('output'+box);
	val=Math.round(val*1)/1;
	b.value=val;
    if(box==1) gThreshold=val;
    if(box==2) gScoreBar=val;
}

