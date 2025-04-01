import React, { useState } from "react";
import { Link } from "expo-router";
import {
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { router } from "expo-router";
import TermsAndConditions from "@/components/TermsAndConditions"; // Import the new component

export default function Register() {
  const [modalVisible, setModalVisible] = useState(false);
  const [hasScrolledToEnd, setHasScrolledToEnd] = useState(false);

  const handleRegister = () => {
    if (!hasScrolledToEnd) {
      Alert.alert("Please read the Terms and Conditions before register.");
    } else {
      // Proceed with registration logic
      router.replace("/set-pin");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View className="flex-1 bg-white justify-center items-center">
        <View className="flex flex-row items-center mb-40">
          <Image
            source={require("@/assets/images/logo.png")}
            className="w-[50] h-[50] mr-2.5"
          />
          <Text style={styles.title}>Walled</Text>
        </View>
        <View className="w-4/5 bg-white rounded-lg">
          <TextInput
            placeholder="Fullname"
            placeholderTextColor="black"
            className="h-12 rounded-lg mb-5 px-3.5 bg-[#f1f1f1]"
          />
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
          <TextInput
            placeholder="Avatar Url"
            placeholderTextColor="black"
            className="h-12 rounded-lg mb-5 px-3.5 bg-[#f1f1f1]"
          />
        </View>
        <View className="w-4/5 mt-5">
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            className="mt-5"
          >
            <Text className="text-blue-500 text-base text-center font-bold">
              View Terms and Conditions
            </Text>
          </TouchableOpacity>
        </View>
        <View className="w-4/5 mt-10">
          <TouchableOpacity
            onPress={handleRegister}
            className="bg-[#007BFF] rounded-lg h-12 justify-center items-center"
          >
            <Text className="text-white text-base font-bold">Register</Text>
          </TouchableOpacity>
          <View className="flex flex-row mt-5">
            <Text>Have an account?</Text>
            <Link href="/" className="text-blue-500 ml-1">
              Login here
            </Link>
          </View>
        </View>

        <TermsAndConditions
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onScrollEnd={() => setHasScrolledToEnd(true)}
          hasScrolledToEnd={hasScrolledToEnd}
          setHasScrolledToEnd={setHasScrolledToEnd}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 48,
    fontWeight: "bold",
  },
});
