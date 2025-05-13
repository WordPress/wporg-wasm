/**
 * WordPress dependencies
 */
import { useState, useRef } from '@wordpress/element';
import safeAddQueryArgs from '../safe-add-query-args';

/**
 * Internal dependencies
 */
import SettingsModal from './settings/settings-modal';
import { availablePlugins } from './settings/use-plugins-chooser';
import { availableThemes } from './settings/use-themes-chooser';
import Playground from './playground';

import '../style.scss';

const STEP_SETTINGS = 'settings';
const STEP_PLAYGROUND = 'playground';

export default function WasmDemoApp({ blockAttributes }) {
	const ref = useRef();
	const { settings, bootedAtLeastOnce, updateSettings, openSettingsModal } =
		usePlaygroundSettings(blockAttributes);

	return (
		<div>
			{settings.step === STEP_SETTINGS && (
				<SettingsModal
					initialTheme={settings.theme}
					initialPlugins={settings.plugins}
					onSubmit={updateSettings}
				/>
			)}
			{bootedAtLeastOnce && (
				<Playground
					ref={ref}
					theme={settings.theme}
					plugins={settings.plugins}
					showSettingsModal={openSettingsModal}
				/>
			)}
		</div>
	);
}

function usePlaygroundSettings(blockAttributes) {
	const [settings, setSettings] = useState(() => {
		const searchParams = new URL(window.location.href).searchParams;
		const query = {
			step: searchParams.get('step'),
			theme: searchParams.get('theme'),
			plugins: searchParams.getAll('plugin'),
		};
		const attributeSet =
			query.step || query.theme || query.plugins?.length
				? query
				: blockAttributes;

		const initialTheme = attributeSet.theme || '';
		const initialPlugins = attributeSet.plugins || [];

		return {
			step: [STEP_PLAYGROUND, STEP_SETTINGS].includes(attributeSet.step)
				? attributeSet.step
				: STEP_PLAYGROUND,
			theme:
				availableThemes.find(
					(t) =>
						comparableZipName(t.zip) ===
						comparableZipName(initialTheme)
				) || availableThemes[0],
			plugins:
				initialPlugins
					.map((p) =>
						availablePlugins.find(
							(plugin) =>
								comparableZipName(plugin.zip) ===
								comparableZipName(p)
						)
					)
					.filter((x) => x) || [],
		};
	}, []);

	const [bootedAtLeastOnce, setBootedAtLeastOnce] = useState(
		settings.step === STEP_PLAYGROUND
	);
	function handleUpdateSettings({ theme, plugins }) {
		setBootedAtLeastOnce(true);
		setSettings({
			step: STEP_PLAYGROUND,
			theme,
			plugins,
		});
		updateUrlParams({
			step: STEP_PLAYGROUND,
			theme: theme.zip,
			plugin: plugins.map((p) => p.zip),
		});
	}
	function handleOpenSettingsModal() {
		setSettings({ ...settings, step: STEP_SETTINGS });
		updateUrlParams({ step: STEP_SETTINGS });
	}

	return {
		settings,
		bootedAtLeastOnce,
		updateSettings: handleUpdateSettings,
		openSettingsModal: handleOpenSettingsModal,
	};
}

function comparableZipName(name) {
	return name.toLowerCase().replace(/\.latest\.zip$/g, '');
}

function updateUrlParams(params) {
	window.history.replaceState(
		{},
		'',
		safeAddQueryArgs(window.location.href, params)
	);
}
