var keystone = require('keystone');
var util = require('util');

exports = module.exports = function(req, res){

  var view = new keystone.View(req, res);
  var locals = res.locals;

  // Set locals
  locals.section = 'site';
  locals.filters = {
		layout: req.params.layout
	};
  locals.data = {
    selected: [],
    layouts: []
  };


  // Load the current layout filter
  view.on('init', function(next) {

    if (req.params.layout) {
      keystone.list('Site').model.findOne({ key: locals.filters.layout }).exec(function(err, result) {
        locals.data.layout = result;
        next(err);
      });
    } else {
      next();
    }

  });

    // Load the layouts
    view.on('init', function(next) {

      var q = keystone.list('Layout').model.find().where('state', 'published').sort('-publishedDate').populate('sites author');

      if (locals.data.layout) {
        q.where('sites').in([locals.data.layout]);
      }

      q.exec(function(err, results) {
        locals.data.selected = results;

        next(err);
      });

    });

    // Render the view
  	view.render('layouts');

};
