import { ActivityIndicator, Linking, Text, View } from "react-native";
import { useState } from "react";
import { touchableOpacityStyles } from "../components/styles";
import { TouchableOpacity } from "react-native";
import { providers } from "ethers";

export const Execute = ({route, navigation}) => {

    const [hash, setHash] = useState();
    
    const [loading, setLoading] = useState(false);

    const execute = async () => {

        setLoading(true);

        const provider = new providers.JsonRpcProvider('https://eth-goerli.g.alchemy.com/v2/75qiyn1_EpxCn93X5tD7yEtmcXUM_Udw');

        const sentTx = await provider.sendTransaction(JSON.parse(route.params).signature.replace(/"/g, ''));

        const response = await sentTx.wait();

        setHash(response.transactionHash);

        setLoading(false);
    }

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start', padding: 50}}>
            {
            loading ?
            <View style={{ flex: 1, justifyContent: 'center'}}>
                <ActivityIndicator size="large" color="#000" />
            </View>
            :
            <View>
            {
                hash ? 
                <View>
                    <Text style={{flex: 1, fontSize: 30}}>Success!</Text>

                    <View style={{justifyContent: 'flex-end'}}>
                        <Text style={{fontSize: 20, textAlign: 'center', padding: 10, borderWidth: 1, borderRadius: 9, marginBottom: 10}}>
                            {hash?.substring(0, 10)}...{hash?.substring(hash?.length - 10, hash?.length)}
                        </Text>
                        <TouchableOpacity
                            style={[touchableOpacityStyles, {backgroundColor: "#000", width: 300}]}
                            onPress={() => Linking.openURL(`https://goerli.etherscan.io/tx/${hash}`)}
                        >
                            <Text 
                                style={{fontSize: 20, color: "#fff"}}
                            >
                                View Receipt On Etherscan
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
                :
                <View>
                    <Text style={{flex: 1, fontSize: 30}}>Execute Transaction</Text>

                    <View style={{justifyContent: 'flex-end'}}>
                        <TouchableOpacity
                            style={[touchableOpacityStyles, {backgroundColor: "#000"}]}
                            onPress={execute}
                        >
                            <Text 
                                style={{fontSize: 20, color: "#fff"}}
                            >
                                Execute Transaction 
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            }
            </View>
        }
        </View>
    );

}