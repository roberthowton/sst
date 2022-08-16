import * as fs from 'fs';
import { DynamoDB } from 'aws-sdk';
import AdvertisingBudgetEntry from '../AdvertisingBudgetEntry';

const dynamoDb = new DynamoDB.DocumentClient();

export const writeFromCsv = async () => {
  const contents = fs.readFileSync('./Advertising_Budget.csv', 'utf-8');
  const data = csvToArray(contents);
  const requests: any[] = [];

  data.forEach(({ Month, Impressions, Budget }) =>
    requests.push({
      PutRequest: {
        Item: {
          Month: Month.replace('\n', ''),
          Impressions: Number(Impressions),
          Budget: Number(Budget),
        },
      },
    })
  );

  await dynamoDb
    .batchWrite({
      RequestItems: {
        AdvertisingBudget: requests,
      },
    })
    .promise();
};

function csvToArray(str: string, delimiter = ',') {
  const headers = str.slice(0, str.indexOf('\r\n')).split(delimiter);
  const rows = str.slice(str.indexOf('\r\n') + 1).split('\r\n');

  const arr = rows.map(function (row: string) {
    const values = row.split(delimiter);
    const el = headers.reduce(function (
      object: Record<string, any>,
      header: string,
      index: number
    ) {
      object[header] = values[index];
      return object;
    },
    {});
    return el;
  });

  // return the array
  return arr;
}
