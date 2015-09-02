var keystone = require('keystone');

/**
 * PatternCategory Model
 * ==================
 */

var PatternCategory = new keystone.List('PatternCategory', {
	autokey: { from: 'name', path: 'key', unique: true }
});

PatternCategory.add({
	name: { type: String, required: true }
});

PatternCategory.relationship({ ref: 'Pattern', path: 'patternCategories' });

PatternCategory.register();
