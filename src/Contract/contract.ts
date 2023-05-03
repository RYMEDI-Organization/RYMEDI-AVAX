import Web3 from "web3";
import { Accounts } from "../Account/Account";
import Transaction from "../Transaction/Transaction";
import { IRecord } from "./IContract";
import { AbiItem } from "web3-utils";
import {
  TransactionPayload,
  SignedTransaction,
  SendSignedTransactionResponse,
} from "../Transaction/TransactionTypes";

class SmartContract {
  private readonly contractAddress: string;
  private readonly web3: Web3;
  private readonly PrivateKeys: string[];
  private readonly contract: any;
  private accounts: Accounts;
  private transaction: Transaction;
  constructor(
    contractAddress: string,
    abi: AbiItem | AbiItem[],
    privateKeys: string[],
    providerUrl: Web3
  ) {
    this.contractAddress = contractAddress;
    this.web3 = providerUrl;
    this.PrivateKeys = privateKeys;
    this.contract = new this.web3.eth.Contract(abi, contractAddress);
    this.accounts = new Accounts(providerUrl, privateKeys);
    this.transaction = new Transaction(providerUrl, privateKeys);
  }
  /**
   * Pushes data to the blockchain by invoking the smart contract function that writes a record.
   * The transaction is signed with the provided private key.
   * @param key The key of the record to write.
   * @param value The value of the record to write.
   * @param {string} privateKey - If a private key is provided, use that to sign the transaction, otherwise use the default private key
   * @returns The transaction hash of the submitted transaction.
   */
  public async pushRecord(
    key: string,
    value: string,
    privateKey?: string
  ): Promise<string> {
    try {
      const signerPrivateKey = this.PrivateKeys[0];
      const gasPrice = await this.web3.eth.getGasPrice();

      const data = this.contract.methods.pushRecord(key, value);
      //estimating the gasLimit of keys and values we passed in Bulk Records
      const gasLimit = await data.estimateGas();
      const tx: TransactionPayload = {
        from: this.web3.eth.accounts.privateKeyToAccount(signerPrivateKey)
          .address,
        to: this.contractAddress,
        gasPrice: gasPrice,
        gasLimit: gasLimit,
        data: data.encodeABI(),
      };
      const createSignTx = this.transaction["createSignedTransaction"] as (
        payload: TransactionPayload,
        privateKey?: string
      ) => Promise<SignedTransaction>;
      const signedTx = await createSignTx.call(
        this.transaction,
        tx,
        signerPrivateKey as string
      );
      const sendSignedTxMethod = this.transaction["sendSignedTransaction"] as (
        signedTransactionData: string
      ) => Promise<SendSignedTransactionResponse>;

      const txReceipt = await sendSignedTxMethod.call(
        this.transaction,
        signedTx.rawTransaction
      );
      return txReceipt.transactionHash;
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
}

export default SmartContract;
