import { DynamoDB } from 'aws-sdk';

const dynamoDb = new DynamoDB.DocumentClient();

const getAllAdvertisingBudgetEntries = async () => {
  const params = {
    TableName: process.env.ADVERTISING_BUDGET_TABLE as string,
  };

  const data = await dynamoDb.scan(params).promise();

  return data.Items;
};

export default getAllAdvertisingBudgetEntries;
