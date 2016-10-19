
function ProxyManager(createProxyFromStream, createProxyFromObject) {
	this._createProxyFromStream = createProxyFromStream;
	this._createProxyFromObject = createProxyFromObject;
	this._proxies = [];
}

ProxyManager.prototype.add = function(proxy) {
	this._proxies.push(proxy);
}

ProxyManager.prototype.getProxyFromObject = function(object) {
	var proxy = this._proxies.find(function(proxy) {
		return (
			(object.id || object.id === 0) && proxy.id === object.id
		);
	});
	if (!proxy && this._createProxyFromObject) {
		proxy = this._createProxyFromObject(object);
		this.add(proxy);
	}
	return proxy;
};

ProxyManager.prototype.getProxyFromLocalStream = function(stream) {
	var proxy = this._proxies.find(function(proxy) {
		return (
			proxy.target === stream
		);
	});
	if (!proxy && this._createProxyFromStream) {
		proxy = this._createProxyFromStream(stream);
		this.add(proxy);
	}
	return proxy;
};

ProxyManager.prototype.getObjectFromLocalStream = function(stream) {
	var proxy = this.getProxyFromLocalStream(stream);
	var object = proxy.toObject();
	return object;
};

module.exports = ProxyManager;
