/**
 * @api {delete} /notes/:id Delete a note
 */
const { DynamoDBClient, DeleteItemCommand } = require("@aws-sdk/client-dynamodb")
const { getResponseHeaders, getUserId } = require("./utils")

const dynamoDb = new DynamoDBClient({
  region: "us-east-1"
})

const handler = async (event) => {
  const noteId = decodeURIComponent(event.pathParameters.id)
  // read userId from header
  const userId = getUserId(event.headers)

  const params = new DeleteItemCommand({
    TableName: process.env.NOTES_TABLE_NAME,
    Key: {
      id: { S: noteId },
      userId: { S: userId }
    }
  })

  try {
    await dynamoDb.send(params)
    return {
      statusCode: 200,
      headers: getResponseHeaders(),
      body: JSON.stringify({
        id: noteId
      })
    }
  } catch (error) {
    console.log(error)
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
