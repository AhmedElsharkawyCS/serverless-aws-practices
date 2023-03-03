/**
 * @api {delete} /notes/:id Delete a note
 */
const AWS = require("aws-sdk")
const { getResponseHeaders, getUserId } = require("./utils")

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
    },
    ConditionExpression: "attribute_exists(id)",
    ReturnValues: "ALL_OLD"
  }

  try {
    const { Attributes } = await dynamoDb.delete(params).promise()
    return {
      statusCode: 200,
      headers: getResponseHeaders(),
      body: JSON.stringify(Attributes)
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
