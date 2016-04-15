'use strict';

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';


import scrapers from 'pf-scrapers';
import _ from 'lodash';

import './body.jade';
import './result.jade';

const ResultList = new Meteor.Collection(null);

Template.body.helpers({
  results() {
    console.log(ResultList.find().fetch());
    return ResultList.find({}, {
      sort: [["levDistance", "asc"], ["simplifiedTitle", "asc"], ["price", "asc"]]
    });
  },
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
          ResultList.remove({});
          for (var i = 0; i < results.length; i++) {
            ResultList.insert(results[i]);
          }
        });
    });

    target.text.value = "";
  },
});
