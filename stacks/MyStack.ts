import {
  StackContext,
  Table,
  AppSyncApi,
  EventBus,
  Api,
} from '@serverless-stack/resources';
import { writeFromCsv } from '../services/functions/writeFromCsv';

export function MyStack({ stack }: StackContext) {
  const advertisingBudgetTable = new Table(stack, 'AdvertisingBudget', {
    fields: {
      Month: 'string',
      Impressions: 'number',
      Budget: 'number',
    },
    primaryIndex: {
      partitionKey: 'Month',
    },
  });

  const api = new AppSyncApi(stack, 'AppSyncApi', {
    schema: 'services/graphql/schema.graphql',
    defaults: {
      function: {
        environment: {
          ADVERTISING_BUDGET_TABLE:
            advertisingBudgetTable.tableName ?? 'AdvertisingBudget',
        },
      },
    },
    dataSources: {
      advertisingBudget: 'functions/main.handler',
    },
    resolvers: {
      'Query getAllAdvertisingBudgetEntries': 'advertisingBudget',
      'Query getAdvertisingBudgetEntryByMonth': 'advertisingBudget',
      'Mutation createAdvertisingBudgetEntry': 'advertisingBudget',
    },
  });
  api.attachPermissions([advertisingBudgetTable]);

  const bus = new EventBus(stack, 'UpdateAdBudgetTable', {
    rules: {
      rule1: {
        pattern: {
          source: ['updateAdBudgetTable'],
          detailType: ['AdvertisingBudgetEntry'],
        },
        targets: {
          mutate: 'functions/update.handler',
        },
      },
    },
  });

  const busApi = new Api(stack, 'BusApi', {
    defaults: {
      function: {
        environment: {
          busName: bus.eventBusName,
        },
      },
    },
    routes: {
      'POST /graphql': 'functions/updateAdBudgetTable.handler',
    },
  });

  busApi.attachPermissions([bus, advertisingBudgetTable]);
  bus.attachPermissions([advertisingBudgetTable]);

  stack.addOutputs({
    ApiId: api.apiId,
    ApiKey: api.cdk.graphqlApi.apiKey as string,
    ApiUrl: api.url,
    ApiArn: api.apiArn,
    ApiData: api.cdk.graphqlApi.graphqlUrl,
    BusApiEndpoint: busApi.url,
  });

  writeFromCsv();
}
