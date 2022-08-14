import { StackContext, Table, AppSyncApi } from '@serverless-stack/resources';

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
          ADVERTISING_BUDGET_TABLE: advertisingBudgetTable.tableName,
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
  stack.addOutputs({
    ApiId: api.apiId,
    ApiKey: api.cdk.graphqlApi.apiKey as string,
    ApiUrl: api.url,
    ApiArn: api.apiArn,
    ApiData: api.cdk.graphqlApi.graphqlUrl,
  });

  // const api = new Api(stack, 'api', {
  //   routes: {
  //     'GET /': 'functions/lambda.handler',
  //   },
  // });
  // stack.addOutputs({
  //   ApiEndpoint: api.url,
  // });
}
