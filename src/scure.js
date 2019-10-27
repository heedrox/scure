const { ScureAnswers } = require('./model/scure-answers-model');
const { ScureSentences } = require('./model/scure-sentences-model');
const { ScureUsages } = require('./model/scure-usages-model');
const { ScureItems } = require('./model/scure-items-model');
const { ScureRooms } = require('./model/scure-rooms-model');


class Scure {
  constructor(data) {
    this.data = data;
    this.sentences = new ScureSentences(data.sentences);
    this.items = new ScureItems(data.items);
    this.rooms = new ScureRooms(data.rooms, data.map);
    this.usages = new ScureUsages(data.usages);
    this.answers = new ScureAnswers(data.answers);
  }

  getInit() {
    return this.data.init;
  }

  getMapImage() {
    return this.data.mapImage;
  }

  getCanJumpRooms() {
    return this.data && this.data.init ? this.data.init.canJumpRooms : false;
  }

  getLeftTimeFrom(startTime) {
    const startDateTime = new Date(JSON.parse(startTime));
    const passedTime = ((new Date().getTime() - startDateTime.getTime()) / 1000);
    const remainingTime = (this.getInit().totalMinutes * 60) - passedTime;
    const minutes = Math.floor(remainingTime / 60);
    const seconds = Math.floor(remainingTime % 60);
    return this.sentences.get('remaining-time', { minutes, seconds });
  }
}

const buildScureFor = data => new Scure(data);

exports.buildScureFor = buildScureFor;

