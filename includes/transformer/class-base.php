<?php
namespace Activitypub\Transformer;

/**
 * WordPress Base Transformer
 *
 * Transformers are responsible for transforming a WordPress objects into different ActivityPub
 * Object-Types or Activities.
 */
abstract class Base {
	/**
	 * The WP_Post object.
	 *
	 * @var
	 */
	protected $object;

	/**
	 * Static function to Transform a WordPress Object.
	 *
	 * This helps to chain the output of the Transformer.
	 *
	 * @param stdClass $object The WP_Post object
	 *
	 * @return void
	 */
	public static function transform( $object ) {
		return new static( $object );
	}

	/**
	 * Base constructor.
	 *
	 * @param stdClass $object
	 */
	public function __construct( $object ) {
		$this->object = $object;
	}

	/**
	 * Transform the WordPress Object into an ActivityPub Object.
	 *
	 * @return Activitypub\Activity\Base_Object
	 */
	abstract public function to_object();

	/**
	 * Transform the WordPress Object into an ActivityPub Activity.
	 *
	 * @param string $type The type of Activity to transform to.
	 *
	 * @return Activitypub\Activity\Activity
	 */
	//abstract public function to_activity( $type );
}
