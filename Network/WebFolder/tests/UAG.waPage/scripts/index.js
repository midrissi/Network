
WAF.onAfterInit = function onAfterInit() {// @lock

// @region namespaceDeclaration// @startlock
	var documentEvent = {};	// @document
// @endregion// @endlock

// eventHandlers// @lock

	documentEvent.onLoad = function documentEvent_onLoad (event)// @startlock
	{// @endlock
		var
		grid = $$('dataGrid1');

		grid.bindToNNRelation({
			columns	: {
				dataClass   : 'Network',
	            titleAttr   : 'name',
	            width       : 160
			},
			rows    : {
	            dataClass           : 'Host',
	            pushToDataSource    : [
	                {
	                    sourceAttID     : 'name',
	                    width           : 100,
	                    title           : 'Name',
	                    readOnly        : true,
	                    addTolColumns   : true
	                }
	            ]
	        },
	        dataSourceName : 'host_Network'
		});
	};// @lock

// @region eventManager// @startlock
	WAF.addListener("document", "onLoad", documentEvent.onLoad, "WAF");
// @endregion
};// @endlock
