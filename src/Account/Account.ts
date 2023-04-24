import Web3 from "web3";
import IAccount from "./IAccount";
export class Accounts implements IAccount {
  private accounts: string[];
  private nonces: { [key: string]: number };
  public web3 = new Web3();
  constructor(privateKeys: string[]) {
    this.accounts = privateKeys.map(
      (privateKey) =>
        new Web3().eth.accounts.privateKeyToAccount(privateKey).address
    );
    this.nonces = {};
  }

  /**
   * Returns the addresses of the acount for the given private key.
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
  public async fetchNonce(account: string): Promise<Number> {
    try {
      const networkNonce = await new Web3().eth.getTransactionCount(account);
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
  public async fetchBalance(account: string): Promise<string> {
    try {
      const balance = await this.web3.eth.getBalance(account);
      console.log(`Fetched balance for account: ${account}`);
      return balance;
    } catch (error) {
      console.log(`Failed to fetch balance for account: ${account}`, error);
      throw error;
    }
  }
}
