exports.isEmptyArg = (arg) => {
  if (!arg) return true;
  if (typeof arg.length !== 'undefined' && arg.length === 0) return true;
  if (JSON.stringify(arg).trim() === '[]') return true;
  if (JSON.stringify(arg).trim() === '{}') return true;
  if (arg.trim && (arg.trim() === '')) return true;
  return false;
};

exports.baseChars = str => str.toLowerCase().replace(/[áäàÀÁÂÃÄÅ]/g, 'a')
  .replace(/[èéèÈÉÊË]/g, 'e')
  .replace(/[íìIÎ]/g, 'i')
  .replace(/[óòÓÔ]/g, 'o')
  .replace(/[úùüÙ]/g, 'u')
  .replace(/[çÇ]/g, 'c')
  .replace(/[ñÑ]/g, 'n')
  .replace(/[-\\?]/g, '');
