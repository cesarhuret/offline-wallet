import { Text, View } from "react-native";
import { setItemAsync } from "expo-secure-store";
import { useEffect, useState } from "react";

export const Sign = ({route, navigation}) => {

    useEffect(() => {
        console.log(route.params);
    }, []);

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'space-around', marginBottom: 200}}>
            {
                <View>
                    <Text style={{fontSize: 30}}>{route.params.amount}</Text>
                </View>
            }
        </View>
    );

}