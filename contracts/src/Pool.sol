// SPDX-License-Identifier: MIT

pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Pool {

    mapping(address => uint256) internal tokenPrices;

    constructor(
        address[3] memory tokenAddresses,
        uint256[3] memory prices
    ) {

        require(tokenAddresses.length == prices.length, "tokenAddresses and prices must be the same length");

        for (uint256 i = 0; i < tokenAddresses.length; i++) {

            setTokenPrice(tokenAddresses[i], prices[i]);

        }

    }

    function setTokenPrice(address tokenAddress, uint256 price) internal {

        tokenPrices[tokenAddress] = price;

    }

    function deposit(address originInputToken, uint256 amountOfInputToken) internal {

        IERC20 token = IERC20(originInputToken);

        token.transferFrom(msg.sender, address(this), amountOfInputToken);

    }    

    function withdraw(address outputToken, uint256 amountInOutputToken, address recipient) internal {
        
        IERC20 outputTokenContract = IERC20(outputToken);

        outputTokenContract.transfer(recipient, amountInOutputToken);

    }

}