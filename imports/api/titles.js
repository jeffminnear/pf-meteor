import { Mongo } from 'meteor/mongo';

export const Titles = new Mongo.Collection('titles');

Meteor.methods({
  'titles.insert'(text) {
    check(text, String);

    Titles.insert({ text });
  },
  'titles.getArray'() {
    let objArray = Titles.find({});
    let strArray = [];
    for (var obj in objArray) {
      strArray.push(obj.text);
    }
    return strArray;
  },
});
