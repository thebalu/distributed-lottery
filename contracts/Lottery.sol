pragma solidity ^0.4.21;

contract Lottery{

  address public owner;
  mapping (address => uint) balances; // used for preventing multiple entries
  address [][21] entries; // each of the 21 arrays contains the addresses placing a bet on that number
  uint constant feePercent = 30;
  mapping (address => uint) public pendingWithdrawals;
  uint public totalPot = 0;
  uint[21] public sumOfBetsOn;

  event EntryPlaced(address _addr, uint _guessedNumber, uint _sentValue, uint _fee, uint _balance);
  event NoWinner(uint _winningNumber);
  event CorrectGuess(address _winner, uint _winnings, uint _pendingWithdrawal);

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

    emit EntryPlaced(msg.sender, x, msg.value, fee, balances[msg.sender]);
  }


  function finalize() public onlyOwner {
    // generate random number
    uint winningNumber = 5; // placeholder
    if(entries[winningNumber].length == 0 ) {
      // no winner, refund each
      for(uint i=1; i<=20; i++) {
        for(uint j=0; j<entries[i].length; j++) {
          pendingWithdrawals[entries[i][j]] += balances[entries[i][j]];
          balances[entries[i][j]] = 0;
        }
      }
      emit NoWinner(winningNumber);
    } else if(entries[winningNumber].length == 1) {
      // transfer to the winner
      address winner = entries[winningNumber][0];
      for( i=1; i<=20; i++) {
        for( j=0; j<entries[i].length; j++) {
          pendingWithdrawals[winner] += balances[entries[i][j]];
          balances[entries[i][j]] = 0;
        }
      }
      emit CorrectGuess(winner, totalPot, pendingWithdrawals[winner]);
    } else {
      // distribute between winners
      uint moneyLeft = totalPot;
      uint amount;
      for(j = 0; j < entries[winningNumber].length; j++) {
        amount = balances[entries[winningNumber][j]] * totalPot / uint(sumOfBetsOn[winningNumber]);
        pendingWithdrawals[entries[winningNumber][j]] += amount;
        moneyLeft -= amount;

        emit CorrectGuess(entries[winningNumber][j], amount, pendingWithdrawals[entries[winningNumber][j]]);

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

    // reset contract
    totalPot = 0;
    delete entries;
    delete sumOfBetsOn;
  }

  function withdraw() public {
        uint amount = pendingWithdrawals[msg.sender];
        pendingWithdrawals[msg.sender] = 0;
        msg.sender.transfer(amount);
    }

}
