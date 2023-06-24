import 'react-native-get-random-values';
import 'fastestsmallesttextencoderdecoder';
import { Text, View, TouchableOpacity } from "react-native";
import { setItemAsync } from "expo-secure-store";
import { useState } from "react";
import { touchableOpacityStyles } from './styles';
import { generatePrivateKey } from 'viem/accounts'

export default function CreateWallet() {

    const create = () => {
        const privateKey  = generatePrivateKey();
        setPrivateKey(privateKey);
    }

    const [privateKey, setPrivateKey] = useState("");

    setItemAsync('privateKey', privateKey);

    return (
        <View>
            <Text >Welcome to Offline Wallet</Text>
            <Text >Your private key is:</Text>
            <TouchableOpacity
                style={touchableOpacityStyles}
                onPress={create}
            >
                <Text style={{fontSize: 20}}>
                    Generate Private Key
                </Text>
            </TouchableOpacity>
            <Text> {">"} {privateKey}</Text>
            <Text>Write it down and keep it safe!</Text>
        </View>
    );

}