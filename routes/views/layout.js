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
        locals.data.layout = result;

        console.log('This is ' + locals.data.layout);

        next(err);
      });
    } else {
      next();
    }

  });

    // Load the posts
    view.on('init', function(next) {

      var q = keystone.list('Layout').model.find().where('state', 'published').sort('-publishedDate').populate('sites author');

      if (locals.data.layout) {
        q.where('sites').in([locals.data.layout]);
      }

      q.exec(function(err, results) {
        locals.data.selected = results;
        console.log('End result layout ' + locals.data.selected[0]);

        next(err);
      });

    });

    // Render the view
  	view.render('layouts');

};
