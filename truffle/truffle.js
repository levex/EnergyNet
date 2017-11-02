module.exports = {
  build: "./get_master_abi.sh",
  networks: {
    localhost: {
      host: "localhost",
      port: 8545,
      network_id: "*", // Match any network id
    }
  }
};
