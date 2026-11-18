import { CognitoUserPool, type CognitoUserSession } from 'amazon-cognito-identity-js';

export const USER_POOL = new CognitoUserPool({
  UserPoolId: 'us-east-1_9qUKvpTsS',
  ClientId: '7ahpgflc95213blskltlrk4rsi',
});

export function getIdToken(): Promise<string> {
  return new Promise((resolve, reject) => {
    const user = USER_POOL.getCurrentUser();
    if (!user) return reject(new Error('No user session'));
    user.getSession((err: Error | null, session: CognitoUserSession | null) => {
      if (err || !session) return reject(err ?? new Error('No session'));
      resolve(session.getIdToken().getJwtToken());
    });
  });
}

export async function authHeaders(): Promise<HeadersInit> {
  try {
    const token = await getIdToken();
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
  } catch {
    return { 'Content-Type': 'application/json' };
  }
}
