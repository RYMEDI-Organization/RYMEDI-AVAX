import Web3 from "web3";
import IAccount from "./IAccount";

export class Accounts implements IAccount {
  private web3: Web3;
  private accounts: string[];
  private nonces: { [key: string]: number };
  private currentKeyIndex: number;
  private readonly PrivateKeys: string[];

  /**
   * @param {string} providerUrl - The web3 provider URL
   * @param {string} privateKeys - The private keys to get account.
   */
  constructor(web3: Web3, privateKeys: string[]) {
    this.web3 = web3;
    this.accounts = privateKeys.map(
      (privateKey) =>
        this.web3.eth.accounts.privateKeyToAccount(privateKey).address
    );
    this.nonces = {};
    this.currentKeyIndex = 0;
    this.PrivateKeys = privateKeys;
  }

  /**
   * Returns the addresses of the account for the given private key.
   *
   * @returns Update the variable with the current account addresses for further use.
   */
  public getAccounts(): string[] {
    return this.accounts;
  }

  /**
   * Used to fetch the current transaction count of the account
   *
   * @param account The address of the account
   *
   * @returns a number which is the transaction count.
   */
  private async getNonce(account: string): Promise<number> {
    try {
      const networkNonce = await this.web3.eth.getTransactionCount(account);
      const localNonce = this.nonces[account] || 0;
      const maxNonce = Math.max(networkNonce, localNonce);
      this.nonces[account] = maxNonce;
      return maxNonce;
    } catch (error: any) {
      throw new Error(`Failed to fetch nonce: ${error.message}` );
    }
  }

  /**
   * An function used to update the transaction count of the account.
   *
   * @param account The address of the account
   */
  public incrementNonce(account: string): void {
      if (!this.nonces[account]) {
        this.nonces[account] = 1;
      } else {
        this.nonces[account]++;
      }
  }

  /**
   * To fetch the balance of the account.
   *
   * @param account The address of the account.
   *
   * @returns a string which represents the balance of the account.
   */
  public async getBalance(account: string): Promise<string> {
    try {
      const balance = await this.web3.eth.getBalance(account);
      return balance;
    } catch (error: any) {
      throw new Error(`Failed to fetch balance: ${error.message}` );
    }
  }
  /**
   * To return private key in round robin way.
   * @returns private key.
   */
  private returnPrivateKey(): string {
    const numKeys = this.PrivateKeys.length;
    let signerPrivateKey = this.PrivateKeys[this.currentKeyIndex];
    this.currentKeyIndex = (this.currentKeyIndex + 1) % numKeys;
    return signerPrivateKey;
  }
  /**
   * Resets the nonces object to an empty object.
   */
  public resetNonces(): void {
    this.nonces = {};
  }
}
