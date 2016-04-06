'use strict';

import { Meteor } from 'meteor/meteor';

import scrapers from 'pf-scrapers';

Meteor.startup(() => {
  // code to run on server at startup
});

/*
TODO figure out why this method is being called twice
     once with the correct title, and once with a blank title
*/
Meteor.methods({
  'getResults': function getResults(args) {
    console.log("##################################################\n" + args.title + "\n##################################################");

    var promises = scrapers;

    Promise.all(promises.map((x) => x(args)))
      .then((results) => {
        console.log(results);
      });
  }
});
