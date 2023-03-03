/**
 * @api {get} /note/:id Get a note
 */
const AWS = require("aws-sdk")
const { getResponseHeaders } = require("./utils")

AWS.config.update({
  region: "us-east-1"
})
const dynamoDb = new AWS.DynamoDB.DocumentClient()

const handler = async (event) => {
  const noteId = event.pathParameters.id
  const userId = event.queryStringParameters.userId

  const params = {
    TableName: process.env.NOTES_TABLE_NAME,
    Key: {
      id: noteId,
      userId: userId
    }
  }

  try {
    const { Item } = await dynamoDb.get(params).promise()
    return {
      statusCode: 200,
      headers: getResponseHeaders(),
      body: JSON.stringify(Item)
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
