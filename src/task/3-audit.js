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
      const url = `${USER_DISTRIBUTION_ENDPOINT}/user-by-mail/${pentagon_games_email}`;
      const userResponse = await axios.get(url);
    //user exists
      if (userResponse.data.status === 200) {
        vote = false;
        return userResponse.data?.data || false;
      } 
    } catch (error) {
      if (error.response && error.response.status === 404) { // no user

        try {
          const data = JSON.stringify({
          "koii_main_account_pubkey": publicKey || "0000000000000000000000000000000000000000",
          "email": pentagon_games_email
        });
    
        const config = {
          method: 'post',
          maxBodyLength: Infinity,
          url: `${USER_DISTRIBUTION_ENDPOINT}/validate-distribution`,
          headers: { 
            'x-api-key': X_API_KEY, 
            'Content-Type': 'application/json'
          },
          data: data
        };
        
        const validateResponse = await axios.request(config);
        vote = true;
        return validateResponse?.data?.data || false;
      } catch (error) {
        console.error("Error validating submitter for distribution:", error);
        return false;
      }
      }
      console.error("Error getting user info:", error);
      return false;
    }
    
  }

  if (queryResponse == false) {
    
    vote = false;
  }

  return vote;
}
