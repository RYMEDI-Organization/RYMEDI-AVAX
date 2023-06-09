import Web3 from "web3";
import { Contract } from "web3-eth-contract";
import { Accounts } from "../Account/Account";
import Transaction from "../Ledger/Ledger";
import EventFetcher from "./EventFetcher/eventFetcher";
import { AbiItem } from "web3-utils";
import {
  TransactionPayload,
  SignedTransaction,
  SendSignedTransactionResponse,
} from "../Ledger/LedgerTypes";
import axios from "axios";
class SmartContract {
  private readonly contractAddress: string;
  private readonly web3: Web3;
  private readonly contract: Contract;
  private accounts: Accounts;
  private transaction: Transaction;
  private storeAbi: AbiItem | AbiItem[];
  public EventFetcher: EventFetcher;
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
    this.EventFetcher = new EventFetcher(this.contract);
    this.createSignedTx = this.transaction["createSignedTransaction"] as (
      payload: TransactionPayload,
      privateKey?: string
    ) => Promise<SignedTransaction>;
    this.sendSignedTx = this.transaction["sendSignedTransaction"] as (
      signedTransactionData: string
    ) => Promise<SendSignedTransactionResponse>;
    this.storeAbi = abi;
  }

  /**
   * Signs the transaction and sends the transaction.
   * @param {TransactionPayload} payload The object of the payload.
   * @param {string} signerPrivateKey The private key for signing transaction.
   * @returns The transaction hash of the submitted transaction.
   */
  private async signTransaction(
    payload: TransactionPayload,
    signerPrivateKey: string
  ) {
    //estimating the gasLimit of keys and values we passed in Bulk Records
    try {
      const signedTx = await this.createSignedTx.call(
        this.transaction,
        payload,
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
      const signerPrivateKey = this.accounts["returnPrivateKey"].call(
        this.accounts
      );
      const address =
        this.web3.eth.accounts.privateKeyToAccount(signerPrivateKey).address;
      const isSender = await this.contract.methods.isSender(address).call();
      if (isSender) {
        try {
          const data = await this.contract.methods.addRecord(key, value);
          const gasPrice = await this.web3.eth.getGasPrice();
          const gasLimit = await data.estimateGas({
            from: address,
          });
          const maxPriorityFeePerGas = await this.getMaximumPrioriityFeeGas();
          const maxFeePerGas = (
            parseInt(gasPrice) + parseInt(maxPriorityFeePerGas)
          ).toString();
          const tx: TransactionPayload = {
            from: address,
            to: this.contractAddress,
            gasLimit: gasLimit,
            data: data.encodeABI(),
            maxPriorityFeePerGas: maxPriorityFeePerGas,
            maxFeePerGas: maxFeePerGas
          };
          const txhash = await this.signTransaction(tx, signerPrivateKey);
          if (txhash.length == 0) {
            throw new Error("Please provide valid arguements");
          } else {
            return txhash;
          }
        } catch {
          throw new Error("Invalid key format, provide key in SHA54 format");
        }
      } else {
        throw new Error(
          "Provided public address does not have any sender in it."
        );
      }
    } catch (error: any) {
      throw new Error(error);
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
      const signerPrivateKey = this.accounts["returnPrivateKey"].call(
        this.accounts
      );
      const address =
        this.web3.eth.accounts.privateKeyToAccount(signerPrivateKey).address;
      const isSender = await this.contract.methods.isSender(address).call();
      if (isSender) {
        try {
          const data = await this.contract.methods.addBulkRecords(keys, values);
          const gasPrice = await this.web3.eth.getGasPrice();
          const gasLimit = await data.estimateGas({
            from: address,
          });
          const maxPriorityFeePerGas = await this.getMaximumPrioriityFeeGas();
          const maxFeePerGas = (
            parseInt(gasPrice) + parseInt(maxPriorityFeePerGas)
          ).toString();
          const tx: TransactionPayload = {
            from: address,
            to: this.contractAddress,
            gasLimit: gasLimit,
            data: data.encodeABI(),
            maxPriorityFeePerGas: maxPriorityFeePerGas,
            maxFeePerGas: maxFeePerGas
          };
          const txhash = await this.signTransaction(tx, signerPrivateKey);
          if (txhash.length == 0) {
            throw new Error("Please provide valid arguements");
          } else {
            return txhash;
          }
        } catch {
          throw new Error("Invalid key format, provide key in SHA54 format");
        }
      } else {
        throw new Error(
          "Provided public address does not have any sender in it."
        );
      }
    } catch (error: any) {
      throw new Error(error);
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
      if (
        result !=
        "0x0000000000000000000000000000000000000000000000000000000000000000"
      ) {
        return result;
      } else {
        return "";
      }
    } catch (error: any) {
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
      const signerPrivateKey = this.accounts["returnPrivateKey"].call(
        this.accounts
      );
      const address =
        this.web3.eth.accounts.privateKeyToAccount(signerPrivateKey).address;
      const isAdmin = await this.contract.methods.isAdmin(address).call();
      if (isAdmin) {
        const data = this.contract.methods.removeRecord(key);
        const gasPrice = await this.web3.eth.getGasPrice();
        const gasLimit = await data.estimateGas({
          from: address,
        });
        const maxPriorityFeePerGas = await this.getMaximumPrioriityFeeGas();
        const maxFeePerGas = (
          parseInt(gasPrice) + parseInt(maxPriorityFeePerGas)
        ).toString();
        const tx: TransactionPayload = {
          from: address,
          to: this.contractAddress,
          gasLimit: gasLimit,
          data: data.encodeABI(),
          maxPriorityFeePerGas: maxPriorityFeePerGas,
          maxFeePerGas: maxFeePerGas
        };
        const txhash = await this.signTransaction(tx, signerPrivateKey);
        return txhash;
      }
      return "";
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Returns a count of records from the blockchain by invoking the smart contract function.
   * @param key The address of the new Contract.
   * @returns The value of the record as a object of string.
   */
  public async getRecordCount(): Promise<string> {
    try {
      const result = await this.contract.methods.recordCount().call();
      return result;
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Returns the ABI which is used to initialize contract.
   * @returns The copy of ABI used.
   */
  public async getAbi() {
    return this.storeAbi;
  }

  private async getMaximumPrioriityFeeGas(): Promise<string> {
    try {
      let data = JSON.stringify({
        jsonrpc: "2.0",
        method: "eth_maxPriorityFeePerGas",
        params: [],
        id: 1,
      });

      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "https://api.avax-test.network/ext/bc/C/rpc",
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };

      const response = await axios.request(config);
      const maxPriorityFeePerGas = this.web3.utils.hexToNumberString(
        response.data.result
      );
      return maxPriorityFeePerGas;
    } catch (error: any) {
      throw new Error(`Failed to get average gas fee: ${error.message}`);
    }
  }
}

export default SmartContract;
