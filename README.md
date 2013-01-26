js-anim
=======

Stand-alone JS animations with easing *(no framework required - 1.6 kB)*  

> [View a demo >](http://www.rcrawford.net/demos/js-anim/)  
  
```javascript
animate(el, prop, to, unitsPerSecond, easing, callback);
/**
* Animate style property
* i.e. animate(div1, "width", 1100, 1000, "out", function(){console.log('div1 anim end')});
* 
* @param el                   DOM element
* @param prop                 Property to animate
* @param to                   Destination property value
* @param unitsPerSecond       Speed of animation in units per second
* @param easing (optional)    Easing type: "in" or "out"
* @param callback (optional)  Function to call when animation is complete
*/

quitAnims(el);
/**
* Quit all animations on element
* i.e. quitAnims(div1);
* 
* @param el  DOM element
*/
```