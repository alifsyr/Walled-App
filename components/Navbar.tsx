import React from 'react';
import { View, Text } from 'react-native';
import { Link } from 'expo-router';

export default function Navbar() {
    return (
        <View className="flex flex-row justify-between items-center bg-white h-12 px-5">
            <Text className="text-lg font-bold">Walled</Text>
            <View className="flex flex-row items-center">
                <Link href="/" className="text-black mr-5">
                    Home
                </Link>
                <Link href="/register" className="text-black">
                    Register
                </Link>
            </View>
        </View>
    );
}