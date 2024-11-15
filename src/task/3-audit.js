export async function audit(submission, roundNumber) {
  /**
   * Audit a submission
   * This function should return true if the submission is correct, false otherwise
   */
  console.log(`AUDIT SUBMISSION FOR ROUND ${roundNumber}`);

  // for clarity
  const queryResponse = submission;

  let vote = false;

  if (queryResponse != false) {
    vote = true;
  }

  return vote;
}
