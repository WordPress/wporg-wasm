/**
 * WordPress dependencies
 */
import { createContext, useContext, useState } from '@wordpress/element';
import safeAddQueryArgs from '../safe-add-query-args';

const StateContext = createContext();

const themes = [
	{
		url: 'https://wp-themes.com/twentytwentythree',
		thumbnail:
			'https://i0.wp.com/themes.svn.wordpress.org/twentytwentythree/1.0/screenshot.png?w=572&strip=all',
		name: 'Twenty Twenty-Three',
		zip: 'twentytwentythree.latest-stable.zip',
	},
	{
		url: 'https://wp-themes.com/skatepark',
		thumbnail:
			'https://i0.wp.com/themes.svn.wordpress.org/skatepark/1.0.48/screenshot.png?w=572&strip=all',
		name: 'Skatepark',
		zip: 'skatepark.latest-stable.zip',
	},
	{
		url: 'https://wp-themes.com/pendant',
		thumbnail:
			'https://i0.wp.com/themes.svn.wordpress.org/pendant/1.0.11/screenshot.png?w=572&strip=all',
		name: 'Pendant',
		zip: 'pendant.latest-stable.zip',
	},
	{
		url: 'https://wp-themes.com/disco',
		thumbnail:
			'https://i0.wp.com/themes.svn.wordpress.org/disco/1.0.3/screenshot.png?w=572&strip=all',
		name: 'Disco',
		zip: 'disco.latest-stable.zip',
	},
	{
		url: 'https://wp-themes.com/stewart',
		thumbnail:
			'https://i0.wp.com/themes.svn.wordpress.org/stewart/1.15/screenshot.png?w=572&strip=all',
		name: 'Stewart',
		zip: 'stewart.latest-stable.zip',
	},
	{
		url: 'https://wp-themes.com/tove',
		thumbnail:
			'https://i0.wp.com/themes.svn.wordpress.org/tove/0.7.1/screenshot.png?w=572&strip=all',
		name: 'Tove',
		zip: 'tove.latest-stable.zip',
	},
	{
		url: 'https://wp-themes.com/rainfall',
		thumbnail:
			'https://i0.wp.com/themes.svn.wordpress.org/rainfall/1.0.5/screenshot.png?w=572&strip=all',
		name: 'Rainfall',
		zip: 'rainfall.latest-stable.zip',
	},
	{
		url: 'https://wp-themes.com/raft',
		thumbnail:
			'https://i0.wp.com/themes.svn.wordpress.org/raft/1.0.5/screenshot.png?w=572&strip=all',
		name: 'Raft',
		zip: 'raft.latest-stable.zip',
	},
];
export const ThemesProvider = ( { children } ) => {
	const [ activeTheme, _setActiveTheme ] = useState( () => {
		const urlTheme = new URL( window.location.href ).searchParams.get(
			'theme'
		);
		const preselectedTheme = themes.find(
			( theme ) => theme.zip === urlTheme
		);
		return preselectedTheme ? preselectedTheme : themes[ 0 ];
	} );
	const setActiveTheme = ( theme ) => {
		_setActiveTheme( theme );
		window.history.replaceState(
			{},
			'',
			safeAddQueryArgs( window.location.href, { theme: theme.zip } )
		);
	};
	return (
		<StateContext.Provider
			value={ {
				themes,
				activeTheme,
				setActiveTheme,
			} }
		>
			{ children }
		</StateContext.Provider>
	);
};

export const useThemes = () => {
	const context = useContext( StateContext );

	if ( context === undefined ) {
		throw new Error( 'useThemes must be used within a Provider' );
	}

	return context;
};
