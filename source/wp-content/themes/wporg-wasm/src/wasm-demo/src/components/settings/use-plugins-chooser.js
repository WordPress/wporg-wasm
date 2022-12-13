/**
 * WordPress dependencies
 */
import { useState } from '@wordpress/element';

export const availablePlugins = [
	{
		name: 'Coblocks',
		zip: 'coblocks',
		icon: 'https://ps.w.org/coblocks/assets/icon-256x256.jpg',
	},
	{
		name: 'bbPress',
		zip: 'bbpress',
		icon: 'https://ps.w.org/bbpress/assets/icon-256x256.png?rev=1331499',
	},
	{
		name: 'BuddyPress',
		zip: 'buddypress',
		icon: 'https://ps.w.org/buddypress/assets/icon-256x256.png?rev=1331499',
	},
	{
		name: 'Gutenberg',
		zip: 'gutenberg',
		icon: 'https://ps.w.org/gutenberg/assets/icon-256x256.jpg',
	},
	{
		name: 'Classic Editor',
		zip: 'classic-editor',
		icon: 'https://ps.w.org/classic-editor/assets/icon-256x256.png',
	},
	{
		name: 'Yoast SEO',
		zip: 'wordpress-seo',
		icon: 'https://ps.w.org/wordpress-seo/assets/icon-256x256.png',
	},
	{
		name: 'Duplicate Page',
		zip: 'duplicate-page',
		icon: 'https://ps.w.org/duplicate-page/assets/icon-128x128.jpg',
	},
	{
		name: 'Ultimate Blocks',
		zip: 'ultimate-blocks',
		icon: 'https://ps.w.org/ultimate-blocks/assets/icon-256x256.png',
	},
	{
		name: 'Advanced Custom Fields',
		zip: 'advanced-custom-fields',
		icon: 'https://ps.w.org/advanced-custom-fields/assets/icon-256x256.png',
	},
];

export function usePluginsChooser(initialPlugins = []) {
	const [activePlugins, setActivePlugins] = useState(initialPlugins);
	const toggleActivePlugin = (plugin) => {
		// Update the state
		let newActivePlugins = [...activePlugins];
		if (newActivePlugins.includes(plugin)) {
			newActivePlugins = newActivePlugins.filter((p) => p !== plugin);
		} else {
			newActivePlugins.push(plugin);
		}
		setActivePlugins(newActivePlugins);
	};
	return { availablePlugins, activePlugins, toggleActivePlugin };
}
