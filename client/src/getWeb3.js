import Web3 from "web3";

const getWeb3 = () =>
  new Promise(async (resolve, reject) => {
    try {
      if (document.readyState === "complete") {
        const web3 = await loadWeb3();
        return resolve(web3)
      }

      console.log('Page is not fully loaded yet. Registering event to load web3 when fully loaded');
    } catch (error) {
      reject(error);
    }
    // Wait for loading completion to avoid race conditions with web3 injection timing.
    window.addEventListener("load", async () => {
      // Modern dapp browsers...
      try {
        const web3 = await loadWeb3();
        resolve(web3)
      } catch (error) {
        reject(error);
      }
    });
  });

async function loadWeb3() {
  if (window.ethereum) {
    const web3 = new Web3(window.ethereum);
    try {
      // Request account access if needed
      await window.ethereum.enable();
      // Acccounts now exposed
      return web3;
    } catch (error) {
      throw error;
    }
  }
  // Legacy dapp browsers...
  else if (window.web3) {
    // Use Mist/MetaMask's provider.
    const web3 = window.web3;
    console.log("Injected web3 detected.");
    return web3;
  }
  // Fallback to localhost; use dev console port by default...
  else {
    const provider = new Web3.providers.HttpProvider(
      "http://127.0.0.1:8545"
    );
    const web3 = new Web3(provider);
    console.log("No web3 instance injected, using Local web3.");
    return web3;
  }
}

export default getWeb3;
