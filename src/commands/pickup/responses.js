const { aResponse } = require('../../scure-response');

const unknown = scure => aResponse(scure.sentences.get('item-unknown'));
const notSeen = (scure, name) => aResponse(scure.sentences.get('item-notseen', { name }));
const alreadyInInventory = (scure, item) =>
  aResponse(scure.sentences.get('item-alreadyinventory', { name: item.name.toLowerCase() }));
const alreadyPicked = (scure, item) =>
  aResponse(scure.sentences.get('item-alreadypicked', { name: item.name.toLowerCase() }));
const pickedUp = (scure, data, item) => {
  const aditionalResponse = item.pickingResponse ? ` ${item.pickingResponse}` : '';
  const pickedResponse = scure.sentences.get('item-pickedup', { name: item.name.toLowerCase() });
  return aResponse(`${pickedResponse}${aditionalResponse}`, data);
};
const itemNotPickable = (scure, item) => (item.pickingResponse ?
  aResponse(item.pickingResponse) :
  aResponse(scure.sentences.get('item-notpickable', { name: item.name.toLowerCase() })));

const responses = {
  unknown,
  notSeen,
  alreadyInInventory,
  alreadyPicked,
  pickedUp,
  itemNotPickable,
};

exports.responses = responses;
