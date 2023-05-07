import { TransactionDetails, TransactionReceipt } from "./LedgerTypes";

/**
 * Interface representing a transaction methods on the Ethereum blockchain.
 */
export default interface ILedger {
  /**
   * Get transaction details/status from blockchain for any provided transaction ID
   * @param {string} transactionId - The transaction ID
   * @returns {Promise<TransactionDetails>} - The transaction object
   */
  fetchTransactionDetails(transactionId: string): Promise<TransactionDetails>;
  /**
   * Get block number from blockchain for any provided transaction ID/hash
   * @param {string} transactionHash - The transaction IDs
   * @returns {Promise<number>} - The block number
   */
  getBlockByTransactionHash(transactionHash: string): Promise<number>;
  /**
   * Get transaction receipt from blockchain providing the ID for it in the input.
   * @param {string} transactionId - The transaction ID
   * @returns {Promise<TransactionReceipt>} - The transaction receipt object
   */
  fetchTransactionReceipt(transactionId: string): Promise<TransactionReceipt>;
  /**
   * Retrieves the latest block number from the blockchain network
   * @returns {Promise<number>} - latest block number
   */
  getLatestBlockNumber(): Promise<number>;
  /**
   * Retrieves details of a block on the blockchain network based on its identifier (either block number or block hash)
   * @param blockIdentifier The identifier of the block to retrieve details for
   * @returns A promise that resolves to the block details object or throws an error if the block is not found
   */
  getBlockDetails(blockIdentifier: string | number): Promise<any>;
}
