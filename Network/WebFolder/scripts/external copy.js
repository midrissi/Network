(function(ns) {
	function Network(config) {
		config = this.config = _.defaults(config, {
			dataSource: null,
			xAttr: 'x',
			yAttr: 'y',
			titleAttr: 'name',
			template: '',
			stage: null,
			h: 50,
			w: 50,
			events:  {
				node: {},
				segment: {}
			}
		});

		this._segments = {};
		this._nodes = {};

		if (_.isString(config.template)) {
			config.template = _.template(template);
		}

		if (!_.isObject(config.dataSource)) {
			throw 'The datasource is mondatory';
		}

		if (_.isNull(config.stage)) {
			throw 'The stage attribute is mondatory';
		}
	}

	Network.prototype.init = function() {
		var self = this,
			config = self.config;

		WAF.addListener(config.dataSource.getID(), "onCollectionChange", function(e) {
			self.clear();
			self.draw(0);
		}, "WAF");
	};

	Network.prototype.clear = function() {
		for (var attr in this._nodes) {
			var node = this._nodes[attr];
			node.remove();
		}

		this._nodes = {};
		this._segments = {};
	};

	Network.prototype.loadTemplate = function(template, callback) {
		var self = this,
			config = self.config;

		$.ajax({
			url: template
		}).done(function(resp) {
			config.template = _.template(resp);

			if (_.isFunction(callback)) {
				callback.call(self);
			}
		});
	};

	Network.prototype.draw = function(position) {
		var self = this,
			config = this.config;

		if (position >= config.dataSource.length) {
			return;
		}

		config.dataSource.getElement(position, {
			onSuccess: function(e) {
				self.drawOne(e.element);
				self.draw(position + 1);
			}
		});
	};

	Network.prototype.drawOne = function(element) {
		if (!_.isObject(element)) {
			return false;
		}

		var self = this,
			config = this.config,
			dc = config.dataSource.getDataClass(),
			entity = element._private.currentEntity,
			name = element[config.titleAttr],
			events = config.events;

		if (name && !_.isObject(self._nodes[entity.getKey()])) {
			var node = new Node({
				title: name,
				stage: config.stage,
				w: config.w,
				h: config.h,
				x: element[config.xAttr],
				y: element[config.yAttr],
				events: {
					dblclick: function() {
						if (_.isFunction(events.node.dblclick)) {
							events.node.dblclick.call(this, element);
						}
						var selected = this.el.parent().find('div.node.selected');

						if (selected.length) {
							self.drawSegment(selected.first().data('key'), this.el.data('key'));
							selected.removeClass('selected');
						} else {
							this.el.toggleClass('selected');

							
						}
					},
					drop: function() {
						var pos = this.el.position();
						entity.x.setValue(pos.left);
						entity.y.setValue(pos.top);
						entity.save();
					},
					click: function() {
						if (_.isFunction(events.node.click)) {
							events.node.click.call(this, element);
						}
					}
				}
			});

			node.attach();

			node.el.attr({
				'data-key': entity.getKey()
			}).html(config.template({
				element: element
			})).tooltip({
				html: true
			});

			this.updateTooltip(node, {
				__template_type__: "host_tooltip",
				element: element
			});

			node.element = element;
			node.entity = entity;
			node.id = entity.getKey();

			self._nodes[entity.getKey()] = node;
		}
	};

	Network.prototype.updateTooltip = function(particle, params) {
		particle.el.attr({
			'data-original-title': this.config.template(params)
		});
	};

	Network.prototype.drawSegment = function(sourceID, destinationID, element) {
		
	};

	function Scenario(config){
		config = this.config = _.defaults(config, {
			dataSource: null,
			sourceAttr: 'source',
			destinationAttr : 'destination',
			network: null
		});

		this.network = this.config.network;
		this.source = this.config.dataSource;
		this._segments = {};
	}

	Scenario.prototype.init = function() {
		var self = this,
			config = self.config;

		WAF.addListener(self.source.getID(), "onCollectionChange", function(e) {
			self.clear();
			self.draw(0);
		}, "WAF");
	};

	Scenario.prototype.draw = function(position) {
		var self = this,
			config = this.config;

		if (position >= self.source.length) {
			return;
		}

		self.source.getElement(position, {
			onSuccess: function(e) {
				var element = e.element,
					entity = element._private.currentEntity,
					cache = self.source.getDataClass().getCache(),
					cacheEntity = cache.entitiesByKey[entity.getKey()].rawEntity;

				self.drawOne(cacheEntity , position);
				self.draw(position + 1);
			},
			autoExpand: this.config.sourceAttr + ", " + this.config.destinationAttr
		});
	};

	Scenario.prototype.clear = function() {
		for (var attr in this._segments) {
			this._segments[attr].remove();
		}

		this._segments = {};
	};

	Scenario.prototype.drawOne = function(element, position) {
		var self = this,
			network = self.network,
			config = network.config,
			events = network.config.events,
			sourceID = element[this.config.sourceAttr].__KEY,
			destinationID = element[this.config.destinationAttr].__KEY;

		if (_.isObject(network._nodes[sourceID]) && _.isObject(network._nodes[destinationID]) && !_.isObject(self._segments[sourceID + '_' + destinationID])) {
			var seg = new Segment({
					h: 5,
					stage: network.config.stage,
					origin: network._nodes[sourceID],
					destination: network._nodes[destinationID]
				}),
				segKey = sourceID + '_' + destinationID,
				tempParams = {
					__template_type__: "segment_tooltip",
					segment: seg
				};

			seg.el.attr({
				'data-key': segKey
			});

			seg.el.bind({
				dblclick: function() {
					seg.remove();
					delete self._segments[segKey];
					$('.tooltip.fade.top.in').remove();
					if (_.isFunction(events.segment.remove)) {
						events.segment.remove.call(seg);
					}
				},
				click: function() {
					if (_.isFunction(events.segment.click)) {
						events.segment.click.call(seg);
					}
				}
			}).tooltip({
				html: true
			});

			self._segments[segKey] = seg;
			seg.attach();


			if(_.isObject(element)){
				tempParams.element = element;
			}

			network.updateTooltip(seg, tempParams);

			/*if (_.isFunction(events.segment.create)) {
				events.segment.create.call(seg);
			}*/

			seg.id = segKey;
			seg.position = position;
		}
	};

	Scenario.prototype.play = function() {
		
	};

	Scenario.prototype.next = function() {
		
	};

	Scenario.prototype.previous = function() {
		
	};

	Scenario.prototype.pause = function() {
		
	};

	Scenario.prototype.restart = function() {
		
	};

	Scenario.prototype.end = function() {
		
	};

	Scenario.prototype.hasNext = function() {
		
	};

	function Form(fields) {
		this.fields = _.isArray(fields) ? fields : [];
	}

	Form.prototype.clear = function() {
		for (var i = this.fields.length - 1; i >= 0; i--) {
			this.fields[i].setValue('');
		};
	};

	Form.prototype.get = function(id) {
		for (var i = this.fields.length - 1; i >= 0; i--) {
			if (this.fields[i].id === id) {
				return this.fields[i];
			}
		};
	};

	Form.prototype.enable = function() {
		for (var i = this.fields.length - 1; i >= 0; i--) {
			this.fields[i].enable();
		};
	};

	Form.prototype.disable = function() {
		for (var i = this.fields.length - 1; i >= 0; i--) {
			this.fields[i].disable();
		};
	};

	Form.prototype.add = function(field) {
		if (_.isArray(field)) {
			this.fields = _.union(fields, field);
		} else {
			this.fields.push(field);
		}
	};

	ns.Network = Network;
	ns.Scenario = Scenario;
	ns.Form = Form;
})(window)