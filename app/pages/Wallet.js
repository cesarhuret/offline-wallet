import { Text, View } from "react-native";
import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from "react";
import CreateWallet from "../components/CreateWallet";

export const Wallet = ({ navigation }) => {

    const [privateKey, setPrivateKey] = useState("");
    
    useEffect(async () => {
        privateKey = await SecureStore.getItemAsync('privateKey');
        setPrivateKey(privateKey);
    }, []);

    return (
        <View>
        {privateKey != "" ?
        <View>
            <CreateWallet />
        </View> 
        :
        <View>
            
        </View>
        }
    </View>
        
    );
}