import { Text, View } from "react-native";

import { setItemAsync } from "expo-secure-store";
import { useState } from "react";

export default function CreateWallet() {

    const [privateKey, setPrivateKey] = useState("");

    setItemAsync('privateKey', privateKey);

    return (
        <View>
            <Text >Welcome to Offline Wallet</Text>
            <Text >Your private key is:</Text>
            
            <Text>{privateKey}</Text>
            <Text>Write it down and keep it safe!</Text>
        </View>
    );

}