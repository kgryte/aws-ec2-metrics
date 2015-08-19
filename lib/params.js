'use strict';

/**
* FUNCTION: params( opts )
*	Maps query options to a AWS parameter object.
*
* @param {Object} opts - query options
* @returns {Object} parameter object
*/
function params( opts ) {
	var out = {},
		ids,
		len,
		i;

	out.Namespace = opts.namespace;
	out.MetricName = opts.metric;
	out.Unit = opts.unit;

	out.Statistics = [
		'Average'
	];

	out.Period = opts.period;
	out.StartTime = opts.start;
	out.EndTime = opts.end;

	// Create a filter to return metrics for select instances...
	if ( opts.ids ) {
		len = opts.ids.length;
		ids = new Array( len );
		for ( i = 0; i < len; i++ ) {
			ids.push({
				'Name': 'InstanceId',
				'Value': opts.ids[ i ]
			});
		}
		out.Dimensions = ids;
	}

	return out;
} // end FUNCTION params()


// EXPORTS //

module.exports = params;
