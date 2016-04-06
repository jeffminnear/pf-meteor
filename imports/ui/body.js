'use strict';

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
// import { Session } from 'meteor/session';


import scrapers from 'pf-scrapers';

import './body.jade';


Template.body.events({
  'submit .search'(event) {
    event.preventDefault();

    const target = event.target;
    const text = target.text.value;


    var args = {
      limit: 5,
      title: text
    };

    Meteor.call('getResults', args);

    target.text.value = "";
  },
});
