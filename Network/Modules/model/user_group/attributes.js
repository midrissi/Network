module.exports = {
	ID: new Attribute("storage", "long", "key auto"),
	group: new Attribute("relatedEntity", "Group", "Group"),
	user: new Attribute("relatedEntity", "User", "User")
};