/**
 * @api {post} /notes Add a note
 */
const AWS = require("aws-sdk")
const moment = require("moment")
const { v4: uuidv4 } = require("uuid")
const { getResponseHeaders, getUserId } = require("./utils")

AWS.config.update({
  region: "us-east-1"
})
const dynamoDb = new AWS.DynamoDB.DocumentClient()

const handler = async (event) => {
  const { body } = event
  const { title, content } = JSON.parse(body)
  const userId = getUserId(body)

  const Item = {
    title,
    content,
    userId: userId,
    timestamp: moment().unix(),
    expireAt: moment().add(1, "day").unix(),
    id: uuidv4()
  }

  const params = {
    TableName: process.env.NOTES_TABLE_NAME,
    Item
  }

  try {
    await dynamoDb.put(params).promise()
    return {
      statusCode: 201,
      headers: getResponseHeaders(),
      body: JSON.stringify(params.Item)
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
