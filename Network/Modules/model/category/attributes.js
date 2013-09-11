module.exports = {
	ID: new Attribute("storage", "long", "key auto"),
	name: new Attribute("storage", "string"),
	description: new Attribute("storage", "string", null, {
		"multiLine": true
	}),
	themes: new Attribute("relatedEntities", "Themes", "category", {
		"reversePath": true
	})
};