import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Titles = new Mongo.Collection('titles');

Meteor.methods({
  'titles.insert'(text) {
    check(text, String);

    Titles.insert({ text });
  },
  'titles.getArray'(term) {
    var query = {
      text: { $regex: term, $options: 'i' }
    };

    var results = Titles.find(query, { limit: 15 }).fetch();
    var array = [];
    for (var i = 0; i < results.length; i++) {
      array.push(results[i].text);
    }

    return array;
  },
});
