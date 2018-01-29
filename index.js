/* jshint node: true */
'use strict';

var util = require('util');
var extend = util._extend;
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

    parentApp.import('vendor/bootstrap-slider.js');

    if (options.importBootstrapSliderCSS) {
      parentApp.import('vendor/bootstrap-slider.css');
    }
    if (options.importAddonCss) {
      parentApp.import('vendor/ui-slider.css');
    }
  },

  treeForVendor(vendorTree) {
    var bootstrapSliderJsTree = new Funnel('bower_components/seiyria-bootstrap-slider/dist', {
      files: ['bootstrap-slider.js']
    });
    var bootstrapSliderCssTree = new Funnel('bower_components/seiyria-bootstrap-slider/dist/css', {
      files: ['bootstrap-slider.css', 'vendor/ui-slider/ui-slider.css']
    });
    var addonCssTree = new Funnel('vendor/ui-slider', {
      files: ['ui-slider.css']
    });

    sliderJsTree = map(sliderJsTree, (content) => `if (typeof FastBoot === 'undefined') { ${content} }`);

    var sliderTree = mergeTrees([sliderJsTree, sliderCssTree, addonCssTree]);

    return vendorTree ? mergeTrees([vendorTree, sliderTree]) : sliderTree;
  }
};
