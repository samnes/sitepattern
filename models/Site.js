var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Site Model
 * ==========
 */

 var Site = new keystone.List('Site', {
 	map: { name: 'title' },
 	autokey: { path: 'key', from: 'title', unique: true }
 });

 Site.add({
 	title: { type: String, required: true },
 	state: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
 	author: { type: Types.Relationship, ref: 'User', index: true},
 	publishedDate: { type: Types.Date, index: true, dependsOn: { state: 'published' } },
 	image: { type: Types.CloudinaryImage, required: true, initial: false },
  description: { type: Types.Html, wysiwyg: true, height: 150, label: 'Description' }
 });

/**
* Relationships
*/

Site.relationship({ref: 'Layout', path: 'sites', refPath: 'layouts' });


Site.register();
