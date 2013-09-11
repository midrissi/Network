
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
		    columns: {
		        dataClass: 'Group',
		        titleAttr: 'name',
		        width: 160
		    },
		    rows: {
		        dataClass: 'User',
		        pushToDataSource: [{
		            sourceAttID: 'fullname',
		            width: 100,
		            title: 'Fullname',
		            readOnly: true,
		            addTolColumns: true
		        }]
		    },
		    dataSourceName: 'user_group'
		});
	};// @lock

// @region eventManager// @startlock
	WAF.addListener("document", "onLoad", documentEvent.onLoad, "WAF");
// @endregion
};// @endlock
