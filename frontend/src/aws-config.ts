export const awsConfig = {
  Auth: {
    Cognito: {
      userPoolId: 'us-east-2_lEX1Shkb1',
      userPoolClientId: '5bqgfs40sl0dh5e9gsmjk5n718',
      loginWith: {
        oauth: {
          domain: 'us-east-2lex1shkb1.auth.us-east-2.amazoncognito.com',
          scopes: ['openid', 'email', 'profile'],
          redirectSignIn: ['http://localhost:5173/'],
          redirectSignOut: ['http://localhost:5173/'],
          responseType: 'code' as const
        }
      }
    }
  }
};
