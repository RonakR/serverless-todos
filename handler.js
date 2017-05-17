const createTodo = require('./src/todos/create');

module.exports = {
  todosHandler: (event, context, callback) => {
    if (event.httpMethod === 'GET') {
      console.log('Got GET');
    } else if (event.httpMethod === 'POST') {
      createTodo(event.body)
        .then(result => callback(null, result))
        .catch(err => callback(err));
    }
    // Use this code if you don't use the http event with the LAMBDA-PROXY integration
    // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
  },
};
