const { aResponse } = require('../../scure-response');
const { getPossibleDestinationsSentence } = require('../../scure-commons');
const { getDescription } = require('../../scure-commons');

const itemNotFound = scure => aResponse(scure.sentences.get('item-not-in-location'));
const itemDescription = (scure, data, item) =>
  aResponse(getDescription(item.description, data, scure));
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
