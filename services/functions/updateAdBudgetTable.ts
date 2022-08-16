import AdvertisingBudgetEntry from 'AdvertisingBudgetEntry';
import AWS from 'aws-sdk';
const eventBridgeClient = new AWS.EventBridge();

export async function handler(entry: AdvertisingBudgetEntry) {
  eventBridgeClient
    .putEvents({
      Entries: [
        {
          EventBusName: process.env.busName,
          Source: 'updateAdBudgetTable',
          DetailType: 'AdvertisingBudgetEntry',
          Detail: JSON.stringify(entry),
        },
      ],
    })
    .promise()
    .catch((err) => console.log(err));
  // console.log('Mutation request received! Request body: ', entry);
  return {
    statusCode: 200,
    body: JSON.stringify({ status: 'successful' }),
  };
}
