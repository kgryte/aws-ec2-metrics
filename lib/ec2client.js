'use strict';

// MODULES //

var ec2client = require( 'aws-ec2-running' );


// CLIENT //

/**
* FUNCTION: client( opts )
*	Returns a client factory.
*
* @param {Object} opts - client options
* @returns {Function} client factory
*/
function client( opts ) {
	/**
	* FUNCTION: request( clbk )
	*	Performs a single request.
	*
	* @private
	* @param {Function} clbk - callback to invoke after making the request
	* @returns {Query} Query instance
	*/
	return function request( clbk ) {
		return ec2client( opts, clbk );
	};
} // end FUNCTION client()


// EXPORTS //

module.exports = client;
