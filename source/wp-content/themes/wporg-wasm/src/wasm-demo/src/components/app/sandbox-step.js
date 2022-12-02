/**
 * WordPress dependencies
 */
import { Button, Flex, FlexItem } from '@wordpress/components';
import { useRef, forwardRef, useState, useEffect } from '@wordpress/element';
import { Icon, settings } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import Iframe from '../iframe';
import { useThemes } from '../../hooks/themes';
import { usePlugins } from '../../hooks/plugins';

const BASE_URL = 'https://wasm.wordpress.net/wordpress.html';

export default forwardRef(({ onClickBack }, ref) => {
	const [url, setUrl] = useState('');
	const [isBooted, setIsBooted] = useState(false);
	const { activeTheme } = useThemes();
	const { activePlugins } = usePlugins();
	const iframeRef = useRef();
	const urlInputRef = useRef();

	const sandboxConfigQueryString = buildQueryString([
		['rpc', '1'],
		['url', '/'],
		['mode', 'seamless'],
		['theme', activeTheme.zip],
		...activePlugins.map((plugin) => ['plugin', plugin.zip]),
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

		// Update the URL bar to always reflect the current state of the Sandbox:
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

	const iframeUrl = `${BASE_URL}?${sandboxConfigQueryString}`;
	const className =
		'wporg-demo-browser ' + (isBooted ? 'is-booted' : 'is-booting');

	return (
		<div className={className} ref={ref}>
			<Flex className="wporg-demo__viewport-controls">
				<FlexItem></FlexItem>
				<FlexItem style={{ flexGrow: 1 }}>
					<form
						className="wpsandbox-url-bar"
						onSubmit={handleUrlSubmit}
					>
						<div className="wpsandbox-url-bar__input-container">
							<input
								ref={urlInputRef}
								value={url}
								onChange={(e) => setUrl(e.target.value)}
								type="text"
								autoComplete="off"
								className="wpsandbox-url-bar__input"
							/>
						</div>
						<input
							type="submit"
							tabIndex="-1"
							className="wpsandbox-url-bar__submit"
						/>
					</form>
				</FlexItem>
				<FlexItem>
					<Flex align="center" justify="center">
						<Button
							onClick={onClickBack}
							variant="tertiary"
							className="wporg-demo__settings-button"
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
