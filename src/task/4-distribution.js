const SLASH_PERCENT = 0.7;

export async function distribution(submitters, bounty, roundNumber) {
  /**
   * Generate the reward list for a given round
   * This function should return an object with the public keys of the submitters as keys
   * and the reward amount as values
   */
  console.log(`MAKE DISTRIBUTION LIST FOR ROUND ${roundNumber}`);
  const distributionList = {};
  const approvedSubmitters = [];
  const startOfDayUTC = new Date(Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), new Date().getUTCDate()));

  // Slash the stake of submitters who submitted incorrect values
  // and make a list of submitters who submitted correct values
  for (const submitter of submitters) {
    if (submitter.votes === 0) {
      distributionList[submitter.publicKey] = 0;
    } else if (submitter.votes < 0) {
      const slashedStake = submitter.stake * SLASH_PERCENT;
      distributionList[submitter.publicKey] = -slashedStake;
      console.log('CANDIDATE STAKE SLASHED', submitter.publicKey, slashedStake);
    } else {
      // check submitter is valid for distribution
      const userData = await validateSubmitterForDistribution(submitter);
      if (!userData?.distributable) {
        console.log('CANDIDATE NOT VALID FOR DISTRIBUTION', submitter.publicKey);
        continue
      } else {
        await updateLastDistributionAt(userData, startOfDayUTC);
      }
      approvedSubmitters.push(submitter.publicKey);
    }
  }
  // reward the submitters who submitted correct values
  const reward = Math.floor(bounty / approvedSubmitters.length);
  console.log('REWARD PER NODE', reward);
  approvedSubmitters.forEach(candidate => {
    distributionList[candidate] = reward;
  });
  return distributionList;
}

const USER_DISTRIBUTION_ENDPOINT = 'http://koii.api.pentagon.games/api';
const X_API_KEY = 'KoiidMzcsxVTcGvcFrHnnlZTcKqkKtPG';

async function validateSubmitterForDistribution(submitter) {
  try {
    const response = await axios.post(
      `${USER_DISTRIBUTION_ENDPOINT}/validate-distribution`,
      {
        koii_main_account_pubkey: submitter.publicKey,
        email: submitter.email
      },
      {
        headers: {
          'x-api-key': X_API_KEY,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log("VALIDATE DISTRIBUTION RESPONSE DATA:", response.data?.data);
    return response.data?.data;
  } catch (error) {
    console.error('Error validating submitter for distribution:', error);
    return null
  }
}


async function updateLastDistributionAt(user, newDistributionDate) {
  try {
    const response = await axios.put(
      `${USER_DISTRIBUTION_ENDPOINT}/user/${user.id}`,
      {
        koii_main_account_pubkey: user.koii_main_account_pubkey,
        email: user.email,
        last_distribution_at: newDistributionDate
      },
      {
        headers: {
          'x-api-key': X_API_KEY,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log("UPDATE LAST DISTRIBUTION", response.data?.data);
    return response.data?.data;
  } catch (error) {
    console.error('Error updating last distribution at:', error);
    return null
  }
}
