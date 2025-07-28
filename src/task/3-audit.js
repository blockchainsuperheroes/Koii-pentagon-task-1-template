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

    return true;
  } catch (error) {
    console.error('Error getting Audit on:', error);
    return false;
  }
}
