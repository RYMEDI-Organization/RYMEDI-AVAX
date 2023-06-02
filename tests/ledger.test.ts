import dotenv from "dotenv";
import Web3 from "web3";
// Load the environment variables from .env file
dotenv.config();
import Transaction from "../src/Ledger/Ledger";
const providerUrl = new Web3(process.env.PROVIDER_URL as string);
const defaultPrivateKey = process.env.DEFAULT_PRIVATE_KEY?.split(' ') as string[];
let payload: any
// Test suite for Transaction class
describe("Transaction", () => {
  let transaction: Transaction;

  // Runs before each test case in this suite
  beforeAll(() => {
    // Set up a new Transaction instance using a mock web3 provider URL and private key
    transaction = new Transaction(providerUrl, defaultPrivateKey);
    let account = transaction['accounts']
    payload = {
      from: (account.getAccounts())[0],
      to: process.env.RECEIVER_ADDRESS,
      value: process.env.AMOUNT_TO_SEND,
      gas: "21000",
    };
  });

  // Test case for fetchTransactionDetails method
  describe("fetchTransactionDetails", () => {
    // Test for successful fetch
    test("fetches transaction details for a valid transaction ID", async () => {
      const transactionId =
        process.env.TRANSACTION_ID as string;
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
      ).rejects.toThrow(`Failed to fetch transaction details: Transaction details for ${transactionId} not found`);
    });
    // Test for invalid transactionId
    test("throws an error when the transaction ID is invalid", async () => {
      const transactionId =
        process.env.INCORRECT_TRANSACTION_ID as string;
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
      process.env.TRANSACTION_ID as string;
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
      ).rejects.toThrow(`Failed to fetch transaction receipt: Transaction receipt for ${transactionId} not found`);
    });

    // Test for invalid transactionId
    test("throws an error when the transaction ID is invalid", async () => {
      const transactionId = process.env.INCORRECT_TRANSACTION_ID as string;
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
      const signedTransaction = await transaction['createSignedTransaction'](
        payload,
        process.env.USER_PROVIDED_KEY as string
      );
      expect(signedTransaction.rawTransaction).toBeTruthy();
    });
    // Test for successful creation with user provided private key
    test("returns signed transaction with provided private key when a valid payload and private key are provided", async () => {
      const customPrivateKey = process.env.USER_PROVIDED_KEY;
      const signedTransaction = await transaction["createSignedTransaction"](
        payload,
        customPrivateKey as string
      );
      expect(signedTransaction.rawTransaction).toBeTruthy();
    });
    // Test for failed creation with invalid payload
    test("throws an error when an invalid payload is provided", async () => {
      await expect(
        transaction["createSignedTransaction"]({from: 'time', to: 'as'}, defaultPrivateKey[1])
      ).rejects.toThrowError("Failed to create signed transaction");
    });
  });

  // Test for fetching gasPrice
  describe("getGasPrice", () => {
    test("returns the current gas price in wei", async () => {
      const gasPrice = await transaction["getGasPrice"]();
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
      const blockDetails = await transaction.getBlockDetails(process.env.BLOCK_NUMBER as string);
      expect(blockDetails.number).toBe(Number(process.env.BLOCK_NUMBER));
    });
    // Test for failed fetch with invalid block details
    test("throws an error when an invalid block identifier is provided", async () => {
      await expect(
        transaction.getBlockDetails("invalidBlockIdentifier")
      ).rejects.toThrowError("Failed to get block details");
    });
  });

  describe("getBlockByTransactionHash", () => {
    test("returns the block number when a valid transaction hash is provided", async () => {
      const block = await transaction.getBlockByTransactionHash(process.env.TRANSACTION_ID as string);
      expect(block).toBe(Number(21294971));
    });
    // Test for failed fetch with invalid transaction hash
    test("throws an error when an invalid transaction hash is provided", async () => {
      await expect(
        transaction.getBlockByTransactionHash(process.env.INCORRECT_TRANSACTION_ID as string)
      ).rejects.toThrowError(`Failed to fetch block number: Error: Failed to fetch transaction details: Transaction details for ${process.env.INCORRECT_TRANSACTION_ID} not found`);
    });
  });
});
