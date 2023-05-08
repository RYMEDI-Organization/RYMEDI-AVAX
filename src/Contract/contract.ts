import Web3 from "web3";
import { Contract } from "web3-eth-contract";
import { Accounts } from "../Account/Account";
import Transaction from "../Ledger/Ledger";
import EventFetcher from "./EventFetcher/eventFetcher";
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
  public EventFetcher: EventFetcher
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
    this.EventFetcher = new EventFetcher(this.contract)
    this.createSignedTx = this.transaction["createSignedTransaction"] as (
      payload: TransactionPayload,
      privateKey?: string
    ) => Promise<SignedTransaction>;
    this.sendSignedTx = this.transaction["sendSignedTransaction"] as (
      signedTransactionData: string
    ) => Promise<SendSignedTransactionResponse>;
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
      const gasPrice = await this.web3.eth.getGasPrice();
      const address = this.web3.eth.accounts.privateKeyToAccount(signerPrivateKey).address;
      const data = this.contract.methods.addRecord(key, value);
      //estimating the gasLimit of keys and values we passed in Bulk Records
      const gasLimit = await data.estimateGas({
        from: address
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
