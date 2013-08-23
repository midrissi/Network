var _ns = _ns || {};
(function(ns) {
    /**
     * The models
     */

    Backbone.Model.prototype.getID = function() {
        with(this) {
            return typeof id == 'undefined' ? cid : id;
        }
    };

    Backbone.Model.prototype.initialize = function() {
        _.extend(this, new Backbone.Picky.Selectable(this));
    };

    var NodeM = Backbone.Model.extend({
        _enabled: false,
        idAttribute: 'ID',
        defaults: {
            x: 0,
            y: 0,
            w: 50,
            h: 50,
            title: ''
        },
        enable: function enable(node) {
            if (this.collection) {
                this._enabled = true;
                this.collection.trigger('enable', this, this.collection, node);
            }
        },
        disable: function disable(node) {
            if (this.collection) {
                this._enabled = false;
                this.collection.trigger('disable', this, this.collection, node);
            }
        },
        toggleEnable: function toggleEnable(node) {
            if (this.collection) {
                this._enabled = !this._enabled;
                this.collection.trigger(
                    this._enabled ? 'enable' : 'disable', this, this.collection, node
                );
            }
        }
    });

    var SegmentM = Backbone.Model.extend({
        idAttribute: 'ID',
        defaults: {
            origin: null,
            destination: null,
            h: 5
        }
    });

    ns.Models = {};
    ns.Models.Segment = Segment;
    ns.Models.Node = NodeM;

    /**
     * The collections
     */

    var Nodes = Backbone.Collection.extend({
        model: NodeM,
        enabled: [],
        initialize: function() {
            this.on({
                'enable': function enable(model) {
                    this.enabled.push(model);
                },
                'disable': function(model) {
                    var index = null;
                    for (var i = this.enabled.length - 1; i >= 0; i--) {
                        if (this.enabled[i].getID() == model.getID()) {
                            index = i;
                        }
                    };

                    if (index === 0 || index > 0) {
                        this.enabled.splice(index, 1);
                    }
                }
            });

            _.extend(this, new Backbone.Picky.SingleSelect(this));
        },
        disableAll: function() {
            while (this.enabled.length) {
                this.enabled[0].disable();
            }
        }
    });

    var Segments = Backbone.Collection.extend({
        model: SegmentM,
        initialize: function() {
            _.extend(this, new Backbone.Picky.SingleSelect(this));
        },
        clear: function clear() {
            while (this.length) {
                this.remove(network.segments.first());
            }
        }
    });

    ns.Collections = {};
    ns.Collections.Segments = Segments;
    ns.Collections.Nodes = Nodes;

    /**
     * The views
     */

    var NodesV = Backbone.View.extend({
        classes: {
            'ENABLED': 'selected',
            'CURRENT': 'current'
        },
        template: '<h4><%= title %></h4>',
        initialize: function(options) {
            var self = this,
                CLASSES = this.classes,
                options = this.options;

            this.model.on({
                add: function() {
                    self.addOne.apply(self, arguments);
                },
                reset: function() {
                    self.resetAll.apply(self, arguments);
                },
                enable: function(model, collection, node) {
                    var node = model.node;

                    if (_.isObject(node)) {
                        node.el.addClass(self.classes.ENABLED);
                    }
                },
                disable: function(model, collection, node) {
                    var node = model.node;

                    if (_.isObject(node)) {
                        node.el.removeClass(self.classes.ENABLED);
                    }
                }
            });

            this.template = _.template(this.template);

            if (_.isObject(options) && options.tooltip) {
                self.setTooltip(options.tooltip);
            }

            this.resetAll();
        },
        model: new Nodes(),
        setTemplate: function(template) {
            if (template && _.isString(template)) {
                if (_.isString(template)) {
                    this.template = _.template(template);
                } else if (_.isFunction(template)) {
                    this.template = template;
                }
            }
        },
        setTooltip: function(tooltip) {
            switch (typeof tooltip) {
                case 'string':
                    this.tooltip = _.template(tooltip);
                    break;
                case 'function':
                    this.tooltip = tooltip;
                    break;
            }
        },
        addOne: function(model) {
            var self = this,
                node = this._createNew(model);

            model.on({
                'remove': function remove(model, collection, options) {
                    node.remove();
                },
                'change': function change(model, collection, options) {
                    var changed_attrs = _.keys(model.changedAttributes());

                    if (_.intersection(changed_attrs, ['x', 'y']).length >= 0) {
                        node.clickCoords = {
                            x: 0,
                            y: 0
                        };

                        node.onDrag({
                            pageX: model.get('x'),
                            pageY: model.get('y')
                        });
                    }
                    node
                        .el
                        .html(self.template(model.toJSON()));
                    
                    if (_.isFunction(self.tooltip)) {
                        node.el
                            .attr({
                                'data-original-title': self.tooltip(model.toJSON())
                            });
                    }
                },
                'selected': function select(model) {
                    if (model) {
                        node.el.addClass(self.classes.CURRENT);
                    }
                }
            });

            if (_.isFunction(this.tooltip)) {
                node.el
                    .attr({
                        'data-original-title': this.tooltip(model.toJSON())
                    })
                    .tooltip({
                        html: true
                    });
            }
        },
        _createNew: function(model) {
            var node = new Node({
                title: model.get('title'),
                stage: this.$el,
                w: model.get('w'),
                h: model.get('h'),
                x: model.get('x'),
                y: model.get('y'),
                events: {
                    dblclick: function() {
                        model.toggleEnable(node);
                    },
                    drop: function() {
                        var pos = this.el.position();

                        model.set({
                            'x': pos.left,
                            'y': pos.top
                        });
                    },
                    click: function() {
                        model.select();
                    }
                }
            });

            node
                .attach().el
                .html(this.template(model.toJSON()))
                .attr({
                    'data-key': model.getID()
                });

            model.node = node;

            return node;
        },
        resetAll: function() {
            var self = this;
            this.$el.empty();
            _.each(this.model.models, function(model) {
                self.addOne(model);
            });
        }
    });

    var SegmentV = Backbone.View.extend({
        classes: {
            'SELECTED': 'selected'
        },
        initialize: function(options) {
            var self = this,
                CLASSES = this.classes;

            this.model.on({
                add: function() {
                    self.addOne.apply(self, arguments);
                    self._current = self.model.length - 1;
                },
                reset: function() {
                    self.resetAll.apply(self, arguments);
                }
            });

            this.resetAll();
        },
        model: new Segments(),
        addOne: function(model) {
            var self = this,
                segment = this._createNew(model),
                options = this.options;

            model.on({
                'remove': function remove(model, collection, options) {
                    segment.remove();
                },
                'change:origin change:destination': function change(model, collection, options) {
                    segment.origin = model.get('origin').node;
                    segment.destination = model.get('destination').node;
                    segment.calculateRotation();
                },
                'selected': function select(model) {
                    if (model) {
                        segment.el.addClass(self.classes.CURRENT);
                    }
                },
                'change': function (model) {
                    if (_.isFunction(self.tooltip)) {
                        segment.el
                            .attr({
                                'data-original-title': self.tooltip(model.toJSON())
                            });
                    }
                }
            });

            if (_.isObject(options) && options.tooltip) {
                this.setTooltip(options.tooltip);
            }
        },
        setTooltip: function(tooltip) {
            switch (typeof tooltip) {
                case 'string':
                    this.tooltip = _.template(tooltip);
                    break;
                case 'function':
                    this.tooltip = tooltip;
                    break;
            }
        },
        _createNew: function(model) {
            var self = this;

            var segment = new Segment({
                stage: this.$el,
                origin: model.get('origin').node,
                destination: model.get('destination').node,
                h: model.get('h')
            });

            segment
                .attach().el
                .attr({
                    'data-key': model.getID()
                })
                .bind({
                    click: function click() {
                        model.select();
                    }
                });

            if (_.isFunction(this.tooltip)) {
                segment.el
                    .attr({
                        'data-original-title': this.tooltip(model.toJSON())
                    })
                    .tooltip({
                        html: true
                    });
            }

            model.segment = segment;

            return segment;
        },
        setTemplate: function(template) {
            if (template && _.isString(template)) {
                if (_.isString(template)) {
                    this.template = _.template(template);
                } else if (_.isFunction(template)) {
                    this.template = template;
                }
            }
        },
        resetAll: function() {
            var self = this;
            this.$el.empty();
            _.each(this.model.models, function(model) {
                self.addOne(model);
            });
        },
        _current: -1,
        next: function next() {
            this._current++;
            var cur = this.getCurrent();
            if (cur) {
                cur.segment.el.show();
                return true;
            }

            this.playAll();
            this._current = this.model.length - 1;
            return false;
        },
        previous: function previous() {
            var cur = this.getCurrent();
            this._current--;
            if (cur) {
                cur.segment.el.hide();
                return true;
            }

            this._hideAll();
            this._current = -1;
            return false;
        },
        hasNext: function has_next() {
            return this._current < this.model.length - 1;
        },
        hasPrevious: function has_previous() {
            return this._current > 0;
        },
        replay: function replay() {
            this._hideFrom(0);
            this._current = 0;
            this.play();
        },
        play: function play() {
            if (!this.hasNext()) {
                this._hideAll();
                this._current = -1;
            }

            if (this.duration) {
                var i = 0,
                    self = this;

                clearInterval(this.t_o);
                this.t_o = setInterval(function() {
                    if (!self.next()) {
                        clearInterval(self.t_o);
                        return;
                    }
                }, this.duration);
            } else {
                this.playAll();
            }
        },
        playAll: function play_all() {
            this.$el.find('.segment').show();
        },
        _hideFrom: function(index) {
            var model;
            for (; model = this.model.at(index++);) {
                model.segment.el.hide();
            };
        },
        _hideAll: function() {
            this._current = -1;

            this.$el.find('.segment').hide();
        },
        start: function start() {
            this.stop();
            this.play();
        },
        stop: function stop() {
            this._current = -1;
            if (this.t_o) {
                clearInterval(this.t_o);
            }
            this._hideAll();
        },
        pause: function pause() {
            if (this.t_o) {
                clearTimeout(this.t_o);
            }
        },
        getCurrent: function() {
            return this.model.at(this._current);
        },
        duration: 1000
    });

    var NetworkM = Backbone.Model.extend({
        defaults: {
            nodes: null,
            segments: null
        }
    });

    var Network = Backbone.View.extend({
        model: new NetworkM(),
        initialize: function(options) {
            var nodesV = new NodesV({
                el: this.$el
            }),
                nodes = nodesV.model,
                segmentsV = new SegmentV({
                    el: this.$el
                }),
                segments = segmentsV.model,
                self = this;

            if (_.isObject(options) && options.segmentTooltip) {
                segmentsV.setTooltip(options.segmentTooltip);
            };

            if (_.isObject(options) && options.nodeTooltip) {
                nodesV.setTooltip(options.nodeTooltip);
            };

            this.model.set({
                nodes: nodesV,
                segments: segmentsV
            });

            if (!_.isUndefined(options)) {
                if (!_.isUndefined(options.template)) {
                    this.model.get('nodes').setTemplate(options.template);
                }
            }

            Object.defineProperties(this, {
                'nodes': {
                    configurable: false,
                    writable: false,
                    value: nodes,
                    enumerable: false
                },
                'segments': {
                    configurable: false,
                    writable: false,
                    value: segments,
                    enumerable: false
                }
            });

            this.nodes.on({
                'enable': function(a, b, c) {
                    var enabled = this.enabled;
                    if (enabled.length >= 2) {
                        var seg = new SegmentM({
                            ID: enabled[0].getID() + '_' + enabled[1].getID(),
                            origin: enabled[0],
                            destination: enabled[1]
                        });

                        segmentsV.model.add(seg);
                        self.trigger('segment:new', seg, enabled[0], enabled[1]);
                        segmentsV.playAll();
                        self.nodes.disableAll();
                    }
                }
            });
        },
        clear: function() {
            this.segments.reset();
            this.nodes.reset();
        }
    });

    ns.Network = Network;
})(_ns);