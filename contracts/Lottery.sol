pragma solidity ^0.4.21;

contract Lottery {

  address public owner;
  mapping (address => uint) balances; // used for preventing multiple entries
  address [][21] entries; // each of the 21 arrays contains the addresses placing a bet on that number
  uint constant feePercent = 30;
  mapping (address => uint) pendingWithdrawals;
  uint public totalPot = 0;
  uint[21] sumOfBetsOn;

  event Div(uint x);

  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }


  function Lottery() public {
    owner = msg.sender;
  }

  function bet(uint x) public payable {
    require(1<=x && x<=20);
    require(balances[msg.sender]==0);
    require(msg.value>0);
    uint fee = msg.value / 100 * feePercent; // division always truncates, so the fee may be a bit less
    owner.transfer(fee);

    balances[msg.sender]+= (msg.value - fee);
    entries[x].push(msg.sender);
    sumOfBetsOn[x] += msg.value - fee;
    totalPot += msg.value - fee;
  }


  function finalize() public onlyOwner {
    // stop accepting bets
    // generate random number
    uint winningNumber = 5; // placeholder
    if(entries[winningNumber].length == 0 ) {
      // refund all
      for(uint i=1; i<=20; i++) {
        for(uint j=0; j<entries[i].length; j++) {
          pendingWithdrawals[entries[i][j]] += balances[entries[i][j]];
          balances[entries[i][j]] = 0;
        }
      }
    } else if(entries[winningNumber].length == 1) {
      // transfer to the winner
      address winner = entries[winningNumber][0];
      for( i=1; i<=20; i++) {
        for( j=0; j<entries[i].length; j++) {
          pendingWithdrawals[winner] += balances[entries[i][j]];
          balances[entries[i][j]] = 0;
        }
      }
    } else {
      // distribute between winners
      uint moneyLeft = totalPot;
      for(j = 0; j < entries[winningNumber].length; j++) {
        pendingWithdrawals[entries[winningNumber][j]] +=
              balances[entries[winningNumber][j]] * totalPot / uint(sumOfBetsOn[winningNumber]);
        moneyLeft -= balances[entries[winningNumber][j]] * totalPot / uint(sumOfBetsOn[winningNumber]);
      }

      // if some wei remains because of int division, make it withdrawable by owner
      pendingWithdrawals[owner] += moneyLeft;
      moneyLeft = 0;

      //zero all balances
      for( i=1; i<=20; i++) {
        for( j=0; j<entries[i].length; j++) {
          balances[entries[i][j]] = 0;
        }

      }
    }

    // reset contract:
    totalPot = 0;
    // remove all entries
    // start accepting bets
  }

}
