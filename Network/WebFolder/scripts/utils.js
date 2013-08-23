﻿var _ns = _ns || {};

(function(_ns){
	WAF.Widget.prototype.center = function(config){
		var
		htmlObj 	= this.$domNode,
		width		= this.getWidth(),
		parent		= htmlObj.parent(),
		height		= this.getHeight();
		
		if(parent.attr('id') === $('body').attr('id')){
			parent = $(window);
		}
		
		/**
		 * Config : 
		 *    center 			==> 'v' : only vertically
		 *				 			'h' : only horizontally
		 *				 			'vh': horizontally and vertically
		 **/
		if(arguments.length == 0){
			htmlObj.css({
				left	: (parent.width() - width)/2,
				top		: (parent.height() - height)/2
			});
			
			return;
		}
		
		switch(config.center){
			case 'v' :
				htmlObj.css({
					top		: (parent.height() - height)/2
				});
				break;
			case 'h' :
				htmlObj.css({
					left	: (parent.width() - width)/2
				});
				break;
			case 'vh' :
				htmlObj.css({
					left	: (parent.width() - width)/2,
					top		: (parent.height() - height)/2
				});
				break;
		}
	}
	
	WAF.widget.Grid.prototype.editCell = function(row , column){
		var
		gridView = this.gridController.gridView,
		row = gridView._private.functions.getRowByRowNumber({
			gridView: gridView,
			rowNumber: row
		});
		
		gridView._private.functions.startEditCell({
			gridView: gridView,
			columnNumber: column,
			row: row,
			cell: row.cells[0]
		});
	}
	
	WAF.DataSourceEm.prototype.cancel = function(){
		var
	    curElem	= this.getCurrentElement();
	    
	    if(this.isNewElement() || !curElem || !curElem.getKey()){
	        this.removeCurrent();
	        return;
	    }
		
	    this.serverRefresh({forceReload : true});
	}

	function parseUri (str) {
		var	o   = parseUri.options,
			m   = o.parser[o.strictMode ? "strict" : "loose"].exec(str),
			uri = {},
			i   = 14;

		while (i--) uri[o.key[i]] = m[i] || "";

		uri[o.q.name] = {};
		uri[o.key[12]].replace(o.q.parser, function ($0, $1, $2) {
			if ($1) uri[o.q.name][$1] = $2;
		});

		return uri;
	};

	parseUri.options = {
		strictMode: false,
		key: ["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"],
		q:   {
			name:   "queryKey",
			parser: /(?:^|&)([^&=]*)=?([^&]*)/g
		},
		parser: {
			strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
			loose:  /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
		}
	};

	(function($) {
		$.widget("ui.searchW", {
			options: {
				datasource	: null,
				query		: 'fullname = "' + waf.wildchar + '@value' + waf.wildchar + '"',
				trigger		: 'keyup',
				filter		: false,
				callback	: function(event){
					var options = $(this).data('_widget').data('searchW').options;
					
					if(options.datasource && options.datasource.query){
						if($(this).val()){
							if(!options.filter){
								options.datasource.query(options.query.replace(/@value/g , $(this).val()) , options.queryOptions)
							}else{
								options.datasource.filterQuery(options.query.replace(/@value/g , $(this).val()) , options.queryOptions)
							}
						}
						else{
							options.datasource.all(options.queryOptions);
						}
					}
				},
				queryOptions: {}
			},
			clear: function(){
				$(this.element).find('input').val('');
				$(this.element).find('span').hide();
			},
			_create: function(){
				var
				options 	= this.options,
				element 	= $(this.element).addClass('search waf-project-sm-container-search'),
				h 			= element.height(),
				w 			= element.width(),
				form 		= $('<form>').appendTo(element),
				field		= $('<input>').appendTo(form).addClass('field'),
				delBtn		= $('<div>').appendTo(form).addClass('delete'),
				span		= $('<span>').html('x').appendTo(delBtn),
				submitBtn	= $('<button type="submit"></button>').appendTo(form);
				
				submitBtn.css({
					width: h
				});
				
				form.css({
					width: w-h-10
				})
				
				field.prop({
					name: 'field',
					type: 'text',
					placeholder: 'Search...'
				});
				
				field.keyup(function() {
			        if ($.trim(field.val()) != "") {
			            span.fadeIn();
			        }
			        else{
			        	span.fadeOut();
			        }
			    })
			    .css({
			    	width: w-h-45
			    });
			    
			    span.click(function(e) {
			        field.val("");
			        options.callback.call(field.get(0) , e);
			        $(this).hide();
			    });
			    
			    form.submit(function(e){
			    	options.callback.call(field.get(0) , e);
			    	return false;
			    }).data({
			    	'_widget': element,
			    	'_input': field
			    });
			}
		});
		
		$.fn.liveDraggable = function (opts) {
	      this.live("mouseover", function() {
	         if (!$(this).data("init")) {
	            $(this).data("init", true).draggable(opts);
	         }
	      });
	      return this;
	   };
	})(jQuery);
	
	$.fn.equals = function(compareTo) {
	  if (!compareTo || this.length != compareTo.length) {
	    return false;
	  }
	  for (var i = 0; i < this.length; ++i) {
	    if (this[i] !== compareTo[i]) {
	      return false;
	    }
	  }
	  return true;
	};

	function Form(fields) {
		this.fields = _.isArray(fields) ? fields : [];
	};
	
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
		
		if(this.fields[0]){
			this.fields[0].focus();
		}
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
	
	_ns.parseUri = parseUri;
	_ns.Form = Form;
})(_ns);

// Modified jQuery ui combobox 
$.widget( "ui.combobox", {
    _create: function() {
        var self = this,
        select = this.element.hide(),
        selected = select.children( ":selected" ),
        value = selected.val() ? selected.text() : "";
        var input = this.input = $( "<input>" )
        .attr('placeholder' , '[Select]')
        .insertAfter( select )
        .val( value )
        .autocomplete({
            delay: 0,
            minLength: 0,
            source: function( request, response ) {
                var matcher = new RegExp( $.ui.autocomplete.escapeRegex(request.term), "i" );
                response( select.children( "option" ).map(function() {
                    var text = $( this ).text();
                    if ( this.value && ( !request.term || matcher.test(text) ) )
                        return {
                            label: text.replace(
                                new RegExp(
                                    "(?![^&;]+;)(?!<[^<>]*)(" +
                                    $.ui.autocomplete.escapeRegex(request.term) +
                                    ")(?![^<>]*>)(?![^&;]+;)", "gi"
                                    ), "<strong>$1</strong>" ),
                            value: text,
                            option: this
                        };
                }) );
            },
            select: function( event, ui ) {
                ui.item.option.selected = true;
                self._trigger( "selected", event, {
                    item: ui.item.option
                });
            },
            change: function( event, ui ) {
                if ( !ui.item ) {
                    var matcher = new RegExp( "^" + $.ui.autocomplete.escapeRegex( $(this).val() ) + "$", "i" ),
                    valid = false;
                    select.children( "option" ).each(function() {
                        if ( $( this ).text().match( matcher ) ) {
                            this.selected = valid = true;
                            return false;
                        }
                    });
                    if ( !valid ) {
                        // remove invalid value, as it didn't match anything
                        $( this ).val( "" );
                        select.val( "" );
                        input.data( "autocomplete" ).term = "";
                        return false;
                    }
                }
            }
        })
        .addClass( "ui-widget ui-widget-content ui-corner-left" );

        input.data( "autocomplete" )._renderItem = function( ul, item ) {
            return $( "<li></li>" )
            .data( "item.autocomplete", item )
            .append( "<a>" + item.label + "</a>" )
            .appendTo( ul );
        };

        this.button = $( "<button type='button'>&nbsp;</button>" )
        .prop( "tabIndex", -1 )
        .insertAfter( input )
        .button({
            icons: {
                primary: "ui-icon-triangle-1-s"
            },
            text: false
        })
        .removeClass( "ui-corner-all" )
        .removeAttr('title')
        .addClass( "ui-corner-right ui-button-icon" )
        .click(function() {
            // close if already visible
            if ( input.autocomplete( "widget" ).is( ":visible" ) ) {
                input.autocomplete( "close" );
                return;
            }

            // work around a bug (likely same cause as #5265)
            $( this ).blur();

            // pass empty string as value to search for, displaying all results
            input.autocomplete( "search", "" );
            //input.focus();
        });
        
    },

    destroy: function() {
        this.input.remove();
        this.button.remove();
        this.element.show();
        $.Widget.prototype.destroy.call( this );
    },
    
    //allows programmatic selection of combo using the option value
    setValue: function (value) {
        var $input = this.input;
        $("option", this.element).each(function () {
            if ($(this).val() == value) {
                this.selected = true;
                $input.val(this.text);
                return false;
            }
        });
    }
});

/* Simple JavaScript Inheritance
 * By John Resig http://ejohn.org/
 * MIT Licensed.
 */
// Inspired by base2 and Prototype
(function(){
  var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;
 
  // The base Class implementation (does nothing)
  this.Class = function(){};
 
  // Create a new Class that inherits from this class
  Class.extend = function(prop) {
    var _super = this.prototype;
   
    // Instantiate a base class (but only create the instance,
    // don't run the init constructor)
    initializing = true;
    var prototype = new this();
    initializing = false;
   
    // Copy the properties over onto the new prototype
    for (var name in prop) {
      // Check if we're overwriting an existing function
      prototype[name] = typeof prop[name] == "function" &&
        typeof _super[name] == "function" && fnTest.test(prop[name]) ?
        (function(name, fn){
          return function() {
            var tmp = this._super;
           
            // Add a new ._super() method that is the same method
            // but on the super-class
            this._super = _super[name];
           
            // The method only need to be bound temporarily, so we
            // remove it when we're done executing
            var ret = fn.apply(this, arguments);        
            this._super = tmp;
           
            return ret;
          };
        })(name, prop[name]) :
        prop[name];
    }
   
    // The dummy class constructor
    function Class() {
      // All construction is actually done in the init method
      if ( !initializing && this.init )
        this.init.apply(this, arguments);
    }
   
    // Populate our constructed prototype object
    Class.prototype = prototype;
   
    // Enforce the constructor to be what we expect
    Class.prototype.constructor = Class;
 
    // And make this class extendable
    Class.extend = arguments.callee;
   
    return Class;
  };
})();