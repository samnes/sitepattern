'use strict';
var keystone = require('keystone');
var _ = require('underscore');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Set locals
	locals.section = 'site';
	locals.filters = {
		pattern: req.params.pattern
	};
  locals.data = {
    patterns: [],
		sidepatterns: []
  };

	// Load the current post
	view.on('init', function(next) {
		var q = keystone.list('Pattern').model.findOne({
			state: 'published',
      key: locals.filters.pattern
      }).populate('author');

		q.exec(function(err, result) {
			locals.data.patterns = result;
			next(err);
		});

	});

	// Load the sidebar patterns

	view.on('init', function(next) {

		var categoriesRes = [];
		//var categoryNames = [];
		var query = {};

					// Get the _ids of the users of the selected category
					var q = keystone.list('Pattern').model.find();

					var category = 'Navigation';
					console.log(category);

						keystone.list('PatternCategory').model.find({name: category}, {_id: 1}, function(err, categories) {

								// Get the id of the current category
								var ids = categories.map(function(category) { return category._id; });

										console.log('This is ids: ' + ids);
									q.find({patternCategories: {$in: ids}}).exec(function(err, patterns) {
										var ids = patterns.map(function(pattern) { return pattern._id; });


										q.find({'_id': {$in: ids}}).exec(function(err, patterns) {

											var patternCategory = {
												category: category,
												patterns: []
											};

											for (var i = 0; i < patterns.length; i++) {
												patternCategory.patterns.push(patterns[i]);
											}

											categoriesRes.push(patternCategory);

											query = q;

											console.log(categoriesRes);

											query.exec(function(err) {
												locals.data.sidepatterns = categoriesRes;
												next(err);
											});

										});

								});
							});

	});

	// Render the view
	view.render('pattern');

};
