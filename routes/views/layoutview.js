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


		/*var q = keystone.list('Layout').model.find();*/

		/*var options = {
		  patternCategories: {
		    options: {
		      sort: '-name'
		    }
		  }
		}*/

		/*q.where('state', 'published').populate('sites patterns').deepPopulate('patterns.patternCategories');*/

		/*if (locals.filters.site) {
			console.log(locals.filters.site);
			q.where('sites').in([locals.filters.site]);
		}*/

		/*q.where('key', 'front-page-big-images');*/

		/*var site = locals.filters.siteName;
		var query = {};
		query['sites.key.' + site] = {$exists: true};
		console.log(query);
		q.find(query);*/

		var q = keystone.list('Pattern').model.find();

		// Get the _ids of the users of the selected category
		keystone.list('PatternCategory').model.find({name:'Navigation'}, {_id: 1}, function(err, categories) {

		    // Map the user docs into an array of just the _ids
		    var ids = categories.map(function(category) { return category._id; });
				/*console.log(ids);*/

		    // Get the patterns whose patternCategories is in that set of ids
		    keystone.list('Pattern').model.find({patternCategories: {$in: ids}}).exec(function(err, patterns) {
						var ids = patterns.map(function(pattern) { return pattern._id; });
					  q.find({'_id': {$in: ids}});

						q.exec(function(err, result) {
							locals.data.patterns = result;
							next(err);
						});

		    });

		});


	});



	// Render the view
	view.render('layoutview');

};
