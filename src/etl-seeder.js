'use strict'
const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3')
// const { DynamoDBClient, TransactWriteItemsCommand } = require("@aws-sdk/client-dynamodb");
const getStream = require('get-stream')
const { Readable } = require('stream')
const AWS = require('aws-sdk')
const docClient = new AWS.DynamoDB.DocumentClient()

module.exports.main = async (event, context, callback) => {
  console.log('Grabbing user file from S3...')
  const s3Client = new S3Client({
    region: 'us-west-1',
  })

  const getParams = {
    Bucket: 'sls-dd-seeder-dev',
    Key: 'users.json',
  }

  const s3Item = await s3Client.send(new GetObjectCommand(getParams))

  const file_stream = s3Item.Body
  let content_buffer = null
  let userArray = []

  if (file_stream instanceof Readable) {
    content_buffer = await getStream.buffer(file_stream)
    userArray = JSON.parse(content_buffer.toString())
  } else {
    throw new Error('Unknown stream type.')
  }

  const userSeeds = userArray.map(user => {
    return {
      PutRequest: {
        Item: {
          PK: user.email,
          SK: new Date().toISOString(),
          id: user.id,
          fist_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
        },
      },
    }
  })

  let quotient = Math.floor(userSeeds.length / 25)
  const remainder = userSeeds.length % 25

  let batchMultiplier = 1
  while (quotient > 0) {
    for (let i = 0; i < userSeeds.length - 1; i += 25) {
      await docClient
        .batchWrite(
          {
            RequestItems: {
              'sls-dd-seeder-dev': userSeeds.slice(i, 25 * batchMultiplier),
            },
          },
          (err, data) => {
            if (err) {
              console.log('something went wrong...')
            } else {
              console.log('yay...users uploaded!')
            }
          }
        )
        .promise()
      console.log({ quotient })
      ++batchMultiplier
      --quotient
    }
  }

  if (remainder > 0) {
    await docClient
      .batchWrite(
        {
          RequestItems: {
            'sls-dd-seeder-dev': userSeeds.slice(seedData.length - remainder),
          },
        },
        (err, data) => {
          if (err) {
            console.log('something went wrong...')
          } else {
            console.log('yay...users uploaded!')
          }
        }
      )
      .promise()
  }
}
