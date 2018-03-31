var Lottery = artifacts.require("Lottery");

contract ('Lottery', (accounts) => {

  var creatorAddress = accounts[0];
  var contractAddress;

  it('should set the owner correctly', async () => {
    contractInstance = await Lottery.deployed();
    assert.equal(contractInstance.owner, accounts[0]);
  });


});


// For reference:
// it('should set the owner correctly', () => {
//   //var contractInstance = await Lottery.deployed();
//   var contractInstance;
//   return Lottery.deployed().then( instance => {
//     contractInstance = instance;
//   }).then( result => {
//     assert.equal(contractInstance.address, "0123", "should fail");
//   });
// });
//
// it('do the same with await', async () => {
//   var contractInstance = await Lottery.deployed();
//   assert.equal(contractInstance.address, "0x0", "this should also fail");
//
// });
