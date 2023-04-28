import dotenv from "dotenv";
// Load the environment variables from .env file
dotenv.config();
import Transaction from "../src/Transaction/Transaction";

const providerUrl = process.env.PROVIDER_URL as string;
const defaultPrivateKey = process.env.DEFAULT_PRIVATE_KEY as string;
const payload = {
  to: process.env.RECEIVER_ADDRESS,
  value: "1000000000",
  gas: "21000",
};

// Test suite for Transaction class
describe("Transaction", () => {
  let transaction: Transaction;

  // Runs before each test case in this suite
  beforeAll(() => {
    // Set up a new Transaction instance using a mock web3 provider URL and private key
    transaction = new Transaction(providerUrl, defaultPrivateKey);
  });

  // Test case for fetchTransactionDetails method
  describe("fetchTransactionDetails", () => {
    // Test for successful fetch
    test("fetches transaction details for a valid transaction ID", async () => {
      const transactionId =
        "0x7265155b36006188f42db30af22fc97a7a8946c8752c46d2dd0aeb4461331ba2";
      const transaction = new Transaction(providerUrl, defaultPrivateKey);
      const result = await transaction.fetchTransactionDetails(transactionId);
      expect(result).toBeDefined();
      // Assert that the returned transactionId is the same as the mocked transactionId
      expect(result.hash).toBe(transactionId);
    });

    // Test for failed fetch
    test("throws an error when the transaction is not found", async () => {
      const transactionId =
        "0x0000000000000000000000000000000000000000000000000000000000000000";
      const transaction = new Transaction(providerUrl, defaultPrivateKey);
      await expect(
        transaction.fetchTransactionDetails(transactionId)
      ).rejects.toThrow("Transaction not found");
    });
    // Test for invalid transactionId
    test("throws an error when the transaction ID is invalid", async () => {
      const transactionId =
        "0x7265155b36006188f42db30af22fc97a7a8946c8752c46d2dd0aeb4461331bb5";
      const transaction = new Transaction(providerUrl, defaultPrivateKey);
      await expect(
        transaction.fetchTransactionDetails(transactionId)
      ).rejects.toThrow();
    });
  });

  // Test case for fetchTransactionReceipt method
  describe("fetchTransactionReceipt", () => {
    test("fetches transaction receipt for a valid transaction ID", async () => {
      const transactionId =
        "0x7265155b36006188f42db30af22fc97a7a8946c8752c46d2dd0aeb4461331ba2";
      const transaction = new Transaction(providerUrl, defaultPrivateKey);
      const result = await transaction.fetchTransactionReceipt(transactionId);
      expect(result).toBeDefined();
      // Assert that the returned transactionId is the same as the mocked transactionId
      expect(result.transactionHash).toBe(transactionId);
    });

    // Test for failed fetch
    test("throws an error when the transaction receipt is not found", async () => {
      const transactionId =
        "0x0000000000000000000000000000000000000000000000000000000000000000";
      const transaction = new Transaction(providerUrl, defaultPrivateKey);
      await expect(
        transaction.fetchTransactionReceipt(transactionId)
      ).rejects.toThrow("Transaction receipt not found");
    });

    // Test for invalid transactionId
    test("throws an error when the transaction ID is invalid", async () => {
      const transactionId = "invalid-transaction-id";
      const transaction = new Transaction(providerUrl, defaultPrivateKey);
      await expect(
        transaction.fetchTransactionReceipt(transactionId)
      ).rejects.toThrow();
    });
  });

  // Test case for createSignedTransaction method
  describe("createSignedTransaction", () => {
    // Test for successful creation with default private key
    test("returns signed transaction when a valid payload is provided", async () => {
      const signedTransaction = await transaction.createSignedTransaction(
        payload
      );
      expect(signedTransaction.rawTransaction).toBeTruthy();
    });
    // Test for successful creation with user provided private key
    test("returns signed transaction with provided private key when a valid payload and private key are provided", async () => {
      const customPrivateKey = process.env.USER_PROVIDED_KEY;
      const signedTransaction = await transaction.createSignedTransaction(
        payload,
        customPrivateKey
      );
      expect(signedTransaction.rawTransaction).toBeTruthy();
    });
    // Test for failed creation with invalid payload
    test("throws an error when an invalid payload is provided", async () => {
      await expect(
        transaction.createSignedTransaction(null)
      ).rejects.toThrowError("Failed to create signed transaction");
    });
  });

  // Test for fetching gasPrice
  describe("getGasPrice", () => {
    test("returns the current gas price in wei", async () => {
      const gasPrice = await transaction.getGasPrice();
      expect(parseInt(gasPrice)).toBeGreaterThan(0);
    });
  });

  // Test for fetching latest block number
  describe("getLatestBlockNumber", () => {
    test("returns the latest block number on the blockchain network", async () => {
      const latestBlockNumber = await transaction.getLatestBlockNumber();
      expect(latestBlockNumber).toBeGreaterThan(0);
    });
  });

  // Test for fetching latest block details
  describe("getBlockDetails", () => {
    test("returns the block details object when a valid block identifier is provided", async () => {
      const blockDetails = await transaction.getBlockDetails(123456);
      expect(blockDetails.number).toBe(123456);
    });
    // Test for failed fetch with invalid block details
    test("throws an error when an invalid block identifier is provided", async () => {
      await expect(
        transaction.getBlockDetails("invalidBlockIdentifier")
      ).rejects.toThrowError("Failed to get block details");
    });
  });
});
