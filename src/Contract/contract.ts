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
import { ABI } from "../../abi";
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
      const address =
        this.web3.eth.accounts.privateKeyToAccount(signerPrivateKey).address;
      const data = this.contract.methods.addRecord(key, value);
      //estimating the gasLimit of keys and values we passed in Bulk Records
      // const gasLimit = await data.estimateGas({
      //   from: address
      // });
      // const tx: TransactionPayload = {
      //   from: address,
      //   to: this.contractAddress,
      //   gasPrice: gasPrice,
      //   gasLimit: gasLimit,
      //   data: data.encodeABI(),
      // };
      // const signedTx = await this.createSignedTx.call(
      //   this.transaction,
      //   tx,
      //   signerPrivateKey as string
      // );
      // const txReceipt = await this.sendSignedTx.call(
      //   this.transaction,
      //   signedTx.rawTransaction
      // );
      // console.log(txReceipt)
      // return txReceipt.transactionHash;
      let res = await this.signTransaction(data, signerPrivateKey);
      console.log(res);
      return res;
    } catch (error) {
      throw error;
    }
  }

  public async pushBulkRecord(
    keys: string[],
    values: string[]
  ): Promise<string> {
    try {
      const returnPrivateKey = this.accounts["returnPrivateKey"];
      const signerPrivateKey = returnPrivateKey.call(this.accounts);
      const address =
        this.web3.eth.accounts.privateKeyToAccount(signerPrivateKey).address;
      // const isSender = this.senderList.includes(publicAddress) ? true : false;
      // console.log(isSender);
      const isSender = this.contract.methods.isSender(address).call();
      const gasPrice = await this.web3.eth.getGasPrice();
      if (isSender) {
        const data = this.contract.methods.addRecord(keys, values);
        this.signTransaction(data, signerPrivateKey);
        //estimating the gasLimit of keys and values we passed in Bulk Records
        // const gasLimit = await data.estimateGas({
        //   from: address
        // });
        // const tx: TransactionPayload = {
        //   from: address,
        //   to: this.contractAddress,
        //   gasPrice: gasPrice,
        //   gasLimit: gasLimit,
        //   data: data.encodeABI(),
        // };
        // const signedTx = await this.createSignedTx.call(
        //   this.transaction,
        //   tx,
        //   signerPrivateKey as string
        // );
        // const txReceipt = await this.sendSignedTx.call(
        //   this.transaction,
        //   signedTx.rawTransaction
        // );
        // return txReceipt.transactionHash;
      }
      return "";
    } catch (error) {
      throw error;
    }
  }

  public async signTransaction(data: any, signerPrivateKey: string) {
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

      let createSignedTx = this.transaction["createSignedTransaction"] as (
        payload: TransactionPayload,
        privateKey?: string
      ) => Promise<SignedTransaction>;
      const signedTx = await createSignedTx.call(
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

const web = new Web3("https://api.avax-test.network/ext/C/rpc");
const data = new SmartContract(
  "0xE29C2Ff001E9E344B43069f8b585128193A91A77",
  ABI as AbiItem[],
  [
    "efb28159e40ae370139ab9f61d74522004c6f99ee44dad32902ba16cc74e6874",
    "9274c3ae7d49ded898bb928169ea3812793e184e5898024ac5cd0b9de3755418",
    "92632f2dd6a1622d5e3719b8cfb6d6b61c5e340aa81b698d538333b6706f5da2",
    "fd9f7902c674a7bcdcab416c4df12329f35c8d96c118563bde83717bdaee8479",
    "461b45c53737d5612f7d7e1763b70b959c1bd491f0418a3d80a563921e4b9029",
  ],
  web
);
const ulra = async () => {
  await data.pushRecord(
    "0xcb9c3136fe8eca358ef7e67f6f49df9a99870bf31bdf3b5ed228f73de936b250",
    "0x2fe7a71b0f54705b0e652f481d9c750fe360d72fa7809c5b650acc741f585be0"
  );
};

ulra();
