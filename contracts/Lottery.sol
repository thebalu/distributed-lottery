pragma solidity ^0.4.21;

contract Lottery {

  address public owner;

  function Lottery() public {
    owner = msg.sender;
  }
/* 
  function getOwner() public  returns(address) {
    return owner;
  } */

}
