var User 	= new (require('nn/relation').RelationMember)('Users', 'public'),
	utils	= require('utils'),
	_		= require('underscore');

utils.extend(User, require('./attributes'));
utils.extend(User, require('./methods'));
utils.extend(User, require('./events'));

module.exports = User;