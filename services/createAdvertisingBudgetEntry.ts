import { DynamoDB } from 'aws-sdk';
import AdvertisingBudgetEntry from './AdvertisingBudgetEntry';

const dynamoDb = new DynamoDB.DocumentClient();

const createAdvertisingBudgetEntry = async (
  entry: AdvertisingBudgetEntry
): Promise<AdvertisingBudgetEntry> => {
  const params = {
    Item: entry as Record<string, unknown>,
    TableName: process.env.ADVERTISING_BUDGET_TABLE as string,
  };
  await dynamoDb.put(params).promise();

  return entry;
};

export default createAdvertisingBudgetEntry;
