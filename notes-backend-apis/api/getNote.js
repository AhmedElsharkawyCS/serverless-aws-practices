/**
 * @api {get} /note/:id Get a note
 */
const { DynamoDBClient, GetItemCommand } = require("@aws-sdk/client-dynamodb")
const { getResponseHeaders, getUserId } = require("./utils")

const dynamoDb = new DynamoDBClient({
  region: "us-east-1"
})

const handler = async (event) => {
  const noteId = event.pathParameters.id
  // read userId from header
  const userId = getUserId(event.headers)

  const params = new GetItemCommand({
    TableName: process.env.NOTES_TABLE_NAME,
    Key: {
      id: { S: noteId },
      userId: { S: userId }
    }
  })

  try {
    const { Item } = await dynamoDb.send(params)
    return {
      statusCode: 200,
      headers: getResponseHeaders(),
      body: JSON.stringify({
        id: Item.id.S,
        title: Item.title.S,
        content: Item.content.S,
        expireAt: Item.expireAt.N,
        createdAt: Item.createdAt.N
      })
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
