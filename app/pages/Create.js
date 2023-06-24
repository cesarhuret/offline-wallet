import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { textInputStyles, touchableOpacityStyles } from '../components/styles';
import DropDownPicker from 'react-native-dropdown-picker';

export const Create = ({ navigation }) => {

    const chains = [
        {label: 'Mumbai', value: 'mumbai'},
        {label: 'Goerli', value: 'goerli'}
    ]

    const tokens = [
        {label: 'USDC', value: 'usdc'},
        {label: 'USDT', value: 'usdt'}
    ]

    const [token, setToken] = useState();

    const [chain, setChain] = useState();
  
    const [amount, setAmount] = useState(null);

    const [error, setError] = useState(null);

    const walletAddress = "0x0000000";

    const [openChain, setOpenChain] = useState(false);
    const [openToken, setOpenToken] = useState(false);

    const create = async () => {
        console.log(token, chain, parseInt(amount || 0));
    }


    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>

            <DropDownPicker
                mode="BADGE"
                open={openChain}
                multiple={true}
                value={chain}
                items={chains}
                setOpen={setOpenChain}
                setValue={setChain}
                searchable={true}
                placeholder="Select a chain"
                searchPlaceholder="Search for a chain..."
                zIndex={3000}
                zIndexInverse={1000}
                style={{
                    alignSelf: 'center',
                    maxWidth: 300,
                    marginBottom: 15
                }}
                containerProps={{
                    maxWidth: 300
                }}
            />

            <DropDownPicker
                mode="BADGE"
                open={openToken}
                multiple={true}
                value={token}
                items={tokens}
                setOpen={setOpenToken}
                setValue={setToken}
                searchable={true}
                searchPlaceholder="Search for a token..."
                placeholder="Select a token"
                zIndex={2000}
                zIndexInverse={2000}
                style={{
                    alignSelf: 'center',
                    maxWidth: 300,
                    marginBottom: 15
                }}
                containerProps={{
                    maxWidth: 300
                }}
            />

            <TextInput 
                keyboardAppearance='dark'
                keyboardType="numeric"
                value={amount}
                placeholderTextColor={'#969696'} 
                placeholder='Amount'
                onChangeText={amt => setAmount(amt.replace(/[^0-9]/g, ''))} 
                maxLength={24}
                style={textInputStyles}
            />
                    
            <TouchableOpacity
                style={touchableOpacityStyles}
                disabled={amount === null || chain === null || token === null}
                onPress={create}
            >
                <Text style={{fontSize: 20}}>
                    Create QR Code
                </Text>
            </TouchableOpacity>
  
      </View>
    );
}