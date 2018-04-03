module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },

    rinkeby: {
          host: "localhost", // Connect to geth on the specified
          port: 8545,
          from: "0x64CD039A8C27749Daee925dD9343a6f07a4a6A8f", // default address to use for any transaction Truffle makes during migrations
          network_id: 4,
          gas: 4612388 // Gas limit used for deploys
        }
  }
};
