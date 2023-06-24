// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";

interface IERC20 {
    function balanceOf(address account) external view returns (uint256);
}

contract Wallet {
    uint256 public number;

    ISwapRouter swapRouter;

    constructor(address _swapRouter) {
        swapRouter = ISwapRouter(_swapRouter);
    }

    function setNumber(uint256 newNumber) public {
        number = newNumber;
    }

    // calldata will have the following
        // USDorETH: bool
        // valueOf: uint256
        // tokensAccepted: address[]
        // tokensOwned: address[]
        // tokenForPayment: address

    // function calculateTokenAmounts(bool USDorETH, uint256 valueOf, address[] calldata tokens, address tokenOwned) internal returns (uint256[] memory)  {
    //     uint256 amountOfTokenOwned = IERC20(tokenOwned).balanceOf(address(this));
    // }

    function increment() public {
        number++;
    }
}
