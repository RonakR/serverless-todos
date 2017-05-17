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
      'checked = :checked',
      ConditionExpression: 'id = :todoId',
      ExpressionAttributeValues: {
        ':todoId': todoId,
        ':todoText': data.text,
        ':time': time,
        ':checked': data.checked,
      },
      ReturnValues: 'UPDATED_NEW',
    };

    console.log(dynamoParams);
    dynamoDb.update(dynamoParams, (err, result) => {
      if (err) {
        console.error('Unsuccessful todo update: ', err);
        reject(new Error('Unsuccessful todo update'));
      } else {
        console.log('Result from DB:', result);
        const response = {
          statusCode: 200,
          body: JSON.stringify(result.Attributes),
        };
        resolve(response);
      }
    })
  });
};