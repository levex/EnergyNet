module.exports = {
  build: "./get_abis.sh",
  networks: {
    localhost: {
      host: "localhost",
      port: 8545,
      network_id: "*", // Match any network id
    }
  }
};
