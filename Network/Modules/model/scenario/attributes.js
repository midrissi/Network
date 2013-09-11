module.exports = {
	ID: new Attribute("storage", "long", "key auto"),
	name: new Attribute("storage", "string", "auto", {
		"unique": true,
		"not_null": true
	}),
	description: new Attribute("storage", "string", null, {
		"multiLine": true
	}),
	requests: new Attribute("relatedEntities", "Requests", "scenario", {
		"reversePath": true
	}),
	network: new Attribute("relatedEntity", "Network", "Network"),
	theme: new Attribute("relatedEntity", "Theme", "Theme")
};