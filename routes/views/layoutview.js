var keystone = require('keystone');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Set locals
	locals.section = 'site';
	locals.filters = {
		view: req.params.layoutview,
		originalUrl: req.originalUrl
	};
  locals.data = {
    views: [],
		patterns: []
  };

	// Load the current layout
	view.on('init', function(next) {

		var q = keystone.list('Layout').model.findOne({
			state: 'published',
      key: locals.filters.view
      }).populate('author sites patterns');

		q.exec(function(err, result) {
			locals.data.views = result;
			next(err);
		});

	});

	// Load all the patterns
	view.on('init', function(next) {

	  var q = keystone.list('Pattern').model.find().where('state', 'published').sort('-publishedDate');

		q.exec(function(err, result) {
			locals.data.patterns = result;
			next(err);

		});

	});



	// Render the view
	view.render('layoutview');

};
