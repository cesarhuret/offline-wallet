import 'react-native-get-random-values';
import 'fastestsmallesttextencoderdecoder';
import { Text, View, TouchableOpacity, ActivityIndicator } from "react-native";
import { setItemAsync, getItemAsync, deleteItemAsync } from "expo-secure-store";
import { useEffect, useState } from "react";
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts'
import { touchableOpacityStyles } from '../components/styles';
import { goerli } from 'viem/chains';
import IERC20 from "../data/IERC20.json";
import { createPublicClient, createWalletClient, parseGwei, http, parseEther, encodeFunctionData, pad } from 'viem';
import AsyncStorage from '@react-native-async-storage/async-storage';
import "react-native-get-random-values"
import "@ethersproject/shims"
import { BigNumber, utils } from 'ethers';


export const Wallet = ({ navigation }) => {

    const [loading, setLoading] = useState(false);

    const [address, setAddress] = useState(null);
    
    useEffect(() => {
        getItemAsync('address')
        .then((address) => address && setUp(address))
    }, [])

    const setUp = async (address) => {

        setAddress(address)

        const client = createPublicClient({
            chain: goerli,
            transport: http('https://eth-goerli.g.alchemy.com/v2/75qiyn1_EpxCn93X5tD7yEtmcXUM_Udw')
        })

        const privKey = await getItemAsync('privateKey')

        const transactionCount = await client.getTransactionCount({ address: privateKeyToAccount(privKey).address })
        
        await AsyncStorage.setItem('transactionCount', transactionCount.toString())
    
        console.log(address, transactionCount)
    }

    const create = async () => {

        setLoading(true);

        const inf = new utils.Interface(IERC20.abi);

        const privateKey = generatePrivateKey();

        const transport = http('https://eth-goerli.g.alchemy.com/v2/75qiyn1_EpxCn93X5tD7yEtmcXUM_Udw')

        const account = privateKeyToAccount(privateKey);

        const feeder = privateKeyToAccount("0x9cc1f2b0c4790daf5844f7c2ae3ed6f6b0f8390570164e9e86e1a960685ed0a4")

        const feedWallet = createWalletClient({
            account: feeder,
            chain: goerli,
            transport
        })

        const fundingHash = await feedWallet.sendTransaction({
            account: feeder,
            to: account.address,
            value: parseEther("0.01"),
        })

        const publicClient = createPublicClient({
            chain: goerli,
            transport
        })

        await publicClient.waitForTransactionReceipt( 
            { hash: fundingHash }
        )

        const walletClient = createWalletClient({
            account,
            chain: goerli,
            transport
        })

        const hash = await walletClient.sendTransaction({
            account,
            to: '0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2',
            data: `0x1688f0b90000000000000000000000003e5c63644e683549055b9be8653de26e0b4cd36e000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000188ef47b3c10000000000000000000000000000000000000000000000000000000000000164b63e800d0000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000140000000000000000000000000f48f2b2d2a534e402487b3ee7c18c33aec0fe5e40000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000${account.address.slice(2)}000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000`,
            gasLimit: 2*10**6,
            maxFeePerGas: parseGwei('20'),
            maxPriorityFeePerGas: parseGwei('2'), 
        })

        console.log(hash)

        const tx = await publicClient.waitForTransactionReceipt({ hash })
        
        console.log(tx)
        console.log(tx.logs[1].topics[0])

        const data = inf.encodeFunctionData('approve', [
            "0xf3679DBeb5954a39a0a2dddb715A4409A4bD81ee",
            BigNumber.from((1000000).toString()).mul(BigNumber.from(10).pow(18))
        ])

        const executeABI = {
            inputs: [
                { 'type': 'address', 'name': 'to'},
                { 'type': 'uint256', 'name': 'value'},
                { 'type': 'bytes', 'name': 'data'},
                { 'type': 'uint8', 'name': 'operation'},
                { 'type': 'uint256', 'name': 'safeTxGas'},
                { 'type': 'uint256', 'name': 'baseGas'},
                { 'type': 'uint256', 'name': 'gasPrice'},
                { 'type': 'address', 'name': 'gasToken'},
                { 'type': 'address', 'name': 'refundReceiver'},
                { 'type': 'bytes', 'name': 'signatures'}
            ],
            outputs: [
                {'type': 'bool'}
            ],
            name: 'execTransaction',
            type: 'function',
            stateMutability: 'payable',
        }
        
        const signatures = pad(account.address, { size: 32 }) + pad("1", { size: 32 }).replace("0x", "00")

        const aaData = encodeFunctionData({
            abi: [executeABI],
            args: [
                "0x8ACFC9D02FB13d83eE4Cfa9102d50f7abD0C3656",
                parseEther("0"),
                data,
                0,
                parseGwei("0"),
                parseGwei("0"),
                parseGwei("0"),
                "0x0000000000000000000000000000000000000000",
                "0x0000000000000000000000000000000000000000",
                signatures
            ]
        })

        console.log(tx.logs[0].address)

        await feedWallet.sendTransaction({
            account: feeder,
            to: tx.logs[0].address,
            value: parseEther("0.01"),
        })
        
        const approvalHash = await walletClient.sendTransaction({
            account,
            to: tx.logs[0].address,
            data: aaData
        })
    
        const approvalTx = await publicClient.waitForTransactionReceipt({ hash: approvalHash })
    
        console.log(approvalTx)
        
        setItemAsync('privateKey', privateKey);
        setItemAsync('address', tx.logs[0].address);
        
        setUp(tx.logs[0].address)

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
            }
        </View>  
    );
}