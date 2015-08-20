'use strict';

/**
* FUNCTION: filter( data )
*	Filters response data and returns a metrics array.
*
* @param {Object} data - response data
* @returns {Array[]} metrics
*/
function filter( data ) {
	var out = new Array(2 );

	out[ 0 ] = data.Datapoints[ 0 ].Timestamp;
	out[ 1 ] = data.Datapoints[ 0 ].Average;

	return out;
} // end FUNCTION filter()


// EXPORTS //

module.exports = filter;
