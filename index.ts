import Web3 from "web3";
import { AbiItem } from "web3-utils";
import { Accounts } from "./src/Account/Account";
import Ledger from "./src/Ledger/Ledger";
import SmartContract from "./src/Contract/contract";
import { AccessControl } from "./src/AccessControl/accessControl";

export class BlockchainClient {
  private web3: Web3;
  private privateKeys: string[];
  private abi;
  private contractAddress: string;
  public Account: Accounts;
  public Ledger: Ledger;
  public Contract: SmartContract;
  public AccessControl: AccessControl;
  constructor(
    providedUrl: string,
    privateKeys: string[],
    abi: AbiItem | AbiItem[],
    contractAddress: string
  ) {
    this.abi = abi;
    this.web3 = new Web3(providedUrl);
    this.privateKeys = privateKeys;
    this.contractAddress = contractAddress;
    this.Account = this.accounts();
    this.Contract = this.contract();
    this.Ledger = this.ledger();
    this.AccessControl = this.access();
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
   * @returns {Ledger} - An instance of the Ledger class
   */
  private ledger(): Ledger {
    return new Ledger(this.web3, this.privateKeys);
  }

  private contract(): SmartContract {
    return new SmartContract(
      this.contractAddress,
      this.abi,
      this.privateKeys,
      this.web3
    );
  }

  /**
   * Creates a new instance of the AccessControl class for managing Ethereum accounts
   *
   * @returns {AccessControl} - An instance of the AccessControl class
   */
  private access(): AccessControl {
    return new AccessControl(
      this.web3,
      this.privateKeys,
      this.abi,
      this.contractAddress
    );
  }
}
