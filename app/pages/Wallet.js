import 'react-native-get-random-values';
import 'fastestsmallesttextencoderdecoder';
import { Text, View, TouchableOpacity } from "react-native";
import { setItemAsync, getItemAsync, deleteItemAsync } from "expo-secure-store";
import { useEffect, useState } from "react";
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts'
import { touchableOpacityStyles } from '../components/styles';
import { goerli } from 'viem/chains';
import IERC20 from "../data/IERC20.json";
import { createPublicClient, createWalletClient, parseGwei, http, parseEther } from 'viem';
import AsyncStorage from '@react-native-async-storage/async-storage';
import "react-native-get-random-values"
import "@ethersproject/shims"
import { BigNumber, utils } from 'ethers';


export const Wallet = ({ navigation }) => {



    const [address, setAddress] = useState(null);
    
    useEffect(() => {
        getItemAsync('address')
        .then((address) => address && setUp(address))

        const inf = new utils.Interface(IERC20.abi);
        
        console.log(inf.encodeFunctionData('approve', [
            "0xf3679DBeb5954a39a0a2dddb715A4409A4bD81ee",
            BigNumber.from("10000000000000000")
        ]))
    }, [])

    const setUp = async (address) => {
        setAddress(address)

        const client = createPublicClient({
            chain: goerli,
            transport: http('https://eth-goerli.g.alchemy.com/v2/75qiyn1_EpxCn93X5tD7yEtmcXUM_Udw')
        })

        console.log(address)

        const transactionCount = await client.getTransactionCount({ address })
        
        await AsyncStorage.setItem('transactionCount', transactionCount.toString())
        await deleteItemAsync('privateKey')
        await deleteItemAsync('address')

        console.log(transactionCount)

    }

    const create = async () => {

        const privateKey = generatePrivateKey();

        const account = privateKeyToAccount(privateKey);
        
        const account2 = privateKeyToAccount("0x9cc1f2b0c4790daf5844f7c2ae3ed6f6b0f8390570164e9e86e1a960685ed0a4")

        const walletClient2 = createWalletClient({
            account: account2,
            chain: goerli,
            transport: http('https://eth-goerli.g.alchemy.com/v2/75qiyn1_EpxCn93X5tD7yEtmcXUM_Udw')
        })



        const hash2 = await walletClient2.sendTransaction({
            account: account2,
            to: account.address,
            value: parseEther("0.01"),
        })



        const publicClient = createPublicClient({
            chain: goerli,
            transport: http('https://eth-goerli.g.alchemy.com/v2/75qiyn1_EpxCn93X5tD7yEtmcXUM_Udw')
        })

        const transaction = await publicClient.waitForTransactionReceipt( 
            { hash: hash2 }
        )
        // alert(hash2)


        const walletClient = createWalletClient({
            account,
            chain: goerli,
            transport: http('https://eth-goerli.g.alchemy.com/v2/75qiyn1_EpxCn93X5tD7yEtmcXUM_Udw')
        })




        const balance = await publicClient.getBalance({ 
            address: account.address,
          })





        const hash = await walletClient.sendTransaction({
            account,
            to: '0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2',
            data: `0x1688f0b90000000000000000000000003e5c63644e683549055b9be8653de26e0b4cd36e000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000188ef47b3c10000000000000000000000000000000000000000000000000000000000000164b63e800d0000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000140000000000000000000000000f48f2b2d2a534e402487b3ee7c18c33aec0fe5e40000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000${account.address.slice(2)}000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000`,
            gasLimit: 2*10**6,
            maxFeePerGas: parseGwei('20'),
            maxPriorityFeePerGas: parseGwei('2'), 
        })


        const transaction2 = await publicClient.waitForTransactionReceipt(
            { hash }
        )

        console.log(transaction2, "6")
          
        // setItemAsync('privateKey', privateKey);
        // setItemAsync('address', account.address);
    }

    return (
        <View style={{ flex: 1, alignItems: 'center', padding: 50}}>
            {
                address ? 
                <View style={{ flex: 1, justifyContent: 'center'}}>
                    <Text style={{fontSize: 25 }}>Your Account: {address?.substring(0, 6)}...{address?.substring(address?.length - 4, address?.length)}</Text>
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
    );
}