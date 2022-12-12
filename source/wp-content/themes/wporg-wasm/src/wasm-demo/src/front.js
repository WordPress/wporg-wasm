/**
 * WordPress dependencies
 */
import { render } from '@wordpress/element';

/**
 * Internal dependencies
 */
import App from './components/index.js';

const init = () => {
	if (document.location.pathname.includes('/demo')) {
		document.body.parentNode.classList.add('wporg-wasm-demo-page');
	}
	const domElement = document.getElementById('wporg-wasm-demo');
	if (!domElement) {
		return;
	}

	const blockAttributes = Object.fromEntries(
		Object.entries(domElement.dataset)
	);
	render(<App blockAttributes={blockAttributes} />, domElement);
};

document.addEventListener('DOMContentLoaded', init);
