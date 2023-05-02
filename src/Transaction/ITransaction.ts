import {
  TransactionDetails,
  TransactionReceipt,
  SignedTransaction,
  TransactionPayload
} from "./TransactionTypes";

/**
 * Interface representing a transaction methods on the Ethereum blockchain.
 */
export default interface ITransaction {
  /**
   * Get transaction details/status from blockchain for any provided transaction ID
   * @param {string} transactionId - The transaction ID
   * @returns {Promise<TransactionDetails>} - The transaction object
   */
  fetchTransactionDetails(transactionId: string): Promise<TransactionDetails>;
  /**
   * Get transaction receipt from blockchain providing the ID for it in the input.
   * @param {string} transactionId - The transaction ID
   * @returns {Promise<TransactionReceipt>} - The transaction receipt object
   */
  fetchTransactionReceipt(transactionId: string): Promise<TransactionReceipt>;
  /**
   * Create signed transaction for all different payloads of transactions
   * @param {any} payload - The transaction object
   * @param {string} privateKey - If a private key is provided, use that to sign the transaction, otherwise use the default private key
   * @returns {Promise<SignedTransaction>} - The signed transaction object
   */
  createSignedTransaction(
    payload: TransactionPayload,
    privateKey?: string
  ): Promise<SignedTransaction>;
  /**
   * Retrieves the current gas price(in wei) from the blockchain network
   * @returns {Promise<string>} - gas price
   */
  getGasPrice(): Promise<string>;
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
