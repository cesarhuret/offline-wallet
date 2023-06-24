import { useEffect, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { textInputStyles, touchableOpacityStyles } from '../components/styles';
import DropDownPicker from 'react-native-dropdown-picker';
import { getItemAsync } from "expo-secure-store";
import { chains } from "../data/chains.json";
import { tokens } from "../data/tokens.json";

export const Create = ({ navigation }) => {

    const [token, setToken] = useState();

    const [chain, setChain] = useState();
  
    const [amount, setAmount] = useState(null);

    const [address, setAddress] = useState(null);

    const [openChain, setOpenChain] = useState(false);
    const [openToken, setOpenToken] = useState(false);

    useEffect(() => {
        getItemAsync('address')
        .then(address => setAddress(address))
    }, [])

    const disabled = amount === null || chain === null || token === null

    useEffect(() => {
        console.log(amount)
    }, [amount])

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start', padding: 50}}>
            <Text style={{fontSize: 25}}>Create a Payment</Text>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                
                <Text style={{fontSize: 16, marginBottom: 15, borderWidth: 1, width: 300, padding: 10, borderRadius: 9}}>
                    To: {address?.substring(0, 6)}...{address?.substring(address?.length - 4, address?.length)}
                </Text>

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
                    keyboardType="decimal-pad"
                    value={amount}
                    placeholderTextColor={'#969696'} 
                    placeholder='Amount'
                    onChangeText={amt => setAmount(amt.replace(/^[-+]?[0-9]+\.[^0-9]+$/, ''))} 
                    maxLength={24}
                    style={textInputStyles}
                />
            </View>
            
            <View style={{justifyContent: 'flex-end'}}>
                <TouchableOpacity
                    style={disabled ? [touchableOpacityStyles, {borderColor: "#ddd"}] : [touchableOpacityStyles, {backgroundColor: "#000"}]}
                    disabled={disabled}
                    onPress={() => navigation.push('QRCode', {
                        token: token,
                        chains: chain,
                        amount: parseFloat(amount.replace(",", ".") || 0),
                        receiver: address,
                        share: true
                    })}
                >
                    <Text 
                        style={ 
                            disabled ?
                            {fontSize: 20, color: '#aaa'}
                            : {fontSize: 20, color: '#fff'}
                        }
                    >
                        Create QR Code
                    </Text>
                </TouchableOpacity>
            </View>
      </View>
    );
}