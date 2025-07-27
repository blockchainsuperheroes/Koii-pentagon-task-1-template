import axios from 'axios';
import { namespaceWrapper } from '@_koii/task-manager/namespace-wrapper';

export async function audit(submission, roundNumber, submitterKey) {
  /**
   * Audit a submission
   * This function should return true if the submission is correct, false otherwise
   */

  try {
    console.log(
      `AUDIT SUBMISSION FOR ROUND ${roundNumber} from ${submitterKey}`,
    );
    if (!submission || submission === 'false') {
      return false;
    }

    const publicKey = await namespaceWrapper.getMainAccountPubkey();
    const pentagon_games_email = process.env.PENTAGON_LOGIN_EMAIL;

    const isValid = await validateSubmitterForDistribution(
      publicKey,
      pentagon_games_email,
    );

    return isValid;
  } catch (error) {
    console.error('Error getting Audit on:', error);
    return false;
  }
}

async function validateSubmitterForDistribution(
  publicKey,
  pentagon_games_email,
) {
  const USER_DISTRIBUTION_ENDPOINT = 'https://koii.api.pentagon.games/api';
  const X_API_KEY = 'KoiidMzcsxVTcGvcFrHnnlZTcKqkKtPG';

  try {
    const payload = {
      koii_main_account_pubkey:
        publicKey || '0000000000000000000000000000000000000000',
      email: pentagon_games_email,
    };

    const response = await axios.post(
      `${USER_DISTRIBUTION_ENDPOINT}/validate-distribution`,
      payload,
      {
        headers: {
          'x-api-key': X_API_KEY,
          'Content-Type': 'application/json',
        },
      },
    );

    const { data } = response?.data;

    return data?.distributable ?? false;
  } catch (error) {
    console.error(
      'Error validating submitter for distribution:',
      error?.response?.data || error.message,
    );
    return false;
  }
}
