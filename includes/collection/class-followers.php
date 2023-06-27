<?php
namespace Activitypub\Collection;

use WP_Error;
use Exception;
use WP_Query;
use Activitypub\Http;
use Activitypub\Webfinger;
use Activitypub\Model\Activity;
use Activitypub\Model\Follower;

use function Activitypub\is_tombstone;
use function Activitypub\get_remote_metadata_by_actor;

/**
 * ActivityPub Followers Collection
 *
 * @author Matt Wiebe
 * @author Matthias Pfefferle
 */
class Followers {
	const POST_TYPE = 'ap_follower';
	const CACHE_KEY_INBOXES = 'follower_inboxes_%s';

	/**
	 * Register WordPress hooks/actions and register Taxonomy
	 *
	 * @return void
	 */
	public static function init() {
		// register "followers" post_type
		self::register_post_type();

		\add_action( 'activitypub_inbox_follow', array( self::class, 'handle_follow_request' ), 10, 2 );
		\add_action( 'activitypub_inbox_undo', array( self::class, 'handle_undo_request' ), 10, 2 );

		\add_action( 'activitypub_followers_post_follow', array( self::class, 'send_follow_response' ), 10, 4 );
	}

	/**
	 * Register the "Followers" Taxonomy
	 *
	 * @return void
	 */
	private static function register_post_type() {
		register_post_type(
			self::POST_TYPE,
			array(
				'labels'           => array(
					'name'          => _x( 'Followers', 'post_type plural name', 'activitypub' ),
					'singular_name' => _x( 'Follower', 'post_type single name', 'activitypub' ),
				),
				'public'           => false,
				'hierarchical'     => false,
				'rewrite'          => false,
				'query_var'        => false,
				'delete_with_user' => false,
				'can_export'       => true,
				'supports'         => array(),
			)
		);

		register_post_meta(
			self::POST_TYPE,
			'preferred_username',
			array(
				'type'              => 'string',
				'single'            => true,
				'sanitize_callback' => function( $value ) {
					return sanitize_user( $value, true );
				},
			)
		);

		register_post_meta(
			self::POST_TYPE,
			'icon',
			array(
				'single'            => true,
			)
		);

		register_post_meta(
			self::POST_TYPE,
			'url',
			array(
				'type'              => 'string',
				'single'            => false,
				'sanitize_callback' => array( self::class, 'sanitize_url' ),
			)
		);

		register_post_meta(
			self::POST_TYPE,
			'inbox',
			array(
				'type'              => 'string',
				'single'            => true,
				'sanitize_callback' => array( self::class, 'sanitize_url' ),
			)
		);

		register_post_meta(
			self::POST_TYPE,
			'_shared_inbox',
			array(
				'type'              => 'string',
				'single'            => true,
				'sanitize_callback' => array( self::class, 'sanitize_url' ),
			)
		);

		register_post_meta(
			self::POST_TYPE,
			'_errors',
			array(
				'type'              => 'string',
				'single'            => false,
				'sanitize_callback' => function( $value ) {
					if ( ! is_string( $value ) ) {
						throw new Exception( 'Error message is no valid string' );
					}

					return esc_sql( $value );
				},
			)
		);

		register_post_meta(
			self::POST_TYPE,
			'_actor',
			array(
				'type'              => 'string',
				'single'            => false,
				'sanitize_callback' => function( $value ) {
					return esc_sql( $value );
				},
			)
		);

		do_action( 'activitypub_after_register_post_type' );
	}

	public static function sanitize_url( $value ) {
		if ( filter_var( $value, FILTER_VALIDATE_URL ) === false ) {
			return null;
		}

		return esc_url_raw( $value );
	}

	/**
	 * Handle the "Follow" Request
	 *
	 * @param array $object    The JSON "Follow" Activity
	 * @param int   $user_id The ID of the ID of the WordPress User
	 *
	 * @return void
	 */
	public static function handle_follow_request( $object, $user_id ) {
		// save follower
		$follower = self::add_follower( $user_id, $object['actor'] );

		do_action( 'activitypub_followers_post_follow', $object['actor'], $object, $user_id, $follower );
	}

	/**
	 * Handle "Unfollow" requests
	 *
	 * @param array $object  The JSON "Undo" Activity
	 * @param int   $user_id The ID of the ID of the WordPress User
	 */
	public static function handle_undo_request( $object, $user_id ) {
		if (
			isset( $object['object'] ) &&
			isset( $object['object']['type'] ) &&
			'Follow' === $object['object']['type']
		) {
			self::remove_follower( $user_id, $object['actor'] );
		}
	}

	/**
	 * Add new Follower
	 *
	 * @param int    $user_id The ID of the WordPress User
	 * @param string $actor   The Actor URL
	 *
	 * @return array|WP_Error The Follower (WP_Term array) or an WP_Error
	 */
	public static function add_follower( $user_id, $actor ) {
		$meta = get_remote_metadata_by_actor( $actor );

		if ( empty( $meta ) || ! is_array( $meta ) || is_wp_error( $meta ) ) {
			return $meta;
		}

		$follower = Follower::from_array( $meta );
		$follower->upsert();

		$meta = get_post_meta( $follower->get__id(), '_user_id' );

		if ( is_array( $meta ) && ! in_array( $user_id, $meta, true ) ) {
			add_post_meta( $follower->get__id(), '_user_id', $user_id );
			wp_cache_delete( sprintf( self::CACHE_KEY_INBOXES, $user_id ), 'activitypub' );
		}

		return $follower;
	}

	/**
	 * Remove a Follower
	 *
	 * @param int    $user_id The ID of the WordPress User
	 * @param string $actor   The Actor URL
	 *
	 * @return bool|WP_Error True on success, false or WP_Error on failure.
	 */
	public static function remove_follower( $user_id, $actor ) {
		wp_cache_delete( sprintf( self::CACHE_KEY_INBOXES, $user_id ), 'activitypub' );

		$follower = self::get_follower( $user_id, $actor );

		if ( ! $follower ) {
			return false;
		}

		return delete_post_meta( $follower->get__id(), '_user_id', $user_id );
	}

	/**
	 * Get a Follower
	 *
	 * @param int    $user_id The ID of the WordPress User
	 * @param string $actor   The Actor URL
	 *
	 * @return \Activitypub\Model\Follower The Follower object
	 */
	public static function get_follower( $user_id, $actor ) {
		global $wpdb;

		$post_id = $wpdb->get_var(
			$wpdb->prepare(
				"SELECT p.ID FROM $wpdb->posts p INNER JOIN $wpdb->postmeta pm ON p.ID = pm.post_id WHERE p.post_type = %s AND pm.meta_key = '_user_id' AND pm.meta_value = %d AND p.guid = %s",
				array(
					esc_sql( self::POST_TYPE ),
					esc_sql( $user_id ),
					esc_sql( $actor ),
				)
			)
		);

		if ( $post_id ) {
			$post = get_post( $post_id );
			return Follower::from_custom_post_type( $post );
		}

		return null;
	}

	/**
	 * Send Accept response
	 *
	 * @param string                     $actor    The Actor URL
	 * @param array                      $object   The Activity object
	 * @param int                        $user_id  The ID of the WordPress User
	 * @param Activitypub\Model\Follower $follower The Follower object
	 *
	 * @return void
	 */
	public static function send_follow_response( $actor, $object, $user_id, $follower ) {
		if ( is_wp_error( $follower ) ) {
			// it is not even possible to send a "Reject" because
			// we can not get the Remote-Inbox
			return;
		}

		if ( isset( $object['user_id'] ) ) {
			unset( $object['user_id'] );
			unset( $object['@context'] );
		}

		// get inbox
		$inbox = $follower->get_inbox();

		// send "Accept" activity
		$activity = new Activity( 'Accept' );
		$activity->set_activity_object( $object );
		$activity->set_actor( \get_author_posts_url( $user_id ) );
		$activity->set_to( $actor );
		$activity->set_id( \get_author_posts_url( $user_id ) . '#follow-' . \preg_replace( '~^https?://~', '', $actor ) );

		$activity = $activity->to_simple_json();
		$response = Http::post( $inbox, $activity, $user_id );
	}

	/**
	 * Get the Followers of a given user
	 *
	 * @param int    $user_id The ID of the WordPress User
	 * @param string $output  The output format, supported ARRAY_N, OBJECT and ACTIVITYPUB_OBJECT
	 * @param int    $number  Limts the result
	 * @param int    $offset  Offset
	 *
	 * @return array The Term list of Followers, the format depends on $output
	 */
	public static function get_followers( $user_id, $number = null, $offset = null, $args = array() ) {
		$defaults = array(
			'post_type'      => self::POST_TYPE,
			'posts_per_page' => $number,
			'offset'         => $offset,
			'orderby'        => 'ID',
			'order'          => 'DESC',
			'meta_query'     => array(
				array(
					'key'   => '_user_id',
					'value' => $user_id,
				),
			),
		);

		$args  = wp_parse_args( $args, $defaults );
		$query = new WP_Query( $args );
		$items = array();

		foreach ( $query->get_posts() as $post ) {
			$items[] = Follower::from_custom_post_type( $post ); // phpcs:ignore
		}

		return $items;
	}

	/**
	 * Get all Followers
	 *
	 * @param array $args The WP_Query arguments.
	 *
	 * @return array The Term list of Followers.
	 */
	public static function get_all_followers( $user_id = null ) {
		$args = array(
			'meta_query' => array(),
		);
		return self::get_followers( $user_id, null, null, $args );
	}

	/**
	 * Count the total number of followers
	 *
	 * @param int $user_id The ID of the WordPress User
	 *
	 * @return int The number of Followers
	 */
	public static function count_followers( $user_id ) {
		$query = new WP_Query(
			array(
				'post_type'  => self::POST_TYPE,
				'fields'     => 'ids',
				'meta_query' => array(
					array(
						'key'   => '_user_id',
						'value' => $user_id,
					),
				),
			)
		);

		return $query->found_posts;
	}

	/**
	 * Returns all Inboxes fo a Users Followers
	 *
	 * @param int $user_id The ID of the WordPress User
	 *
	 * @return array The list of Inboxes
	 */
	public static function get_inboxes( $user_id ) {
		$cache_key = sprintf( self::CACHE_KEY_INBOXES, $user_id );
		$inboxes = wp_cache_get( $cache_key, 'activitypub' );

		if ( $inboxes ) {
			return $inboxes;
		}

		// get all Followers of a ID of the WordPress User
		$posts = new WP_Query(
			array(
				'post_type'  => self::POST_TYPE,
				'fields'     => 'ids',
				'meta_query' => array(
					array(
						'key'     => '_shared_inbox',
						'compare' => 'EXISTS',
					),
					array(
						'key'   => '_user_id',
						'value' => $user_id,
					),
				),
			)
		);

		$posts = $posts->get_posts();

		if ( ! $posts ) {
			return array();
		}

		global $wpdb;
		$results = $wpdb->get_col(
			$wpdb->prepare(
				"SELECT DISTINCT meta_value FROM {$wpdb->postmeta}
				WHERE post_id IN (" . implode( ', ', array_fill( 0, count( $posts ), '%d' ) ) . ")
				AND meta_key = '_shared_inbox'
				AND meta_value IS NOT NULL",
				$posts
			)
		);

		$inboxes = array_filter( $results );
		wp_cache_set( $cache_key, $inboxes, 'activitypub' );

		return $inboxes;
	}

	/**
	 * Get all Followers that have not been updated for a given time
	 *
	 * @param enum $output     The output format, supported ARRAY_N, OBJECT and ACTIVITYPUB_OBJECT.
	 * @param int  $number     Limits the result.
	 * @param int  $older_than The time in seconds.
	 *
	 * @return mixed The Term list of Followers, the format depends on $output.
	 */
	public static function get_outdated_followers( $number = 50, $older_than = 604800 ) {
		$args = array(
			'post_type'      => self::POST_TYPE,
			'posts_per_page' => $number,
			'orderby'        => 'modified',
			'order'          => 'DESC',
			'post_status'    => 'any', // 'any' includes 'trash
			'date_query'     => array(
				array(
					'column' => 'post_modified_gmt',
					'before' => gmdate( 'Y-m-d', \time() - $older_than ),
				),
			),
		);

		$posts = new WP_Query( $args );
		$items = array();

		foreach ( $posts->get_posts() as $follower ) {
			$items[] = Follower::from_custom_post_type( $follower ); // phpcs:ignore
		}

		return $items;
	}

	/**
	 * Get all Followers that had errors
	 *
	 * @param enum    $output The output format, supported ARRAY_N, OBJECT and ACTIVITYPUB_OBJECT
	 * @param integer $number The number of Followers to return.
	 *
	 * @return mixed The Term list of Followers, the format depends on $output.
	 */
	public static function get_faulty_followers( $number = 10 ) {
		$args = array(
			'post_type'      => self::POST_TYPE,
			'posts_per_page' => $number,
			'meta_query'     => array(
				array(
					'key'     => 'errors',
					'compare' => 'EXISTS',
				),
			),
		);

		$posts = new WP_Query( $args );
		$items = array();

		foreach ( $posts->get_posts() as $follower ) {
			$items[] = Follower::from_custom_post_type( $follower ); // phpcs:ignore
		}

		return $items;
	}
}
