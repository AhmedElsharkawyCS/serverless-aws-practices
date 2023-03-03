/**
 * @api {put} /notes/:id Update a note
 */
const AWS = require("aws-sdk")
const moment = require("moment")
const { getResponseHeaders, getUserId } = require("./utils")

AWS.config.update({
  region: "us-east-1"
})
const dynamoDb = new AWS.DynamoDB.DocumentClient()

const handler = async (event) => {
  const { body } = event
  const noteId = event.pathParameters.id
  const { title, content } = JSON.parse(body)
  const expireAt = moment().add(1, "day").unix()
  const userId = getUserId(body)

  const params = {
    TableName: process.env.NOTES_TABLE_NAME,
    Key: {
      id: noteId,
      userId: userId
    },
    UpdateExpression: "set title = :title, content = :content, expireAt = :expireAt",
    ExpressionAttributeValues: {
      ":title": title,
      ":content": content,
      ":expireAt": expireAt
    }
  }

  try {
    await dynamoDb.update(params).promise()
    return {
      statusCode: 200,
      headers: getResponseHeaders(),
      body: JSON.stringify({
        id: noteId,
        title,
        content,
        expireAt,
        userId
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
