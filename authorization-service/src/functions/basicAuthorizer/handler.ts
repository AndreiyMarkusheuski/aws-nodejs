import isDefined from "src/utils/tools/is-defined";

const generatePolicy = (principalId, effect, resource) => ({
  principalId,
  policyDocument: {
    Version: '2012-10-17',
    Statement: [
      {
        Action: 'execute-api:Invoke',
        Effect: effect,
        Resource: resource,
      },
    ],
  },
});

const basicAuthorizer = (event, context, callback) => {
  console.log('"basicAuthorizer": ', event);

  try {
    if (event.type !== 'TOKEN') {
      callback('Unauthorized: missing token');
    }

    const { authorizationToken = '', methodArn } = event || {};
    console.log('Authorization Token: ', authorizationToken);

    const [, token] = authorizationToken.split(' ');
    console.log('Token', token);
    if (!isDefined(token)) {
      callback(null, generatePolicy('login', 'Deny', methodArn));
    }

    const encodedToken = Buffer.from(token, 'base64').toString();
    const [login, password] = encodedToken.split(':');

    console.log('Login: ', login, 'Password: ', password);

    if (!isDefined(process.env[login])) {
      console.log('non-existing login');
      callback('Unauthorized');
    }

    const isValidLogin = password === process.env[login];
    const effect = isValidLogin ? 'Allow' : 'Deny';

    return callback(null, generatePolicy(login, effect, methodArn));
  } catch (e) {
    console.log('Error: ', e);
    return callback('Unauthorized', e);
  }
};

export const main = basicAuthorizer;
