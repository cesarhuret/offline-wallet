// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "../src/Bridge.sol";
import "../src/MyToken.sol";

contract BridgeScript is Script {

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        address[3] memory tokenAddresses;
        tokenAddresses[0] = 0x8ACFC9D02FB13d83eE4Cfa9102d50f7abD0C3656;
        tokenAddresses[1] = 0x83EbCEF22bD896e522d27AF442Bf7F3f1efB52Eb;
        tokenAddresses[2] = 0xad7204FEF049294eEeD3046Cbc5995C123D83eE0;

        uint256[3] memory prices;
        prices[0] = 1;
        prices[1] = 1900;
        prices[2] = 31000;

        Bridge bridge = new Bridge(
            tokenAddresses,
            prices,
            0xCC737a94FecaeC165AbCf12dED095BB13F037685
        );

        IERC20(0x8ACFC9D02FB13d83eE4Cfa9102d50f7abD0C3656).approve(address(bridge), 100000000000000000000);
        IERC20(0x83EbCEF22bD896e522d27AF442Bf7F3f1efB52Eb).approve(address(bridge), 100000000000000000000);
        IERC20(0xad7204FEF049294eEeD3046Cbc5995C123D83eE0).approve(address(bridge), 100000000000000000000);

        MyToken(0x8ACFC9D02FB13d83eE4Cfa9102d50f7abD0C3656).mint(address(bridge), 100000000000000);
        MyToken(0x83EbCEF22bD896e522d27AF442Bf7F3f1efB52Eb).mint(address(bridge), 100000000000000);
        MyToken(0xad7204FEF049294eEeD3046Cbc5995C123D83eE0).mint(address(bridge), 100000000000000);

        vm.stopBroadcast();
    }
}
