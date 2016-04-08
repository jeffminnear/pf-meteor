'use strict';

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';


import scrapers from 'pf-scrapers';

import './body.jade';
import './result.jade';

// Template.body.onRendered(function() {
//   const self = this;
//
//   Tracker.autorun(() => {
//     console.log('tracker autorun');
//     self.scrapeResults = Session.get('scrapeResults');
//   });
// });

Template.body.helpers({
  scrapeResults() {
    return Session.get('scrapeResults');
  }
});

Template.body.events({
  'submit .search'(event) {
    event.preventDefault();

    const target = event.target;
    const text = target.text.value;


    var args = {
      limit: 5,
      title: text
    };

    Meteor.call('getResults', args, function(error, result) {
      if ( result == null ) return;

      Promise.all(result)
        .then((results) => {
          Session.set('scrapeResults', results);
        });
    });

    target.text.value = "";
  },
});
