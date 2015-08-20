'use strict';

/**
* FUNCTION: params( opts )
*	Maps query options to a AWS parameter object.
*
* @param {Object} opts - query options
* @returns {Object} parameter object
*/
function params( opts ) {
	var out = {};

	// Define metric parameters...
	out.Namespace = opts.namespace;
	out.MetricName = opts.metric;
	out.Unit = opts.unit;

	// Define what statistics should be calculated over the data...
	out.Statistics = [
		'Average'
	];

	// Define the temporal parameters...
	out.Period = opts.period;
	out.StartTime = opts.start;
	out.EndTime = opts.end;

	// Create a filter to return metrics for a single instance...
	if ( opts.iid ) {
		out.Dimensions = [
			{
				'Name': 'InstanceId',
				'Value': opts.iid
			}
		];
	}
	return out;
} // end FUNCTION params()


// EXPORTS //

module.exports = params;
