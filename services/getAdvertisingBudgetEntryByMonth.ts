import { DynamoDB } from 'aws-sdk';
import AdvertisingBudgetEntry from './AdvertisingBudgetEntry';

const dynamoDb = new DynamoDB.DocumentClient();

const getAdvertisingBudgetEntryByMonth = async (
  entryMonth: AdvertisingBudgetEntry['Month']
): Promise<AdvertisingBudgetEntry | undefined> => {
  const params = {
    Key: {
      Month: entryMonth,
    },
    TableName: process.env.ADVERTISING_BUDGET_TABLE as string,
  };

  const { Item } = await dynamoDb.get(params).promise();

  return Item as AdvertisingBudgetEntry;
};

export default getAdvertisingBudgetEntryByMonth;
