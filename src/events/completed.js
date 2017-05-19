const AWS = require('aws-sdk');
const moment = require('moment');

const dynamoDb = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' });
const sns = new AWS.SNS();

function getNumCompleted() {
  return new Promise((resolve, reject) => {
    const dynamoParams = {
      TableName: process.env.TODOS_TABLE,
      IndexName: 'completedIndex',
      KeyConditionExpression: 'completed = :completed',
      ExpressionAttributeValues: {
        ':completed': 1,
      },
      ProjectionExpression: 'modifiedAt',
    };
    console.log('Dynamo Params', dynamoParams);

    dynamoDb.query(dynamoParams, (err, result) => {
      if (err) {
        reject(err);
      } else {
        console.log('Completed Todos: ', result.Items);
        let recentlyCompleted = result.Items.reduce((acc, cur) => {
          if(moment().subtract(1, 'minute').isBefore(moment(cur.modifiedAt))) acc = acc + 1;
          return acc
        }, 0)
        console.log('Recently complete:', recentlyCompleted);
        resolve(recentlyCompleted.length);
      }
    });
  });
}

function publishToSNS(numCompleted, context) {
  return new Promise((resolve, reject) => {
    let snsArn = context.invokedFunctionArn;
    snsArn = snsArn.replace('lambda', 'sns');
    snsArn = snsArn.replace(`function:${context.functionName}`, process.env.COMPLETED_TOPIC);
    const snsParams = {
        TargetArn: snsArn,
        Message: JSON.stringify({completed: numCompleted}),
    };

    console.log('Sns Params', snsParams);

    sns.publish(snsParams, (err, data) => {
      if (err) {
        console.log(`error publishing topic ${process.env.COMPLETED_TOPIC} `, err);
        reject(err);
      } else {
        console.log('Published without Error:'.concat(JSON.stringify(snsParams)).concat(JSON.stringify(data)));
        resolve("Published");
      }
    });
  });
}
module.exports = (context) => {
  return new Promise((resolve, reject) => {
    getNumCompleted()
      .then(result => publishToSNS(result, context))
      .then(result => resolve(result))
      .catch(err => reject(err));
  });
};