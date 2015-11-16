var keystone = require('keystone');
var Types = keystone.Field.Types;
var mongoose = (keystone.mongoose);
var deepPopulate = require('mongoose-deep-populate')(mongoose);


/**
 * Layout Model
 * ==========
 */

var Layout = new keystone.List('Layout', {
  map: {name: 'title'},
  autokey: {path: 'key', from: 'title', unique: true}
});

Layout.add({
 	title: { type: String, required: true },
  sites: { type: Types.Relationship, ref: 'Site', many: true },
  patterns: { type: Types.Relationship, ref: 'Pattern', many: true },
 	state: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
 	author: { type: Types.Relationship, ref: 'User', index: true},
 	publishedDate: { type: Types.Date, index: true, dependsOn: { state: 'published' } },
 	image: { type: Types.CloudinaryImage, required: true, initial: false },
  description: { type: Types.Html, wysiwyg: true, height: 150, label: 'Description' },
  context: { type: Types.Html, wysiwyg: true, height: 150, label: 'Context of use' },
  persuasivepatterns: { type: Types.Html, wysiwyg: true, height: 150, label: 'Persuasive patterns' },
  examples: { type: Types.Html, wysiwyg: true, height: 50, label: 'Links to example sites', note: 'Add bullet list of urls' }
});

Layout.schema.plugin(deepPopulate);

Layout.register();
