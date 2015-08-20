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
		count = 0,
		params,
		total,
		clbk,
		data,
		rid;

	// Create a unique request id:
	rid = ++this._rid;

	// Emit that we are ready to begin making requests:
	this.emit( 'init', {
		'rid': rid
	});

	// Get the instances currently running...
	this._ec2client( onInstances );

	/**
	* FUNCTION: onInstances( error, json )
	*	Callback invoked upon receiving a list of running instances.
	*
	* @private
	* @param {Error|Null} error - error object or null
	* @param {Object} json - JSON data object
	*/
	function onInstances( error, json ) {
		var iids = json.data,
			start,
			opts,
			end,
			i;

		if ( error ) {
			return self.emit( 'error', error );
		}
		total = iids.length;

		// Configure the query start and end times...
		// TODO: use offset/lag, start, end, and period options
		start = new Date( Date.now() - 10*60*1000 ).toISOString();
		end = new Date( Date.now() - 5*60*1000 ).toISOString();

		// Retrieve metrics for each running instance...
		for ( i = 0; i < total; i++ ) {
			// Create a response handler:
			clbk = response( rid, iids[ i ], onData );

			// Configure options...
			opts = copy( self._opts );
			opts.start = start;
			opts.end = end;
			opts.period = 5 * 60;
			opts.iid = iids[ i ];

			// Create a parameter object:
			params = getParams( opts );

			// Make a request:
			self._client.getMetricStatistics( params, clbk );
		}
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
		count += 1;
		if ( error ) {
			self.emit( 'error', error );
		} else {
			if ( !data ) {
				data = {};
			}
			data[ evt.iid ] = evt.data;
		}
		// Have we received all responses?
		if ( count === total ) {
			if ( data ) {
				data = {
					'rid': rid,
					'time': evt.time,
					'data': data
				};
				self.emit( 'data', data );
			}
			self.emit( 'end', {
				'rid': rid
			});
		}
	} // end FUNCTION onData()
} // end FUNCTION query()


// EXPORTS //

module.exports = query;
