/* Amplify Params - DO NOT EDIT
	API_AIRBC_GRAPHQLAPIENDPOINTOUTPUT
	API_AIRBC_GRAPHQLAPIIDOUTPUT
	API_AIRBC_GRAPHQLAPIKEYOUTPUT
	ENV
	REGION
Amplify Params - DO NOT EDIT */

const GRAPHQL_ENDPOINT = process.env.API_AIRBC_GRAPHQLAPIENDPOINTOUTPUT
const GRAPHQL_API_KEY = process.env.API_AIRBC_GRAPHQLAPIKEYOUTPUT

const queryImage = /* GraphQL */ `
  mutation CREATE_IMAGE($input: CreateImageInput!) {
    createImage(input: $input) {
      id
      itemKey
    }
  }
`
const queryVideo = /* GraphQL */ `
  mutation CREATE_VIDEO($input: CreateVideo!) {
    createVideo(input: $input) {
      id
      itemKey
    }
  }
`

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
export const handler = async (event) => {
  console.log('Received S3 event:', JSON.stringify(event, null, 2))
  const bucket = event.Records[0].s3.bucket.name
  const itemKey = event.Records[0].s3.object.key
  console.log(`Bucket: ${bucket}`, `Key: ${itemKey}`)

  const variables = { input: { id: itemKey, itemKey } }

  /** @type {import('node-fetch').RequestInit} */
  const options = {
    method: 'POST',
    headers: {
      'x-api-key': GRAPHQL_API_KEY,
    },
    body: JSON.stringify({
      query: itemKey.includes('.mp4') ? queryVideo : queryImage,
      variables,
    }),
  }

  const request = new Request(GRAPHQL_ENDPOINT, options)

  let statusCode = 200
  let body
  let response

  try {
    response = await fetch(request)
    body = await response.json()
    if (body.errors) statusCode = 400
  } catch (error) {
    statusCode = 400
    body = {
      errors: [
        {
          status: response.status,
          message: error.message,
          stack: error.stack,
        },
      ],
    }
  }

  return {
    statusCode,
    body: JSON.stringify(body),
  }
}
