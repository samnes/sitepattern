var keystone = require('keystone');

/**
 * Layout Model
 * ==========
 */

 var Layout = new keystone.List('Layout', {
  map: { name: 'title' },
  autokey: { path: 'slug', from: 'title', unique: true }
 });

 Layout.add({
 	title: { type: String, required: true },
 	state: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
 	author: { type: Types.Relationship, ref: 'User', index: true },
 	publishedDate: { type: Types.Date, index: true, dependsOn: { state: 'published' } },
 	image: { type: Types.CloudinaryImage },
 	content: {
 		brief: { type: Types.Html, wysiwyg: true, height: 150 },
 	},
 });


Layout.relationship({ ref: 'Site', path: 'layouts' });


Layout.register();
