// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@hyperlane/interfaces/IMailbox.sol";


interface IERC20 {
    function balanceOf(address account) external view returns (uint256);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function transfer(address recipient, uint256 amount) external returns (bool);
}
contract Coinbase {
    function addressToBytes32(address _addr) internal pure returns (bytes32) {
        return bytes32(uint256(uint160(_addr)));
    }

    mapping (address => uint256) public tokenToBalance;
    mapping (uint32 => IMailbox) public IdToMailbox;

    function updateBalance(address token) public {
        tokenToBalance[token] = IERC20(token).balanceOf(address(this));
    }

    function setMailbox(address mailboxAddress) public {
        IMailbox mailbox = IMailbox(mailboxAddress);
        IdToMailbox[mailbox.localDomain()] = mailbox;
    }

    function bridgeAndSwap(
        uint32 destinationChain, 
        address destinationAddress,
        address recipient,
        address tokenIn, 
        address tokenOut, 
        uint256 amountIn, 
        uint256 amountOut
    ) public {
        require(IERC20(tokenIn).balanceOf(address(this)) - tokenToBalance[tokenIn] == amountIn, "Not enough tokens to bridge");
        IERC20(tokenIn).transferFrom(msg.sender, address(this), amountIn);
        updateBalance(tokenIn);
        IMailbox mailbox = IdToMailbox[destinationChain];
        mailbox.dispatch(destinationChain, addressToBytes32(destinationAddress), abi.encodePacked(tokenOut, amountOut, recipient));
    }

    function handle(
        uint32 _origin,
        bytes32 _sender,
        bytes calldata _body
        ) external {
            (address tokenOut, uint256 amountOut, address recipient) = abi.decode(_body, (address, uint256, address));
            IERC20(tokenOut).transfer(recipient, amountOut);
            updateBalance(tokenOut);
        }
}