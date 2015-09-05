'use strict';
var keystone = require('keystone'),
async = require('async');
var _ = require('underscore');

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

	// Load the patterns

	view.on('init', function(next) {

		var categoriesRes = [];
		var categoryNames = [];
		var patternIds = [];
		var query = {};

		async.series([
			function(callback) {
				//Get category names
				keystone.list('PatternCategory').model.find({}, function(err, categories) {
			    if (!err){
							categoryNames = categories.map(function(category) { return category.name; });
			        console.log(categoryNames);

							callback();

			    } else {throw err;}
				});

		},function(callback) {
			var layoutQuery = keystone.list('Layout').model.find();

			//Get all the site ids
			keystone.list('Site').model.findOne({ key: locals.filters.siteName }, function(err, site) {
					var id =  site._id;
					console.log(id);
					//Get all the layouts in current site
					layoutQuery.find({sites: id}, function(err, layouts) {
						patternIds = layouts.map(function(layout) { return layout.patterns; });
						patternIds = [].concat.apply([],patternIds);
						patternIds = patternIds.map(function(item) {
    						return item.toString();
						});

						console.log('This is pattern ids: ' +  patternIds);
						callback();
					});
			});

		},function(done) {
				// Get the _ids of the users of the selected category
				async.each(categoryNames, function(category, callback) {

					var q = keystone.list('Pattern').model.find();

					console.log(category);

						keystone.list('PatternCategory').model.find({name: category}, {_id: 1}, function(err, categories) {

						    // Map the pattern categories into an array of just the _ids
						    var ids = categories.map(function(category) { return category._id; });

						    // Get the patterns whose patternCategories is in that set of ids
						    q.find({patternCategories: {$in: ids}}).exec(function(err, patterns) {
										var ids = patterns.map(function(pattern) { return pattern._id; });
										ids = ids.map(function(item) {
				    						return item.toString();
										});

										 var strippedIds = _.intersection(ids,patternIds);

										// console.log('This is ids: ' + ids);
										// console.log(patternIds);
										// console.log('This is stripped out: ' + strippedIds);

									  q.find({'_id': {$in: strippedIds}}).exec(function(err, patterns) {

											var patternCategory = {
												category: category,
								        patterns: []
											};

											for (var i = 0; i < patterns.length; i++) {
												patternCategory.patterns.push(patterns[i]);
											}

											categoriesRes.push(patternCategory);

											query = q;
											callback(null);
										});

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
		        if (err) {
							return next(err);
						}
		        //Here locals will be populated
						// console.log(categoriesRes);

						query.exec(function(err) {
							locals.data.patterns = categoriesRes;
							next(err);
						});

		    });//end async.series

	});



	// Render the view
	view.render('layoutview');

};
