
function Packet(type, data) {
	data.type = type;
	return data;
}

Packet.types = {
	STATE_UPDATE: 'state-update',
	STATES: 'states',
	EVENT: 'event',
	COMMAND: 'command'
};

Packet.StateUpdatePacket = function(target, time, update) {
	return new Packet(
		Packet.types.STATE_UPDATE,
		{
			target: target,
			time: time,
			update: update
		}
	);
};

Packet.StatesPacket = function(target, states) {
	return new Packet(
		Packet.types.STATES,
		{
			target: target,
			states: states
		}
	);
};

Packet.EventPacket = function(eventType, target, data) {
	return new Packet(
		Packet.types.EVENT,
		{
			eventType: eventType,
			target: target,
			data: data
		}
	);
};

Packet.CommandPacket = function(commandType, target, data) {
	return new Packet(
		Packet.types.COMMAND,
		{
			commandType: commandType,
			target: target,
			data: data
		}
	);
};

module.exports = Packet;
