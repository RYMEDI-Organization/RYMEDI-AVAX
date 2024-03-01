import Web3 from "web3";
import IAccount from "./IAccount";
export declare class Accounts implements IAccount {
    private web3;
    private accounts;
    private nonces;
    private currentKeyIndex;
    private readonly PrivateKeys;
    /**
     * @param {string} providerUrl - The web3 provider URL
     * @param {string} privateKeys - The private keys to get account.
     */
    constructor(web3: Web3, privateKeys: string[]);
    /**
     * Returns the addresses of the account for the given private key.
     *
     * @returns Update the variable with the current account addresses for further use.
     */
    getAccounts(): string[];
    /**
     * Used to fetch the current transaction count of the account
     *
     * @param account The address of the account
     *
     * @returns a number which is the transaction count.
     */
    getNonce(account: string): Promise<number>;
    /**
     * An function used to update the transaction count of the account.
     *
     * @param account The address of the account
     */
    incrementNonce(account: string): void;
    /**
     * To fetch the balance of the account.
     *
     * @param account The address of the account.
     *
     * @returns a string which represents the balance of the account.
     */
    getBalance(account: string): Promise<string>;
    /**
     * To return private key in round robin way.
     * @returns private key.
     */
    private returnPrivateKey;
    /**
     * Resets the local nonce for the given account to 0.
     * @param account The address of the account
     */
    resetNonces(account: string): void;
}
