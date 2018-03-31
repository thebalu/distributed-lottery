var Lottery = artifacts.require("Lottery");

contract ('Lottery', (accounts) => {

  var creatorAddress = accounts[0];

  Lottery.deployed().then( instance => {
    contractAddress = instance.address;
  });



} );
