import { Authenticator } from 'fastify-passport';

export function registerPassportSerializer(authenticator: Authenticator) {
  console.log(authenticator);
}
