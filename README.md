js-anim
=======

Stand-alone JS animations with easing *(no framework required - 1.2 kB)*  

> [View a demo >](http://www.rcrawford.net/demos/js-anim/)  

*Example*  
```javascript
animate(div1, "width", 1100, 1000, "out", function(){console.log('div1 anim end')});

/**
* @param el  DOM element
* @param prop  Property to animate
* @param to  Destination property value
* @param pxPerSecond  Speed of animation in pixels per second
* @param easing (optional)  Easing type: "in" or "out"
* @param callback (optional)  Function to call when animation is complete
*/
```