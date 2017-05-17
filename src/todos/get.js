const AWS = require('aws-sdk');

const dynamoDb = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' });

module.exports = (body) => {
  return new Promise((resolve, reject) => {

    const dynamoParams = {
      TableName: process.env.TODOS_TABLE,
    };

    console.log('Dynamo Params: ', dynamoParams);

    dynamoDb.scan(dynamoParams, (err, result) => {
      if (err) {
        console.error('Unsuccessful todo get: ', err);
        reject(new Error('Unsuccessful todo get'));
      } else {
        console.log('Successful todo get');
        const response = {
          statusCode: 200,
          body: JSON.stringify(result.Items),
        };
        resolve(response);
      }
    })
  });
};