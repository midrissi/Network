var result = {},
	utils  = require('utils');

/************************************************************************************
 |                                                                                  |
 |                               Attribute Events                                	|
 | Examples:                                                                        |
 |          result.attributeName.events.onInit = function on_init() 				|
 |          result.attributeName.events.onLoad = function on_load() 				|
 |          result.attributeName.events.onSet = function on_set() 					|
 |          result.attributeName.events.onValidate = function on_validate() 		|
 |          result.attributeName.events.onSave = function on_save() 				|
 |          result.attributeName.events.onRemove = function on_remove()             |
 |                                                                                  |
 ************************************************************************************/



/************************************************************************************
 |                                                                                  |
 |                            Datastore Class Event                             	|
 | Examples:                                                                        |
 |          result.events.onInit = function on_init() 								|
 |          result.events.onLoad = function on_load() 								|
 |          result.events.onValidate = function on_validate() 						|
 |          result.events.onSave = function on_save() 								|
 |          result.events.onRemove = function on_remove()							|
 |          result.events.onRestrictingQuery = function on_restricting_query()		|
 |                                                                                  |
 ************************************************************************************/

// Initialize the events object:
result.events = {};

// Initialize the events object:
result.events = {};

/*result.events.onRestrictingQuery = function(){
	var curSession = currentSession();

	if(curSession.belongsTo(config.ROLES.SELLER)){
		return this.all();
	}
	else if(utils.isCustomer()){
		return this.query('ID == :1', sessionStorage.ID);
	}

	return this.createEntityCollection();
}*/

/************************************************************************************
 |                                                                                  |
 |                         Calculated Attributes Events                          	|
 | Examples:                                                                        |
 |          result.attributeName.onGet = function on_get() 							|
 |          result.attributeName.onSet = function on_set() 							|
 |          result.attributeName.onQuery = function on_query() 						|
 |          result.attributeName.onSort = function on_sort()						|
 |                                                                                  |
 ************************************************************************************/

result.password = {
	onGet: function on_get () {
		return "************";
	},
	onSet: function on_set (value) {
		this.ha1key = directory.computeHA1(this.getKey(), value);
	}
};

result.fullname = {
	onGet: function on_get () {
		var formatter = require("formatting");

		return formatter.formatString(this.firstname, "c") + " " + formatter.formatString(this.lastname, "U");
	}
};

// Export the result object:
module.exports = result;