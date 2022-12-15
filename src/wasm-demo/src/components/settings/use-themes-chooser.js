/**
 * WordPress dependencies
 */
import { useState } from '@wordpress/element';

export const availableThemes = [
	{
		url: 'https://wp-themes.com/twentytwentythree',
		thumbnail:
			'https://i0.wp.com/themes.svn.wordpress.org/twentytwentythree/1.0/screenshot.png?w=572&strip=all',
		name: 'Twenty Twenty-Three',
		zip: 'twentytwentythree',
	},
	{
		url: 'https://wp-themes.com/skatepark',
		thumbnail:
			'https://i0.wp.com/themes.svn.wordpress.org/skatepark/1.0.48/screenshot.png?w=572&strip=all',
		name: 'Skatepark',
		zip: 'skatepark',
	},
	{
		url: 'https://wp-themes.com/pendant',
		thumbnail:
			'https://i0.wp.com/themes.svn.wordpress.org/pendant/1.0.11/screenshot.png?w=572&strip=all',
		name: 'Pendant',
		zip: 'pendant',
	},
	{
		url: 'https://wp-themes.com/disco',
		thumbnail:
			'https://i0.wp.com/themes.svn.wordpress.org/disco/1.0.3/screenshot.png?w=572&strip=all',
		name: 'Disco',
		zip: 'disco',
	},
	{
		url: 'https://wp-themes.com/stewart',
		thumbnail:
			'https://i0.wp.com/themes.svn.wordpress.org/stewart/1.15/screenshot.png?w=572&strip=all',
		name: 'Stewart',
		zip: 'stewart',
	},
	{
		url: 'https://wp-themes.com/tove',
		thumbnail:
			'https://i0.wp.com/themes.svn.wordpress.org/tove/0.7.1/screenshot.png?w=572&strip=all',
		name: 'Tove',
		zip: 'tove',
	},
	{
		url: 'https://wp-themes.com/rainfall',
		thumbnail:
			'https://i0.wp.com/themes.svn.wordpress.org/rainfall/1.0.5/screenshot.png?w=572&strip=all',
		name: 'Rainfall',
		zip: 'rainfall',
	},
	{
		url: 'https://wp-themes.com/raft',
		thumbnail:
			'https://i0.wp.com/themes.svn.wordpress.org/raft/1.0.5/screenshot.png?w=572&strip=all',
		name: 'Raft',
		zip: 'raft',
	},
];
export function useThemesChooser(initialTheme) {
	const [activeTheme, setActiveTheme] = useState(() => {
		const preselectedTheme = availableThemes.find(
			(theme) => theme === initialTheme
		);
		return preselectedTheme ? preselectedTheme : availableThemes[0];
	});
	return { availableThemes, activeTheme, setActiveTheme };
}
