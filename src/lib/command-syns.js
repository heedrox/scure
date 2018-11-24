const isInInventory = (scure, item, data) => scure.items.isInInventory(item.id, data.inventory);
const isInLocation = (item, roomId) =>
  (item.location === null) || (roomId === item.location && item.location !== null);
const itemIsFound = (scure, data, item) =>
  item && (isInInventory(scure, item, data) || isInLocation(item, data.roomId));
const matchItems = (argument, synArgument, data, scure) => {
  const item = scure.items.getBestItem(argument, data, scure);
  return item ? (item.id === synArgument && itemIsFound(scure, data, item)): false;
};
const byCommandSyn = (command, argument, data, scure) => commandSyn =>
  (commandSyn.fromCommand === command) && matchItems(argument, commandSyn.arg, data, scure);

const findCommand = (scure, command, argument, data) => {
  const resultCommand = scure.data.commandSyns.find(byCommandSyn(command, argument, data, scure));
  return resultCommand ? resultCommand.toCommand : null;
};

const getCommandSyn = (command, argument, data, scure) =>
  (scure.data.commandSyns ? findCommand(scure, command, argument, data) : null);

exports.getCommandSyn = getCommandSyn;
