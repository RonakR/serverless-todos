const AWS = require('aws-sdk');

const dynamoDb = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' });

module.exports = (body) => {
  return new Promise((resolve, reject) => {

    const dynamoParams = {
      TableName: process.env.TODOS_TABLE,
    };

    dynamoDb.scan(dynamoParams, (err, result) => {
      if (err) {
        console.error('Unsuccessful get todo: ', err);
        reject(new Error('Unsuccessful get todo'));
      } else {
        const response = {
          statusCode: 200,
          body: JSON.stringify(result.Items),
        };
        resolve(response);
      }
    })
  });
};