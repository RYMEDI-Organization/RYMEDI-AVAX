import Web3 from "web3";
import ITransaction from "./ITransaction";
import { Accounts } from "../Account/Account";
import {
  TransactionDetails,
  TransactionReceipt,
  SignedTransaction,
  TransactionPayload,
  SendSignedTransactionResponse,
} from "./TransactionTypes";

/**
 * Class representing a Transaction
 */
class Transaction implements ITransaction {
  private web3: Web3;
  private defaultPrivateKey: string;
  private accounts: Accounts;

  /**
   * @param {string} providerUrl - The web3 provider URL
   * @param {string} defaultPrivateKey - The default private key to sign the transactions
   */
  constructor(web3: Web3, defaultPrivateKey: string[]) {
    this.web3 = web3;
    this.defaultPrivateKey = defaultPrivateKey[0];
    this.accounts = new Accounts(this.web3, defaultPrivateKey);
  }

  /**
   * Get transaction details/status from blockchain for any provided transaction ID
   * @param {string} transactionId - The transaction ID
   * @returns {Promise<TransactionDetails>} - The transaction object
   */
  async fetchTransactionDetails(
    transactionId: string
  ): Promise<TransactionDetails> {
    try {
      const transaction = await this.web3.eth.getTransaction(transactionId);
      if (!transaction) {
        throw new Error(`Transaction details for ${transactionId} not found`);
      }
      return transaction as TransactionDetails;
    } catch (error: any) {
      throw new Error(`Failed to fetch transaction details: ${error.message}`);
    }
  }

  /**
   * Get transaction receipt from blockchain providing the ID for it in the input.
   * @param {string} transactionId - The transaction ID
   * @returns {Promise<TransactionReceipt>} - The transaction receipt object
   */
  async fetchTransactionReceipt(
    transactionId: string
  ): Promise<TransactionReceipt> {
    try {
      const receipt = await this.web3.eth.getTransactionReceipt(transactionId);
      if (!receipt) {
        throw new Error(`Transaction receipt for ${transactionId} not found`);
      }
      return receipt as TransactionReceipt;
    } catch (error: any) {
      throw new Error(`Failed to fetch transaction receipt: ${error.message}`);
    }
  }

  /**
   * Create signed transaction for all different payloads of transactions
   * @param {TransactionPayload} payload - The transaction object
   * @param {string} privateKey - If a private key is provided, use that to sign the transaction, otherwise use the default private key
   * @returns {Promise<SignedTransaction>} - The signed transaction object
   */
  private async createSignedTransaction(
    payload: TransactionPayload,
    privateKey?: string
  ): Promise<SignedTransaction> {
    try {
      const signerPrivateKey = privateKey || this.defaultPrivateKey;
      const nonce: number = await this.accounts.getNonce(payload.from);
      const tx: TransactionPayload = {
        ...payload,
        nonce,
      };
      this.accounts.incrementNonce(payload.from);
      const signedTransaction = await this.web3.eth.accounts.signTransaction(
        tx,
        signerPrivateKey
      );
      return {
        rawTransaction: signedTransaction.rawTransaction as string,
      };
    } catch (error: any) {
      throw new Error(`Failed to create signed transaction: ${error.message}`);
    }
  }

  /**
   * Sends an already signed transaction.
   * @param {string} signedTransactionData - Signed transaction data in HEX format
   * @returns {Promise<SendSignedTransactionResponse>} - The transaction response
   */
  private async sendSignedTransaction(
    signedTransactionData: string
  ): Promise<SendSignedTransactionResponse> {
    try {
      const result = await this.web3.eth.sendSignedTransaction(
        signedTransactionData
      );
      return {
        transactionHash: result.transactionHash as string,
      };
    } catch (error: any) {
      throw new Error(`Failed to create signed transaction: ${error.message}`);
    }
  }
  /**
   * Retrieves the current gas price(in wei) from the blockchain network
   * @returns {Promise<string>} - gas price
   */
  private async getGasPrice(): Promise<string> {
    try {
      const gasPrice = await this.web3.eth.getGasPrice();

      return gasPrice;
    } catch (error: any) {
      throw new Error(`Failed to get average gas fee: ${error.message}`);
    }
  }
  /**
   * Retrieves the latest block number from the blockchain network
   * @returns {Promise<number>} - latest block number
   */
  async getLatestBlockNumber(): Promise<number> {
    try {
      const latestBlock = await this.web3.eth.getBlock("latest");
      return latestBlock.number;
    } catch (error: any) {
      throw new Error(`Failed to get latest block number: ${error.message}`);
    }
  }

  /**
   * Retrieves details of a block on the blockchain network based on its identifier (either block number or block hash)
   * @param blockIdentifier The identifier of the block to retrieve details for
   * @returns A promise that resolves to the block details object or throws an error if the block is not found
   */

  async getBlockDetails(blockIdentifier: string | number): Promise<any> {
    try {
      const block = await this.web3.eth.getBlock(blockIdentifier);
      if (!block) {
        throw new Error("Block not found");
      }
      return block;
    } catch (error: any) {
      throw new Error(`Failed to get block details: ${error.message}`);
    }
  }
}

export default Transaction;
