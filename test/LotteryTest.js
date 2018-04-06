var Lottery = artifacts.require("Lottery");


contract ('Lottery', (accounts) => {

  var creatorAddress = accounts[0];
  var contractAddress;
  var lot;

  beforeEach( async () => {
    //lot=await Lottery.new();
    return Lottery.new().then(function(instance) {lot = instance});
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

      it('works with correct entry', async () => {
        await lot.bet(3,{value: 100, from:accounts[6]});

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

    // Fake tests locally
    describe('oraclize callback (fake/local)' , () => {

      it('should refund bets if there are no winners', async () => {

        await lot.bet(5,{from:accounts[1], value: 10});
        await lot.bet(6,{from:accounts[2], value: 20000});
        await lot.bet(7,{from:accounts[3], value: 100000});

        // await lot.finalize();
        await lot.__callback(0, '3'); // fake random number: 3

        assert.equal((await lot.pendingWithdrawals(accounts[1])).toNumber(), 7);
        assert.equal((await lot.pendingWithdrawals(accounts[2])).toNumber(), 14000);
        assert.equal((await lot.pendingWithdrawals(accounts[3])).toNumber(), 70000);


      });

      it('should handle one winner', async () => {

        await lot.bet(5,{from:accounts[1], value: 10000});
        await lot.bet(6,{from:accounts[2], value: 20000});
        await lot.bet(7,{from:accounts[3], value: 30000});

        // await lot.finalize();
        await lot.__callback(0, '5'); // fake random number: 5

        assert.equal((await lot.pendingWithdrawals(accounts[1])).toNumber(), 42000);

      });

      it('should handle two winners', async () => {

        await lot.bet(2,{from:accounts[1], value: 10000});
        await lot.bet(2,{from:accounts[2], value: 20000});
        await lot.bet(7,{from:accounts[3], value: 30000});
        await lot.bet(8,{from:accounts[4], value: 40000});

        // await lot.finalize();
        await lot.__callback(0, '2'); // fake random number: 2

        assert.equal((await lot.pendingWithdrawals(accounts[1])).toNumber(), 23333);
        assert.equal((await lot.pendingWithdrawals(accounts[2])).toNumber(), 46666);
        assert.equal((await lot.pendingWithdrawals(accounts[0])).toNumber(), 1); // rounding errors

      });

      it('should handle three winners', async () => {

        await lot.bet(2,{from:accounts[1], value: 10000});
        await lot.bet(2,{from:accounts[2], value: 20000});
        await lot.bet(2,{from:accounts[3], value: 30000});

        // await lot.finalize();
        await lot.__callback(0, '2'); // fake random number: 2

        assert.equal((await lot.pendingWithdrawals(accounts[1])).toNumber(), 7000);
        assert.equal((await lot.pendingWithdrawals(accounts[2])).toNumber(), 14000);
        assert.equal((await lot.pendingWithdrawals(accounts[3])).toNumber(), 21000);
      });

      // it('listens to events', async () => {
      //
      //   var bet = await lot.bet(2,{from:accounts[1], value: 10000});
      //   //await lot.bet(2,{from:accounts[2], value: 20000});
      //   //await lot.bet(2,{from:accounts[3], value: 30000});
      //
      //   bet.watch( function(error, result) {
      //     if (!error)
      //       alert("wait for a while, check for block Synchronization or block creation");
      //     console.log(result);
      //   })
      //
      //   // await lot.finalize();
      //   await lot.__callback(0, '2'); // fake random number: 2
      //
      //   assert.equal((await lot.pendingWithdrawals(accounts[1])).toNumber(), 7000);
      //   assert.equal((await lot.pendingWithdrawals(accounts[2])).toNumber(), 14000);
      //   assert.equal((await lot.pendingWithdrawals(accounts[3])).toNumber(), 21000);
      // });

    }); // describe
}); // contract


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
