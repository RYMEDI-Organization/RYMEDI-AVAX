/**
 * This interface represents Account methods.
 */
export default interface IAccount {
  /**
   * Returns the addresses of the acount for the given private key.
   *
   * @returns Update the variable with the current account addresses for further use.
   */
  getAccounts(): string[];

  /**
   * An function used to update the transaction count of the account.
   *
   * @param account The address of the account
   */
  getBalance(account: string): Promise<string>;

  /**
   * To fetch the balance of the account.
   *
   * @param account The address of the account.
   *
   * @returns a string which represents the balance of the account.
   */
  incrementNonce(account: string): void;
}
