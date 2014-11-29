/* jshint node:true */
'use strict';

var h = require('virtual-dom/h');
var diff = require('virtual-dom/diff');
var patch = require('virtual-dom/patch');
var createElement = require('virtual-dom/create-element');
var Marionette = require('backbone.marionette');
var $ = require('jquery');
var Backbone = require('backbone');

var View = Marionette.ItemView.extend({
  modelEvents: {
    "change": "render"
  },
  template: function(data) {
    return h('div', [
      h('div', {
        style: {
            textAlign: 'center',
            verticalAlign: 'center',
            lineHeight: (100 + data.count) + 'px',
            border: '1px solid red',
            width: (100 + data.count) + 'px',
            height: (100 + data.count) + 'px'
        }
      }, [ String(data.count) ])

    ]);
  },

  _renderTemplate: function() {
    var template = this.getTemplate();

    // Add in entity data and template helpers
    var data = this.serializeData();
    data = this.mixinTemplateHelpers(data);

    var newTree = template(data);
    if(this._vDom) {
      var patches = diff(this._vDom, newTree);
      this._rootNode = patch(this._rootNode, patches);
    } else {
      this._rootNode = createElement(newTree);
      this.el.appendChild(this._rootNode);
    }
    this._vDom = newTree;

    return this;
  },
});

var model = new Backbone.Model({ count: 1 });
var view = new View({ el: 'body', model: model }).render();

setInterval(function () {
     var count = model.get('count');
     count++;
     model.set('count', count);
}, 1000);

