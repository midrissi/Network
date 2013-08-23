module.exports = {
	ID: new Attribute("storage", "long", "key auto"),
	host: new Attribute("relatedEntity", "Host", "Host"),
	network: new Attribute("relatedEntity", "Network", "Network"),
	x: new Attribute("storage", "number"),
	y: new Attribute("storage", "number")
};