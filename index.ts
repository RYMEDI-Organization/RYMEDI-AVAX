import Web3 from "web3";
import { AbiItem } from "web3-utils";
import { Accounts } from "./src/Account/Account";
import Transaction from "./src/Transaction/Transaction";
import SmartContract from "./src/Contract/contract";

export class BlockchainClient {
  private web3: Web3;
  private privateKeys: string[];
  private abi;
  private contractAddress: string;
  public Account: Accounts
  public Transaction: Transaction
  public Contract: SmartContract

  constructor(
    providedUrl: string,
    privateKey: string[],
    abi: AbiItem | AbiItem[],
    contractAddress: string
  ) {
    this.abi = abi;
    this.web3 = new Web3(providedUrl);
    this.privateKeys = privateKey;
    this.contractAddress = contractAddress;
    this.Account = this.accounts()
    this.Contract = this.contract()
    this.Transaction = this.transactions()
  }

  /**
   * Creates a new instance of the Accounts class for managing Ethereum accounts
   *
   * @returns {Accounts} - An instance of the Accounts class
   */
  private accounts(): Accounts {
    return new Accounts(this.web3, this.privateKeys);
  }
  /**
   * Creates a new instance of the Transaction class for managing Ethereum accounts
   *
   * @returns {Transaction} - An instance of the Transaction class
   */
  private transactions(): Transaction {
    return new Transaction(this.web3, this.privateKeys);
  }

  private contract(): SmartContract {
    return new SmartContract(
      this.contractAddress,
      this.abi,
      this.privateKeys,
      this.web3
    );
  }
}