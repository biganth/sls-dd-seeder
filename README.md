# ⚡ sls DD seeder ⚡

sls DD seeder is a [Serverless](https://www.serverless.com/) deployment that seeds a DynamoDB table with 1,000 users. The deployment creates an S3 bucket, a DynamoDB table, Lambda and a plugin. The plugin invokes the Lambda after deployment and the Lambda downloads the json file from the S3 bucket and pipes 1,000 user records into DynamoDB via BatchWrite.

## Installation

Use [npm](https://www.npmjs.com/) to install sls DD seeder.

```bash
npm i
```

## Usage

```
cd src
sls deploy
sls deploy --aws-profile user2  # deploy under a different AWS user profile
```

## TO DO

- Test coverage
- Notification of completion
- Typescript
- Handle unprocessed batchWrite items
- CDK version
- Replace hard coded variables

## License

[MIT](https://choosealicense.com/licenses/mit/)
