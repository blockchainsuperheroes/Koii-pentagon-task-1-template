import { namespaceWrapper } from '@_koii/namespace-wrapper';
import axios from 'axios';

export async function task(roundNumber) {
  // Run your task and store the proofs to be submitted for auditing
  // The submission of the proofs is done in the submission function (see 2-submission.js)
  try {

    // Grab the task_variables
    let twitter_handle = process.env.TWITTER_USERNAME;
    let pentagon_games_email = process.env.PENTAGON_GAMES_EMAIL;
    console.log("PENTAGON_GAMES_EMAIL" + pentagon_games_email);
    console.log("twitter_handle" + twitter_handle);
    // Collect the main wallet account pubkey
    let koii_main_account_pubkey = await namespaceWrapper.getMainAccountPubkey();

    // Check to see if the email exists in Pentagon's system
    let queryResponse = await findUserInPentagon(pentagon_games_email, koii_main_account_pubkey,twitter_handle);

    // (Optional) console.log the information for verbose logs
    //console.log('TWITTER_HANDLE processed by task is:', twitter_handle);
    //console.log('PENTAGON_GAMES_EMAIL processed by task is:', pentagon_games_email);
    //console.log('Koii Main Account Public Key processed by task is:', koii_main_account_pubkey);
    //console.log('queryResponse processed by task is:', queryResponse);

    // Insert functionality below for how the task should handle the data returned from queryResponse
    // async function example(ex) {
    //
    //}

    // Store the result in NeDB
    if (queryResponse) { // For the purpose of having an examplar within the template, we will use queryResponse as our final outcome
      await namespaceWrapper.storeSet('QUERY_RESPONSE', queryResponse);
    }

  } catch (error) {
    console.error('EXECUTE TASK ERROR:', error);
  }

}

async function findUserInPentagon(userData, public_address,twitter_handle) {
  try {
    // Create form data
    const form = new FormData();
    form.append('user_data', userData);  // Pentagon username, email, or Twitter username
    form.append('koii_address', public_address);
    form.append('twitter_username', twitter_handle);
    // Send the POST request to the API
    const response = await axios.post(
      'https://api.account.pentagon.games/user/koii',
      form,
      {
        headers: {
          'api-key': 'bJVNdMzcsxVTcGvcFrHnnlZTcKqkKtVm', // API key
        }
      }
    );

    console.log("RESPONSE DATA:", response.data)
    return response?.data?.status || false;
  } catch (error) {
    console.error('Error in finding user:', error);
    return false;
  }
}