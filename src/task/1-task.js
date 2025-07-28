import { namespaceWrapper } from '@_koii/task-manager/namespace-wrapper';
import axios from 'axios';

export async function task(roundNumber) {
  console.log('Main task called with round', roundNumber);
  try {
    // Grab the task_variables
    let twitter_handle = process.env.PG_LOGIN_TIED_TWITTER_ACCT;
    let pentagon_games_email = process.env.PENTAGON_LOGIN_EMAIL;
    let koii_main_account_pubkey =
      await namespaceWrapper.getMainAccountPubkey();
    // Check to see if the email exists in Pentagon's system
    let queryResponse = await findUserInPentagon(
      pentagon_games_email,
      koii_main_account_pubkey,
      twitter_handle,
    );

    let result = false;

    if (queryResponse) {
      const isValid = await validateSubmitterForDistribution(
        koii_main_account_pubkey,
        pentagon_games_email,
      );

      if (isValid) {
        result = true;
      }
    }

    await namespaceWrapper.storeSet(`${roundNumber}`, `${result}`);
  } catch (error) {
    console.error('EXECUTE TASK ERROR:', error);
  }
}

async function findUserInPentagon(userData, public_address, twitter_handle) {
  try {
    // Create form data
    const form = new FormData();
    form.append('user_data', userData); // Pentagon username, email, or Twitter username
    form.append('koii_address', public_address);
    form.append('twitter_username', twitter_handle);
    // Send the POST request to the API
    const response = await axios.post(
      'https://api.account.pentagon.games/user/koii',
      form,
      {
        headers: {
          'api-key': 'bJVNdMzcsxVTcGvcFrHnnlZTcKqkKtVm', // API key
        },
      },
    );
    return response?.data?.status || false;
  } catch (error) {
    console.error('Error in finding user:', error);
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
