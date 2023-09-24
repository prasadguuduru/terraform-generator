'use strict';
 
module.exports.handler = function (event, context, callback) {
  console.log('prasad');
  console.log(event); // Contains incoming request data (e.g., query params, headers and more)
 
  const response = {
    statusCode: 200,
    headers: {
	"Content-Type": "application/json"
    },
    body: JSON.stringify({ message: 'Hello World!' }),
  };
 
  callback(null, response);
};