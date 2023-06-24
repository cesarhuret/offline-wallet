import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { textInputStyles, touchableOpacityStyles } from '../components/styles';
import DropDownPicker from 'react-native-dropdown-picker';
import QRCode from 'react-native-qrcode-svg';

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

    const walletAddress = "0x7d6703218ab83D5255e4532101deB294eA1b9d27";

    const [qrCode, setQrCode] = useState("");

    const [openChain, setOpenChain] = useState(false);
    const [openToken, setOpenToken] = useState(false);

    const disabled = amount === null || chain === null || token === null

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
                style={disabled ? [touchableOpacityStyles, {borderColor: "#ddd"}] : [touchableOpacityStyles]}
                disabled={disabled}
                onPress={() => navigation.push('QRCode', {
                    tokens: token,
                    chains: chain,
                    amount: parseInt(amount || 0),
                    receiver: walletAddress
                })}
            >
                <Text 
                    style={ 
                        disabled ?
                        {fontSize: 20, color: '#aaa'}
                        : {fontSize: 20}
                    }
                >
                    Create QR Code
                </Text>
            </TouchableOpacity>
  
      </View>
    );
}