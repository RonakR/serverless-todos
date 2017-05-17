const AWS = require('aws-sdk');
const moment = require('moment');

const dynamoDb = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' });

module.exports = (todoId) => {
  return new Promise((resolve, reject) => {

    const dynamoParams = {
      TableName: process.env.TODOS_TABLE,
      Key: {
        id: todoId
      }
    };

    console.log('Dynamo Params: ', dynamoParams);

    dynamoDb.delete(dynamoParams, (err, result) => {
      if (err) {
        console.error('Unsuccessful todo delete: ', err);
        reject(new Error('Unsuccessful todo delete'));
      } else {
        console.log('Successful todo delete');
        const response = {
          statusCode: 204,
        };
        resolve(response);
      }
    })
  });
};