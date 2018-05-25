const initializeStartTime = (data) => {
  data.startTime = data.startTime || JSON.stringify(new Date());
  return data;
};

const initializeDefaultRoom = (scure, data) => {
  data.roomId = data.roomId || scure.getInit().roomId;
  return data;
};

const increaseNumCommand = (data) => {
  const getNextNumCommand = num => (!num ? 1 : (num + 1));
  data.numCommands = getNextNumCommand(data.numCommands);
  return data;
};

const scureInitializeState = (scure, data) => {
  data = data || {};
  data = initializeStartTime(data);
  data = initializeDefaultRoom(scure, data);
  data = increaseNumCommand(data);
  return data;
};

exports.scureInitializeState = scureInitializeState;
