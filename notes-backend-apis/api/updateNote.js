/**
 * @api {put} /notes/:id Update a note
 */
const { DynamoDBClient, UpdateItemCommand } = require("@aws-sdk/client-dynamodb")
const moment = require("moment")
const { getResponseHeaders, getUserId } = require("./utils")

const dynamoDb = new DynamoDBClient({
  region: "us-east-1"
})

const handler = async (event) => {
  const { body, headers } = event
  const noteId = event.pathParameters.id
  const { title, content } = JSON.parse(body)
  const expireAt = moment().add(1, "day").unix()
  // read userId from header
  const userId = getUserId(headers)

  const params = new UpdateItemCommand({
    TableName: process.env.NOTES_TABLE_NAME,
    Key: {
      id: { S: noteId },
      userId: { S: userId }
    },
    UpdateExpression: "set title = :title, content = :content, expireAt = :expireAt",
    ExpressionAttributeValues: {
      ":title": { S: title },
      ":content": { S: content },
      ":expireAt": { N: expireAt.toString() }
    }
  })

  try {
    await dynamoDb.send(params)
    return {
      statusCode: 200,
      headers: getResponseHeaders(),
      body: JSON.stringify({
        id: noteId,
        title,
        content,
        expireAt
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
