import { Text, TouchableOpacity, View } from "react-native";
import { useEffect, useState } from "react";
import { touchableOpacityStyles } from "./styles";
import QRCode from "react-native-qrcode-svg";

export const QRCodePage = ({route, navigation}) => {

    useEffect(() => console.log(route.params), [route.params])

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start', padding: 50}}>
            <Text style={{fontSize: 30}}>Payment QR Code</Text>
            <View style={{flex: 1, justifyContent: 'center'}}>
                <QRCode
                    size={300}
                    value={JSON.stringify(route.params)}
                />
            </View>
            {
                route.params?.share &&
                <TouchableOpacity
                    style={[touchableOpacityStyles, {backgroundColor: "#000"}]}
                    onPress={() => {
                        navigation.replace('ScanPopup');
                    }}
                >
                    <Text 
                        style={{fontSize: 20, color: '#fff'}}
                    >
                        Scan Customer Payment
                    </Text>
                </TouchableOpacity>
            }
        </View>
    );

}