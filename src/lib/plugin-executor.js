const executePlugin = (plugin, data, scure) => plugin(data, scure);

const isPluginFunction = plugin => typeof plugin === 'function';

const executePluginExtension = (data, scure) => dataElement =>
  (isPluginFunction(dataElement) ? executePlugin(dataElement, data, scure) : dataElement);

const executePluginExtensions = (response, data, scure) =>
  response.data.map(executePluginExtension(data, scure)).join('');

const handlePluginExtensions = (response, data, scure) =>
  (response.isPluginExtension ? executePluginExtensions(response, data, scure) : response);

exports.handlePluginExtensions = handlePluginExtensions;
