'use strict'
const { LambdaClient, InvokeAsyncCommand } = require('@aws-sdk/client-lambda')

class EtlPlugin {
  constructor(serverless, options) {
    this.serverless = serverless
    this.hooks = {
      'after:deploy:deploy': this.afterDeployFunctions.bind(this),
    }
  }

  async afterDeployFunctions() {
    const lambda = new LambdaClient({
      region: 'us-west-1',
    })
    const params = {
      InvocationType: 'RequestResponse',
      FunctionName: 'sls-dd-seeder-dev-etl-seeder',
      InvokeArgs: 'null',
    }
    const invokeAsyncCommand = new InvokeAsyncCommand(params)
    try {
      await lambda.send(invokeAsyncCommand)
    } catch (error) {
      console.log(error)
    }
  }
}

module.exports = EtlPlugin
