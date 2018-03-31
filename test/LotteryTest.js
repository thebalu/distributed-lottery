var Lottery = artifacts.require("Lottery");

contract ('Lottery', (accounts) => {

  var creatorAddress = accounts[0];
  var contractAddress;

  it('should set the owner correctly', async () => {
    lot = await Lottery.deployed();
    own = await lot.owner();
    assert.equal(own, accounts[0]);
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



// working version with awaits
  //
  // it('should set the owner correctly', async () => {
  //   var contractInstance;
  //   //var inst2 = await Lottery.deployed();
  //   return Lottery.deployed().then( instance => {
  //
  //     //  assert.equal(1,2);
  //       lot = instance;
  //       return lot.owner();
  //     }).then(own => {
  //     //  console.log(own);
  //       assert.equal(own, accounts[0]);
  //     });
  //   });
  //
  // it('should set the owner correctly2', async () => {
  //   var contractInstance;
  //   lot2 = await Lottery.deployed();
  //   own2 = await lot2.owner();
  //   console.log("o2");
  //   console.log(own2);
  //     // assert.equal(contractInstance.owner(), accounts[0]);
  // //    console.log(lot);
  // //  console.log("---------------------------------------------")
  // //  console.log(Lottery);
  // });
