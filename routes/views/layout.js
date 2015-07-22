var keystone = require('keystone');
var util = require('util');

exports = module.exports = function(req, res){

  var view = new keystone.View(req, res);
  var locals = res.locals;

  // Set locals
  locals.section = 'layout';
  locals.filters = {
		layout: req.params.layout
	};
  locals.data = {
    selected: [],
    layouts: []
  };

  // Load the current category filter
  view.on('init', function(next) {
    console.log(util.inspect( req.params ) );

    if (req.params.layout) {
      keystone.list('Site').model.findOne({ slug: locals.filters.layout }).exec(function(err, result) {
        locals.data.layouts = result;
        console.log('This is ' + locals.data.layouts);

        next(err);
      });
    } else {
      next();
    }

  });

    // Load the posts
    view.on('init', function(next) {

      var q = keystone.list('Layout').paginate({
  				page: req.query.page || 1,
  				perPage: 50,
  				maxPages: 50
  			})
        .where('state', 'published')
        .sort('-publishedDate')

      if (locals.data.layout) {
        q.where('layouts').in([locals.data.layout]);
      }

      q.exec(function(err, results) {
        locals.data.selected = results;
        next(err);
      });

    });

    // Render the view
  	view.render('layouts');

};
