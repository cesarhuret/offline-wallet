// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router01.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol";
import "@uniswap/v2-core/contracts/interfaces/IPair.sol";

interface IERC20 {
    function balanceOf(address account) external view returns (uint256);
}

contract Wallet {
    IUniswapV2Router01 router;
    IUniswapv2Factory factory;
    IERC20 USDC;
    IERC20 WETH;


    constructor (address _router, address _USDC) {
        router = IUniswapV2Router01(_router);
        factory = IUniswapV2Factory(router.factory());
        USDC = IERC20(_USDC);
        WETH = IERC20(router.WETH());
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

    function calculateTokenOwnedAmounts(bool isUSDorETH, uint256 valueOfUSDorETH, address[] calldata tokens, address tokenOwned) internal returns (uint256[] memory)  {
        uint256 amountOfTokenOwned = IERC20(tokenOwned).balanceOf(address(this));
        if (isUSDorETH) {
            // get price in usd
            (address token0, address token1) = tokenOwned < USDC ? (tokenOwned, USDC) : (USDC, tokenOwned);
            IPair pair = IPair(factory.getPair(token0, token1));
            (uint256 reserve0, uint256 reserve1, ) = pair.getReserves();
            uint256 valueOfOwned = router.getAmountIn(valueOfUSDorETH, reserve0, reserve1);
        } else {
            // get price in eth
            (address token0, address token1) = tokenOwned < WETH ? (tokenOwned, WETH) : (WETH, tokenOwned);
            IPair pair = IPair(factory.getPair(token0, token1));
            (uint256 reserve0, uint256 reserve1, ) = pair.getReserves();
            uint256 valueOfOwned = router.getAmountOut(valueOfUSDorETH, reserve0, reserve1);
        }
        require(valueOfOwned >= amountOfTokenOwned, "Not enough tokens owned");
        

    }
}
