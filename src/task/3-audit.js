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
    // if (!submission || submission === 'false') {
    //   console.error('No submission data found.');
    //   return false;
    // }

    console.log('DEBUG: Submission data:', submission, submission === 'false');

    const publicKey = await namespaceWrapper.getMainAccountPubkey();
    const pentagon_games_email = process.env.PENTAGON_LOGIN_EMAIL;

    console.log('DEBUG: Public key:', publicKey);
    console.log('DEBUG: Pentagon games email:', pentagon_games_email);

    const isValid = await validateSubmitterForDistribution(
      publicKey,
      pentagon_games_email,
    );

    console.log('DEBUG: Validation result:', isValid);

    return true;
    // return isValid;
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

  console.log('DEBUG: Starting validation for distribution');
  console.log('DEBUG: Endpoint:', USER_DISTRIBUTION_ENDPOINT);

  try {
    const payload = {
      koii_main_account_pubkey:
        publicKey || '0000000000000000000000000000000000000000',
      email: pentagon_games_email,
    };

    console.log('DEBUG: Payload being sent:', payload);

    const config = {
      method: 'post',
      url: `${USER_DISTRIBUTION_ENDPOINT}/validate-distribution`,
      headers: {
        'x-api-key': X_API_KEY,
        'Content-Type': 'application/json',
      },
      data: JSON.stringify(payload),
    };

    console.log('DEBUG: Making API request to validate distribution');
    const response = await axios.request(config);
    console.log('DEBUG: API response status:', response.status);
    console.log('DEBUG: API response data:', response.data);

    const { data } = response?.data;
    console.log('DEBUG: Extracted data from response:', data);
    console.log('DEBUG: Distributable value:', data?.distributable);

    return data?.distributable ?? false;
  } catch (error) {
    console.error('DEBUG: Error in validateSubmitterForDistribution');
    console.error('DEBUG: Error message:', error.message);
    console.error('DEBUG: Error response data:', error?.response?.data);
    console.error('DEBUG: Full error:', error);
    console.error(
      'Error validating submitter for distribution:',
      error?.response?.data || error.message,
    );
    return false;
  }
}
