<?php
/**
 * Plugin Name:       Wasm Demo
 * Description:       Example block scaffolded with Create Block tool.
 * Requires at least: 6.1
 * Requires PHP:      7.0
 * Version:           0.1.0
 * Author:            The WordPress Contributors
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       wasm-demo
 *
 * @package           create-block
 */

namespace WordPressdotorg\WordPressWasm\DemoBlock;

add_action( 'init', __NAMESPACE__ .'\create_block_wasm_demo_block_init' );

 /**
 * Renders block on the server.
 *
 * @param array    $attributes Block attributes.
 * @param string   $content    Block default content.
 * @param WP_Block $block      Block instance.
 *
 * @return string Returns the event year for the current post.
 */
function render_block( $attributes, $content ) {
	$wrapper_attributes = get_block_wrapper_attributes();
	$block_attributes = '';
	foreach($attributes as $name => $value) {
		$block_attributes .= 'data-' . $name . '="' . esc_attr($value) . '" ';
	}
	
	return sprintf(
		'<div id="wporg-wasm-demo" %s %s></div>',
		$wrapper_attributes,
		$block_attributes,
	);
}

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
function create_block_wasm_demo_block_init() {
	register_block_type( 
		__DIR__ . '/build/block.json',
		array(
			'render_callback' => __NAMESPACE__ . '\render_block',
		)
	);
}
