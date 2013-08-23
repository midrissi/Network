var TheDataClass 	= new (require('nn/relation').Relation)('U_Gs', 'public'),
	utils			= require('utils');

utils.extend(TheDataClass, require('./attributes'));
utils.extend(TheDataClass, require('./methods'));
utils.extend(TheDataClass, require('./events'));

module.exports = TheDataClass;