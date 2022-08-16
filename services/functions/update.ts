import AdvertisingBudgetEntry from 'AdvertisingBudgetEntry';
import createAdvertisingBudgetEntry from 'createAdvertisingBudgetEntry';
// import fetch from 'node-fetch';
// import { MyStack } from '../../stacks/MyStack';

export async function handler(entry: AdvertisingBudgetEntry) {
  await createAdvertisingBudgetEntry(entry);
}
