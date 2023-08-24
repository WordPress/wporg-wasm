/**
 * WordPress dependencies
 */
import {
	Flex,
	FlexBlock,
	FlexItem,
	Modal,
	Button,
	CheckboxControl,
} from '@wordpress/components';

/**
 * Internal dependencies
 */
import { usePluginsChooser } from './use-plugins-chooser';
import { useThemesChooser } from './use-themes-chooser';

export default function SettingsModal({
	onSubmit,
	initialTheme,
	initialPlugins,
}) {
	const { availableThemes, activeTheme, setActiveTheme } =
		useThemesChooser(initialTheme);
	const { availablePlugins, activePlugins, toggleActivePlugin } =
		usePluginsChooser(initialPlugins);

	const handleSubmit = (event) => {
		if (event?.preventDefault) {
			event.preventDefault();
		}
		onSubmit({ theme: activeTheme, plugins: activePlugins });
	};

	return (
		<Modal
			isFullScreen={false}
			title="WordPress Playground"
			onRequestClose={handleSubmit}
			className="wporg-setup-modal"
		>
			<p>
				Welcome to a new and exciting way of testing WordPress Themes
				and Plugins. Choose a theme, sprinkle with a plugin or a few,
				and start a new WordPress Playground – all inside of your
				browser!
			</p>

			<Flex wrap={true}>
				<FlexItem>
					<h4 className="wporg-setup-modal__section-title">
						Select a theme
					</h4>
					<Flex
						as="ul"
						justify="flex-start"
						className="wporg-tab-item-list is-theme"
						wrap={true}
						gap="24px"
					>
						{availableThemes.map((theme) => (
							<FlexItem
								as="li"
								key={theme.name}
								className={
									'wporg-tab-item-list-item ' +
									(activeTheme === theme ? 'is-active' : '')
								}
								onClick={() => setActiveTheme(theme)}
							>
								<a
									href={theme.url}
									onClick={(event) => event.preventDefault()}
								>
									<Flex
										align="flex-start"
										direction="column"
										gap={0}
									>
										<FlexItem>
											<div className="wporg-tab-item-list__theme-thumbnail-wrapper">
												<img
													className="wporg-tab-item-list__theme-thumbnail"
													src={theme.thumbnail}
													alt={theme.name}
												/>
											</div>
										</FlexItem>
										<FlexBlock
											as="h3"
											className="wporg-tab-item-list__item-name"
										>
											{theme.name}
										</FlexBlock>
									</Flex>
								</a>
								<div className="wporg-tab-item-list__overlay" />
							</FlexItem>
						))}
					</Flex>

					<h4
						className="wporg-setup-modal__section-title"
						style={{ marginTop: -20 }}
					>
						Add plugins
					</h4>
					<Flex
						className="wporg-tab-item-list is-plugin"
						justify="flex-start"
						wrap={true}
						gap="8px"
					>
						{availablePlugins.map((plugin) => (
							<label>
								<FlexItem
									key={plugin.zip}
									className={
										'wporg-tab-item-list-item ' +
										(activePlugins.includes(plugin)
											? 'is-active'
											: '')
									}
								>
									{' '}
									<Flex
										align="center"
										direction="row"
										gap={2}
									>
										<FlexItem>
											<img
												src={plugin.icon}
												alt={plugin.name}
											/>
										</FlexItem>
										<FlexBlock
											as="h3"
											className="wporg-tab-item-list__item-name"
										>
											{plugin.name}
										</FlexBlock>
										<FlexItem>
											<CheckboxControl
												checked={activePlugins.includes(
													plugin
												)}
												onChange={() =>
													toggleActivePlugin(plugin)
												}
											/>
										</FlexItem>
									</Flex>
								</FlexItem>
							</label>
						))}
					</Flex>

					<div className="wporg-setup-footer">
						<Button
							isPrimary
							className="wporg-tab-item-list__confirm"
							onClick={handleSubmit}
						>
							Start Playground
						</Button>
					</div>
				</FlexItem>
			</Flex>
		</Modal>
	);
}
