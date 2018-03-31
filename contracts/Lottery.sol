pragma solidity ^0.4.21;

contract Lottery {

  address public owner;
  mapping (address => uint) balances; // used for preventing multiple entries
  address [][21] entries; // each of the 21 arrays contains the addresses placing a bet on that number

  function Lottery() public {
    owner = msg.sender;
  }

  function bet(uint x) public payable {
    require(1<=x && x<=20);
    require(balances[msg.sender]==0);
    //
  }
}
