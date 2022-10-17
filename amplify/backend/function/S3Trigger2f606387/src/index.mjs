/* Amplify Params - DO NOT EDIT
	API_AIRBC_GRAPHQLAPIENDPOINTOUTPUT
	API_AIRBC_GRAPHQLAPIIDOUTPUT
	API_AIRBC_GRAPHQLAPIKEYOUTPUT
	ENV
	REGION
Amplify Params - DO NOT EDIT */

import fetch from 'node-fetch'

const GRAPHQL_ENDPOINT = process.env.API_AIRBC_GRAPHQLAPIENDPOINTOUTPUT
const GRAPHQL_API_KEY = process.env.API_AIRBC_GRAPHQLAPIKEYOUTPUT

const queryImage = /* GraphQL */ `
  mutation CREATE_IMAGE($input: CreateImageInput!) {
    createImage(input: $input) {
      itemKey
    }
  }
`
const queryVideo = /* GraphQL */ `
  mutation CREATE_VIDEO($input: CreateVideoInput!) {
    createVideo(input: $input) {
      itemKey
    }
  }
`

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
export async function handler(event) {
  console.log('Received S3 event:', JSON.stringify(event, null, 2))
  const bucket = event.Records[0].s3.bucket.name
  const itemKey = event.Records[0].s3.object.key
  console.log(`Bucket: ${bucket}`, `Key: ${itemKey}`)

  const variables = { input: { itemKey } }

  /** @type {import('node-fetch').RequestInit} */
  const options = {
    method: 'POST',
    headers: { 'x-api-key': GRAPHQL_API_KEY },
    body: JSON.stringify({
      query: itemKey.includes('.mp4') ? queryVideo : queryImage,
      variables,
    }),
  }

  let statusCode = 200
  let body
  let response

  try {
    response = await fetch(GRAPHQL_ENDPOINT, options)
    console.log({ response })
    body = await response.json()
    console.log({ body })
    if (body.errors) statusCode = 400
  } catch (error) {
    console.log('Fetching error: ', error)
    statusCode = 400
    body = {
      errors: [
        {
          status: error.status,
          message: error.message,
          stack: error.stack,
        },
      ],
    }
  }

  return { statusCode, body }
}

// fetch(
//   'https://w2rxqikjyfh4rampstoyru6fny.appsync-api.ap-northeast-2.amazonaws.com/graphql',
//   {
//     method: 'POST',
//     headers: {
//       'x-api-key': '5mukvlevgbbyppmnyga2jcfg5q',
//     },
//     body: JSON.stringify({
//       query: queryImage,
//       variables: { input: { itemKey: 'abc.jpeg' } },
//     }),
//   },
// )
