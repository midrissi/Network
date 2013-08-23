var TheDataClass 	= new (require('nn/relation').RelationMember)('Groups', 'public'), // new (require('nn/relation').RelationMember)()
	utils			= require('utils');

utils.extend(TheDataClass, require('./attributes'));
utils.extend(TheDataClass, require('./methods'));
utils.extend(TheDataClass, require('./events'));

module.exports = TheDataClass;