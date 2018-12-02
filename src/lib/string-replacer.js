const stringReplace = (sentence, args) => {
  const replacer = (s1, s2) => s1.replace(`{${s2}}`, args[s2]);
  return Object.keys(args).reduce(replacer, sentence);
};

exports.stringReplace = stringReplace;
