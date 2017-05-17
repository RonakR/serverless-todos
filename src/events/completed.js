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
      ProjectionExpression: 'transactionId',
    };
    console.log('Dynamo Params', dynamoParams);

    dynamoDb.query(dynamoParams, (err, result) => {
      if (err) {
        reject(err);
      } else {
        console.log('Completed Todos: ', result.Items);
        resolve(result.Items.length);
      }
    });
  });
}

function publishToSNS() {
  return new Promise((resolve, reject) => {
    const snsParams = {
        TargetArn: snsArn,
        Message: strTran,
      };
    console.log('Sns Params', snsParams);

    sns.publish(snsParams, (err, data) => {
      if (err) {
        consle.log(`error publishing topic ${process.env.COMPLETED_TOPIC} `, err);
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

    let snsArn = context.invokedFunctionArn;
    snsArn = snsArn.replace('lambda', 'sns');
    snsArn = snsArn.replace(`function:${context.functionName}`, process.env.DOTLOOP_UPDATE_SIGNAL);

    getNumCompleted()
      .then(result => publishToSNS(result))
      .then(result => resolve(result))
      .catch(err => reject(err))
  });
};