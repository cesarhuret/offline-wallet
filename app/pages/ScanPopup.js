import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { BarCodeScanner } from 'expo-barcode-scanner';
import { useEffect, useState } from "react";
import { touchableOpacityStyles } from '../components/styles';

export const ScanPopup = ({ navigation }) => {

    const styles = StyleSheet.create({
        container: {
          flex: 1,
          padding: 24,
          backgroundColor: '#eaeaea',
        },
        title: {
          marginTop: 16,
          paddingVertical: 8,
          borderWidth: 4,
          borderColor: '#20232a',
          borderRadius: 6,
          backgroundColor: '#61dafb',
          color: '#20232a',
          textAlign: 'center',
          fontSize: 30,
          fontWeight: 'bold',
        },
    });

    const [scanned, setScanned] = useState(false);
      
    const [hasPermission, setHasPermission] = useState(null);

    const handleBarCodeScanned = ({type, data}) => {
        setScanned(true);
        const signature = data;
        navigation.push('Execute', JSON.stringify({ signature }));
    }

    useEffect(() => {
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    if (hasPermission === null) {
        return <Text>Requesting for camera permission</Text>;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    return (
        <View style={[styles.container, {justifyContent: 'flex-end'}]}>
            <BarCodeScanner
                onBarCodeScanned={!scanned && handleBarCodeScanned}
                style={StyleSheet.absoluteFillObject}
            />
            {   scanned
                && 
                <TouchableOpacity
                    style={[touchableOpacityStyles, {backgroundColor: "#000"}]}
                    onPress={() => setScanned(false)}
                >
                    <Text 
                        style={{fontSize: 20, color: "#fff"}}
                    >
                        Tap to Scan Again
                    </Text>
                </TouchableOpacity>
            }
        </View>
    );
    
}
  