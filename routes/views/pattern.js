var keystone = require('keystone');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Set locals
	locals.section = 'site';
	locals.filters = {
		pattern: req.params.pattern
	};
  locals.data = {
    patterns: []
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

	// Render the view
	view.render('pattern');

};
