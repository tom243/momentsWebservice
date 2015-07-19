var contactsCollection = require("./dao");

/* Constructor for the contactsManager */
function ContactsManager() {
	this.contacts = [];
	console.log("Created instance of contacts manager\n");
};

ContactsManager.prototype.getAllContacts = function(callback) {
	if (this.contacts === undefined || this.contacts.length == 0) {// verify contact list is exist
		contactsCollection.getAllcontacts(function(contactList) {
			console.log("callback with the list of contacts in  getAllcontacts function\n");
			callback(contactList);
			// return the  contacts list with callback
		});
	} else {
		console.log("Contacts is up to date - no need to access mongo DB\n");
		callback(this.contacts);
	}
};

ContactsManager.prototype.setAllContacts = function(contactList) {// Set new contacts array
	this.contacts = contactList;
};

exports.getContactsManager = function() {
	var contactsManager = new ContactsManager();
	return contactsManager;
}; 