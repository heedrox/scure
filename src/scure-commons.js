const { matchesCondition } = require('./lib/conditions-evaluator');
const { isEmptyArg } = require('./lib/common');
const { removeStopwords } = require('./scure-stopwords');
const { singularizeWords } = require('./scure-singular');

const joinMultipleStrings = (arr, language) => {
  if (arr.length === 1) return arr[0];
  const concatenator = (language === 'en') ? 'and' : 'y';
  return `${arr.slice(0, arr.length - 1).join(', ')} ${concatenator} ${arr[arr.length - 1]}`;
};

const baseChars = str => str.replace(/[áäàÀÁÂÃÄÅ]/g, 'a')
  .replace(/[èéèÈÉÊË]/g, 'e')
  .replace(/[íìIÎ]/g, 'i')
  .replace(/[óòÓÔ]/g, 'o')
  .replace(/[úùüÙ]/g, 'u')
  .replace(/[çÇ]/g, 'c')
  .replace(/[-]/g, '');

const removeExtraSpaces = phrase => phrase.replace(/\s+/g, ' ').trim();
const joinNumbers = phrase => phrase.replace(/\d\s+\d/g, digits => digits.replace(/\s+/g, ''));

const cleanText = name =>
  joinNumbers(removeExtraSpaces(singularizeWords(removeStopwords(baseChars(name.toLowerCase())))));

const isSynonym = (synonyms, name) => {
  const synsArr = synonyms || [];
  const lcSyns = synsArr.map(cleanText);
  return lcSyns.indexOf(cleanText(name)) >= 0;
};

const isTextEqual = (name1, name2) => {
  const cleanName1 = cleanText(name1);
  const cleanName2 = cleanText(name2);
  if (isEmptyArg(cleanName1) || isEmptyArg(cleanName2)) return false;
  return cleanName1 === cleanName2;
};

const getPossibleDestinationsSentence = (scure, data) => {
  const destinations = scure.rooms.getPossibleDestinationNamesFrom(data.roomId, data.unlocked);
  return (destinations.length > 0) ? scure.sentences.get('destinations', { destinations }) : '';
};

const getMatchingDescription = (descriptions, data, scure) => {
  const byMatchingCondition = d => matchesCondition(data, scure)(d.condition);
  const matchedDescriptions = descriptions.filter(byMatchingCondition);
  return matchedDescriptions.length > 0 ? matchedDescriptions[0] : null;
};

const getDescription = (descriptions, data, scure) => {
  if (typeof descriptions === 'string') return descriptions;
  if (typeof descriptions[0] === 'undefined') return descriptions;
  const match = getMatchingDescription(descriptions, data, scure);
  return match ? match.description : descriptions[descriptions.length - 1].description;
};

const getConsumesObjects = (descriptions, data, scure) => {
  if (typeof descriptions === 'string') return false;
  const match = getMatchingDescription(descriptions, data, scure);
  return match ? match.consumesObjects : descriptions[descriptions.length - 1].consumesObjects;
};

const buildUsageIndex = (itemId1, itemId2) => {
  const itemsSorted = [itemId1, itemId2].sort();
  return itemsSorted.join('-');
};

const addItemIdTo = (itemId, data, container) => {
  data[container] = data[container] || [];
  if (data[container].indexOf(itemId) === -1) {
    data[container].push(itemId);
  }
};

exports.joinMultipleStrings = joinMultipleStrings;
exports.isSynonym = isSynonym;
exports.isTextEqual = isTextEqual;
exports.getPossibleDestinationsSentence = getPossibleDestinationsSentence;
exports.getDescription = getDescription;
exports.getConsumesObjects = getConsumesObjects;
exports.buildUsageIndex = buildUsageIndex;
exports.addItemIdTo = addItemIdTo;
