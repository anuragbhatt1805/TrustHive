// AWS Lambda handler entry point
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { AuthLambdaRequest, AuthLambdaResponse, handleAuth } from './main';

export const handler = async (
  event: APIGatewayProxyEvent,
  _context: Context
): Promise<APIGatewayProxyResult> => {
  // eslint-disable-next-line no-console
  console.log('Lambda function invoked with event:', JSON.stringify(event, null, 2));

  try {
    // Parse the request body
    let authRequest: AuthLambdaRequest;
    
    if (event.body) {
      authRequest = JSON.parse(event.body);
    } else {
      // Handle GET request with query parameters
      authRequest = {
        action: event.queryStringParameters?.action || '',
        email: event.queryStringParameters?.email,
        password: event.queryStringParameters?.password,
        token: event.queryStringParameters?.token
      };
    }

    // Process the auth request
    const authResponse: AuthLambdaResponse = await handleAuth(authRequest);

    // Return the Lambda response
    return {
      statusCode: authResponse.statusCode,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,Authorization',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
      },
      body: JSON.stringify({
        message: authResponse.message,
        data: authResponse.data
      })
    };

  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error processing request:', error);

    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        message: 'Internal server error'
      })
    };
  }
};
