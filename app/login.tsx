import React, { useState, useEffect } from "react";
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
import {
  saveAccessToken,
  saveRefreshToken,
  getAccessToken,
} from "@/script/utils";
import api from "@/services/api";
import { useUserStore } from "@/stores/useUserStore";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ Check session on mount
  useEffect(() => {
    const checkSession = async () => {
      const token = await getAccessToken();
      if (token) {
        console.log("Token found, redirecting to home...");
        router.replace("/home");
      }
    };
    checkSession();
  }, [router]);

  // ✅ Form validation logic
  const isFormValid = () => {
    return email.trim() !== "" && password.trim() !== "" && !loading;
  };

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
    }

    setErrors(newErrors);
    return valid;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;
    try {
      setLoading(true);

      // 1. Login dan ambil token
      const response = await api.post(
        "/auth/login",
        { email, password },
        { headers: { skipAuth: true } },
      );

      const result = response.data;
      if (result.responseCode !== 200) {
        alert(result.message || "Login failed");
        return;
      }

      const { accessToken, refreshToken } = result.data;
      await saveAccessToken(accessToken);
      await saveRefreshToken(refreshToken);

      // 2. Cek apakah user sudah punya PIN
      const pinResponse = await api.post("/api/users/has-pin");
      const pinResult = pinResponse.data;

      if (pinResult.responseCode !== 200) {
        alert("Failed to check PIN status.");
        return;
      }

      // 3. Ambil data user
      const userRes = await api.get("/api/users/me");
      const userData = userRes.data;

      if (userData.responseCode !== 200) {
        throw new Error("Failed to fetch user profile");
      }

      if (userData.data.wallet === null) {
        router.replace({
          pathname: "/set-pin",
          params: {
            fullName: userData.data.user.fullName,
            avatar: userData.data.user.avatarUrl,
          },
        });
        return;
      }

      const { fullName, avatarUrl } = userData.data.user;
      const { type } = userData.data.wallet;
      const defaultAvatar = require("@/assets/images/profile-pict.jpg");

      // 4. Simpan ke Zustand
      useUserStore.getState().setUser({
        name: fullName,
        accountType:
          type === "PERSONAL" ? "Personal Account" : "Business Account",
        profileImage:
          typeof avatarUrl === "string" && avatarUrl.trim() !== ""
            ? { uri: avatarUrl }
            : defaultAvatar,
      });

      // 5. Redirect
      if (pinResult.data === true) {
        router.replace("/home");
      } else {
        router.replace("/set-pin");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
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
            onChangeText={(text) => setEmail(text.toLowerCase())}
            autoCapitalize="none"
          />
          {errors.email && (
            <Text className="text-red-500 mb-4">{errors.email}</Text>
          )}

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
          {errors.password && (
            <Text className="text-red-500 mb-4">{errors.password}</Text>
          )}

          <TouchableOpacity
            onPress={handleLogin}
            disabled={!isFormValid()}
            className={`rounded-lg h-12 justify-center mt-16 items-center ${
              isFormValid() ? "bg-[#007BFF]" : "bg-gray-300"
            }`}
          >
            <Text className="text-white text-base font-bold">
              {loading ? "Logging in..." : "Login"}
            </Text>
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
