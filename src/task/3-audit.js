import axios from 'axios';
import { namespaceWrapper } from '@_koii/namespace-wrapper';
export async function audit(submission, roundNumber) {
  /**
   * Audit a submission
   * This function should return true if the submission is correct, false otherwise
   */
  console.log(`AUDIT SUBMISSION FOR ROUND ${roundNumber}`);

  // for clarity
  const queryResponse = submission;

  let vote = false;
  const publicKey =  await namespaceWrapper.getMainAccountPubkey();
  const pentagon_games_email = process.env.PENTAGON_GAMES_EMAIL;
  const USER_DISTRIBUTION_ENDPOINT = 'http://koii.api.pentagon.games/api';
  const X_API_KEY = 'KoiidMzcsxVTcGvcFrHnnlZTcKqkKtPG';
  const userData = await validateSubmitterForDistribution(publicKey,pentagon_games_email);
  async function validateSubmitterForDistribution(publicKey,pentagon_games_email) {
    try {
      let data = JSON.stringify({
        "koii_main_account_pubkey": publicKey || "0000000000000000000000000000000000000000",
        "email": pentagon_games_email
      });
      console.log("data" + data);
      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://koii.api.pentagon.games/api/validate-distribution',
        headers: { 
          'x-api-key': 'KoiidMzcsxVTcGvcFrHnnlZTcKqkKtPG', 
          'Content-Type': 'application/json'
        },
        data : data
      };
      const response = await axios.request(config);
      console.log("VALIDATE DISTRIBUTION RESPONSE DATA:", response.data?.data);
      return response?.data?.data || false;
    } catch (error) {
      console.error('Error validating submitter for distribution:', error);
      return false;
    }
  }

  if (queryResponse != false) {
    vote = true;
  }

  return vote;
}
