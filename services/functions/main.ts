import AdvertisingBudgetEntry from '../AdvertisingBudgetEntry';
import getAllAdvertisingBudgetEntries from '../getAllAdvertisingBudgetEntries';
import getAdvertisingBudgetEntryByMonth from '../getAdvertisingBudgetEntryByMonth';
import createAdvertisingBudgetEntry from '../createAdvertisingBudgetEntry';

type AppSyncEvent = {
  info: {
    fieldName: string;
  };
  arguments: {
    entry: AdvertisingBudgetEntry;
    entryMonth: string;
  };
};

export const handler = async (event: AppSyncEvent) => {
  console.log({ event });
  switch (event.info.fieldName) {
    case 'getAllAdvertisingBudgetEntries':
      return await getAllAdvertisingBudgetEntries();
    case 'getAdvertisingBudgetEntryByMonth':
      return await getAdvertisingBudgetEntryByMonth(event.arguments.entryMonth);
    case 'createAdvertisingBudgetEntry':
      return await createAdvertisingBudgetEntry(event.arguments.entry);
    default:
      return null;
  }
};
