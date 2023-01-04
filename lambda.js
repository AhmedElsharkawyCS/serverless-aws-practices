const AWS = require("aws-sdk")

// configure aws region
AWS.config.update({ region: "us-east-1" })
const lambda = new AWS.Lambda()

// create lambda function
const createLambda = async (name) => {
  const params = {
    Code: {
      ZipFile: "exports.handler = async (event) => { return { message: 'Hello ' + event.name } }"
    },
    FunctionName: name,
    Handler: "index.handler",
    Role: "arn:aws:iam::773636731754:role/lambda-role",
    Runtime: "nodejs18.x"
  }

  const data = await lambda.createFunction(params).promise()
  console.log("Lambda Function Created: ", data.FunctionName)
}

// delete lambda function
const deleteLambda = async (name) => {
  const params = {
    FunctionName: name
  }

  const data = await lambda.deleteFunction(params).promise()
  console.log("Lambda Function Deleted: ", data.FunctionName)
}

// invoke lambda function
const invokeLambda = async (name) => {
  const params = {
    FunctionName: name,
    Payload: JSON.stringify({ name: "John" })
  }

  const data = await lambda.invoke(params).promise()
  console.log("Lambda Function Invoked: ", data.Payload)
}

// list all the lambda functions
const listLambdas = async () => {
  const functions = await lambda.listFunctions().promise()
  console.log("Functions: ", functions.Functions)
}

// describe lambda function
const describeLambda = async (name) => {
  const params = {
    FunctionName: name
  }

  const data = await lambda.getFunction(params).promise()
  console.log("Function Description: ", data.Configuration)
}

const run = async () => {
  // create lambda function
  await createLambda("lambda-function")
  // list all the lambda functions
  await listLambdas()
  // describe lambda function
  await describeLambda("lambda-function")
  // invoke lambda function
  await invokeLambda("lambda-function")
  // delete lambda function
  await deleteLambda("lambda-function")
}

run()
