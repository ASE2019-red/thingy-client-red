const _ = require('lodash');
module.exports = {
    "/api/random": {
        "GET": {
            "data": _.sample([1, 3, 4, 5, 111])
        }
    }
}
