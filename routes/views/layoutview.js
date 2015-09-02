var keystone = require('keystone'),

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Set locals
	locals.section = 'site';
	locals.filters = {
		view: req.params.layoutview,
		site: req.params.layout,
		siteName: req.params.layout,
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

	// Load the current site filter
	view.on('init', function(next) {

		if (locals.filters.site) {
			keystone.list('Site').model.findOne({ key: locals.filters.site }).exec(function(err, result) {
				locals.filters.site = result;
				next(err);
			});
		} else {
			next();
		}

	});

	// Load all the patterns
	view.on('init', function(next) {

		var q = keystone.list('Layout').model.find();

		q.where('state', 'published').populate('sites patterns').deepPopulate('patterns.patternCategories');

		if (locals.filters.site) {
			q.where('sites').in([locals.filters.site]);
		}

		q.exec(function(err, result) {
			locals.data.patterns = result;
			next(err);
		});

	});



	// Render the view
	view.render('layoutview');

};
