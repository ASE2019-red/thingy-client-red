const _ = require('lodash');
module.exports = {
    "/coffee": {
        GET: {
            data: require('./all-coffees.json.js')
        }
    },
    '/api/users': {
        GET: {
            data: function(req) {
	            return {
		            name: "John",
		            timestamp: new Date(),
		        }
	        }
        }
    }

}
