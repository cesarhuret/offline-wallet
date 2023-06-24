import { Text, View } from "react-native";
import { setItemAsync } from "expo-secure-store";
import { useEffect, useState } from "react";
import QRCode from "react-native-qrcode-svg";

export const QRCodePage = ({route, navigation}) => {

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'space-around', marginBottom: 200}}>
            <Text style={{fontSize: 30}}>Payment QR Code</Text>
            <QRCode
                size={200}
                value={JSON.stringify(route.params)}
            />
        </View>
    );

}