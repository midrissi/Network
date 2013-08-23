module.exports = {
	ID: new Attribute("storage", "long", "key auto"),
	userRelations: new Attribute("relatedEntities", "U_Gs", "group", {
		"reversePath": true
	}),
	name: new Attribute("storage", "string", "btree", {
		unique: true
	})
};