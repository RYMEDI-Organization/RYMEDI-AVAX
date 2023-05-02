import Web3 from "web3";
import { AbiItem } from "web3-utils";
import { Accounts } from "./src/Account/Account";
import Transaction from "./src/Transaction/Transaction";

export class rymediAvaxHelper {
  private web3: Web3;
  private defaultPrivateKey: string[];
  private abi;
  private contractAddress: string;
  constructor(
    providedUrl: string,
    privateKey: string[],
    abi: AbiItem | AbiItem[],
    contractAddress: string
  ) {
    this.web3 = new Web3(providedUrl);
    this.defaultPrivateKey = privateKey;
    this.contractAddress = contractAddress;
    this.abi = new this.web3.eth.Contract(abi, contractAddress);
  }

  /**
   * Creates a new instance of the Accounts class for managing Ethereum accounts
   *
   * @returns {Accounts} - An instance of the Accounts class
   */
  accounts(): Accounts {
    return new Accounts(this.web3, this.defaultPrivateKey);
  }
  /**
   * Creates a new instance of the Transaction class for managing Ethereum accounts
   *
   * @returns {Transaction} - An instance of the Transaction class
   */
  transactions(): Transaction {
    return new Transaction(this.web3, this.defaultPrivateKey);
  }
}
