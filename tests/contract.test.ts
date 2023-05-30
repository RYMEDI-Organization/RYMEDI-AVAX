import SmartContract from "../src/Contract/contract";
import Web3 from "web3";
import dotenv from "dotenv";
import { ABI } from "../abi";
import { Contract } from "web3-eth-contract";
const sha256 = require("sha.js")("sha256");

// Load the environment variables from .env file
dotenv.config();
const abi = ABI as [];
const providedUrl: Web3 = new Web3(process.env.PROVIDER_URL as string);
const privateKeys = process.env.DEFAULT_PRIVATE_KEY?.split(" ") as string[];
const contractAddress = process.env.CONTRACT_ADDRESS as string;
const mockedTransactionHash = process.env.TRANSACTION_ID;
const contract: Contract = new providedUrl.eth.Contract(abi, contractAddress);
let payload: any;

function generateHash(key: any, data: any) {
  //getting some random data to pass it with key and value
  const salt = Math.random().toString(36).substring(2, 18);
  let hash = sha256.update(`${key}-${data}-${salt}`).digest("hex");
  hash = "0x" + hash;
  return hash;
}

describe("SmartContract", () => {
  let smartContract: SmartContract;
  beforeEach(() => {
    smartContract = new SmartContract(
      contractAddress,
      abi,
      privateKeys,
      providedUrl
    );
    let account = smartContract["accounts"];
    payload = {
      from: account.getAccounts()[0],
      to: process.env.RECEIVER_ADDRESS,
      value: process.env.AMOUNT_TO_SEND,
      gas: "21000",
    };
  });

  describe("pushRecord", () => {
    test("should push a record to the blockchain and return the transaction hash", async () => {
      const key = generateHash("key", "generate");
      const value = generateHash("value", "generate");
      const result = await smartContract.pushRecord(key, value);
      expect(result).toBeDefined();
    }, 10000);

    it("should return an empty string if the sender is not allowed", async () => {
      const instanceContract = new SmartContract(
        contractAddress,
        abi,
        ["ee720dc97c27b9dd14387e64493b1bf80495c292b1a5837468d587386f47ccf7"],
        providedUrl
      );
      const key = generateHash("key", "generate");
      const value = generateHash("value", "generate");
      const expectedTxHash = "";
      const result = await instanceContract.pushRecord(key, value);

      expect(result).toBeDefined();
      expect(result).toBe(expectedTxHash);
    }, 10000);

    it("should throw an error if an exception occurs", async () => {
      try {
        await smartContract.pushRecord("key", "value");
      } catch (error) {
        expect(error).toThrow();
      }
    }, 10000);
  });

  describe("pushBulkRecord", () => {
    it("should push a record to the blockchain and return the transaction hash", async () => {
      const key = generateHash("key", "generate");
      const key1 = generateHash("key1", "generate");
      const value = generateHash("value", "generate");
      const value1 = generateHash("value1", "generate");

      const result = await smartContract.pushBulkRecord(
        [key, value],
        [key1, value1]
      );
      expect(result).toBeDefined();
    }, 10000);

    it("should return an empty string if the sender is not allowed", async () => {
      const instanceContract = new SmartContract(
        contractAddress,
        abi,
        ["ee720dc97c27b9dd14387e64493b1bf80495c292b1a5837468d587386f47ccf7"],
        providedUrl
      );
      const key = generateHash("key", "generate");
      const key1 = generateHash("key1", "generate");
      const value = generateHash("value", "generate");
      const value1 = generateHash("value1", "generate");
      const expectedTxHash = "";
      const result = await instanceContract.pushBulkRecord(
        [key, value],
        [key1, value1]
      );

      expect(result).toBeDefined();
      expect(result).toBe(expectedTxHash);
    }, 10000);

    it("should throw an error if an exception occurs", async () => {
      try {
        await smartContract.pushBulkRecord(
          ["key1", "key2"],
          ["value1", "value2"]
        );
      } catch (error) {
        expect(error).toThrowError();
      }
    }, 10000);
  });

  describe("readRecord", () => {
    it("should read a record from the blockchain", async () => {
      const key = generateHash("key", "generate");
      const value = generateHash("value", "generate");
      const expectedHash = await smartContract.pushRecord(key, value);
      const result = await smartContract.readRecord(key);
      expect(result).toBeDefined();
      expect(result).toBe(expectedHash);
    });

    it("invalid key is provided should return empty string", async () => {
      const expectedValue = "";
      const result = await smartContract.readRecord(
        "0x45faae7e8e88ee901827f8f48064826cd10a1e1a746c823f24295bf5ccc28212"
      );
      expect(result).toBeDefined();
      expect(result).toBe(expectedValue);
    });

    it("should throw an error if key is not in sha56", async () => {
      try {
        await smartContract.readRecord("key1,key2");
      } catch (error) {
        expect(() => {
          throw error;
        }).toThrowError();
      }
    });
  });

  describe("removeRecord", () => {
    it("should remove a record from the blockchain and return the transaction hash", async () => {
      const key = generateHash("key", "generate");
      const value = generateHash("value", "generate");
      await smartContract.pushRecord(key, value);
      const result = await smartContract.removeRecord(key);

      expect(result).toBeDefined();
    });

    it("should return an empty string if the sender is not an admin", async () => {
      const instanceContract = new SmartContract(
        contractAddress,
        abi,
        [
          "efb28159e40ae370139ab9f61d74522004c6f99ee44dad32902ba16cc74e6874",
          "461b45c53737d5612f7d7e1763b70b959c1bd491f0418a3d80a563921e4b9029",
        ],
        providedUrl
      );
      const key = generateHash("key", "generate");
      const value = generateHash("value", "generate");
      const expectedTxHash = "";
      await instanceContract.pushRecord(key, value);

      const result = await smartContract.removeRecord(key);

      expect(result).toBe(expectedTxHash);
    });

    it("should throw an error if an exception occurs", async () => {
      try {
        await smartContract.removeRecord("key");
      } catch (error) {
        expect(error).toThrow();
      }
    });
  });

  describe("getRecordCount", () => {
    it("should return the record count from the blockchain", async () => {
      const result = await smartContract.getRecordCount();

      expect(result).toBeTruthy();
      expect(result).toBeDefined();
    });

    it("should throw an error if an exception occurs", async () => {
      const expectedError = new Error("Get record count failed");
      contract.methods.recordCount = jest
        .fn()
        .mockRejectedValueOnce(expectedError);

      try {
        await smartContract.getRecordCount();
      } catch (error) {
        expect(error).toBe(expectedError);
      }
    });
  });

  describe("getAbi", () => {
    it("should return the stored ABI", async () => {
      const expectedAbi = ABI;

      const result = await smartContract.getAbi();
      expect(result).toBe(expectedAbi);
    });
  });
});
