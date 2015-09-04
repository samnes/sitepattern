'use strict';
var keystone = require('keystone');

exports = module.exports = function(req, res){

  var view = new keystone.View(req, res);
  var locals = res.locals;

  // Set locals
  locals.section = 'site';
  locals.filters = {
		site: req.params.site
	};
  locals.data = {
    sites: []
  };
  // Load the published sites
  view.on('init', function(next){

    var q = keystone.list('Site').model.find().where('state', 'published').sort('-publishedDate');

      q.exec(function(err, results) {
  			locals.data.sites = results;
  			next(err);
  		});

    });

    // Render the view
  	view.render('site');

};
