/**
 * @api {get} /notes Get the notes
 */
const { DynamoDBClient, ScanCommand } = require("@aws-sdk/client-dynamodb")
const { getResponseHeaders, getUserId } = require("./utils")

const dynamoDb = new DynamoDBClient({
  region: "us-east-1"
})

const handler = async (event) => {
  const { queryStringParameters, headers } = event
  const limit = parseInt(queryStringParameters?.limit || 10)
  // read userId from header
  const userId = getUserId(headers)

  const params = new ScanCommand({
    TableName: process.env.NOTES_TABLE_NAME,
    Limit: limit,
    FilterExpression: "userId = :userId",
    ExpressionAttributeValues: {
      ":userId": { S: userId }
    }
  })

  try {
    const { Items } = await dynamoDb.send(params)
    const mappedItems = Items.map((item) => ({
      id: item.id.S,
      title: item.title.S,
      content: item.content.S,
      expireAt: item.expireAt.N,
      createdAt: item.createdAt.N
    }))
    return {
      statusCode: 200,
      headers: getResponseHeaders(),
      body: JSON.stringify(mappedItems)
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
