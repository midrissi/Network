var host_template = '';

WAF.onAfterInit = function onAfterInit() {// @lock
	var hostSource = sources.host,
		$hosts = $('#hosts_matrix .waf-matrix-element'),
		$designer = $('#designer'),
		compiled_hostT = _.template(host_template),
		scenario_form = new Form([
			$$('scenario_name'),
			$$('scenario_description'),
			$$('scenario_save'),
			$$('scenario_cancel')
		]),
		host_form = new Form([
			$$('host_image'),
			$$('host_name'),
			$$('host_type'),
			$$('host_ip'),
			$$('host_port'),
			$$('host_description'),
			$$('host_save'),
			$$('host_cancel')
		]),
		requests_form = new Form([
			$$('requests_action'),
			$$('requests_type'),
			$$('requests_protocol'),
			$$('requests_order'),
			$$('requests_params'),
			$$('requests_description'),
			$$('requests_save'),
			$$('requests_cancel')
		]);
		
		network = new Network({
			dataSource: sources.hosts,
			stage: $designer,
			template: compiled_hostT,
			events: {
				node: {
					click: function(element){
						hostSource.selectByKey(element.ID);
						waf.widgets.tabView1.selectTab(1);
					}
				},
				segment: {
					click: function(element){
						debugger;
						sources.requests.select(this.position);
						waf.widgets.tabView1.selectTab(2);
					},
					create: function(){
						var scen = sources.scenarios.getCurrentElement(),
							self = this;
						
						if(scen){
							sources.requests.addNewElement();
							sources.requests.source.set(this.origin.entity);
							sources.requests.destination.set(this.destination.entity);
							sources.requests.save({
								onSuccess: function(e){
									requests_form.enable();
									var $$action = requests_form.get('requests_action');
									if($$action){
										$$action.focus();
									}
									self.position = e.dataSource.getPosition();
								}
							});
						}else{
							this.remove();
							alert('Please select a scenario or create a new one');
							sources.scenarios.addNewElement();
							scenario_form.enable();
							var $$name = scenario_form.get('scenario_name');
							if($$name){
								$$name.$domNode.focus();
							}
						}
					}
				}
			}
		});
		
		var scenario = new Scenario({
			dataSource: sources.requests,
			network: network
		});
		
		network.loadTemplate('/templates/hosts.html', function(){
			network.init();
			scenario.init();
		});
		
// @region namespaceDeclaration// @startlock
	var requestsEvent = {};	// @dataSource
	var hostEvent = {};	// @dataSource
	var requests_cancel = {};	// @button
	var scenario_cancel = {};	// @button
	var host_cancel = {};	// @button
	var image3 = {};	// @image
	var requests_save = {};	// @button
	var image2 = {};	// @image
	var host_save = {};	// @button
	var icon3 = {};	// @icon
	var icon2 = {};	// @icon
	var scenario_save = {};	// @button
	var icon1 = {};	// @icon
	var documentEvent = {};	// @document
// @endregion// @endlock
	
	
	
// eventHandlers// @lock

	requestsEvent.onElementSaved = function requestsEvent_onElementSaved (event)// @startlock
	{// @endlock
		var source = event.entity.source.getRawValue(),
			dest = event.entity.destination.getRawValue(),
			seg;
			
		if(source && dest){
			source = source.__KEY;
			dest = dest.__KEY;
			
			seg = network._segments[source + '_' + dest];
			network.updateTooltip(seg, {
				__template_type__: "segment_tooltip",
				segment: seg,
				element: event.element
			});
		}
	};// @lock

	requestsEvent.onCurrentElementChange = function requestsEvent_onCurrentElementChange (event)// @startlock
	{// @endlock
		waf.widgets.tabView1.selectTab(2);
	};// @lock

	hostEvent.onCurrentElementChange = function hostEvent_onCurrentElementChange (event)// @startlock
	{// @endlock
		waf.widgets.tabView1.selectTab(1);
	};// @lock

	requests_cancel.click = function requests_cancel_click (event)// @startlock
	{// @endlock
		sources.requests.cancel();
		requests_form.disable();
	};// @lock

	scenario_cancel.click = function scenario_cancel_click (event)// @startlock
	{// @endlock
		sources.scenarios.cancel();
		scenario_form.disable();
	};// @lock

	host_cancel.click = function host_cancel_click (event)// @startlock
	{// @endlock
		sources.host.cancel();
		host_form.disable();
	};// @lock

	image3.click = function image3_click (event)// @startlock
	{// @endlock
		sources.host.addNewElement();
		host_form.enable();
	};// @lock

	requests_save.click = function requests_save_click (event)// @startlock
	{// @endlock
		sources.requests.save({
			onSuccess: function(){
				requests_form.disable();
			}
		});
	};// @lock

	image2.click = function image2_click (event)// @startlock
	{// @endlock
		requests_form.enable();
	};// @lock

	host_save.click = function host_save_click (event)// @startlock
	{// @endlock
		sources.host.save({
			onSuccess: function(){
				host_form.disable();
			}
		});
	};// @lock

	icon3.click = function icon3_click (event)// @startlock
	{// @endlock
		host_form.enable();
	};// @lock

	icon2.click = function icon2_click (event)// @startlock
	{// @endlock
		scenario_form.enable();
	};// @lock

	scenario_save.click = function scenario_save_click (event)// @startlock
	{// @endlock
		sources.scenarios.save({
			onSuccess: function(){
				scenario_form.disable();
			}
		});
	};// @lock

	icon1.click = function icon1_click (event)// @startlock
	{// @endlock
		sources.scenarios.addNewElement();
		scenario_form.enable();
	};// @lock

	documentEvent.onLoad = function documentEvent_onLoad (event)// @startlock
	{// @endlock
		$hosts.liveDraggable({
		    start: function(e, ui){
		    	var $el = $('#clone-' + ui.helper.data('ref') + '-' + ui.helper.data('area')),
		    		wk	= $el.css("-webkit-transform"),
		    		pos = wk.substr(7, wk.length - 8).split(', ');
		    	
		    	$(ui.helper).css("margin-left", -parseInt(pos[4]));
                $(ui.helper).css("margin-top", -parseInt(pos[5]));
		    },
		    appendTo: $designer,
		    cursor: 'move',
		    cursorAt: { left: 5 },
		    scroll: false,
		    helper: "clone",
		    zIndex: 888888
		});
		
		$designer.droppable({
		    drop: function(e){
		        var entity = hostSource.getCurrentElement();
		        
		        entity.y.setValue(parseInt($(e.toElement).css('top')));
				entity.x.setValue(parseInt($(e.toElement).css('left')));
				entity.network.setValue(sources.network.getCurrentElement());
				
				entity.save({
					onSuccess: function(e){
						network.drawOne(WAF.DataSourceEm.makeElement(hostSource, e.entity));
					}
				});
		    }
		});
		
		scenario_form.disable();
		host_form.disable();
		requests_form.disable();
	};// @lock

// @region eventManager// @startlock
	WAF.addListener("requests", "onElementSaved", requestsEvent.onElementSaved, "WAF");
	WAF.addListener("requests", "onCurrentElementChange", requestsEvent.onCurrentElementChange, "WAF");
	WAF.addListener("host", "onCurrentElementChange", hostEvent.onCurrentElementChange, "WAF");
	WAF.addListener("requests_cancel", "click", requests_cancel.click, "WAF");
	WAF.addListener("scenario_cancel", "click", scenario_cancel.click, "WAF");
	WAF.addListener("host_cancel", "click", host_cancel.click, "WAF");
	WAF.addListener("image3", "click", image3.click, "WAF");
	WAF.addListener("requests_save", "click", requests_save.click, "WAF");
	WAF.addListener("image2", "click", image2.click, "WAF");
	WAF.addListener("host_save", "click", host_save.click, "WAF");
	WAF.addListener("icon3", "click", icon3.click, "WAF");
	WAF.addListener("icon2", "click", icon2.click, "WAF");
	WAF.addListener("scenario_save", "click", scenario_save.click, "WAF");
	WAF.addListener("icon1", "click", icon1.click, "WAF");
	WAF.addListener("document", "onLoad", documentEvent.onLoad, "WAF");
// @endregion
};// @endlock
