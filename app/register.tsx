import React, { useState } from "react";
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
  ActivityIndicator,
} from "react-native";
import { router, Link } from "expo-router";
import TermsAndConditions from "@/components/TermsAndConditions";
import api from "@/services/api";
import { saveAccessToken, saveRefreshToken } from "@/script/utils";

const initialErrors = {
  fullName: "",
  email: "",
  password: "",
  phoneNumber: "",
};

export default function Register() {
  const [modalVisible, setModalVisible] = useState(false);
  const [hasScrolledToEnd, setHasScrolledToEnd] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  const [errors, setErrors] = useState(initialErrors);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = { ...initialErrors };
    if (!fullName.trim()) newErrors.fullName = "Full name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email))
      newErrors.email = "Invalid email address";
    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6) newErrors.password = "Minimum 6 characters";
    if (!phoneNumber.trim()) newErrors.phoneNumber = "Phone number is required";

    setErrors(newErrors);
    return Object.values(newErrors).every((val) => !val);
  };

  const handleRegister = async () => {
    if (!hasScrolledToEnd) {
      Alert.alert("Please read the Terms and Conditions before registering.");
      return;
    }

    if (!validate()) return;

    try {
      setLoading(true);

      const response = await api.post(
        "/auth/signup",
        {
          email,
          fullName,
          password,
          phoneNumber,
          avatarUrl,
        },
        {
          headers: {
            skipAuth: true, // agar tidak menyisipkan Authorization
          },
        },
      );

      const data = response.data;
      setLoading(false);
      console.log("Registration response:", data);
      if (data.responseCode === 201) {
        const { accessToken, refreshToken } = data.data;

        await saveAccessToken(accessToken);
        await saveRefreshToken(refreshToken);

        router.replace("/set-pin");
      } else {
        if (data.message === "Validation failed" && data.data) {
          setErrors((prev) => ({ ...prev, ...data.data }));
        } else {
          Alert.alert(
            "Registration Failed",
            data.message || "Something went wrong",
          );
        }
      }
    } catch (err: any) {
      setLoading(false);
      console.error("Registration error:", err);
      Alert.alert(
        "Network Error",
        "Unable to register. Please try again later.",
      );
    }
  };

  const renderInput = (
    placeholder: string,
    value: string,
    setValue: any,
    key: keyof typeof errors,
    extraProps = {},
  ) => (
    <>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="black"
        value={value}
        onChangeText={setValue}
        className={`h-12 rounded-lg px-3.5 bg-[#f1f1f1] border ${
          errors[key] ? "border-red-500 mb-2" : "border-[#f1f1f1] mb-4"
        }`}
        {...extraProps}
      />
      {errors[key] && (
        <Text className="text-red-500 mb-2 ml-1">{errors[key]}</Text>
      )}
    </>
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="flex-1 bg-white justify-center items-center">
        <View className="flex flex-row items-center mb-10">
          <Image
            source={require("@/assets/images/logo.png")}
            className="w-[50] h-[50] mr-2.5"
          />
          <Text style={styles.title}>Walled</Text>
        </View>

        <View className="w-4/5 bg-white rounded-lg">
          {renderInput("Full Name", fullName, setFullName, "fullName")}
          {renderInput("Email", email, setEmail, "email", {
            keyboardType: "email-address",
            autoCapitalize: "none",
          })}
          {renderInput("Password", password, setPassword, "password", {
            secureTextEntry: true,
          })}
          {renderInput(
            "Phone Number",
            phoneNumber,
            setPhoneNumber,
            "phoneNumber",
            { keyboardType: "phone-pad" },
          )}
          <TextInput
            placeholder="Avatar Url (optional)"
            placeholderTextColor="black"
            value={avatarUrl}
            onChangeText={setAvatarUrl}
            className="h-12 rounded-lg mb-5 px-3.5 bg-[#f1f1f1]"
          />
        </View>

        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          className="mt-5"
        >
          <Text className="text-blue-500 text-base text-center font-bold">
            View Terms and Conditions
          </Text>
        </TouchableOpacity>

        <View className="w-4/5 mt-10">
          <TouchableOpacity
            onPress={handleRegister}
            className="bg-[#007BFF] rounded-lg h-12 justify-center items-center"
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white text-base font-bold">Register</Text>
            )}
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
