<?php

namespace WordPressdotorg\Theme\Wasm_2024;

require_once __DIR__ . '/inc/block-styles.php';

// Blocks
require_once __DIR__ . '/src/wasm-demo/wasm-demo.php';

/**
 * Enqueue scripts and styles.
 */
function enqueue_assets() {
	// The parent style is registered as `wporg-parent-2021-style`, and will be loaded unless
	// explicitly unregistered. We can load any child-theme overrides by declaring the parent
	// stylesheet as a dependency.
	wp_enqueue_style(
		'wporg-wasm-style',
		get_stylesheet_directory_uri() . '/style.css',
		array( 'wporg-parent-2021-style', 'wp-components' ),
		filemtime( __DIR__ . '/style.css' )
	);
	wp_style_add_data( 'wporg-wasm-style', 'rtl', 'replace' );
}
add_action( 'wp_enqueue_scripts', __NAMESPACE__ . '\enqueue_assets' );

/**
 * Register the custom navigation menu for the local nav.
 *
 * @return void
 */
function register_my_menus() {
	register_nav_menus(
		array(
			'local-nav' => __( 'Local Nav' ),
		)
	);
}
add_action( 'init', __NAMESPACE__ . '\register_my_menus' );

/**
 * Get the Local Nav navigation menu object if it exists.
 */
function _get_local_nav_menu_object() {
	$local_nav_menu_locations = get_nav_menu_locations();
	$local_nav_menu_object = isset( $local_nav_menu_locations['local-nav'] )
		? wp_get_nav_menu_object( $local_nav_menu_locations['local-nav'] )
		: false;

	return $local_nav_menu_object;
}

/**
 * Provide a list of local navigation menus.
 */
function add_site_navigation_menus( $menus ) {
	if ( is_admin() ) {
		return $menus;
	}

	$local_nav_menu_object = _get_local_nav_menu_object();

	if ( ! $local_nav_menu_object ) {
		return $menus;
	}

	$menu_items = wp_get_nav_menu_items( $local_nav_menu_object->term_id );

	if ( ! $menu_items || empty( $menu_items ) ) {
		return $menus;
	}

	$menus['wasm'] = array_map(
		function( $menu_item ) {
			return array(
				'label' => esc_html( $menu_item->title ),
				'url' => esc_url( $menu_item->url )
			);
		},
		// Limit local nav items to 6
		array_slice( $menu_items, 0, 6 )
	);

	return $menus;
}
add_filter( 'wporg_block_navigation_menus', __NAMESPACE__ . '\add_site_navigation_menus' );
