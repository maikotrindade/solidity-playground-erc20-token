const HDWalletProvider = require('truffle-hdwallet-provider');
let mnemonic = 'YOUR SECRET';

//Rinkeby – Maiko's accounts: 

module.exports = {
  networks: {

    rinkeby: {
      provider: () => new HDWalletProvider(mnemonic, 'YOUR TOKEN'),
      network_id: '*',
      gas: 4500000,
      gasPrice: 25000000000,
    }

    // development: {
    //   host: "127.0.0.1",
    //   port: 8545,
    //   network_id: "*"
    // }

  }
};