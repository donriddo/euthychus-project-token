import React, { Component } from "react";
import EPTContract from "../contracts/EPT.json";
import getWeb3 from "../getWeb3";
import BigNumber from "bignumber.js";

import "../App.css";


const EPT_COST = 100;
const NAIRA_TO_KOBO = 100;

class Home extends Component {
  state = {
    storageValue: 0,
    totalSupply: 0,
    decimals: 10 ** 18,
    web3: null,
    accounts: null,
    contract: null,
    walletBalance: 0,
  };

  payWithPaystack() {
    const user = JSON.parse(window.localStorage.getItem('user'));
    const amount = prompt("How much EPT would you like to buy ?")
    var handler = window.PaystackPop.setup({
      key: 'pk_test_92558d1de85fca3ef39946faa9de4cfcaad9f44a',
      email: user.email,
      amount: Number(amount) * EPT_COST * NAIRA_TO_KOBO,
      currency: 'NGN',
      callback: (response) => {
        //this happens after the payment is completed successfully
        var reference = response.reference;
        alert('Payment complete! Reference: ' + reference);
        window.localStorage.setItem('eptBought', amount);
        window.location = '/';
      },
      onClose: function () {
        alert('Transaction was not completed, window closed.');
      },
    });
    handler.openIframe();
  }

  async buyEPT(amount) {
    const { contract, accounts } = this.state;
    try {
      const response = await contract.methods
        .buyEPT(
          new BigNumber(amount).toFixed()
        )
        .send({ from: accounts[0] });
      console.log(response);
      window.localStorage.removeItem('eptBought');
      window.location = '/';
    } catch (error) {
      console.error(error);
    }
  }

  async transferEPT() {
    const recipient = prompt("Please paste in the address of the recipient");
    const amount = prompt("How much would you like to send ?");
    const { contract, accounts } = this.state;
    try {
      const response = await contract.methods
        .transfer(
          recipient,
          new BigNumber(amount).multipliedBy(this.state.decimals).toFixed()
        )
        .send({ from: accounts[0] });
      console.log(response);
      window.location = '/';
    } catch (error) {
      console.error(error);
    }
  }

  loadWeb3 = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
      console.log({ accounts });

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = EPTContract.networks[networkId];
      const instance = new web3.eth.Contract(
        EPTContract.abi,
        deployedNetwork && deployedNetwork.address,
      );
      console.log({ instance, networkId, deployedNetwork, nws: EPTContract.networks });

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.start);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  async componentDidMount() {
    await this.loadWeb3();

    const amount = Number(window.localStorage.getItem('eptBought'));
    if (amount) {
      await this.buyEPT(amount);
    }
  }

  start = async () => {
    const { contract } = this.state;

    const response = await contract.methods.totalSupply().call();
    const totalSupply = new BigNumber(response)
      .div(this.state.decimals).toFormat();
    let walletBalance = await contract.methods
      .balanceOf(this.state.accounts[0]).call();
    walletBalance = new BigNumber(walletBalance)
      .div(this.state.decimals).toFormat()
    // Update state with the total token supply.
    this.setState({ totalSupply, walletBalance });
  };

  render() {
    // const user = localStorage.getItem('user');

    return !this.state.web3
      ? (
        <div>Loading Web3, accounts, and contract...</div>
      )
      : (
        <div className="content-area">
          <h4>There are currently {this.state.totalSupply} EPT tokens in circulation.</h4>
          <button onClick={this.payWithPaystack} className="link-button">
            Buy EPT (EPT 1 = NGN 100)
          </button>

          <button onClick={this.transferEPT.bind(this)} className="link-button">
            Send EPT to a friend
          </button>

          <div>
            Wallet Balance: EPT {this.state.walletBalance}
          </div>
        </div>
      );
  }
}

export default Home;
