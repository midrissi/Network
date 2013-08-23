WAF.widget.Grid.prototype.bindToDatasource = function(theSource , options){
    var
    config 			= this.config,
    defaultOptions	= {
        columns: [],
        colWidth: [],
        parentNode: config.id,
        cacheSize: 0,
        rowHeight: 27,
        subscriberID: config.id,
        cls: config['class'],
        selMode: config['data-selection-mode'] ? config['data-selection-mode'] : 'single',
        mustDisplayError: config['data-display-error'],
        errorDiv: config['data-errorDiv'],
        hideFooter: config['data-footer-hide'] === 'true' ? true : false,
        hideHeader: config['data-header-hide'] === 'true' ? true : false,
        textFooter: config['data-footer-text'] ? config['data-footer-text'] : 'item(s)'
    };
	
    if(typeof theSource == 'string'){
        theSource = sources[theSource];
    }
	
    if(theSource instanceof WAF.DataSourceVar || 
        theSource instanceof WAF.DataSourceEm ){
        defaultOptions.dataSource = theSource;
    }
    else{
        throw new Error('Invalid datasource');
    }
	
    options	= $.extend({} , defaultOptions , options)
    this.gridController.dataGrid.dataSource = theSource;
    this.gridController.gridView._private.globals.rows = []; // A hack to force the grid to fill the cells
	
    this.initWithOptions(options);
	
    this.dataSource.addListener("all", WAF.classes.DataGrid.gridSourceEventHandler, {
        listenerID: config.id,
        listenerType: 'grid'
    }, {
        dataGrid: this
    });
	
    // For the first time, no row is selected, this line to force the selection
    this.dataSource.dispatch('onCurrentElementChange');
}

WAF.widget.Grid.prototype.bindToNNRelation = function(config){
    var ERRORS = {
        INVALID_COLUMNS_DC  : "Invalid Columns DataClass",
        INVALID_ROWS_DC     : "Invalid Rows DataClass",
        INVALID_ROW_ATTR    : "The dataClass '@dc' does not have the attribute '@attr'!"
    }
    
    var
    defaultConfig = {
        columns : {
            dataClass   : null,
            initQuery   : null,
            titleAttr   : null
        },
        rows    : {
            initQuery			: null,
            dataClass           : null,
            pushToDataSource    : [],
            dataSource          : null
        },
        dataSourceName  : function(){
            while(true){
                var res = WAF.generateRandomStr({
                    onlyChars : true
                });
                
                if(!sources[res]){
                    return res;
                }
            }
        }.call(),
        callback: function(event){
            var
            dataSource 	= event.dataSource,
            attrName	= event.attributeName,
            res;
        	
            if(event.eventKind === "onAttributeChange"){
                res = dataSource[attrName] ? dataSource.addNN( dataSource.meta.rowID , attrName) : dataSource.removeNN( dataSource.meta.rowID , attrName);
            }
		    
            return res;
        }
    },
    err_msg,
    attribs         = "meta:object",
    grid            = this,
    columns         = [],
    columnDC        = null,
    rowDC           = null,
    columnTitleAttr = null;
    
    config          = $.extend({} , defaultConfig , config);
    
    // Verification Initiale
    if(!config.columns.dataClass || !ds[config.columns.dataClass]){
        throw ERRORS.INVALID_COLUMNS_DC;
        return null;
    }
    
    if(!config.rows.dataClass || !ds[config.rows.dataClass]){
        throw ERRORS.INVALID_ROWS_DC;
        return null;
    }
    
    if(!config.columns.titleAttr || !ds[config.columns.dataClass][config.columns.titleAttr]){
        err_msg = ERRORS.INVALID_ROW_ATTR;
        err_msg = err_msg.replace(/@dc/g , config.columns.dataClass);
        err_msg = err_msg.replace(/@attr/g , config.columns.titleAttr);

        throw err_msg;
        return null;
    }
    
    columnDC        = ds[config.columns.dataClass];
    rowDC           = ds[config.rows.dataClass];
    columnTitleAttr = config.columns.titleAttr;
    
    // Add the row attributes to the dataGrid columns
    for(var i = 0 , column ; column = config.rows.pushToDataSource[i] ; i++){
        var
        dcAttr = rowDC[column.sourceAttID];
        if(!dcAttr){
            err_msg = ERRORS.INVALID_ROW_ATTR;
            err_msg = err_msg.replace(/@dc/g , config.rows.dataClass);
            err_msg = err_msg.replace(/@attr/g , column.fromAttr);
            
            throw err_msg;
            continue;
        }
        
        attribs += ",row_" + dcAttr.name + ":" + dcAttr.type;
        
        column = $.extend({} , column , {
            sourceAttID : 'row_' + dcAttr.name
        });
        
        if(column.addTolColumns){
            columns.push(new Column(column));
        }
    }
    
    // Add the columns to the dataGrid columns
    if(config.columns.initQuery){
        columnDC.query(config.columns.initQuery , {
            onSuccess: function(e){
            	$(columnDC).data('event' , e).trigger("onColumnsReady");
            }
        });
    }
    else{
        columnDC.all({
            onSuccess: function(e){
            	$(columnDC).data('event' , e).trigger("onColumnsReady");
            }
        });
    }
    
    $(columnDC).bind({
        'onColumnsReady' : function(e){
            var
            data        = $(this).data('event'),
            collection  = data.result,
            columnsMap	= {};
            
            for(var i = 0 ; i < collection.length ; i++){
                collection.getEntity(i , {
                    onSuccess: function(ev){
                        var
                        entity 	= ev.entity,
                        obj     = {
                            sourceAttID : entity.getKey(),
                            title	: entity[columnTitleAttr].getValue()
                        };
                        
                        attribs += "," + entity.getKey() + ":bool";
                        obj = $.extend({} , config.columns , obj);
                        
                        obj.readOnly = rowDC.removeNNElement && rowDC.addNNElement ? obj.readOnly : true;
                        
                        columns.push(new Column(obj));
                        columnsMap[entity.getKey()] = columns.length - 1;
                        
                        if(ev.userData.lastEntity){
                            var
                            addToColumns 	= [],
                            dataSource,
                            allNN;
                        	
                            for(var i = 0 , column ; column = config.rows.pushToDataSource[i] ; i++){
                                if(column.sourceAttID){
                                    addToColumns.push(column.sourceAttID);
                                }
                            }
                            
                            allNN	= rowDC.getNN({
                                columnsQuery	: config.columns.initQuery,
                                rowsQuery		: config.rows.initQuery,
                                addToColumns	: addToColumns,
                                withDC			: columnDC.getName()
                            });
                        	
                            window[config.dataSourceName] = allNN.result;
                        	
                            dataSource = WAF.dataSource.create({
                                'id'                : config.dataSourceName,
                                'binding'           : config.dataSourceName,
                                'data-source-type'  : 'array',
                                'data-attributes'   : attribs
                            });
                            dataSource.sync();
                            
                            $(grid).data({
                                '_binToNNRelation' : {
                                    dataSource 	: dataSource,
                                    meta			: allNN.meta,
                                    columnsMap	: columnsMap
                                }
                            });
                            
                            dataSource.addNN = function(idDC1 , idDC2){
                                rowDC.addNNElement({
                                    withDC : {
                                        name 	: columnDC.getName(),
                                        ID		: idDC2
                                    },
                                    ID	: idDC1
                                });
                            }
                            
                            dataSource.removeNN = function(idDC1 , idDC2){
                                rowDC.removeNNElement({
                                    withDC : {
                                        name 	: columnDC.getName(),
                                        ID		: idDC2
                                    },
                                    ID	: idDC1
                                });
                            }
                            
                            grid.bindToDatasource(config.dataSourceName, {
                                columns : columns 
                            });
                            
                            var
                            attributes = dataSource.getAttributeNames();

                            for(var i = config.rows.pushToDataSource.length + 1 , attr ; attr = attributes[i] ; i++){
                                dataSource.addListener("onAttributeChange", config.callback , {
                                    attributeName: attr
                                });
                            }
							
                            grid.$domNode.find('.waf-widget-footer').remove();
                            $(grid).trigger('bindToNNRelationReady');
                        }
                    }
                },
                {
                    lastEntity 	: i == collection.length - 1
                });
            }
        }
    });
}

WAF.generateRandomStr = function randomStr(){
    var
    defaultConf	= {
        onlyChars       : false,
        onlyNumbers	: false,
        length		: 10,
        chars		: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"
    },
    conf 	= defaultConf,
    res 	= "";

    if(arguments.length == 0){
        conf = defaultConf;
    }
    else if(typeof arguments[0] == "number"){
        conf.length = arguments[0];

        conf = $.extend({} , defaultConf , arguments[1]);
    }
    else if(typeof arguments[0] == "object"){
        conf = $.extend({} , defaultConf , arguments[0]);
    }

    if(conf.onlyNumbers){
        conf.chars = '1234567890';
    }

    if(conf.onlyChars){
        conf.chars = conf.chars.substr(0 , conf.chars.length - 10);
    }

    for(var i=0 ; i < conf.length ; i++){
        j = Math.floor(Math.random() * conf.chars.length);
        res += conf.chars.charAt(j);
    }

    return res;
}

function Column (config){
    if(typeof config == 'string'){
        config = {
            sourceAttID : config
        };
    }
	
    this.sourceAttID 	= config.sourceAttID;
    this.colID			= function(){
        if(config.colID){
            return config.colID
        }
        if(config.sourceAttID){
            return config.sourceAttID;
        }
		
        return null;
    }.call();
    this.width		= config.width 		|| 120;
    this.readOnly	= config.readOnly 	|| false;
    this.title	= function(){
        if(config.title){
            return config.title;
        }
        if(config.sourceAttID){
            return config.sourceAttID;
        }
        if(config.colID){
            return config.colID
        }
		
        return null;
    }.call();
}