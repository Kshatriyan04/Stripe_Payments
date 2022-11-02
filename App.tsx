import React, { useEffect, useState } from 'react';
import { Alert, Button, StyleSheet, Text, View } from 'react-native';
import { presentPaymentSheet, StripeProvider, usePaymentSheet, useStripe } from '@stripe/stripe-react-native';


export default function App() {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);
  
  
  useEffect(() => {
    initializePaymentSheet();
  }, []);
  
  const fetchPaymentSheetParams = async () => {
      const response = await fetch('http://192.168.29.23:8000/pay', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

    const { paymentIntent, ephemeralKey, customer} = await response.json();

    return {
      paymentIntent,
      ephemeralKey,
      customer,
    };
  };
  
  const initializePaymentSheet = async () => {
    const {
      paymentIntent,
      ephemeralKey,
      customer,
    } = await fetchPaymentSheetParams();

    const { error } = await initPaymentSheet({
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      customFlow: true,
      merchantDisplayName: 'Example Inc.',
      applePay: {
        merchantCountryCode: 'US',
      },
      style: 'automatic',
      googlePay: { merchantCountryCode: 'US', testEnv: true },
      returnURL: 'stripe-example://stripe-redirect',
    });
    if (!error) {
      setLoading(true);
    }
  };
  
  const openPaymentSheet = async () => {
    const {error} = await presentPaymentSheet();

    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      Alert.alert('Success', 'Your order is confirmed!');
    }
    
  }
  
  return (
    <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: 300, marginTop: 50}}>
    <StripeProvider
    publishableKey="#Your Public key">
    <Text style={{ fontSize: 25, margin: 10}}> Make Payment </Text>      
    <Button title={'Buy'} onPress={openPaymentSheet} ></Button>
    </StripeProvider>
    </View>
    
    );
  }