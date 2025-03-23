import React from "react";
import { Link } from "expo-router";
import {
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

export default function Index() {
  return (
    <View className="flex-1 bg-white justify-center items-center">
      <View className="flex flex-row items-center mb-60">
        <Image
          source={require("@/assets/images/logo.png")}
          className="w-[50] h-[50] mr-2.5"
        />
        <Text style={styles.title}>Walled</Text>
      </View>
      <View className="w-4/5 bg-white rounded-lg">
        <TextInput
          placeholder="Email"
          placeholderTextColor="black"
          className="h-12 rounded-lg mb-5 px-3.5 bg-[#f1f1f1]"
        />
        <TextInput
          placeholder="Password"
          placeholderTextColor="black"
          secureTextEntry
          className="h-12 rounded-lg mb-5 px-3.5 bg-[#f1f1f1]"
        />
      </View>
      <View className="w-4/5 mt-28">
        <TouchableOpacity
          onPress={() => {
            /* Handle login logic */
          }}
          className="bg-[#007BFF] rounded-lg h-12 justify-center items-center"
        >
          <Text className="text-white text-base font-bold">Login</Text>
        </TouchableOpacity>
        <View className="flex flex-row mt-5">
          <Text>Dont have account?</Text>
          <Link href="/register" className="text-blue-500 ml-1">
            Register Here
          </Link>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 48,
    fontWeight: "bold",
  },
});
