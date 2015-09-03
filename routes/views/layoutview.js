var keystone = require('keystone'),
async = require('async');

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

		var categoryNames = [];
		var q = keystone.list('Pattern').model.find();

		async.series([
			function(callback) {
				//Get category names
				var category = keystone.list('PatternCategory').model.find({}, function(err, categories) {
			    if (!err){
							categoryNames = categories.map(function(category) { return category.name; });
			        console.log(categoryNames);

							// Category object test
							var categories = {};
							for (var i = 0; i < categoryNames.length; i++) {
									var key = categoryNames[i];
									categories[key] = {
											name: 'example',
											key: 'example'
									};
							}
							console.log(categories);


							callback();

			    } else {throw err;}
				});

		},function(done) {
				// Get the _ids of the users of the selected category
				console.log(categoryNames);

				async.each(categoryNames, function(category, callback) {

					console.log(category);

						keystone.list('PatternCategory').model.find({name: category}, {_id: 1}, function(err, categories) {

						    // Map the pattern categories into an array of just the _ids
						    var ids = categories.map(function(category) { return category._id; });

						    // Get the patterns whose patternCategories is in that set of ids
						    q.find({patternCategories: {$in: ids}}).exec(function(err, patterns) {
										var ids = patterns.map(function(pattern) { return pattern._id; });
										console.log(ids);
									  q.find({'_id': {$in: ids}});

										callback();

						    });

						});

				}, function(err){
					if(err) {
				 		console.log('A category failed to process');
					} else {
						console.log('Categories processed successfully');
						done();
					}
				});

					}
				], function(err) { //This function gets called after the two tasks have called their "task callbacks"
		        if (err) return next(err);
		        //Here locals will be populated

						q.exec(function(err, result) {
							locals.data.patterns = result;
							next(err);
						});

		    });//end async.series

	});



	// Render the view
	view.render('layoutview');

};
