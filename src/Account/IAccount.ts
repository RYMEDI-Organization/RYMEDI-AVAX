/**
 * This interface represents Account methods.
 */
export default interface IAccount {
  /**
   * Returns the addresses of the acount for the given private key.
   *
   * @returns Update the variable with the current account addresses for further use.
   */
  getAccounts(): String[];

  /**
   * Used to fetch the current transaction count of the account
   *
   * @param account The address of the account
   *
   * @returns a number which is the transaction count.
   */
  fetchNonce(account: String): Promise<Number>;

  /**
   * An function used to update the transaction count of the account.
   *
   * @param account The address of the account
   */
  fetchBalance(account: String): Promise<String>;

  /**
   * To fetch the balance of the account.
   *
   * @param account The address of the account.
   *
   * @returns a string which represents the balance of the account.
   */
  incrementNonce(account: String): void;
}
