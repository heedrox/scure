const executePlugin = (plugin, data, scure, extra) => plugin(data, scure, extra);

const isPluginFunction = plugin => typeof plugin === 'function';

const executePluginExtension = (data, scure, extra) => respData =>
  (isPluginFunction(respData) ? executePlugin(respData, data, scure, extra) : respData);

const executePluginExtensions = (response, data, scure, extra) =>
  response.data.map(executePluginExtension(data, scure, extra)).join('');

const handlePluginExtensions = (response, data, scure, extra) =>
  (response.isPluginExtension ? executePluginExtensions(response, data, scure, extra) : response);

exports.handlePluginExtensions = handlePluginExtensions;
