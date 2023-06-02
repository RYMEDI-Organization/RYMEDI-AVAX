import Web3 from "web3";
import ILedger from "./ILedger";
import { TransactionDetails, TransactionReceipt } from "./LedgerTypes";
/**
 * Class representing a Transaction
 */
declare class Ledger implements ILedger {
    private web3;
    private accounts;
    private getNonce;
    private currentAddress;
    /**
     * @param {string} providerUrl - The web3 provider URL
     * @param {string} privateKeys - The default private key to sign the transactions
     */
    constructor(web3: Web3, privateKeys: string[]);
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
     * Create signed transaction for all different payloads of transactions
     * @param {TransactionPayload} payload - The transaction object
     * @param {string} privateKey - If a private key is provided, use that to sign the transaction, otherwise use the default private key
     * @returns {Promise<SignedTransaction>} - The signed transaction object
     */
    private createSignedTransaction;
    /**
     * Sends an already signed transaction.
     * @param {string} signedTransactionData - Signed transaction data in HEX format
     * @returns {Promise<SendSignedTransactionResponse>} - The transaction response
     */
    private sendSignedTransaction;
    /**
     * Retrieves the current gas price(in wei) from the blockchain network
     * @returns {Promise<string>} - gas price
     */
    private getGasPrice;
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
export default Ledger;
