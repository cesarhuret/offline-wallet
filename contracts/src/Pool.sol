// SPDX-License-Identifier: MIT

pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Pool {

    mapping(address => uint256) private tokenPrices;

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

    function deposit(address tokenAddress, uint256 amount) internal {

        IERC20 token = IERC20(tokenAddress);

        token.transferFrom(msg.sender, address(this), amount);

    }    

    function withdraw(address inputToken, address outputToken, uint256 amount, address recipient) internal {

        require(tokenPrices[inputToken] > 0, "Input token price not set");

        require(tokenPrices[outputToken] > 0, "Output token price not set");

        uint256 inputTokenPrice = tokenPrices[inputToken];

        uint256 outputTokenPrice = tokenPrices[outputToken];

        uint256 outputAmount = (amount * inputTokenPrice) / outputTokenPrice;
        
        IERC20 outputTokenContract = IERC20(outputToken);

        outputTokenContract.transfer(recipient, outputAmount);

    }

}