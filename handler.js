const createTodo = require('./src/todos/create');
const deleteTodo = require('./src/todos/delete');
const getTodo = require('./src/todos/get');
const updateTodo = require('./src/todos/update');

module.exports = {
  todosHandler: (event, context, callback) => {
    if (event.httpMethod === 'GET') {
      getTodo(event.body)
        .then(result => callback(null, result))
        .catch(err => callback(err));
    } else if (event.httpMethod === 'POST') {
      createTodo(event.body)
        .then(result => callback(null, result))
        .catch(err => callback(err));
    } else if (event.httpMethod === 'PUT') {
      updateTodo(event.pathParameters.id, event.body)
        .then(result => callback(null, result))
        .catch(err => callback(err));
    } else if (event.httpMethod === 'DELETE') {
      deleteTodo(event.pathParameters.id)
        .then(result => callback(null, result))
        .catch(err => callback(err));
    }
    // Use this code if you don't use the http event with the LAMBDA-PROXY integration
    // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
  },
};
