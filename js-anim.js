/*!
 * Stand-alone JS animations with easing
 * https://github.com/robCrawford/js-anim
 *
 * Copyright 2013 Rob Crawford
 * Released under the MIT license
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * Elements used from: 
 * jQuery JavaScript Library: Copyright 2011 John Resig under MIT license http://jquery.org/license
 * Animation Step Value Generator by www.hesido.com
 *
 * Date: 19th January 2013
 */
(function(window, document, undefined){
	"use strict";

	//Configure naming
	var globalAnimMethodName = "animate", //Name of globally accessible animate method
		globalQuitMethodName = "quitAnims", //Name of globally accessible quitAnims method
		domElExpandoName = "animData"; //Name of property on DOM elements for storing registry index

	//Init;
	var data = {}, //Registry
		currDataIndex = 1;
	window[globalAnimMethodName] = animate;
	window[globalQuitMethodName] = quitAnims;

	/*------------------------------
	  Animation 
	 ------------------------------*/
	function animate(el, prop, to, pxPerSecond, easing, callback){
	/**
	* Animate style property
	* i.e. animate(div1, "width", 1100, 1000, "out", function(){console.log('div1 anim end')});
	* 
	* @param el  DOM element
	* @param prop  Property to animate
	* @param to  Destination property value
	* @param pxPerSecond  Speed of animation in pixels per second
	* @param easing (optional)  Easing type: "in" or "out"
	* @param callback (optional)  Function to call when animation is complete
	*/
		var frameDur = 10,
			initPropVal = parseInt(getCurrCss(el, prop)),
			distance = Math.abs(to-initPropVal),
			easeVal = (easing==="in")?1.5:(easing==="out")?0.5:1, // >1 ease-in, <1 ease-out
			elAnimData = getData(el, 'animData');

		//Quit if already at 'to' val (still fire callback)
		if(initPropVal===to){
			if(callback)callback.call();
			return;
		}

		//Init animData for el if first anim
		if(!elAnimData){
			elAnimData = {};
			setData(el, {'animData':elAnimData});
		}

		//Get data for prop being animated or create entry
		var animDataOb = elAnimData[prop];
		if(!animDataOb)animDataOb = elAnimData[prop] = {};

		//Don't re-initialise an existing animation i.e. same prop/to
		if(animDataOb.to === to)return;
		animDataOb.to = to; //Store 'to' val

		//Clear any exisiting interval
		if(animDataOb.intId){
			clearInterval(animDataOb.intId);
			animDataOb.intId = null;
		}

		//Create new anim
		animDataOb.intId = (function(animDataOb){
			var totalSteps = Math.round((distance/pxPerSecond)/(frameDur*.001)),
				thisStep = 0;

			return setInterval(function(){
				var newVal = easeInOut(initPropVal, to, totalSteps, thisStep++, easeVal);
				if(!isNaN(newVal))el.style[prop] = newVal + "px"; //Allow 0
				if(thisStep > totalSteps)endAnim(animDataOb, callback);
			}, frameDur);
		})(animDataOb);
	}

	function endAnim(animDataOb, callback){
	//End anim
		clearInterval(animDataOb.intId);
		animDataOb.intId = animDataOb.to = null;
		if(callback)callback.call();
	}

	function quitAnims(el){
	/**
	* Quit all animations on element
	* i.e. quitAnims(div1);
	* 
	* @param el  DOM element
	*/
		var elAnimData = getData(el, "animData");
		for(var p in elAnimData){
			if(elAnimData.hasOwnProperty(p))endAnim(elAnimData[p]);
		}
	}

	/*------------------------------
	  Data registry 
	 ------------------------------*/
	function setData(domEl, dataOb){
	//Set data associated to a DOM element
		var dataIndex = domEl[domElExpandoName];
		if(!dataIndex){
			dataIndex = domEl[domElExpandoName] = currDataIndex++;
			data[dataIndex] = {};
		}
		for(var p in dataOb){
			if(dataOb.hasOwnProperty(p))data[dataIndex][p] = dataOb[p];
		}
	}

	function getData(domEl, p){
	//Get data associated to a DOM element
		if(!domEl[domElExpandoName])return;
		return data[domEl[domElExpandoName]][p];
	}

	function clearData(domEl, propOrArray){ //i.e. clearData(box1,'label') OR clearData(box1,['label','handle']) OR no args clears completely
	//Clear data associated to DOM element
		if(!domEl || !domEl[domElExpandoName])return;

		if(!propOrArray){ //If no props supplied, completely remove data entry and dataIndex expando
			delete data[domEl[domElExpandoName]];
			domEl[domElExpandoName] = null; //delete causes error in IE7
		}
		else if(typeof propOrArray==="string"){ //If just one prop supplied
			delete data[domEl[domElExpandoName]][propOrArray];
		}
		else if(propOrArray.length){ //If array of props supplied
			for(var i=0,len=propOrArray.length;i<len;i++){
				delete data[domEl[domElExpandoName]][propOrArray[i]];
			}
		}
	}

	/*------------------------------
	  Utilities
	 ------------------------------*/
	function easeInOut(minValue,maxValue,totalSteps,actualStep,powr){
	//Generic Animation Step Value Generator by www.hesido.com 
		var delta = maxValue - minValue;
		var stepp = minValue+(Math.pow(((1 / totalSteps) * actualStep), powr) * delta);
		return Math.ceil(stepp);
	}

	function getCurrCss(elem, name, force){
	//Get current CSS - from jQuery.curCSS
	//Removed sections for opacity and float!!
		var getComputedStyle = document.defaultView && document.defaultView.getComputedStyle,
			fcamelCase = function(all, letter){return letter.toUpperCase()},
			ret, style = elem.style;
		if (!force && style && style[name])ret = style[name]; 
		else if(getComputedStyle){
			name = name.replace(/([A-Z])/g, "-$1" ).toLowerCase();
			var defaultView = elem.ownerDocument.defaultView;
			if(!defaultView)return null;
			var computedStyle = defaultView.getComputedStyle(elem, null);
			if(computedStyle)ret = computedStyle.getPropertyValue(name);
		} 
		else if(elem.currentStyle){
			var camelCase = name.replace(/-([a-z])/ig, fcamelCase);
			ret = elem.currentStyle[name] || elem.currentStyle[camelCase];
			if (!/^-?\d+(?:px)?$/i.test(ret) && /^-?\d/.test(ret)){
				var left = style.left, rsLeft = elem.runtimeStyle.left;
				elem.runtimeStyle.left = elem.currentStyle.left;
				style.left = camelCase === "fontSize" ? "1em" : (ret || 0);
				ret = style.pixelLeft + "px";
				style.left = left;
				elem.runtimeStyle.left = rsLeft;
			}
		}
		return ret;
	}

})(window, document);