var keystone = require('keystone');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Set locals
	locals.section = 'site';
	locals.filters = {
		view: req.params.layoutview
	};
  locals.data = {
    views: []
  };

	// Load the current post
	view.on('init', function(next) {

		var q = keystone.list('Layout').model.findOne({
			state: 'published',
      key: locals.filters.view
      }).populate('author sites');

		q.exec(function(err, result) {
			locals.data.views = result;
			next(err);
		});

	});

	// Render the view
	view.render('layoutview');

};