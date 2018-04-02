var Lottery = artifacts.require("Lottery");


contract ('Lottery', (accounts) => {

  var creatorAddress = accounts[0];
  var contractAddress;
  var lot;

  beforeEach( async () => {
    lot=await Lottery.deployed();
  });

  it('should set the owner correctly', async () => {
    //lot = await Lottery.deployed();
    own = await lot.owner();
    assert.equal(own, accounts[0]);
  });

  describe('bet()', () => {
    it('requires that 1<=x<=20', async () => {

        let err = null;
        try {
          await lot.bet(0,{value:1,from:accounts[1]});
        } catch (e) {
          err = e;
        }
        assert.ok(err instanceof Error, 'should have reverted')
        assert.isAbove(err.message.search('revert'), -1, 'error message should have contained "revert"');

        err = null;
        try {
          await lot.bet(21,{value:1,from:accounts[1]});
        } catch (e) {
          err = e;
        }
        assert.ok(err instanceof Error, 'should have reverted')
        assert.isAbove(err.message.search('revert'), -1, 'error message should have contained "revert"');
      });

      it('requires value>0', async () => {

        let err = null;
        try{
          await lot.bet(1,{value:0,from:accounts[1]});
        } catch(e) {
          err=e;
        }
        assert.ok(err instanceof Error, 'should have reverted')
        assert.isAbove(err.message.search('revert'), -1, 'error message should have contained "revert"');
      });
      it('doesnt allow multiple entries', async () => {
        let err = null;
        await lot.bet(15,{value:10,from:accounts[1]});
        try {
          await lot.bet(4,{value:10,from:accounts[1]});
        } catch (e) {
          err = e;
        }
        assert.ok(err instanceof Error, 'should have reverted')
        assert.isAbove(err.message.search('revert'), -1, 'error message should have contained "revert"');
      });

    });

    describe('finalize()' , () => {

      it('can only be called by owner', async () => {
        let err = null;
        try{
          await lot.finalize({from:accounts[1]});
        } catch(e) {
          err=e;
        }
        assert.ok(err instanceof Error, 'should have reverted')
        assert.isAbove(err.message.search('revert'), -1, 'error message should have contained "revert"');
      });


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
