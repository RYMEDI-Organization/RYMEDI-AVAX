import Web3 from "web3";
import { AbiItem } from "web3-utils";
import { Contract } from "web3-eth-contract";
import SmartContract from "../Contract/contract";
import { TransactionPayload } from "../Ledger/LedgerTypes";
export class AccessControl {
  private web3: Web3;
  private contract: Contract;
  private smartContract: SmartContract;
  private contractAddress: string;
  private signTransaction: Function;
  private getMaximumPrioriityFeeGas: Function;
  constructor(
    web3: Web3,
    contract: SmartContract,
    Abi: AbiItem | AbiItem[],
    contractAddress: string
  ) {
    this.web3 = web3;
    this.contract = new this.web3.eth.Contract(Abi, contractAddress);
    this.contractAddress = contractAddress;
    this.smartContract = contract
    this.signTransaction = this.smartContract["signTransaction"] as (
      payload: TransactionPayload,
      signerPrivateKey: string
    ) => Promise<string>;
    this.getMaximumPrioriityFeeGas = this.smartContract["getMaximumPrioriityFeeGas"]
  }

  /**
   * Checks if the given address is owner
   * @param {string} address - The address which needs to be checked
   * @returns {boolean} - true or false
   */
  private async isOwner(address: string): Promise<boolean> {
    try {
      const validOwnerKey = await this.contract.methods.isOwner(address).call();
      return validOwnerKey;
    } catch (error) {
      throw error;
    }
  }
  /**
   * Checks if the given address is admin
   * @param {string} address - The address which needs to be checked
   * @returns {boolean} - true or false
   */
  private async isAdmin(address: string): Promise<boolean> {
    try {
      const validAdminKey = await this.contract.methods.isAdmin(address).call();
      return validAdminKey;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Assign the given address as the admin
   * Can only be signed by owners.
   * @param {string} address - The address which needs to be admin
   * @param {string} ownerPrivateKey - The private key of owner to sign the transaction
   * @returns {string} - The transaction hash
   */
  public async assignAdmin(
    address: string,
    ownerPrivateKey: string
  ): Promise<void> {
    try {
      const ownerPublicAddress =
        this.web3.eth.accounts.privateKeyToAccount(ownerPrivateKey).address;
      const validOwnerKey = await this.isOwner(ownerPublicAddress);
      if (validOwnerKey === true) {
        const data = await this.contract.methods.setAdmin(address);
        const gasPrice = await this.web3.eth.getGasPrice();
        const maxPriorityFeePerGas = await this.getMaximumPrioriityFeeGas();
        const maxFeePerGas = (parseInt(gasPrice) + parseInt(maxPriorityFeePerGas)).toString();
        const gasLimit = await data.estimateGas({
          from: ownerPublicAddress,
        });
        const tx: TransactionPayload = {
          from: ownerPublicAddress,
          to: this.contractAddress,
          gasLimit: gasLimit,
          data: data.encodeABI(),
          maxPriorityFeePerGas: maxPriorityFeePerGas,
          maxFeePerGas: maxFeePerGas
        };
        const txhash = await this.signTransaction.call(
          this.smartContract,
          tx,
          ownerPrivateKey
        );
        return txhash;
      }
      throw new Error("Provided private key is not of owner");
    } catch (error) {
      throw error;
    }
  }

  /**
   * Revoke the address from sender role.
   * Can only be signed by admins.
   * @param {string} address - The address which needs to be removed
   * @param {string} adminPrivateKey - The private key of admin to sign the transaction
   * @returns {string} - The transaction hash
   */

  public async removeSender(
    address: string,
    adminPrivateKey: string
  ): Promise<string> {
    try {
      const adminPublicAddress =
        this.web3.eth.accounts.privateKeyToAccount(adminPrivateKey).address;
      const validAdminKey = await this.isAdmin(adminPublicAddress);
      if (validAdminKey === true) {
        const data = await this.contract.methods.revokeSender(address);
        const gasPrice = await this.web3.eth.getGasPrice();
        const gasLimit = await data.estimateGas({
          from: adminPublicAddress,
        });
        const maxPriorityFeePerGas = await this.getMaximumPrioriityFeeGas();
        const maxFeePerGas = (parseInt(gasPrice) + parseInt(maxPriorityFeePerGas)).toString();
        const tx: TransactionPayload = {
          from: adminPublicAddress,
          to: this.contractAddress,
          gasLimit: gasLimit,
          data: data.encodeABI(),
          maxPriorityFeePerGas: maxPriorityFeePerGas,
          maxFeePerGas: maxFeePerGas
        };
        const txhash = await this.signTransaction.call(
          this.smartContract,
          tx,
          adminPrivateKey
        );
        return txhash;
      }
      throw new Error("Provided private key is not of admin");
    } catch (error) {
      throw error;
    }
  }

  /**
   * Revoke the address from admin role.
   * Can only be signed by owners.
   * @param {string} address - The address which needs to be removed as admin
   * @param {string} ownerPrivateKey - The private key of owner to sign the transaction
   * @returns {string} - The transaction hash
   */

  public async removeAdmin(
    address: string,
    ownerPrivateKey: string
  ): Promise<string> {
    try {
      const ownerPublicAddress =
        this.web3.eth.accounts.privateKeyToAccount(ownerPrivateKey).address;
      const validOwnerKey = await this.isOwner(ownerPublicAddress);

      if (validOwnerKey === true) {
        let data = await this.contract.methods.revokeAdmin(address);
        const gasPrice = await this.web3.eth.getGasPrice();
        const gasLimit = await data.estimateGas({
          from: ownerPublicAddress,
        });
        const maxPriorityFeePerGas = await this.getMaximumPrioriityFeeGas();
        const maxFeePerGas = (parseInt(gasPrice) + parseInt(maxPriorityFeePerGas)).toString();
        const tx: TransactionPayload = {
          from: ownerPublicAddress,
          to: this.contractAddress,
          gasLimit: gasLimit,
          data: data.encodeABI(),
          maxPriorityFeePerGas: maxPriorityFeePerGas,
          maxFeePerGas: maxFeePerGas
        };
        const txhash = await this.signTransaction.call(
          this.smartContract,
          tx,
          ownerPrivateKey
        );
        return txhash;
      }
      throw new Error("Provided private key is not of owner");
    } catch (error) {
      throw error;
    }
  }

  /**
   * Function is used to transfer ownership
   * Can only be signed by owners.
   * @param {string} address - The address which needs to be owner
   * @param {string} ownerPrivateKey - The private key of owner to sign the transaction
   * @returns {string} - The transaction hash
   */

  public async transferOwnership(
    address: string,
    ownerPrivateKey: string
  ): Promise<string> {
    try {
      const ownerPublicAddress =
        this.web3.eth.accounts.privateKeyToAccount(ownerPrivateKey).address;
      const validOwnerKey = await this.isOwner(ownerPublicAddress);
      if (validOwnerKey === true) {
        let data = await this.contract.methods.transferOwnership(address);
        const gasPrice = await this.web3.eth.getGasPrice();
        const gasLimit = await data.estimateGas({
          from: ownerPublicAddress,
        });
        const maxPriorityFeePerGas = await this.getMaximumPrioriityFeeGas();
        const maxFeePerGas = (parseInt(gasPrice) + parseInt(maxPriorityFeePerGas)).toString();
        const tx: TransactionPayload = {
          from: ownerPublicAddress,
          to: this.contractAddress,
          gasLimit: gasLimit,
          data: data.encodeABI(),
          maxPriorityFeePerGas: maxPriorityFeePerGas,
          maxFeePerGas: maxFeePerGas
        };
        const txhash = await this.signTransaction.call(
          this.smartContract,
          tx,
          ownerPrivateKey
        );
        return txhash;
      }
      throw new Error("Provided private key is not of owner");
    } catch (error) {
      throw error;
    }
  }

  /**
   * Set the address to sender role.
   * Can only be signed by admins.
   * @param {string} address - The address which needs to be sender
   * @param {string} adminPrivateKey - The private key of owner to sign the transaction
   * @returns {string} - The transaction hash
   */
  public async assignSender(
    address: string,
    adminPrivateKey: string
  ): Promise<string> {
    try {
      const adminPublicAddress =
        this.web3.eth.accounts.privateKeyToAccount(adminPrivateKey).address;
      const validAdminKey = await this.isAdmin(adminPublicAddress);

      if (validAdminKey === true) {
        let data = await this.contract.methods.setSender(address);
        const gasPrice = await this.web3.eth.getGasPrice();
        const gasLimit = await data.estimateGas({
          from: adminPublicAddress,
        });
        const maxPriorityFeePerGas = await this.getMaximumPrioriityFeeGas();
        const maxFeePerGas = (parseInt(gasPrice) + parseInt(maxPriorityFeePerGas)).toString();
        const tx: TransactionPayload = {
          from: adminPublicAddress,
          to: this.contractAddress,
          gasLimit: gasLimit,
          data: data.encodeABI(),
          maxPriorityFeePerGas: maxPriorityFeePerGas,
          maxFeePerGas: maxFeePerGas
        };
        const txhash = await this.signTransaction.call(
          this.smartContract,
          tx,
          adminPrivateKey
        );
        return txhash;
      }
      throw new Error("Provided private key is not of admin");
    } catch (error) {
      throw error;
    }
  }

  /**
   * update the address of new smart contract.
   * can only be done by owner.
   * @param contractAddress The address of new contract.
   * @param {string} ownerPrivateKey - The private key of owner to sign the transaction
   * @returns The transaction hash of the submitted transaction.
   */
  public async updateContractAddress(
    contractAddress: string,
    ownerPrivateKey: string
  ): Promise<string> {
    try {
      const ownerPublicAddress =
        this.web3.eth.accounts.privateKeyToAccount(ownerPrivateKey).address;
      const isOwner = await this.isOwner(ownerPublicAddress);
      if (isOwner === true) {
        const data = await this.contract.methods.updateCode(contractAddress);
        const gasPrice = await this.web3.eth.getGasPrice();
        const gasLimit = await data.estimateGas({
          from: ownerPublicAddress,
        });
        const maxPriorityFeePerGas = await this.getMaximumPrioriityFeeGas();
        const maxFeePerGas = (parseInt(gasPrice) + parseInt(maxPriorityFeePerGas)).toString();
        const tx: TransactionPayload = {
          from: ownerPublicAddress,
          to: this.contractAddress,
          gasLimit: gasLimit,
          data: data.encodeABI(),
          maxPriorityFeePerGas: maxPriorityFeePerGas,
          maxFeePerGas: maxFeePerGas
        };
        const txhash = await this.signTransaction.call(
          this.smartContract,
          tx,
          ownerPrivateKey
        );
        return txhash;
      }
      throw new Error("Provided private key is not of owner");
    } catch (error: any) {
      throw new Error(error);
    }
  }
}
