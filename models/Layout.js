var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Layout Model
 * ==========
 */

 var Layout = new keystone.List('Layout', {
  map: { name: 'title' },
  autokey: { path: 'key', from: 'title', unique: true }
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
  //sites: { type: Types.Relationship, ref: 'Site' }
 });


Layout.relationship({ ref: 'Site', path: 'layouts' });


Layout.register();
