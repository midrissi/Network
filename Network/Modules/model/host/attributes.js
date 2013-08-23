module.exports = {
	ID: new Attribute("storage", "long", "key auto"),
	name: new Attribute("storage", "string", "auto", {
		"unique": true,
		"not_null": true
	}),
	type: new Attribute("storage", "string"),
	description: new Attribute("storage", "string"),
	image: new Attribute("storage", "image"),
	ip: new Attribute("storage", "string"),
	port: new Attribute("storage", "number"),
	hostname: new Attribute("calculated", "string"),
	hostname: new Attribute("calculated", "string"),
	h_Ns: new Attribute("relatedEntities", "H_Ns", "host", {
		"reversePath": true
	}),
	networks: new Attribute("relatedEntities", "Networks", "h_Ns.network")
};