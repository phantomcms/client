import { checkExistingAuthentication } from '../store/actions';

/**
 * The code to be executed should be placed within a default function that is
 * exported by the global script. Ensure all of the code in the global script
 * is wrapped in the function() that is exported.
 */
export default async () => {
  // check existing token with API
  checkExistingAuthentication();
};
