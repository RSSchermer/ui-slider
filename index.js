/* jshint node: true */
'use strict';

var util = require('util');
var extend = util._extend;
var path = require('path');
var Funnel = require('broccoli-funnel');
var mergeTrees = require('broccoli-merge-trees');
var map = require('broccoli-stew').map;

var defaultOptions = {
  importBootstrapSliderCSS: true,
  importAddonCss: true
};

module.exports = {
  name: 'ui-slider',
  description: 'A flexible UI slider for ambitious Ember apps',
  included: function(app) {
    var parentApp = (typeof app.import !== 'function' && app.app) ? app.app : app;
    var options = extend(defaultOptions, app.options['ui-slider']);

    parentApp.import('bower_components/seiyria-bootstrap-slider/dist/bootstrap-slider.js');

    if (options.importBootstrapSliderCSS) {
      parentApp.import('bower_components/seiyria-bootstrap-slider/dist/css/bootstrap-slider.css');
    }
    if (options.importAddonCss) {
      parentApp.import('vendor/ui-slider/ui-slider.css');
    }
  },

  treeForVendor(vendorTree) {
    var dir = path.dirname(require.resolve('ui-slider'));
    var sliderJsTree = new Funnel(dir, {
      files: ['bootstrap-slider.js']
    });
    var sliderCssTree = new Funnel(dir, {
      files: ['bootstrap-slider.css', 'ui-slider.css']
    });

    sliderJsTree = map(sliderJsTree, (content) => `if (typeof FastBoot === 'undefined') { ${content} }`);

    var sliderTree = mergeTrees([sliderJsTree, sliderCssTree]);

    return vendorTree ? mergeTrees([vendorTree, sliderTree]) : sliderTree;
  }
};
