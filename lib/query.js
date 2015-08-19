'use strict';

// MODULES //

var copy = require( 'utils-copy' ),
	getParams = require( './params.js' ),
	response = require( './response.js' );


// QUERY //

/**
* FUNCTION: query()
*	Makes an HTTP request to an endpoint and emits the results.
*/
function query() {
	/* jshint validthis:true */
	var self = this,
		params,
		opts,
		clbk,
		rid;

	// Create a unique request id:
	rid = ++this._rid;

	// Emit that we are ready to begin a request:
	this.emit( 'init', {
		'rid': rid
	});

	// Create a response handler:
	clbk = response( rid, onData );

	// Customize the options:
	opts = copy( this._opts );

	// Get the instances currently running...
	this._ec2client( onInstances );

	/**
	* FUNCTION: onInstances( error, ids )
	*	Callback invoked upon receiving a list of running instances.
	*
	* @private
	* @param {Error|Null} error - error object or null
	* @param {Array} ids - list of running instances
	*/
	function onInstances( error, ids ) {
		// Configure the query start and end times...
		opts.start = new Date( Date.now() - 10*60*1000 ).toISOString();
		opts.end = new Date( Date.now() + 60*1000 ).toISOString();
		opts.period = 5 * 60;

		// Create a parameter object:
		params = getParams( opts );

		// Make the request:
		self._client.getMetricStatistics( params, clbk );
	} // end FUNCTION onInstances()

	/**
	* FUNCTION: onData( error, evt )
	*	Callback invoked upon receiving an HTTP response.
	*
	* @private
	* @param {Error|Null} error - error object or null
	* @param {Object} evt - response data
	*/
	function onData( error, evt ) {
		var data;
		if ( error ) {
			self.emit( 'error', error );
		} else {
			data = {
				'rid': rid,
				'time': evt.time,
				'data': evt.data
			};
			self.emit( 'data', data );
		}
		self.emit( 'end', {
			'rid': rid
		});
	} // end FUNCTION onData()
} // end FUNCTION query()


// EXPORTS //

module.exports = query;
