import React, { useState } from "react";
import { Link, useRouter } from "expo-router";
import {
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  StyleSheet,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { saveToken } from "@/script/utils"; // Assuming you have a utility function to save tokens

export default function Index() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    let valid = true;
    const newErrors = { email: "", password: "" };

    if (!email) {
      newErrors.email = "Email is required.";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid.";
      valid = false;
    }

    if (!password) {
      newErrors.password = "Password is required.";
      valid = false;
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    try {
      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (result.responseCode === 200) {
        // Simpan token ke SecureStore
        await saveToken("accessToken", result.data.accessToken);
        await saveToken("refreshToken", result.data.refreshToken);

        // Ambil token untuk cek PIN
        const token = result.data.accessToken;

        const pinResponse = await fetch(
          "http://localhost:8080/api/users/has-pin",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const pinResult = await pinResponse.json();

        if (pinResult.responseCode === 200) {
          if (pinResult.data === true) {
            router.replace("/home");
          } else {
            router.replace("/set-pin");
          }
        } else {
          alert("Failed to check PIN status.");
        }
      } else {
        alert(result.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
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
            className={`h-12 rounded-lg mb-4 px-3.5 bg-[#f1f1f1] border ${
              errors.email ? "border-red-500" : "border-[#f1f1f1]"
            }`}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />
          {errors.email ? (
            <Text className="text-red-500 mb-4">{errors.email}</Text>
          ) : null}
          <View className="relative">
            <TextInput
              placeholder="Password"
              placeholderTextColor="black"
              secureTextEntry={!showPassword}
              className={`h-12 rounded-lg mb-5 px-3.5 bg-[#f1f1f1] border ${
                errors.password ? "border-red-500" : "border-[#f1f1f1]"
              }`}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3"
            >
              <FontAwesome
                name={showPassword ? "eye" : "eye-slash"}
                size={20}
                color="gray"
              />
            </TouchableOpacity>
          </View>
          {errors.password ? (
            <Text className="text-red-500 mb-4">{errors.password}</Text>
          ) : null}
          <TouchableOpacity
            onPress={handleLogin}
            className="bg-[#007BFF] rounded-lg h-12 justify-center mt-16 items-center"
          >
            <Text className="text-white text-base font-bold">Login</Text>
          </TouchableOpacity>
          <View className="flex flex-row mt-5">
            <Text>Don't have an account?</Text>
            <Link href="/register" className="text-blue-500 ml-1">
              Register Here
            </Link>
          </View>
        </View>
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
