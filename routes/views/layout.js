var keystone = require('keystone');

exports = module.exports = function(req, res){

  var view = new keystone.View(req, res);
  var locals = res.locals;

  // Set locals
  locals.section = 'layout';
  locals.filters = {
		layout: req.params.layout
	};
  locals.data = {
    layouts: []
  }
  // Load the published layouts
  view.on('init', function(next){

    var q = keystone.list('Layout').model.find().where('state', 'published').sort('-publishedDate');

      q.exec(function(err, results) {
  			locals.data.layouts = results;
  			next(err);
  		});

    });

    // Render the view
  	view.render('layout');

};
