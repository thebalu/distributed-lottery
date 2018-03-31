pragma solidity ^0.4.21;

contract Lottery {

  address public owner;
  mapping (address => uint) balances; // used for preventing multiple entries
  address [][21] entries; // each of the 21 arrays contains the addresses placing a bet on that number
  uint constant feePercent = 30;

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
  }


  function finalize() public onlyOwner {

  }

}
