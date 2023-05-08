import Web3 from "web3";
import { AbiItem } from "web3-utils";
import { Accounts } from "../Account/Account";
import { Contract } from "web3-eth-contract";
import SmartContract from "../Contract/contract";
import Ledger from "../Ledger/Ledger";
import {
  TransactionPayload,
  SignedTransaction,
  SendSignedTransactionResponse,
} from "../Ledger/LedgerTypes";
export class AccessControl {
  private web3: Web3;
  private contract: Contract;
  private readonly PrivateKeys: string[];
  private accounts: Accounts;
  private addresses: string[];
  public senders: {
    address: string;
    privateKey: string;
  }[];
  private admins: {
    address: string;
    privateKey: string;
  }[];
  private owner: {
    address: string;
    privateKey: string;
  }[];
  private smartContract: SmartContract;
  private ledger: Ledger;
  private createSignedTx: Function;
  private sendSignedTx: Function;
  private contractAddress: string;

  constructor(
    web3: Web3,
    privateKeys: string[],
    Abi: AbiItem | AbiItem[],
    contractAddress: string
  ) {
    this.web3 = web3;
    this.contract = new this.web3.eth.Contract(Abi, contractAddress);
    this.PrivateKeys = privateKeys;
    this.accounts = new Accounts(this.web3, privateKeys);
    this.addresses = this.accounts.getAccounts();
    this.senders = [];
    this.contractAddress = contractAddress;
    this.smartContract = new SmartContract(
      contractAddress,
      Abi,
      privateKeys,
      this.web3
    );
    this.admins = [];
    this.owner = [];
    this.ledger = new Ledger(this.web3, privateKeys);
    this.createSignedTx = this.ledger["createSignedTransaction"] as (
      payload: TransactionPayload,
      privateKey?: string
    ) => Promise<SignedTransaction>;
    this.sendSignedTx = this.ledger["sendSignedTransaction"] as (
      signedTransactionData: string
    ) => Promise<SendSignedTransactionResponse>;
  }

  /**
   * Get transaction details/status from blockchain for any provided transaction ID
   * @returns - Creates array of objects for dedicated roles with private keys.
   */
  private async assignRole() {
    try {
      for (let i = 0; i < this.addresses.length; i++) {
        let sender = await this.contract.methods
          .isSender(this.addresses[i])
          .call();
        let owner = await this.contract.methods
          .isOwner(this.addresses[i])
          .call();
        let admin = await this.contract.methods
          .isAdmin(this.addresses[i])
          .call();
        if (sender) {
          this.senders.push({
            address: this.addresses[i],
            privateKey: this.PrivateKeys[i],
          });
        }
        if (owner) {
          this.owner.push({
            address: this.addresses[i],
            privateKey: this.PrivateKeys[i],
          });
        }
        if (admin) {
          this.admins.push({
            address: this.addresses[i],
            privateKey: this.PrivateKeys[i],
          });
        }
      }
    } catch (error) {
      throw error
    }
  }

  /**
   * Assign the diven address as the admin
   * Can only be signed by owners.
   * @param {string} address - The address which needs to be admin
   * @returns {string} - The transaction hash
   */
  public async assignAdmin(address: string): Promise<void> {
    try {
      await this.assignRole();
      let signerPrivateKey: string = "";
      if (this.owner.length > 0) {
        signerPrivateKey = this.owner[0].privateKey;
      }
      if (signerPrivateKey !== "") {
        let data = await this.contract.methods.setAdmin(address);
        let txhash = await this.signTransaction(data, signerPrivateKey);

        return txhash;
      }
      throw new Error("No owner found");
    } catch (error) {
      throw error;
    }
  }

  /**
   * Revoke the address from sender role.
   * Can only be signed by admins.
   * @param {string} address - The address which needs to be removed
   * @returns {string} - The transaction hash
   */

  public async removeSender(address: string): Promise<void> {
    try {
      await this.assignRole();
      let signerPrivateKey: string = "";
      if (this.admins.length > 0) {
        signerPrivateKey = this.admins[0].privateKey;
      }
      if (signerPrivateKey !== "") {
        let data = await this.contract.methods.revokeSender(address);
        let txhash = await this.signTransaction(data, signerPrivateKey);

        return txhash;
      }
      throw new Error("No owner found");
    } catch (error) {
      throw error;
    }
  }

  /**
   * Revoke the address from admin role.
   * Can only be signed by owners.
   * @param {string} address - The address which needs to be removed as admin
   * @returns {string} - The transaction hash
   */

  public async removeAdmin(address: string): Promise<void> {
    try {
      await this.assignRole();
      let signerPrivateKey: string = "";
      if (this.owner.length > 0) {
        signerPrivateKey = this.owner[0].privateKey;
      }
      if (signerPrivateKey !== "") {
        let data = await this.contract.methods.revokeAdmin(address);
        let txhash = await this.signTransaction(data, signerPrivateKey);

        return txhash;
      }
      throw new Error("No owner found");
    } catch (error) {
      throw error;
    }
  }

  /**
   * Function is used to transfer ownership
   * Can only be signed by owners.
   * @param {string} address - The address which needs to be owner
   * @returns {string} - The transaction hash
   */

  public async transferOwnership(address: string): Promise<void> {
    try {
      await this.assignRole();
      let signerPrivateKey: string = "";
      if (this.owner.length > 0) {
        signerPrivateKey = this.owner[0].privateKey;
      }
      if (signerPrivateKey !== "") {
        let data = await this.contract.methods.transferOwnership(address);
        let txhash = await this.signTransaction(data, signerPrivateKey);

        return txhash;
      }
      throw new Error("No owner found");
    } catch (error) {
      throw error;
    }
  }

  /**
   * Set the address to sender role.
   * Can only be signed by admins.
   * @param {string} address - The address which needs to be sender
   * @returns {string} - The transaction hash
   */
  public async assignSender(address: string): Promise<void> {
    try {
      await this.assignRole();
      let signerPrivateKey: string = "";
      if (this.admins.length > 0) {
        signerPrivateKey = this.admins[0].privateKey;
      }
      if (signerPrivateKey !== "") {
        let data = await this.contract.methods.setSender(address);
        let txhash = await this.signTransaction(data, signerPrivateKey);
        return txhash;
      }
      throw new Error("No admin found");
    } catch (error) {
      throw error;
    }
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

      let createSignedTx = this.ledger["createSignedTransaction"] as (
        payload: TransactionPayload,
        privateKey?: string
      ) => Promise<SignedTransaction>;
      const signedTx = await createSignedTx.call(
        this.ledger,
        tx,
        signerPrivateKey as string
      );
      const txReceipt = await this.sendSignedTx.call(
        this.ledger,
        signedTx.rawTransaction
      );
      return txReceipt.transactionHash;
    } catch (error) {
      throw error;
    }
  }
}
