module.exports = {
	ID: new Attribute("storage", "long", "key auto"),
	name: new Attribute("storage", "string", "auto", {
		"unique": true,
		"not_null": true
	}),
	scenarios: new Attribute("relatedEntities", "Scenarios", "network", {
		"reversePath": true
	}),
	h_Ns: new Attribute("relatedEntities", "H_Ns", "network", {
		"reversePath": true
	}),
	hosts: new Attribute("relatedEntities", "Hosts", "h_Ns.host")
};