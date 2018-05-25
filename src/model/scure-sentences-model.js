class ScureSentencesModel {
  constructor(sentences) {
    this.sentences = sentences;
  }

  get(key, args) {
    if (!args || args.length === 0) return this.sentences[key];
    const replacer = (s1, s2) => s1.replace(`{${s2}}`, args[s2]);
    return Object.keys(args).reduce(replacer, this.sentences[key]);
  }
}

exports.ScureSentences = ScureSentencesModel;
