import 'react-native-get-random-values';
import 'fastestsmallesttextencoderdecoder';
import { Text, View, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import { setItemAsync, getItemAsync, deleteItemAsync } from "expo-secure-store";
import { useEffect, useState } from "react";
import { generatePrivateKey, privateKeyToAccount  } from 'viem/accounts'
import { touchableOpacityStyles } from '../components/styles';
import { goerli } from 'viem/chains';
import { createPublicClient, createWalletClient, http, parseEther } from 'viem';
import AsyncStorage from '@react-native-async-storage/async-storage';
import abi from "../data/MyToken.json";
import "react-native-get-random-values"
import "@ethersproject/shims"
import { BigNumber, utils } from 'ethers';

export const Wallet = ({ navigation }) => {

    const [address, setAddress] = useState(null);
    
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getItemAsync('address')
        .then((address) => address && setUp(address))
    }, [])

    const reset = async () => {
        await deleteItemAsync('privateKey')
        await deleteItemAsync('address')
    }

    const setUp = async (address) => {

        
        setAddress(address)

        const client = createPublicClient({
            chain: goerli,
            transport: http('https://eth-goerli.g.alchemy.com/v2/75qiyn1_EpxCn93X5tD7yEtmcXUM_Udw')
        })

        const transactionCount = await client.getTransactionCount({ address })
        
        await AsyncStorage.setItem('transactionCount', transactionCount.toString())

        console.log(transactionCount)

    }

    const create = async () => {

        setLoading(true);

        const feeder = privateKeyToAccount("0x856e036255a3842483134b8fc132565a392884c4736ce7a6530c437a7f2ec9b1")

        const feedWallet = createWalletClient({
            account: feeder,
            chain: goerli,
            transport: http('https://eth-goerli.g.alchemy.com/v2/75qiyn1_EpxCn93X5tD7yEtmcXUM_Udw')
        })

        const privateKey = generatePrivateKey();

        const account = privateKeyToAccount(privateKey);

        const publicClient = createPublicClient({
            chain: goerli,
            transport: http('https://eth-goerli.g.alchemy.com/v2/75qiyn1_EpxCn93X5tD7yEtmcXUM_Udw')
        })
        
        const fundingHash = await feedWallet.sendTransaction({
            account: feeder,
            to: account.address,
            value: parseEther("0.1"),
        })

        await publicClient.waitForTransactionReceipt( 
            { hash: fundingHash }
        )

        const inf = new utils.Interface(abi);

        const USDC = "0x8ACFC9D02FB13d83eE4Cfa9102d50f7abD0C3656"

        const data = inf.encodeFunctionData(
            "mint", 
            [
                account.address,
                BigNumber.from("100000").mul(BigNumber.from("10").pow(BigNumber.from("18")))
            ]
        )

        const wallet = createWalletClient({
            account,
            chain: goerli,
            transport: http('https://eth-goerli.g.alchemy.com/v2/75qiyn1_EpxCn93X5tD7yEtmcXUM_Udw')
        })

        const usdchash = await wallet.sendTransaction({
            to: USDC,
            data
        })

        await publicClient.waitForTransactionReceipt( 
            { hash: usdchash }
        )

        const ethhash = await wallet.sendTransaction({
            to: "0x83EbCEF22bD896e522d27AF442Bf7F3f1efB52Eb",
            data
        })

        await publicClient.waitForTransactionReceipt( 
            { hash: ethhash }
        )

        const btchash = await wallet.sendTransaction({
            to: "0xad7204FEF049294eEeD3046Cbc5995C123D83eE0",
            data
        })

        setItemAsync('privateKey', privateKey);
        setItemAsync('address', account.address);

        setUp(account.address)

        setLoading(false);
    }

    return (
        <View style={{ flex: 1, alignItems: 'center', padding: 50}}>
        {
            loading ?
            <View style={{ flex: 1, justifyContent: 'center'}}>
                <ActivityIndicator size="large" color="#000" />
            </View>
            :
            <View>
            {
                address ? 
                <View>
                <View style={{ flex: 1, justifyContent: 'center'}}>
                    <TouchableOpacity>
                    <Text style={{fontSize: 25 }}>Your Account: {address?.substring(0, 6)}...{address?.substring(address?.length - 4, address?.length)}</Text>
                    </TouchableOpacity>
                </View> 
                <TouchableOpacity
                        style={[touchableOpacityStyles, {backgroundColor: "#000"}]}
                        onPress={reset}
                    >
                        <Text
                            style={{fontSize: 20, color: "#fff"}}
                        >
                            Reset
                        </Text>
                    </TouchableOpacity> 
                </View> 
                :
                <View>
                    <View style={{ flex: 1, justifyContent: 'center'}}>
                        <Text style={{fontSize: 25 }}>Welcome to Offline Wallet</Text>
                    </View>  
                    <TouchableOpacity
                        style={[touchableOpacityStyles, {backgroundColor: "#000"}]}
                        onPress={create}
                    >
                        <Text
                            style={{fontSize: 20, color: "#fff"}}
                        >
                            Generate Private Key
                        </Text>
                    </TouchableOpacity> 
                </View>   
            }
            </View>
        }
        </View>  
    );
}