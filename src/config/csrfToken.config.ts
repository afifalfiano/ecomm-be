/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
export const doubleCsrfOptions: any = {
  getSecret: () => process.env.CSRF_SECRET || 'my-secret', // A function that optionally takes the request and returns a secret
  cookieName: '__csrf-secret', // The name of the cookie to be used, recommend using Host prefix.
  cookieOptions: {
    sameSite: 'lax', // Recommend you make this strict if possible
    path: '/',
    secure: true,
    httpOnly: true,
    // Define or remove remainingCookieOptions if not needed
  },
  size: 32, // The size of the random value used to construct the message used for hmac generation
  ignoredMethods: ['GET', 'HEAD', 'OPTIONS'], // A list of request methods that will not be protected.
  getCsrfTokenFromRequest: (req) => req.headers['x-csrf-token'], // A function that returns the token from the request
};

