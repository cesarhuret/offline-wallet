// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

interface IMailbox {

    /**
     * @notice Dispatches a message to the destination domain & recipient.
     * @param _destination Domain of destination chain
     * @param _recipient Address of recipient on destination chain as bytes32
     * @param _body Raw bytes content of message body
     * @return The message ID inserted into the Mailbox's merkle tree
     */
    function dispatch(
        uint32 _destination,
        bytes32 _recipient,
        bytes calldata _body
    ) external returns (bytes32);

    function process(
        bytes calldata _metadata,
        bytes calldata _message
    ) external;
}