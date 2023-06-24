import 'react-native-get-random-values';
import 'fastestsmallesttextencoderdecoder';
import { Text, View, Image, TouchableOpacity } from "react-native";
import { setItemAsync, getItemAsync } from "expo-secure-store";
import { useEffect, useState } from "react";
import { generatePrivateKey, privateKeyToAccount  } from 'viem/accounts'
import { touchableOpacityStyles } from '../components/styles';
import { goerli } from 'viem/chains';
import { createPublicClient, http } from 'viem';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const Wallet = ({ navigation }) => {

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

        console.log(address)

        const transactionCount = await client.getTransactionCount({ address })
        
        await AsyncStorage.setItem('transactionCount', transactionCount.toString())

        console.log(transactionCount)

    }

    const create = () => {
        const privateKey = generatePrivateKey();

        const account = privateKeyToAccount(privateKey);
        
        setItemAsync('privateKey', privateKey);
        setItemAsync('address', account.address);
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