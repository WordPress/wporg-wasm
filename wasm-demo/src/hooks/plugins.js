/**
 * WordPress dependencies
 */
import { createContext, useContext, useState, useEffect } from '@wordpress/element';
import safeAddQueryArgs from '../safe-add-query-args';

const StateContext = createContext();

const plugins = [
	{
		name: 'WooCommerce',
		zip: 'woocommerce.latest-stable.zip',
		icon: 'https://ps.w.org/woocommerce/assets/icon-256x256.png'
	},
	{
		name: 'Coblocks',
		zip: 'coblocks.latest-stable.zip',
		icon: 'https://ps.w.org/coblocks/assets/icon-256x256.jpg'
	},
	{
		name: 'Duplicate Page',
		zip: 'duplicate-page.latest-stable.zip',
		icon: 'https://ps.w.org/duplicate-page/assets/icon-128x128.jpg'
	},
	{
		name: 'Ultimate Blocks',
		zip: 'ultimate-blocks.latest-stable.zip',
		icon: 'https://ps.w.org/ultimate-blocks/assets/icon-256x256.png'
	},
	{
		name: 'Advanced Custom Fields',
		zip: 'advanced-custom-fields.latest-stable.zip',
		icon: 'https://ps.w.org/advanced-custom-fields/assets/icon-256x256.png'
	},
	{
		name: 'Polylang',
		zip: 'polylang.latest-stable.zip',
		icon: 'https://ps.w.org/polylang/assets/icon-256x256.png?rev=1331499'
	},
	{
		name: 'Gutenberg',
		zip: 'gutenberg.latest-stable.zip',
		icon: 'https://ps.w.org/gutenberg/assets/icon-256x256.jpg'
	},
	{
		name: 'Classic Editor',
		zip: 'classic-editor.latest-stable.zip',
		icon: 'https://ps.w.org/classic-editor/assets/icon-256x256.png'
	},
	{
		name: 'Hello Dolly',
		zip: 'hello-dolly.latest-stable.zip',
		icon: 'https://ps.w.org/hello-dolly/assets/icon-256x256.jpg'
	},
];

export const PluginsProvider = ( { children } ) => {
	const [activePlugins, setActivePlugins] = useState(() => {
		const pluginZips = new URL(location.href).searchParams.getAll('plugin') || []
		return plugins.filter(plugin => pluginZips.includes(plugin.zip))
	});
	const toggleActivePlugin = (plugin) => {
		// Update the state
		let newActivePlugins = [...activePlugins];
		if (newActivePlugins.includes(plugin)) {
			newActivePlugins = newActivePlugins.filter((p) => p !== plugin);
		} else {
			newActivePlugins.push(plugin);
		}
		setActivePlugins(newActivePlugins);

		// Update the URL
		const newUrl = safeAddQueryArgs(location.href, {
			plugin: newActivePlugins.map(plugin => plugin.zip)
		});
		history.replaceState(null, '', newUrl);
	};
	return (
		<StateContext.Provider
			value={ {
				plugins: plugins,
				activePlugins,
				toggleActivePlugin,
			} }
		>
			{ children }
		</StateContext.Provider>
	);
};

export const usePlugins = () => {
	const context = useContext( StateContext );

	if ( context === undefined ) {
		throw new Error( 'useThemes must be used within a Provider' );
	}

	return context;
};