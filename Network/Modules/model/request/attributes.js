module.exports = {
	ID: new Attribute("storage", "long", "key auto"),
	source: new Attribute("relatedEntity", "Host", "Host"),
	destination: new Attribute("relatedEntity", "Host", "Host"),
	action: new Attribute("storage", "string"),
	params: new Attribute("storage", "string"),
	type: new Attribute("storage", "string"),
	protocol: new Attribute("storage", "string"),
	scenario: new Attribute("relatedEntity", "Scenario", "Scenario"),
	order: new Attribute("storage", "long", null, {
		"not_null": true,
		"autosequence": true
	}),
	description: new Attribute("storage", "string")
};