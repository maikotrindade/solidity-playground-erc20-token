pragma solidity ^0.4.24;

import "../node_modules/openzeppelin-solidity/contracts/token/ERC20/StandardToken.sol";
import "../node_modules/openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract Voting is StandardToken, Ownable {
  
    string public name = "VoteToken";
    string public symbol = "VOTE";
    uint8 public decimals = 2;
    uint public INITIAL_SUPPLY = 1000000;

    address public owner;
    uint8 countVotes;
    Product product;
    Voter[] voterList;

    struct Product {
        uint64 sku;
        string name;
        string url;
    }

    struct Voter {
        address voterAddress;
        uint8 rating;
    }

    constructor () public {
        owner = msg.sender;
        totalSupply_ = INITIAL_SUPPLY;
    }

    function addProduct(uint64 sku, string productName, string url) public onlyOwner {
        product = Product(sku, productName, url);
        countVotes = 0;
    }

    function getProduct() public view returns (uint64, string, string) {
        return (product.sku, product.name, product.url);
    }

    function voteProduct(uint8 rating, address voterAddress) public {
        require(validateProduct(product.sku), "Invalid Product");
        require(validateRating(rating), "Invalid Rating");
        require(checkVoter(voterAddress), "Invalid Voter");
        voterList.push(Voter(voterAddress, rating));
        countVotes++;
    }

    function getCounting() public view returns (uint8) {
        return countVotes;
    }

    function checkVoter(address voterAddress) public view returns (bool) {
        for (uint i = 0; i < voterList.length; i++) {
            if (voterList[i].voterAddress == voterAddress) {
                return false;
            }
        }
        return true;
    } 

    function validateRating(uint8 rating) public pure returns (bool) {
        return (rating > 0 && rating <= 5);
    }

    function validateProduct(uint64 sku) public pure returns (bool) {
        return (sku != 0);
    }

    function getResults() public view returns (uint16, uint) {
        uint ratingSum = 0;
        for (uint i = 0; i < voterList.length; i++) {
            ratingSum += voterList[i].rating;
        }
        return (countVotes, ratingSum);
    }

}