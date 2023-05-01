import Web3 from "web3";
import IAccount from "./IAccount";

export class Accounts implements IAccount {
  private web3: Web3;
  private accounts: string[];
  private nonces: { [key: string]: number };

  /**
   * @param {string} providerUrl - The web3 provider URL
   * @param {string} defaultPrivateKey - The default private key to sign the transactions
   */
  constructor(web3: Web3, privateKey: string[]) {
    this.web3 = web3;
    this.accounts = privateKey.map(
      (privateKey) =>
        this.web3.eth.accounts.privateKeyToAccount(privateKey).address
    );
    this.nonces = {};
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
  public async getNonce(account: string): Promise<Number> {
    try {
      const networkNonce = await this.web3.eth.getTransactionCount(account);
      const localNonce = this.nonces[account] || 0;
      return Math.max(networkNonce, localNonce);
    } catch (error) {
      throw error;
    }
  }

  /**
   * An function used to update the transaction count of the account.
   *
   * @param account The address of the account
   */
  public incrementNonce(account: string): void {
    try {
      if (!this.nonces[account]) {
        this.nonces[account] = 1;
      } else {
        this.nonces[account]++;
      }
    } catch (error) {
      throw error;
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
    } catch (error) {
      throw error;
    }
  }
}
