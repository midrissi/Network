var result = {};

/************************************************************************************
 |                                                                                  |
 |                               Attribute Events                                	|
 | Examples:                                                                        |
 |          result.attributeName.events.onInit = function() 						|
 |          result.attributeName.events.onLoad = function() 						|
 |          result.attributeName.events.onSet = function() 							|
 |          result.attributeName.events.onValidate = function() 					|
 |          result.attributeName.events.onSave = function() 						|
 |          result.attributeName.events.onRemove = function()                       |
 |                                                                                  |
 ************************************************************************************/



/************************************************************************************
 |                                                                                  |
 |                            Datastore Class Event                             	|
 | Examples:                                                                        |
 |          result.events.onInit = function() 										|
 |          result.events.onLoad = function() 										|
 |          result.events.onValidate = function() 									|
 |          result.events.onSave = function() 										|
 |          result.events.onRemove = function()										|
 |          result.events.onRestrictingQuery = function()							|
 |                                                                                  |
 ************************************************************************************/

// Initialize the events object:
result.events = {};
result.events.onRemove = function() {
	this.hosts.remove();
};

/************************************************************************************
 |                                                                                  |
 |                         Calculated Attributes Events                          	|
 | Examples:                                                                        |
 |          result.attributeName.onGet = function() 								|
 |          result.attributeName.onSet = function() 								|
 |          result.attributeName.onQuery = function() 								|
 |          result.attributeName.onSort = function()								|
 |                                                                                  |
 ************************************************************************************/



// Export the result object:
module.exports = result;