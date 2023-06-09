/**
 * Interface for transaction details
 * @interface TransactionDetails
 * @property {string} blockHash - Hash of the block that contains the transaction
 * @property {number} blockNumber - Number of the block that contains the transaction
 * @property {string} from - Address of the sender of the transaction
 * @property {number} gas - Gas limit of the transaction
 * @property {string} gasPrice - Gas price of the transaction in wei
 * @property {string} maxFeePerGas - Maximum fee per gas allowed for the transaction in wei
 * @property {string} maxPriorityFeePerGas - Maximum priority fee per gas allowed for the transaction in wei
 * @property {string} hash - Hash of the transaction
 * @property {string} input - Input data of the transaction
 * @property {number} nonce - Nonce of the transaction
 * @property {string} to - Address of the receiver of the transaction
 * @property {number} transactionIndex - Index of the transaction within the block
 * @property {string} value - Value transferred in the transaction in wei
 * @property {number} type - Type of the transaction (0 for legacy, 1 for EIP-1559)
 * @property {any[]} accessList - Access list of the transaction
 * @property {string} chainId - Chain ID of the transaction
 * @property {string} v - Recovery value of the transaction signature
 * @property {string} r - R value of the transaction signature
 * @property {string} s - S value of the transaction signature

 */
export interface TransactionDetails {
  blockHash: string;
  blockNumber: number;
  from: string;
  gas: number;
  gasPrice: string;
  maxFeePerGas: string;
  maxPriorityFeePerGas: string;
  hash: string;
  input: string;
  nonce: number;
  to: string;
  transactionIndex: number;
  value: string;
  type: number;
  accessList: any[];
  chainId: string;
  v: string;
  r: string;
  s: string;
}

/**

Interface for transaction receipt
 * @interface TransactionReceipt
 * @property {string} blockHash - Hash of the block that contains the transaction
 * @property {number} blockNumber - Number of the block that contains the transaction
 * @property {string} contractAddress - Address of the contract created by the transaction (if any)
 * @property {number} cumulativeGasUsed - Total amount of gas used by the transaction and its preceding transactions
 * @property {number} effectiveGasPrice - Effective gas price of the transaction
 * @property {string} from - Address of the sender of the transaction
 * @property {number} gasUsed - Amount of gas used by the transaction
 * @property {any[]} logs - Log objects generated by the transaction
 * @property {string} logsBloom - Bloom filter of the logs generated by the transaction
 * @property {boolean} status - Status of the transaction (true for success, false for failure)
 * @property {string} to - Address of the receiver of the transaction
 * @property {string} transactionHash - Hash of the transaction
 * @property {number} transactionIndex - Index of the transaction within the block
 * @property {string} type - Type of the transaction (0 for legacy, 1 for EIP-1559)
*/

export interface TransactionReceipt {
  blockHash: string;
  blockNumber: number;
  contractAddress: string;
  cumulativeGasUsed: number;
  effectiveGasPrice: number;
  from: string;
  gasUsed: number;
  logs: any[];
  logsBloom: string;
  status: boolean;
  to: string;
  transactionHash: string;
  transactionIndex: number;
  type: string;
}

/**

  Interface for signed transaction
 * @interface SignedTransaction
 * @property {string} rawTransaction - Raw data of the signed transaction
*/
export interface SignedTransaction {
  rawTransaction: string;
}
/**

  Interface for transaction playload
 * @interface TransactionPayload
 * @property {string} from - address of the sender
 * @property {string} to - address of the recipient
 * @property {string} value - Amount to send, in wei
 * @property {string} data - Data to include in the transaction (optional)
 * @property {string} nonce - Nonce to use for the transaction (optional)
 * @property {string} gasLimit - Maximum amount of gas that can be used for the transaction (optional)
 * @property {string} gasPrice - Gas price to use for the transaction, in wei per gas unit (optional)

*/
export interface TransactionPayload {
  from: string;
  to: string;
  value?: string;
  data?: string;
  nonce?: number;
  gasLimit?: number;
  maxPriorityFeePerGas?: string,
  maxFeePerGas?: string,
}
/** 
Interface for signed transaction response
 * @interface SendSignedTransactionResponse
 * @property {string} transactionHash - transaction Hash
*/
export interface SendSignedTransactionResponse {
  transactionHash: string;
}