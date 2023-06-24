// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "./Pool.sol";
import "./interfaces/IMailbox.sol";
import "./interfaces/IInterchainGasPaymaster.sol";

contract Bridge is Pool {

    // address constant mailbox = 0x0E3239277501d215e17a4d31c487F86a425E110B;

    address immutable _mailbox;

    IInterchainGasPaymaster igp = IInterchainGasPaymaster(
        0x8f9C3888bFC8a5B25AED115A82eCbb788b196d2a
    );

    // uint32 constant avalancheDomain = 43114;
    // address constant avalancheRecipient = 0x36FdA966CfffF8a9Cdc814f546db0e6378bFef35;
    // address constant ethereumMailbox = 0x2f9DB5616fa3fAd1aB06cB2C906830BA63d135e3;

    constructor(
        address[3] memory _tokenAddresses,
        uint256[3] memory _prices,
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
     * @param _originTokenToSwap Domain of destination chain
     * @param _destTokenToSwap Domain of destination chain
     * @param _amountToDeposit Domain of destination chain
     * @param _destinationChainId Address of recipient on destination chain as bytes32
     * @param _bridgeOnDestinationChain Raw bytes content of message body
     * @param _destinationChainRecipient the address of person we are sending tokens to on the destination chain
     * @return The message ID inserted into the Mailbox's merkle tree
     */
    function swapAndBridge(
        address _originTokenToSwap,
        address _destTokenToSwap,
        address _outputToken,
        uint256 _amountToDeposit,
        uint32 _destinationChainId,
        address _bridgeOnDestinationChain,
        address _destinationChainRecipient
    ) external payable returns (bytes32) {

        // deposit amountToDeposit of tokenToSwap in Pool.sol
        
        bytes32 messageId = IMailbox(_mailbox).dispatch(
            _destinationChainId,
            _addressToBytes32(_bridgeOnDestinationChain),
            bytes(abi.encode(_destTokenToSwap, _outputToken, _amountToDeposit, _destinationChainRecipient))
        );

        igp.payForGas{ value: msg.value }(
            messageId, // The ID of the message that was just dispatched
            _destinationChainId, // The destination domain of the message
            500000, // 100k gas to use in the recipient's handle function
            msg.sender // refunds go to msg.sender, who paid the msg.value
        );

        deposit(_originTokenToSwap, _amountToDeposit);

        return messageId;

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
