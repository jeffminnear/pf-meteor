'use strict';

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { ReactiveDict } from 'meteor/reactive-dict';

import { Titles } from '../api/titles.js';


import scrapers from 'pf-scrapers';
import _ from 'lodash';

import './body.jade';
import './result.jade';

const ResultList = new Meteor.Collection(null);


$(document).ready(function () {
  $('#search-field').autocomplete({
    source: function (request, callback) {
      Meteor.call('titles.getArray', request.term, function (err, results) {
        callback(results);
      });
    },
    select: function (event, ui) {
      $('#search-field').val(ui.item.value);
      $('#search-form').submit();
    }
  });
});

Template.body.onCreated(function bodyOnCreated() {
  this.state = new ReactiveDict();
});

Template.body.helpers({
  results() {
    const instance = Template.instance();
    if (instance.state.get('onSaleOnly')) {
      if (ResultList.find({ normalPrice: { $ne: null } }).count() == 0) {
        alert("No items in the search results are on sale");
      }
      return ResultList.find({ normalPrice: { $ne: null } }, {
        sort: [["levDistance", "asc"], ["simplifiedTitle", "asc"], ["price", "asc"]]
      });
    }
    return ResultList.find({}, {
      sort: [["levDistance", "asc"], ["simplifiedTitle", "asc"], ["price", "asc"]]
    });
  },
});

Template.body.events({
  'submit #search-form'(event) {
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
            Meteor.call('titles.insert', results[i].simplifiedTitle);
          }
        });
    });

    target.text.value = "";
  },
  'change .sale-switch input'(event, instance) {
    instance.state.set('onSaleOnly', event.target.checked);
  },
});
