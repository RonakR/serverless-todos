const AWS = require('aws-sdk');
const moment = require('moment');
const uuid = require('uuid');

const dynamoDb = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' });

module.exports = (body) => {
  return new Promise((resolve, reject) => {

    const time = moment().format();
    const data = JSON.parse(body);
    const dynamoParams = {
      TableName: process.env.TODOS_TABLE,
      Item: {
        id: uuid.v1(),
        todoText: data.text,
        completed: 1,
        createdAt: time,
        modifiedAt: time,
      },
    };

    console.log('Dynamo Params: ', dynamoParams);

    dynamoDb.put(dynamoParams, (err, result) => {
      if (err) {
        console.error('Unsuccessful todo create: ', err);
        reject(new Error('Unsuccessful todo create'));
      } else {
        console.log('Successful todo create')
        const response = {
          statusCode: 200,
          body: JSON.stringify(dynamoParams.Item),
        };
        resolve(response);
      }
    })
  });
};