import { Text, View, Image } from "react-native";
import { getItemAsync } from "expo-secure-store";
import { useEffect, useState } from "react";
import CreateWallet from "../components/CreateWallet";

export const Wallet = ({ navigation }) => {

    const [privateKey, setPrivateKey] = useState("");
    
    useEffect(() => {
        const getPrivateKey = async () => {
            try {
                const privateKey2 = await getItemAsync('privateKey');
                if (privateKey2 === null) {
                    setPrivateKey("");
                }
                setPrivateKey(privateKey2);
            } catch (e) {
                alert(e);
            }
        }
        getPrivateKey();
    }, []);

    return (
    <View>
        {privateKey === "" ?
        <View>
            <CreateWallet />
        </View> 
        :
        <View>
            <Text>PRIVAE KEU</Text>
            <Text>{privateKey1}</Text>
        </View>
        }
    </View>
        
    );
}