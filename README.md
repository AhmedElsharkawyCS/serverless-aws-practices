# aws-practices

This repository contains some practices with AWS services with some applications.

## Table of Contents

- [DynamoDB](#dynamodb)
- [Lambda](#lambda)
- [Step Functions](#step-functions)
- [S3](#s3)
- [API Gateway](#api-gateway)
- [CloudWatch](#cloudwatch)
- [Route53](#route53)
- [ACM](#acm)
- [IAM](#iam)
- [Serverless](#serverless)
- [Applications](#applications)

## DynamoDB

- Created some table operations like create, describe, list, delete.
- Created some item operations like put, get, update, delete.
- Created some query operations like query, scan, batch write, pagination scan.

## Lambda

- Create a lambda function
- Create a lambda function with a custom runtime
- Delete a lambda function
- Invoke a lambda function

## Step Functions

- Create a step function to run a lambda function
- Delete a step function
- Invoke a step function
- Run multiple lambda functions in parallel

## S3

- Create a bucket
- Delete a bucket
- Upload a file to a bucket
- Add trigger to a bucket

## API Gateway

- Create a REST API
- Create a resource and customize the responses
- create API Gateway Authorizer
- Link API Gateway to a lambda function

## CloudWatch

- Create a CloudWatch Log Group
- Create a scheduled CloudWatch Event
- Retrieve logs from a CloudWatch Log Group

## Route53

- Create a custom domain
- Create a hosted zone

## ACM

- Create a ssl certificate to a custom domain

## IAM

- Create a users, role and policy
- Attach a policy to a role
- Attach a role to a user
- Delete a user, role and policy

## Serverless

- Create a serverless application
- Create a lambda function with a custom runtime
- Delete a serverless application
- Invoke a lambda function locally
- Create API Gateway with a lambda function

## Applications

### Notes-Backend-APIs

- Create a serverless application with the following services:
  - DynamoDB
  - Lambda
  - API Gateway
  - IAM
  - Serverless

#### Requirements

- Node.js
- Serverless Framework
- AWS IAM User

#### Scripts

- install dependencies

```bash
cd notes-backend-apis && yarn install

```

- deploy the application using serverless framework

```bash
serverless deploy

```

- remove the application using serverless framework

```bash
serverless remove

```

- run the application locally

```bash
yarn offline

```

#### API Documentation

[API Documentation/Postman](https://documenter.getpostman.com/view/6200920/2s93JnUSGY)
