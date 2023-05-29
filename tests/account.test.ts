import Web3 from "web3";
import { Accounts } from "../src/Account/Account";
import dotenv from "dotenv";
dotenv.config();

describe("Accounts", () => {
  let web3: Web3;
  let privateKeys: string[];
  let accounts: Accounts;
  let publicAddress: string[]

  beforeEach(() => {
    web3 = new Web3(process.env.PROVIDED_URL as string);
    privateKeys = process.env.DEFAULT_PRIVATE_KEY?.split(' ') as string[]
    accounts = new Accounts(web3, privateKeys);
    publicAddress = accounts.getAccounts();
  });

  afterEach(() => {
    // Clean up any test-specific resources here
  });

  describe("getAccounts", () => {
    it("should return the account addresses", () => {
      const expectedAccounts = privateKeys.map(
        (privateKey) => web3.eth.accounts.privateKeyToAccount(privateKey).address
      );
      const actualAccounts = accounts.getAccounts();
      expect(actualAccounts).toEqual(expectedAccounts);
    });
  });

  describe("getBalance", () => {
    it("should fetch the balance of the account", async () => {
      const account = publicAddress[0];
      const expectedBalance = "1000000000000000000"; // Example balance
      web3.eth.getBalance = jest.fn().mockResolvedValue(expectedBalance);
      const balance = await accounts.getBalance(account);
      expect(balance).toBe(expectedBalance);
      expect(web3.eth.getBalance).toHaveBeenCalledWith(account);
    });

    it("should throw an error if fetching the balance fails", async () => {
      const account = "0x1234567890abcdef";
      const errorMessage = "Failed to fetch balance";
      web3.eth.getBalance = jest.fn().mockRejectedValue(new Error(errorMessage));

      await expect(accounts.getBalance(account)).rejects.toThrow(errorMessage);
    });
  });

  describe("resetNonces", () => {
    it("should reset the local nonce for the given account to 0", () => {
      const account = publicAddress[0];
      accounts.resetNonces(account);
      expect(accounts["nonces"][account]).toBe(0);
    });
  });

  describe("incrementNonce", () => {
    it("should return the nonce for the given account", () => {
      const account = publicAddress[0];
      const mockNonces: { [account: string]: number } = {};
      const incrementNonce = accounts.incrementNonce.bind({ nonces: mockNonces });
      incrementNonce(account);
      expect(mockNonces[account]).toBeGreaterThan(0)
    });
    it("should return the nonce for the given account", () => {
      const account = publicAddress[0] + "123";
      const mockNonces: { [account: string]: number } = {};
      const incrementNonce = accounts.incrementNonce.bind({ nonces: mockNonces });
      incrementNonce(account);
      expect(mockNonces[account]).toBe(1)
    });
  })
});
