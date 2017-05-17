const AWS = require('aws-sdk');
const uuid = require('uuid');

const dynamoDb = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' });

module.exports = (body) => {
  return new Promise((resolve, reject) => {

    const time = new Date().getTime();
    const data = JSON.parse(body);
    const dynamoParams = {
      TableName: process.env.TODOS_TABLE,
      Item: {
        id: uuid.v1(),
        text: data.text,
        checked: false,
        createdAt: time,
        modifiedAt: time,
      },
    };

    dynamoDb.put(dynamoParams, (err, result) => {
      if (err) {
        console.error('Unsuccessful todo create: ', error);
        reject(new Error('Unsuccessful todo create'));
      } else {
        console.log(result);
        const response = {
          statusCode: 200,
          body: JSON.stringify(dynamoParams.Item),
        };
        resolve(response);
      }
    })
  });
};