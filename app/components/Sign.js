import { Text, View } from "react-native";
import { getItemAsync } from "expo-secure-store";
import { useState } from "react";
import DropDownPicker from "react-native-dropdown-picker";
import { touchableOpacityStyles } from "./styles";
import { TouchableOpacity } from "react-native";
import { chains } from "../data/chains.json";
import { tokens } from "../data/tokens.json";
import Bridge from "../data/Bridge.json";
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

        const merchantData = route.params;

        const fromChain = chains.filter(c => c.value === chain)[0];
        const fromToken = tokens.filter(t => t.value === token)[0];

        console.log(merchantData, chains)
        
        const toChain = chains.filter(c => c.value === merchantData.chain)[0];
        const toToken = (tokens.filter(t => t.value === merchantData.token)[0]);
        
        console.log(fromChain, fromToken, toChain, toToken)

        const bridgeInterface = new utils.Interface(Bridge.abi);

        const params = [
            fromToken.addresses[fromChain.chainId], //_originInputToken
            toToken.addresses[fromChain.chainId], //_originOutputToken  
            toToken.addresses[toChain.chainId], //_destOutputToken 
            BigNumber.from((merchantData.amount * 10**toToken.decimals).toString()), //_amountToPayInOutputToken 
            toChain.chainId, //_destinationChainId
            toChain.bridge, //_bridgeOnDestinationChain 
            receiver, //_destinationChainRecipient 
        ]

        console.log(params)

        const data = bridgeInterface.encodeFunctionData(
            "swapAndBridge", 
            params
        )

        console.log(data)

        const wallet = new ethers.Wallet(privateKey);
        const transactionCount = await AsyncStorage.getItem('transactionCount');
        
        const tx = {
            nonce: parseInt(transactionCount),
            type: 2,
            maxPriorityFeePerGas: utils.parseUnits("3", "gwei"),
            maxFeePerGas: utils.parseUnits("4", "gwei"),
            gasLimit: BigNumber.from('150000'),
            to: fromChain.bridge,
            value: utils.parseEther('0.08'),
            data: data,
            chainId: fromChain.chainId
        }
        
        const signature = await wallet.signTransaction(tx);

        console.log(signature)

        // await AsyncStorage.setItem('transactionCount', (parseInt(transactionCount) + 1).toString());

        // navigation.replace('QRCode', signature)
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
                    disabled={!token || !chain}
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