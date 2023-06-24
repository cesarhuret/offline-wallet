import { TextInput } from "react-native";
import { generatePrivateKey } from "viem/accounts";
import { setItemAsync } from "expo-secure-store";

export default function CreateWallet() {

    const privateKey = generatePrivateKey();

    setItemAsync('privateKey', privateKey);

    return (
        <View>
            <Text>Welcome to Offline Wallet</Text>
            <Text >Your private key is:</Text>
            <Text>{privateKey}</Text>
            <Text>Write it down and keep it safe!</Text>
        </View>
    );

}