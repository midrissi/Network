
(function Component (id) {// @lock

// Add the code that needs to be shared between components here

function constructor (id) {

	// @region beginComponentDeclaration// @startlock
	var $comp = this;
	this.name = 'controls';
	// @endregion// @endlock

	this.load = function (data) {// @lock

	// @region namespaceDeclaration// @startlock
	var image14 = {};	// @image
	var image13 = {};	// @image
	var image12 = {};	// @image
	var image11 = {};	// @image
	var image10 = {};	// @image
	var image8 = {};	// @image
	// @endregion// @endlock

	// eventHandlers// @lock

	image14.click = function image14_click (event)// @startlock
	{// @endlock
		network.model.get('segments').start();
	};// @lock

	image13.click = function image13_click (event)// @startlock
	{// @endlock
		network.model.get('segments').playAll();
	};// @lock

	image12.click = function image12_click (event)// @startlock
	{// @endlock
		network.model.get('segments').next();
	};// @lock

	image11.click = function image11_click (event)// @startlock
	{// @endlock
		network.model.get('segments').previous();
	};// @lock

	image10.click = function image10_click (event)// @startlock
	{// @endlock
		network.model.get('segments').stop();
	};// @lock

	image8.click = function image8_click (event)// @startlock
	{// @endlock
		var func = 'play',
			img = 'play';
		
		if(this.isPlaying){
			func = 'pause';
			img = 'pause';
			this.isPlaying = false;
		}else{
			this.isPlaying = true;
		}
		
		this.setValue('/images/' + img + '.png');
		network.model.get('segments')[func]();
	};// @lock

	// @region eventManager// @startlock
	WAF.addListener(this.id + "_image14", "click", image14.click, "WAF");
	WAF.addListener(this.id + "_image13", "click", image13.click, "WAF");
	WAF.addListener(this.id + "_image12", "click", image12.click, "WAF");
	WAF.addListener(this.id + "_image11", "click", image11.click, "WAF");
	WAF.addListener(this.id + "_image10", "click", image10.click, "WAF");
	WAF.addListener(this.id + "_image8", "click", image8.click, "WAF");
	// @endregion// @endlock

	};// @lock


}// @startlock
return constructor;
})();// @endlock
