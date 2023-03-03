/**
 * @api {get} /notes Get the notes
 */
const AWS = require("aws-sdk")
const { getResponseHeaders } = require("./utils")

AWS.config.update({
  region: "us-east-1"
})
const dynamoDb = new AWS.DynamoDB.DocumentClient()

const handler = async (event) => {
  const { queryStringParameters } = event
  const limit = parseInt(queryStringParameters?.limit || 10)
  const userId = event.queryStringParameters.userId

  const params = {
    TableName: process.env.NOTES_TABLE_NAME,
    Key: {
      userId: userId
    },
    Limit: limit,
    ScanIndexForward: false
  }
  console.log("params", params)

  try {
    const { Items } = await dynamoDb.query(params).promise()
    return {
      statusCode: 200,
      headers: getResponseHeaders(),
      body: JSON.stringify(Items)
    }
  } catch (error) {
    return {
      statusCode: 500,
      headers: getResponseHeaders(),
      body: JSON.stringify(error)
    }
  }
}

module.exports = {
  handler
}
