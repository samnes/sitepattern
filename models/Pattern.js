var keystone = require('keystone');
var Types = keystone.Field.Types;


/**
 * Pattern Model
 * ==========
 */

 var Pattern = new keystone.List('Pattern', {
  map: { name: 'title' },
  autokey: { path: 'key', from: 'title', unique: true }
 });

 Pattern.add({
 	title: { type: String, required: true },
  patternCategories: { type: Types.Relationship, ref: 'PatternCategory', many: true, label: 'Pattern Category'},
 	state: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
 	author: { type: Types.Relationship, ref: 'User', index: true},
 	publishedDate: { type: Types.Date, index: true, dependsOn: { state: 'published' } },
  code: { type: Types.Code, height: 400, language: 'html', label: 'HTML code'},
 	image: { type: Types.CloudinaryImage, required: true, initial: false },
  description: { type: Types.Html, wysiwyg: true, height: 150, label: 'Description' },
  context: { type: Types.Html, wysiwyg: true, height: 150, label: 'Context of use' },
  examples: { type: Types.Html, wysiwyg: true, height: 50, label: 'Links to example sites', note: 'Add bullet list of urls' }
 });


Pattern.register();
