/**
 * @api {post} /notes Add a note
 */
const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb")
const moment = require("moment")
const { v4: uuidv4 } = require("uuid")
const { getResponseHeaders, getUserId } = require("./utils")

const dynamoDb = new DynamoDBClient({
  region: "us-east-1"
})

const handler = async (event) => {
  const { body, headers } = event
  const { title, content } = JSON.parse(body)
  const userId = getUserId(headers)

  const command = new PutItemCommand({
    TableName: process.env.NOTES_TABLE_NAME,
    Item: {
      id: { S: uuidv4() },
      title: { S: title },
      content: { S: content },
      userId: { S: userId },
      expireAt: { N: moment().add(1, "day").unix().toString() },
      createdAt: { N: moment().unix().toString() }
    }
  })

  try {
    await dynamoDb.send(command)
    return {
      statusCode: 200,
      headers: getResponseHeaders(),
      body: JSON.stringify({
        id: command.input.Item.id.S,
        title: command.input.Item.title.S,
        content: command.input.Item.content.S,
        expireAt: command.input.Item.expireAt.N,
        userId: command.input.Item.userId.S,
        createdAt: command.input.Item.createdAt.N
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
