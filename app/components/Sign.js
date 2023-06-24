import { Text, View } from "react-native";
import { getItemAsync } from "expo-secure-store";
import { useState } from "react";
import DropDownPicker from "react-native-dropdown-picker";
import { touchableOpacityStyles } from "./styles";
import { TouchableOpacity } from "react-native";
import { chains } from "../data/chains.json";
import { tokens } from "../data/tokens.json";
import { abi } from "../data/IERC20.json"
import AsyncStorage from '@react-native-async-storage/async-storage';
import "react-native-get-random-values"
import "@ethersproject/shims"
import { BigNumber, ethers, utils } from "ethers";

export const Sign = ({route, navigation}) => {

    const [token, setToken] = useState();

    const [chain, setChain] = useState();

    const [openToken, setOpenToken] = useState(false);

    const [openChain, setOpenChain] = useState(false);

    const receiver = route.params?.receiver;

    const sign = async () => {

        const privateKey = await getItemAsync('privateKey');

        const chainData = chains.filter(c => c.value === chain)[0];
        const tokenData = tokens.filter(t => t.value === token)[0];
        const tokenAddress = tokenData.addresses[chainData.chainId];

        const inf = new utils.Interface(abi);

        const data = inf.encodeFunctionData(
            "transfer", 
            [
                receiver,
                BigNumber.from((route.params.amount * 10**tokenData.decimals).toString())
            ]
        )

        const wallet = new ethers.Wallet(privateKey);
        const transactionCount = await AsyncStorage.getItem('transactionCount');
        
        const tx = {
            nonce: parseInt(transactionCount),
            type: 2,
            maxPriorityFeePerGas: utils.parseUnits("5", "gwei"),
            maxFeePerGas: utils.parseUnits("20", "gwei"),
            gasLimit: BigNumber.from('40000'),
            to: tokenAddress,
            value: utils.parseEther('0'),
            data: data,
            chainId: chainData.chainId
        }
        
        const signature = await wallet.signTransaction(tx);

        await AsyncStorage.setItem('transactionCount', (parseInt(transactionCount) + 1).toString());

        navigation.replace('QRCode', signature)
    }

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start', padding: 50}}>
            <Text style={{fontSize: 30}}>Sign Transaction</Text>

            <View style={{flex: 1, justifyContent: 'center'}}>
                <DropDownPicker
                    mode="BADGE"
                    open={openChain}
                    value={chain}
                    items={chains}
                    setOpen={setOpenChain}
                    setValue={setChain}
                    searchable={true}
                    searchPlaceholder="Search for a chain..."
                    placeholder="Select a chain"
                    zIndex={3000}
                    zIndexInverse={1000}
                    style={{
                        alignSelf: 'center',
                        maxWidth: 300,
                        marginBottom: 15
                    }}
                    containerProps={{
                        maxWidth: 300
                    }}
                />
                <DropDownPicker
                    mode="BADGE"
                    open={openToken}
                    value={token}
                    items={tokens}
                    setOpen={setOpenToken}
                    setValue={setToken}
                    searchable={true}
                    searchPlaceholder="Search for a token..."
                    placeholder="Select a token"
                    zIndex={2000}
                    zIndexInverse={2000}
                    style={{
                        alignSelf: 'center',
                        maxWidth: 300,
                        marginBottom: 15
                    }}
                    containerProps={{
                        maxWidth: 300
                    }}
                />
                <Text style={{fontSize: 20, borderWidth: 1, borderRadius: 7, marginBottom: 15, padding: 10}}>To: {receiver?.substring(0, 6)}...{receiver?.substring(receiver?.length - 4, receiver?.length)}</Text>
                <Text style={{fontSize: 20, borderWidth: 1, borderRadius: 7, padding: 10}}>Amount: {route.params?.amount} {route.params?.token.toUpperCase()}</Text>
            </View>

            <View style={{justifyContent: 'flex-end'}}>
                <TouchableOpacity
                    style={[touchableOpacityStyles, {backgroundColor: "#000"}]}
                    onPress={sign}
                >
                    <Text 
                        style={{fontSize: 20, color: "#fff"}}
                    >
                        Sign Transaction 
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );

}