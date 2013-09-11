var host_template = '';

WAF.onAfterInit = function onAfterInit() {// @lock
	var	netSrc = sources.network,
		$hosts = $('#hosts_matrix .waf-matrix-element'),
		$designer = $('#designer'),
		scenario_form = new _ns.Form([
			$$('scenario_name'),
			$$('scenario_description'),
			$$('scenario_save'),
			$$('scenario_cancel')
		]),
		host_form = new _ns.Form([
			$$('host_image'),
			$$('host_name'),
			$$('host_type'),
			$$('host_ip'),
			$$('host_port'),
			$$('host_description'),
			$$('host_save'),
			$$('host_cancel')
		]),
		requests_form = new _ns.Form([
			$$('requests_action'),
			$$('requests_type'),
			$$('requests_protocol'),
			$$('requests_order'),
			$$('requests_params'),
			$$('requests_description'),
			$$('requests_save'),
			$$('requests_cancel')
		]);
		network = new _ns.Network({
			el: $('#designer'),
			template: '<center><img width="100%" height="100%" <%if(_.isObject(image)){%>src="<%= image.__deferred.uri %>"<%}%>/><div style="width:50px;height:50px;top:0px;left:0px;position:absolute;z-index:1000;"></div><%= name %><br/><%= hostname %></center>',
			segmentTooltip: 'source: <%= origin.get("hostname") %><br/>destination: <%= destination.get("hostname") %><br/><%if(typeof action != "undefined"){%> action: <%= action %><br/><%}%><%if( typeof type != "undefined"){%> Type: <%= type %><br/><%}%><%if( typeof params != "undefined"){%> Parameters: <%= params %><br/><%}%><%if(typeof protocol != "undefined"){%> Protocol: <%= protocol %><%}%>',
			nodeTooltip: 'Name: <%= name %><br/>Hostname: <%= hostname %><br/>Type: <%= type %><br/>'
		});
		
		network.on({
			'segment:new': function(segment, source, destination){
				var curScen = sources.scenarios.getCurrentElement();
				if(curScen){
					sources.requests.addNewElement({
						stopDispatch: true
					});
					sources.requests.source.set(source.entity);
					sources.requests.destination.set(destination.entity);
					sources.requests.save();
				}else{
					network.segments.remove(segment);
					sources.scenarios.addNewElement();
					scenario_form.enable();
					alert('Please select a scenario or create a new one');
				}
			}
		});
		
		network.nodes.on({
			'selected': function(model){
				sources.host.selectByKey(model.getID(), {
					onSuccess: function(){
						waf.widgets.tabView1.selectTab(1);
					}
				});
			}
		});
		
		network.segments.on({
			'selected': function(model){
				sources.requests.selectByKey(model.getID(), {
					onSuccess: function(){
						waf.widgets.tabView1.selectTab(2);
					}
				});
			}
		});
		
// @region namespaceDeclaration// @startlock
	var image5 = {};	// @image
	var hostEvent = {};	// @dataSource
	var image4 = {};	// @image
	var h_NsEvent = {};	// @dataSource
	var requestsEvent = {};	// @dataSource
	var requests_cancel = {};	// @button
	var requests_save = {};	// @button
	var image2 = {};	// @image
	var scenario_cancel = {};	// @button
	var scenario_save = {};	// @button
	var icon1 = {};	// @icon
	var icon2 = {};	// @icon
	var host_cancel = {};	// @button
	var host_save = {};	// @button
	var image3 = {};	// @image
	var icon3 = {};	// @icon
	var documentEvent = {};	// @document
// @endregion// @endlock
	
	function addNode(element, entity){
		var model = null;
		
		if(network.nodes.get(element.ID)){
    		model = network.nodes.get(element.ID);
    		model.set(element);
    	}else{
    		model = new _ns.Models.Node(element);
    		model.on({
    			'change:x change:y': function(model){
    				ds.Network.addNNElement({
	                    withDC : {
	                        name 	: "Host",
	                        ID		: model.getID()
	                    },
	                    ID	: model.get('netID'),
	                    attrs: {
	                    	x: model.get('x'),
	                    	y: model.get('y')
	                    }
	                });
    			}
    		});
    		network.nodes.add(model);
    	}
    	
    	if(entity){
    		model.entity = entity;
    	}
	}
	
	WAF.Entity.prototype.getElement = function(){
		var cache = this.getDataClass().getCache(),
    		item = cache.entitiesByKey[this.getKey()],
    		element = item.rawEntity;
    		
    	return element;
	}
	
// eventHandlers// @lock

	image5.click = function image5_click (event)// @startlock
	{// @endlock
		var req = sources.requests.getCurrentElement();
		if(req){
			var seg = network.segments.get(parseInt(req.getKey()));
			if(seg){
				sources.requests.removeCurrent({
					onSuccess: function(){
						network.segments.remove(seg);
					}
				});
			}
		}
	};// @lock

	hostEvent.onElementSaved = function hostEvent_onElementSaved (event)// @startlock
	{// @endlock
		var element = event.element;
		if(element){
			var node = network.nodes.get(element.ID);
			node.set(element);
		}
	};// @lock

	image4.click = function image4_click (event)// @startlock
	{// @endlock
		waf.widgets.tabView1.selectTab(3);
	};// @lock

	h_NsEvent.onCollectionChange = function h_NsEvent_onCollectionChange (event)// @startlock
	{// @endlock
		network.clear();
		for(var i = 0; i<this.length; i++){
			this.getElement(i, {
				onSuccess: function(e1){
					var elem = e1.element,
						entity = elem._private.currentEntity;
						
					entity.host.load({
						onSuccess: function(e2){
							var element = e2.entity.getElement();
		                	
		                	_.extend(element, {
		                		ID: e2.entity.getKey(),
			                	x: elem.x,
			                	y: elem.y,
		                		netID: entity.network.relKey
		                	});
		                	
		                	addNode(element, e2.entity);
						}
					});
				}
			});
		}
	};// @lock

	requestsEvent.onElementSaved = function requestsEvent_onElementSaved (event)// @startlock
	{// @endlock
		var element = event.element;
		if(element){
			var seg = network.segments.get(element.ID);
			if(seg){
				seg.set(element);
			}
		}
	};// @lock

	requestsEvent.onCollectionChange = function requestsEvent_onCollectionChange (event)// @startlock
	{// @endlock
		network.segments.clear();
		if(sources.h_Ns.length){
			this.toArray('', {
				onSuccess: function(e){
					var res = e.result;
					for (var i = 0; i < res.length; i++) {
						var elem = res[i];
						if(elem.source && elem.destination){
							elem.origin = network.nodes.get(elem.source.__KEY);
							elem.destination = network.nodes.get(elem.destination.__KEY);
							network.segments.add(elem);
						}
					};
					
					network.model.get('segments').playAll();
				},
				orderby: 'order'
			});
		}
	};// @lock

	requests_cancel.click = function requests_cancel_click (event)// @startlock
	{// @endlock
		sources.requests.cancel();
		requests_form.disable();
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

	scenario_cancel.click = function scenario_cancel_click (event)// @startlock
	{// @endlock
		sources.scenarios.cancel();
		scenario_form.disable();
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

	icon2.click = function icon2_click (event)// @startlock
	{// @endlock
		scenario_form.enable();
	};// @lock

	host_cancel.click = function host_cancel_click (event)// @startlock
	{// @endlock
		sources.host.cancel();
		host_form.disable();
	};// @lock

	host_save.click = function host_save_click (event)// @startlock
	{// @endlock
		sources.host.save({
			onSuccess: function(){
				host_form.disable();
			}
		});
	};// @lock

	image3.click = function image3_click (event)// @startlock
	{// @endlock
		sources.host.addNewElement();
		host_form.enable();
	};// @lock

	icon3.click = function icon3_click (event)// @startlock
	{// @endlock
		host_form.enable();
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
		    	var hostSrc = sources.host,
		    		curHost = hostSrc.getCurrentElement(),
		    		curNet = sources.network.getCurrentElement();
		    		
		    	if(curHost && curHost.getKey() && curNet && curNet.getKey()){
		    		var res = ds.Network.addNNElement({
	                    withDC : {
	                        name 	: "Host",
	                        ID		: curHost.getKey()
	                    },
	                    ID	: curNet.getKey(),
	                    attrs: {
	                    	x: parseInt($(e.toElement).css('left')),
	                    	y: parseInt($(e.toElement).css('top'))
	                    }
	                });
	                
	                if(res && res.getKey && res.getKey()){
	                	var element = curHost.getElement();
	                	
	                	_.extend(element, {
	                		ID: curHost.getKey(),
		                	x: res.x.getValue(),
		                	y: res.y.getValue(),
		                	netID: curNet.getKey()
	                	});
	                	
	                	addNode(element, curHost);
		            }
		    	}
		    }
		});
		
		scenario_form.disable();
		host_form.disable();
		requests_form.disable();
		sources.network.all();
	};// @lock

// @region eventManager// @startlock
	WAF.addListener("image5", "click", image5.click, "WAF");
	WAF.addListener("requests", "onElementSaved", requestsEvent.onElementSaved, "WAF");
	WAF.addListener("host", "onElementSaved", hostEvent.onElementSaved, "WAF");
	WAF.addListener("image4", "click", image4.click, "WAF");
	WAF.addListener("h_Ns", "onCollectionChange", h_NsEvent.onCollectionChange, "WAF");
	WAF.addListener("requests", "onCollectionChange", requestsEvent.onCollectionChange, "WAF");
	WAF.addListener("requests_cancel", "click", requests_cancel.click, "WAF");
	WAF.addListener("requests_save", "click", requests_save.click, "WAF");
	WAF.addListener("image2", "click", image2.click, "WAF");
	WAF.addListener("scenario_cancel", "click", scenario_cancel.click, "WAF");
	WAF.addListener("scenario_save", "click", scenario_save.click, "WAF");
	WAF.addListener("icon1", "click", icon1.click, "WAF");
	WAF.addListener("icon2", "click", icon2.click, "WAF");
	WAF.addListener("host_cancel", "click", host_cancel.click, "WAF");
	WAF.addListener("host_save", "click", host_save.click, "WAF");
	WAF.addListener("image3", "click", image3.click, "WAF");
	WAF.addListener("icon3", "click", icon3.click, "WAF");
	WAF.addListener("document", "onLoad", documentEvent.onLoad, "WAF");
// @endregion
};// @endlock
