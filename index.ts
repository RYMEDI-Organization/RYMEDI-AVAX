import Web3 from "web3";
import { AbiItem } from "web3-utils";
import { Accounts } from "./src/Account/Account";
import Transaction from "./src/Transaction/Transaction";
import Contract from "./src/Contract/contract";

export class rymediAvaxHelper {
  private web3: Web3;
  private defaultPrivateKey: string[];
  private abi;
  private contractAddress: string;
  private contract: any;
  constructor(
    providedUrl: string,
    privateKey: string[],
    abi: AbiItem | AbiItem[],
    contractAddress: string
  ) {
    this.abi = abi;
    this.web3 = new Web3(providedUrl);
    this.defaultPrivateKey = privateKey;
    this.contractAddress = contractAddress;
    this.contract = new this.web3.eth.Contract(abi, contractAddress);
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

  Contract(): Contract {
    return new Contract(this.contractAddress, this.abi, this.defaultPrivateKey, this.web3, this.contract)
  }
}
