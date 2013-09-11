module.exports = {
	ID: new Attribute("storage", "long", "key auto"),
	name: new Attribute("storage", "string"),
	description: new Attribute("storage", "string", null, {
		"multiLine": true
	}),
	category: new Attribute("relatedEntity", "Category", "Category"),
	scenarios: new Attribute("relatedEntities", "Scenarios", "theme", {
		"reversePath": true
	})
};