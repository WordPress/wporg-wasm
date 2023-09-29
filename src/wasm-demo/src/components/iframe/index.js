import { forwardRef } from '@wordpress/element';

export default forwardRef(({ src }, ref) => {
	return <iframe title="WordPress.org WASM playground" src={src} ref={ref} />;
});
