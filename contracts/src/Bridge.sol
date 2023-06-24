// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "./Pool.sol";
import "./interfaces/IMailbox.sol";

contract Bridge is Pool {

    // address constant mailbox = 0x0E3239277501d215e17a4d31c487F86a425E110B;

    address immutable _mailbox;

    // uint32 constant avalancheDomain = 43114;
    // address constant avalancheRecipient = 0x36FdA966CfffF8a9Cdc814f546db0e6378bFef35;
    // address constant ethereumMailbox = 0x2f9DB5616fa3fAd1aB06cB2C906830BA63d135e3;

    constructor(
        address[] memory _tokenAddresses,
        uint256[] memory _prices,
        address _originMailbox
    ) Pool (
        _tokenAddresses,
        _prices
    ) {
        _mailbox = _originMailbox;
    }

    // for access control on handle implementations
    modifier onlyMailbox() {
        require(msg.sender == _mailbox);
        _;    
    }

    /**
     * @notice Dispatches a message to the destination domain & recipient.
     * @param _tokenToSwap Domain of destination chain
     * @param _amountToDeposit Domain of destination chain
     * @param _destinationChainId Address of recipient on destination chain as bytes32
     * @param _bridgeOnDestinationChain Raw bytes content of message body
     * @param _destinationChainRecipient the address of person we are sending tokens to on the destination chain
     * @return The message ID inserted into the Mailbox's merkle tree
     */
    function swapAndBridge(
        address _tokenToSwap,
        address _outputToken,
        uint256 _amountToDeposit,
        address _originMailbox,
        uint32 _destinationChainId,
        address _bridgeOnDestinationChain,
        address _destinationChainRecipient
    ) external returns (bytes32) {

        // deposit amountToDeposit of tokenToSwap in Pool.sol

        bytes32 response = IMailbox(_originMailbox).dispatch(
            _destinationChainId,
            _addressToBytes32(_bridgeOnDestinationChain),
            bytes(abi.encode(_tokenToSwap, _outputToken, _amountToDeposit, _destinationChainRecipient))
        );

        deposit(_tokenToSwap, _amountToDeposit);

        return response;

    }

    function handle(
        uint32 _origin,
        bytes32 _sender,
        bytes calldata _body
    ) external onlyMailbox {

        (address inputToken, address outputToken, uint256 amount, address recipient) = abi.decode(_body, (address, address, uint256, address));

        withdraw(inputToken, outputToken, amount, recipient);
    
    }

    function _addressToBytes32(address _addr) internal pure returns (bytes32) {
        return bytes32(uint256(uint160(_addr)));
    }

}
