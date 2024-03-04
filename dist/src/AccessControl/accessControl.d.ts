import Web3 from "web3";
import { AbiItem } from "web3-utils";
import SmartContract from "../Contract/contract";
export declare class AccessControl {
    private web3;
    private contract;
    private smartContract;
    private contractAddress;
    private signTransaction;
    private getMaximumPrioriityFeeGas;
    constructor(web3: Web3, contract: SmartContract, Abi: AbiItem | AbiItem[], contractAddress: string);
    /**
     * Checks if the given address is owner
     * @param {string} address - The address which needs to be checked
     * @returns {boolean} - true or false
     */
    private isOwner;
    /**
     * Checks if the given address is admin
     * @param {string} address - The address which needs to be checked
     * @returns {boolean} - true or false
     */
    private isAdmin;
    /**
     * Assign the given address as the admin
     * Can only be signed by owners.
     * @param {string} address - The address which needs to be admin
     * @param {string} ownerPrivateKey - The private key of owner to sign the transaction
     * @returns {string} - The transaction hash
     */
    assignAdmin(address: string, ownerPrivateKey: string): Promise<void>;
    /**
     * Revoke the address from sender role.
     * Can only be signed by admins.
     * @param {string} address - The address which needs to be removed
     * @param {string} adminPrivateKey - The private key of admin to sign the transaction
     * @returns {string} - The transaction hash
     */
    removeSender(address: string, adminPrivateKey: string): Promise<string>;
    /**
     * Revoke the address from admin role.
     * Can only be signed by owners.
     * @param {string} address - The address which needs to be removed as admin
     * @param {string} ownerPrivateKey - The private key of owner to sign the transaction
     * @returns {string} - The transaction hash
     */
    removeAdmin(address: string, ownerPrivateKey: string): Promise<string>;
    /**
     * Function is used to transfer ownership
     * Can only be signed by owners.
     * @param {string} address - The address which needs to be owner
     * @param {string} ownerPrivateKey - The private key of owner to sign the transaction
     * @returns {string} - The transaction hash
     */
    transferOwnership(address: string, ownerPrivateKey: string): Promise<string>;
    /**
     * Set the address to sender role.
     * Can only be signed by admins.
     * @param {string} address - The address which needs to be sender
     * @param {string} adminPrivateKey - The private key of owner to sign the transaction
     * @returns {string} - The transaction hash
     */
    assignSender(address: string, adminPrivateKey: string): Promise<string>;
    /**
     * update the address of new smart contract.
     * can only be done by owner.
     * @param contractAddress The address of new contract.
     * @param {string} ownerPrivateKey - The private key of owner to sign the transaction
     * @returns The transaction hash of the submitted transaction.
     */
    updateContractAddress(contractAddress: string, ownerPrivateKey: string): Promise<string>;
}
