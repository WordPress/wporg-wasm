/**
 * WordPress dependencies
 */
import { Button, Flex, FlexItem } from '@wordpress/components';
import { useRef, forwardRef, useState, useEffect } from '@wordpress/element';
import { Icon, settings } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import Iframe from './iframe';

const BASE_URL = 'https://playground.wordpress.net/';

export default forwardRef(({ showSettingsModal, theme, plugins }, ref) => {
	const [url, setUrl] = useState('');
	const [isBooted, setIsBooted] = useState(false);
	const iframeRef = useRef();
	const urlInputRef = useRef();

	const playgroundConfigQueryString = buildQueryString([
		['rpc', '1'],
		['url', '/'],
		['mode', 'seamless'],
		['theme', theme.zip],
		...plugins.map((plugin) => ['plugin', plugin.zip]),
	]);
	useEffect(() => {
		async function monitorIsBooted() {
			let _isBooted = false;
			do {
				try {
					_isBooted = await rpcWithResponse(
						iframeRef.current,
						'is_booted',
						{},
						{ timeout: 50 }
					);
				} catch (e) {
					await new Promise((resolve) => setTimeout(resolve, 50));
					// ...keep trying
				}
			} while (!_isBooted);
			setIsBooted(true);
		}
		monitorIsBooted();

		// Update the URL bar to always reflect the current state of the Playground:
		window.addEventListener('message', (event) => {
			if (event.data?.type === 'new_path') {
				setUrl(event.data?.path);
			}
		});
	}, []);

	const handleUrlSubmit = (e) => {
		e.preventDefault();
		rpc(iframeRef.current, 'go_to', {
			path: url,
		});
	};

	const iframeUrl = `${BASE_URL}?${playgroundConfigQueryString}`;
	const className =
		'wporg-demo-browser ' + (isBooted ? 'is-booted' : 'is-booting');

	return (
		<div className={className} ref={ref}>
			<Flex className="wporg-demo__viewport-controls" gap={16}>
				<FlexItem className="wporg-demo__viewport-controls__dots"></FlexItem>
				<FlexItem style={{ flexGrow: 1 }}>
					<form
						className="wpplayground-url-bar"
						onSubmit={handleUrlSubmit}
					>
						<div className="wpplayground-url-bar__input-container">
							<input
								ref={urlInputRef}
								value={url}
								onChange={(e) => setUrl(e.target.value)}
								type="text"
								autoComplete="off"
								className="wpplayground-url-bar__input"
								title={__('Playground URL', 'wasm-demo')}
							/>
						</div>
						<input
							type="submit"
							tabIndex="-1"
							className="wpplayground-url-bar__submit"
						/>
					</form>
				</FlexItem>
				<FlexItem>
					<Flex align="center" justify="center">
						<Button
							onClick={showSettingsModal}
							variant="tertiary"
							className="wporg-demo__settings-button"
							aria-label={__('Settings', 'wasm-demo')}
						>
							<Icon icon={settings} />
						</Button>
					</Flex>
				</FlexItem>
			</Flex>
			<div className="wporg-demo__viewport">
				<Iframe src={iframeUrl} ref={iframeRef} />
			</div>
		</div>
	);
});

function buildQueryString(params) {
	const esc = encodeURIComponent;
	const query = params.map(([k, v]) => esc(k) + '=' + esc(v)).join('&');
	return query;
}

let lastRequestId = 0;
async function rpcWithResponse(wpIframe, type, data, { timeout = 5000 }) {
	const requestId = ++lastRequestId;
	rpc(wpIframe, type, { ...data, requestId }, '*');
	return await new Promise((resolve, reject) => {
		async function getResponse(event) {
			// When `requestId` is present, the other thread expects a response:
			if (event.data.requestId === requestId) {
				resolve(event.data?.response);
				window.removeEventListener('message', getResponse);
			}
		}
		setTimeout(() => {
			window.removeEventListener('message', getResponse);
			reject(new Error('RPC request timed out'));
		}, timeout);
		window.addEventListener('message', getResponse);
	});
}

function rpc(wpIframe, type, data) {
	wpIframe.contentWindow.postMessage(
		{
			type,
			...data,
		},
		'*'
	);
}
