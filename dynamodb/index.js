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

// put item
const putItem = async (table, item) => {
  const params = {
    TableName: table,
    Item: item
  }

  const data = await docClient.put(params).promise()
  console.log("Item Inserted: ", data)
}

// get item
const getItem = async (table, key) => {
  const params = {
    TableName: table,
    Key: key
  }

  const data = await docClient.get(params).promise()
  console.log("Item Retrieved: ", data)
}
// delete item
const deleteItem = async (table, key) => {
  const params = {
    TableName: table,
    Key: key
  }

  const data = await docClient.delete(params).promise()
  console.log("Item Deleted: ", data)
}

// update item
const updateItem = async (table, key, updateExpression, ExpressionAttributeNames, expressionAttributeValues) => {
  const params = {
    TableName: table,
    Key: key,
    UpdateExpression: updateExpression,
    ExpressionAttributeNames: ExpressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues,
    ReturnValues: "UPDATED_NEW"
  }

  const data = await docClient.update(params).promise()
  console.log("Item Updated: ", data)
}

// batch write
const batchWrite = async (table, items) => {
  const params = {
    RequestItems: {
      [table]: items
    }
  }

  const data = await docClient.batchWrite(params).promise()
  console.log("Batch Write: ", data)
}

// get all the items in a table
const scanTable = async (table) => {
  const params = {
    TableName: table
  }

  const data = await docClient.scan(params).promise()
  console.log("Scan Table: ", data)
}

// delete all the items in a table
const deleteAllItems = async (table) => {
  const params = {
    TableName: table
  }

  const data = await docClient.scan(params).promise()
  for (let item of data.Items) {
    await deleteItem(table, { id: item.id, timestamp: item.timestamp })
  }
}

// conditional put item
const conditionalPutItem = async (table, item, conditionExpression, expressionAttributeNames, expressionAttributeValues) => {
  const params = {
    TableName: table,
    Item: item,
    ConditionExpression: conditionExpression,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues
  }
  try {
    const data = await docClient.put(params).promise()
    console.log("Conditional Put Item: ", data)
  } catch (err) {
    if (err.code === "ConditionalCheckFailedException") {
      return console.log("Conditional Put Item: ", err.message)
    }
    throw err
  }
}

// pagination scan
const paginationRead = async (table, limit) => {
  let lastEvaluatedKey = null
  do {
    const params = {
      TableName: table,
      Limit: limit,
      ExclusiveStartKey: lastEvaluatedKey
    }
    const data = await docClient.scan(params).promise()
    console.log("Pagination Read: ", data)
    lastEvaluatedKey = data.LastEvaluatedKey
  } while (lastEvaluatedKey)
}

const run = async () => {
  await listTables()
  await describeTables()

  await createTable("testTable")
  await listTables()
  await sleep(10000)

  await updateTableProvisionedThroughput("testTable")
  await sleep(10000)

  await putItem("testTable", { id: "1", timestamp: 1, name: "test" })
  await getItem("testTable", { id: "1", timestamp: 1 })
  await updateItem("testTable", { id: "1", timestamp: 1 }, "set #n = :name", { "#n": "name" }, { ":name": "test2" })
  await getItem("testTable", { id: "1", timestamp: 1 })
  await deleteItem("testTable", { id: "1", timestamp: 1 })

  await batchWrite("testTable", [
    { PutRequest: { Item: { id: "1", timestamp: 1, name: "test" } } },
    { PutRequest: { Item: { id: "2", timestamp: 2, name: "test2" } } }
  ])

  await scanTable("testTable")
  await deleteAllItems("testTable")

  await conditionalPutItem("testTable", { id: "1", timestamp: 1, name: "test" }, "attribute_not_exists(#id)", { "#id": "id" })
  await putItem("testTable", { id: "2", timestamp: 1, name: "test" })
  await conditionalPutItem("testTable", { id: "2", timestamp: 1, name: "test" }, "attribute_not_exists(#id)", { "#id": "id" })
  await scanTable("testTable")
  await deleteAllItems("testTable")

  // create random items
  for (let i = 1; i <= 22; i++) {
    await putItem("testTable", { id: i.toString(), timestamp: new Date().getTime(), name: `test-name-number-${i}` })
  }
  await paginationRead("testTable", 5)

  await deleteTable("testTable")
}

run()
