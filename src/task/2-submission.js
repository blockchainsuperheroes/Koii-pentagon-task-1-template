import { namespaceWrapper } from '@_koii/namespace-wrapper';

export async function submission(roundNumber) {
  /**
   * Submit the task proofs for auditing
   * Must return a string of max 512 bytes to be submitted on chain
   */
  try {
    // Grab the queryResponse from NeDB
    const queryResponse = await namespaceWrapper.storeGet('QUERY_RESPONSE');
    console.log(`ROUND SUBMISSION LOOKS LIKE ${queryResponse}`);

    // and return for submission
    return queryResponse;
  } catch (error) {
    console.error('MAKE SUBMISSION ERROR:', error);
  }
}
