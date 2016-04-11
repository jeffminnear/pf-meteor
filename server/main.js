'use strict';

import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';

import scrapers from 'pf-scrapers';
import _ from 'lodash';
import Levenshtein from 'levenshtein';

Meteor.startup(() => {
  // code to run on server at startup
});


Meteor.methods({
  'getResults': function getResults(args) {
    if (!args.title) {
      return;
    }

    console.log("##################################################\n" + args.title + "\n##################################################");

    var promises = scrapers;

    return new Promise((resolve, reject) => {
      Promise.all(promises.map((x) => x(args)))
        .then((results) => {
          results = _.flatten(results);
          for (var i = 0; i < results.length; i++) {
            var result = results[i];
            var resultLev = new Levenshtein (args.title.toLowerCase(), result.simplifiedTitle);
            result.levDistance = resultLev.distance;
          }

          resolve(results);
        });
    });
  }
});
