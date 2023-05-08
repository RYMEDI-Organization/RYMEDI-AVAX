import Web3 from "web3";
import { Contract } from "web3-eth-contract";
import { Accounts } from "../Account/Account";
import Transaction from "../Ledger/Ledger";
import { IRecord } from "./IContract";
import { AbiItem } from "web3-utils";
import {
  TransactionPayload,
  SignedTransaction,
  SendSignedTransactionResponse,
} from "../Ledger/LedgerTypes";
class SmartContract {
  private readonly contractAddress: string;
  private readonly web3: Web3;
  private readonly contract: Contract;
  private accounts: Accounts;
  private transaction: Transaction;
  private readonly createSignedTx: Function;
  private readonly sendSignedTx: Function;
  constructor(
    contractAddress: string,
    abi: AbiItem | AbiItem[],
    privateKeys: string[],
    providerUrl: Web3
  ) {
    this.contractAddress = contractAddress;
    this.web3 = providerUrl;
    this.contract = new this.web3.eth.Contract(abi, contractAddress);
    this.accounts = new Accounts(providerUrl, privateKeys);
    this.transaction = new Transaction(providerUrl, privateKeys);
    this.createSignedTx = this.transaction["createSignedTransaction"] as (
      payload: TransactionPayload,
      privateKey?: string
    ) => Promise<SignedTransaction>;
    this.sendSignedTx = this.transaction["sendSignedTransaction"] as (
      signedTransactionData: string
    ) => Promise<SendSignedTransactionResponse>;
  }

  /**
   * Signs the transaction and sends the transaction.
   * @param data The object of the record to write.
   * @param signerPrivateKey The private key for signing transaction.
   * @returns The transaction hash of the submitted transaction.
   */
  private async signTransaction(data: any, signerPrivateKey: string) {
    //estimating the gasLimit of keys and values we passed in Bulk Records
    try {
      const gasPrice = await this.web3.eth.getGasPrice();
      const address =
        this.web3.eth.accounts.privateKeyToAccount(signerPrivateKey).address;
      const gasLimit = await data.estimateGas({
        from: address,
      });
      const tx: TransactionPayload = {
        from: address,
        to: this.contractAddress,
        gasPrice: gasPrice,
        gasLimit: gasLimit,
        data: data.encodeABI(),
      };

      const signedTx = await this.createSignedTx.call(
        this.transaction,
        tx,
        signerPrivateKey as string
      );
      const txReceipt = await this.sendSignedTx.call(
        this.transaction,
        signedTx.rawTransaction
      );
      return txReceipt.transactionHash;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Pushes data to the blockchain by invoking the smart contract function that writes a record.
   * The transaction is signed with the provided private key.
   * @param key The key of the record to write.
   * @param value The value of the record to write.
   * @returns The transaction hash of the submitted transaction.
   */

  public async pushRecord(key: string, value: string): Promise<string> {
    try {
      const returnPrivateKey = this.accounts["returnPrivateKey"];
      const signerPrivateKey = returnPrivateKey.call(this.accounts);
      const address =
        this.web3.eth.accounts.privateKeyToAccount(signerPrivateKey).address;
      const isSender = await this.contract.methods.isSender(address).call();
      if (isSender) {
        const data = await this.contract.methods.addBulkRecords(key, value);
        const txhash = await this.signTransaction(data, signerPrivateKey);
        return txhash;
      }
      return "";
    } catch (error) {
      throw error;
    }
  }

  /**
   * Pushes data in bulk to the blockchain by invoking the smart contract function that writes a record.
   * The transaction is signed with the provided private key.
   * @param keys The array of keys of the record to write.
   * @param values The array of values of the record to write.
   * @returns The transaction hash of the submitted transaction.
   */

  public async pushBulkRecord(
    keys: string[],
    values: string[]
  ): Promise<string> {
    try {
      const returnPrivateKey = this.accounts["returnPrivateKey"];
      const signerPrivateKey = returnPrivateKey.call(this.accounts);
      const address =
        this.web3.eth.accounts.privateKeyToAccount(signerPrivateKey).address;
      const isSender = await this.contract.methods.isSender(address).call();
      if (isSender) {
        const data = await this.contract.methods.addBulkRecords(keys, values);
        const txhash = await this.signTransaction(data, signerPrivateKey);
        return txhash;
      }
      return "";
    } catch (error) {
      throw error;
    }
  }

  /**
   * Reads a record from the blockchain by invoking the smart contract function that reads a record.
   * @param key The key of the record to read.
   * @returns The value of the record as a string.
   */

  public async readRecord(key: string): Promise<string> {
    try {
      const result = await this.contract.methods.getRecord(key).call();
      return result;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Removes a record from the blockchain by invoking the smart contract function that removes the record.
   * @param key The key of the record to remove.
   * @returns The transaction hash of the submitted transaction.
   */

  public async removeRecord(key: string): Promise<string> {
    try {
      const returnPrivateKey = this.accounts["returnPrivateKey"];
      const signerPrivateKey = returnPrivateKey.call(this.accounts);
      const address =
        this.web3.eth.accounts.privateKeyToAccount(signerPrivateKey).address;
      const isAdmin = await this.contract.methods.isAdmin(address).call();
      if (isAdmin) {
        const data = this.contract.methods.removeRecord(key);
        let txHash = await this.signTransaction(data, signerPrivateKey);
        return txHash;
      }
      return "";
    } catch (error) {
      throw error;
    }
  }

  /**
   * Returns a count of records from the blockchain by invoking the smart contract function.
   * @param key The address of the new Contract.
   * @returns The value of the record as a object of string.
   */
  public async getRecordCount() {
    try {
      const result = await this.contract.methods.recordCount().call();
      return result;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  /**
   * update the address of new smart contract.
   * can only be done by owner.
   * @param key The address of new contract.
   * @returns The transaction hash of the submitted transaction.
   */
  public async updateContractAddress(key: string) {
    try {
      const returnPrivateKey = this.accounts["returnPrivateKey"];
      const signerPrivateKey = returnPrivateKey.call(this.accounts);
      const address =
        this.web3.eth.accounts.privateKeyToAccount(signerPrivateKey).address;
      const isOwner = await this.contract.methods.isOwner(address).call();
      if (isOwner) {
        const data = await this.contract.methods.updateCode(key);
        let txHash = await this.signTransaction(data, signerPrivateKey);
        return txHash;
      }
      return "";
    } catch (error: any) {
      throw new Error(error);
    }
  }
}

export default SmartContract;
