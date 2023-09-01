import React, { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View, Platform, TouchableOpacity  } from 'react-native';
import { RevenueCatProvider, useRevenueCat } from './provider';
import { PurchasesPackage } from 'react-native-purchases';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from './Home';

// import { presentPaymentSheet, StripeProvider, usePaymentSheet, useStripe } from '@stripe/stripe-react-native';


export default function App() {
	// const { initPaymentSheet, presentPaymentSheet } = useStripe();
	const [loading, setLoading] = useState(false);	
	
// 	useEffect(() => {
// 		initializePaymentSheet();
// 	}, []);
	
// 	const fetchPaymentSheetParams = async () => {
// 		const response = await fetch('http://192.168.29.23:8000/pay', {
// 		method: 'GET',
// 		headers: {
// 			'Content-Type': 'application/json',
// 		},
// 	});
	
// 	const { paymentIntent, ephemeralKey, customer} = await response.json();
	
// 	return {
// 		paymentIntent,
// 		ephemeralKey,
// 		customer,
// 	};
// };

// const initializePaymentSheet = async () => {
// 	const {
// 		paymentIntent,
// 		ephemeralKey,
// 		customer,
// 	} = await fetchPaymentSheetParams();
	
// 	const { error } = await initPaymentSheet({
// 		customerId: customer,
// 		customerEphemeralKeySecret: ephemeralKey,
// 		paymentIntentClientSecret: paymentIntent,
// 		customFlow: true,
// 		merchantDisplayName: 'Example Inc.',
// 		applePay: {
// 			merchantCountryCode: 'US',
// 		},
// 		style: 'automatic',
// 		googlePay: { merchantCountryCode: 'US', testEnv: true },
// 		returnURL: 'stripe-example://stripe-redirect',
// 	});
// 	if (!error) {
// 		setLoading(true);
// 	}
// };

// const openPaymentSheet = async () => {
// 	const {error} = await presentPaymentSheet();
	
// 	if (error) {
// 		Alert.alert(`Error code: ${error.code}`, error.message);
// 	} else {
// 		Alert.alert('Success', 'Your order is confirmed!');
// 	}
	
// }


const Stack = createNativeStackNavigator();



return (
	<RevenueCatProvider>
		<NavigationContainer>
				<Stack.Navigator>
					<Stack.Screen name="RevenueCat App" component={Home} />
				</Stack.Navigator>
			</NavigationContainer>
	{/* <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: 50}}> */}
	{/* {packages.map((pack) => (
					<TouchableOpacity
						key={pack.identifier}
						onPress={() => onPurchase(pack)}
						style={styles.button}
					>
						<View style={{flexGrow: 1}}>
							<Text>{pack.product.title}</Text>
							<Text style={{ color: '#B6B7C0',paddingVertical: 4 }}>{pack.product.description}</Text>
						</View>
						<View style={styles.price}>
							<Text>{pack.product.priceString}</Text>
						</View>
					</TouchableOpacity>
				))} */}
			{/* <Text style={{ fontSize: 25, margin: 10}}> Make Payment </Text>      
			<Button title={'Buy'} onPress={() =>{}} ></Button> */}
	{/* </View> */}
	</RevenueCatProvider>
	
	);
}
