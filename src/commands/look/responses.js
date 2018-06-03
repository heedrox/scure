const { aResponse } = require('../../scure-response');
const { getPossibleDestinationsSentence } = require('../../scure-commons');
const { getDescription } = require('../../scure-commons');
const { handlePluginExtensions } = require('../../lib/plugin-executor');

const itemNotFound = scure => aResponse(scure.sentences.get('item-not-in-location'));
const itemDescription = (scure, data, item) => {
  const description = getDescription(item.description, data, scure);
  return aResponse(handlePluginExtensions(description, data, scure));
};

const lookRoom = (scure, data, roomId) => {
  const room = scure.rooms.getRoom(roomId);
  const description = getDescription(room.description, data, scure);
  const destinations = getPossibleDestinationsSentence(scure, data);
  return aResponse(`${description} ${destinations}`);
};

const responses = {
  itemNotFound,
  itemDescription,
  lookRoom,
};

exports.responses = responses;
