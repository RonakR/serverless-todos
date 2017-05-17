const AWS = require('aws-sdk');
const moment = require('moment');

const dynamoDb = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' });

module.exports = (todoId, body) => {
  return new Promise((resolve, reject) => {

    const time = moment().format();
    const data = JSON.parse(body);
    const dynamoParams = {
      TableName: process.env.TODOS_TABLE,
      Key: {
        id: todoId
      },
      UpdateExpression: 'SET todoText = :todoText,' +
      'modifiedAt = :time,' +
      'completed = :completed',
      ConditionExpression: 'id = :todoId',
      ExpressionAttributeValues: {
        ':todoId': todoId,
        ':todoText': data.text,
        ':time': time,
        ':completed': data.completed,
      },
      ReturnValues: 'UPDATED_NEW',
    };

    console.log('Dynamo Params: ', dynamoParams);

    dynamoDb.update(dynamoParams, (err, result) => {
      if (err) {
        console.error('Unsuccessful todo update: ', err);
        reject(new Error('Unsuccessful todo update'));
      } else {
        console.log('Successful todo update');
        const response = {
          statusCode: 200,
          body: JSON.stringify(result.Attributes),
        };
        resolve(response);
      }
    })
  });
};