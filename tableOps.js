const AWS = require("aws-sdk")

// configure aws region
AWS.config.update({ region: "us-east-1" })
// create a dynamodb instance
const dynamo = new AWS.DynamoDB()

// list all the tables in the database
const listTables = async () => {
  const tables = await dynamo.listTables().promise()
  console.log("Tables: ", tables.TableNames)
}

// describe all the tables in the database
const describeTables = async () => {
  const tables = await dynamo.listTables().promise()
  for (let table of tables.TableNames) {
    const description = await dynamo.describeTable({ TableName: table }).promise()
    console.log("Table Description: ", description.Table)
  }
}

// create table
const createTable = async (name) => {
  const params = {
    TableName: name,
    AttributeDefinitions: [
      {
        AttributeName: "id",
        AttributeType: "S"
      },
      {
        AttributeName: "timestamp",
        AttributeType: "N"
      }
    ],
    KeySchema: [
      {
        AttributeName: "id",
        KeyType: "HASH"
      },
      {
        AttributeName: "timestamp",
        KeyType: "RANGE"
      }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 1,
      WriteCapacityUnits: 1
    }
  }
  const data = await dynamo.createTable(params).promise()
  console.log("Table Created: ", data.TableDescription.TableName)
}

// update table provisioned throughput
const updateTableProvisionedThroughput = async (name) => {
  const params = {
    TableName: name,
    ProvisionedThroughput: {
      ReadCapacityUnits: 2,
      WriteCapacityUnits: 2
    }
  }

  const data = await dynamo.updateTable(params).promise()
  console.log("Table Updated: ", data.TableDescription.TableName)
}

// delete table
const deleteTable = async (name) => {
  const params = {
    TableName: name
  }

  const data = await dynamo.deleteTable(params).promise()
  console.log("Table Deleted: ", data.TableDescription.TableName)
}

// sleep function
const sleep = (ms) => {
  console.log("Sleeping for " + ms + " milliseconds")
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// create document client
const docClient = new AWS.DynamoDB.DocumentClient()

//

const run = async () => {
  await listTables()
  await describeTables()

  await createTable("testTable")
  await sleep(5000)

  await updateTableProvisionedThroughput("testTable")
  await sleep(5000)

  await deleteTable("testTable")
}

module.exports = run
