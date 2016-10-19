
var packetEncryptor = {
	encrypt: function(packet) {
		return JSON.stringify(packet);
	},
	decrypt: function(str) {
		return JSON.parse(str);
	}
};

module.exports = packetEncryptor;
