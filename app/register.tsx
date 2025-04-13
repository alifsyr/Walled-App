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
} from "react-native";
import { router, Link } from "expo-router";
import TermsAndConditions from "@/components/TermsAndConditions";
import api from "@/services/api";
import { saveAccessToken, saveRefreshToken } from "@/script/utils";
import { useUserStore } from "@/stores/useUserStore";
import { FontAwesome } from "@expo/vector-icons";

const initialErrors = {
  fullName: "",
  email: "",
  password: "",
  phoneNumber: "",
  avatarUrl: "",
};

export default function Register() {
  const [modalVisible, setModalVisible] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  const [errors, setErrors] = useState(initialErrors);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const setUser = useUserStore((state) => state.setUser);

  const normalizePhoneNumber = (number: string) => {
    if (number.startsWith("+62")) {
      return number.replace("+62", "0");
    } else if (number.startsWith("62")) {
      return number.replace("62", "0");
    }
    return number;
  };

  const isFormValid = () => {
    return (
      fullName.trim() !== "" &&
      email.trim() !== "" &&
      password.trim() !== "" &&
      phoneNumber.trim() !== "" &&
      !loading
    );
  };

  const validate = () => {
    const newErrors = { ...initialErrors };
    const normalizedPhone = normalizePhoneNumber(phoneNumber);

    if (!fullName.trim()) newErrors.fullName = "Full name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email))
      newErrors.email = "Invalid email address";

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Minimum 8 characters";
    } else {
      const hasLower = /[a-z]/.test(password);
      const hasUpper = /[A-Z]/.test(password);
      const hasNumber = /\d/.test(password);
      const hasSpecial = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-=|]/.test(password);
      const comboCount = [hasLower, hasUpper, hasNumber, hasSpecial].filter(
        Boolean,
      ).length;
      if (comboCount < 4) {
        newErrors.password =
          "Password must include lowercase, uppercase, number, special character";
      }
    }

    if (!normalizedPhone.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^[0-9]+$/.test(normalizedPhone)) {
      newErrors.phoneNumber = "Phone number must contain only digits";
    } else if (normalizedPhone.length < 10 || normalizedPhone.length > 14) {
      newErrors.phoneNumber = "Phone number must be between 10–14 digits";
    }

    if (
      avatarUrl.trim() &&
      !/^https?:\/\/[\w\-]+(\.[\w\-]+)+[/#?]?.*$/.test(avatarUrl)
    ) {
      newErrors.avatarUrl = "Please enter a valid URL";
    }

    setErrors(newErrors);
    return Object.values(newErrors).every((val) => !val);
  };

  const handleRegister = async () => {
    if (!validate()) return;
    if (!agreed) {
      Alert.alert("Please agree to the Terms and Conditions.");
      return;
    }

    try {
      setLoading(true);
      const normalizedPhone = normalizePhoneNumber(phoneNumber);

      let avatar = avatarUrl;
      if (!avatar || avatar.trim() === "") {
        const names = fullName.trim().split(" ");
        const firstName = names[0];
        const lastName = names[1];
        if (lastName) {
          avatar = `https://avatar.iran.liara.run/username?username=${firstName}${lastName}`;
        } else {
          avatar = `https://avatar.iran.liara.run/username?username=${firstName}`;
        }
      }

      const response = await api.post(
        "/auth/signup",
        {
          email,
          fullName,
          password,
          phoneNumber: normalizedPhone,
          avatarUrl: avatar,
        },
        { headers: { skipAuth: true } },
      );

      const data = response.data;
      setLoading(false);

      if (data.responseCode === 201) {
        const { accessToken, refreshToken } = data.data;
        await saveAccessToken(accessToken);
        await saveRefreshToken(refreshToken);

        const userRes = await api.get("/api/users/me");
        const userData = userRes.data;

        if (userData.responseCode === 200 && userData.data.wallet === null) {
          router.replace({
            pathname: "/set-pin",
            params: {
              fullName: userData.data.user.fullName,
              avatar: userData.data.user.avatarUrl,
            },
          });
        }
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
    } finally {
      setLoading(false);
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
          {renderInput(
            "Email",
            email,
            (text: string) => setEmail(text.toLowerCase()),
            "email",
            {
              keyboardType: "email-address",
              autoCapitalize: "none",
            },
          )}
          <View className="relative">
            {renderInput("Password", password, setPassword, "password", {
              secureTextEntry: !showPassword,
            })}
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3"
            >
              <FontAwesome
                name={showPassword ? "eye-slash" : "eye"}
                size={20}
                color="gray"
              />
            </TouchableOpacity>
          </View>
          {renderInput(
            "Phone Number",
            phoneNumber,
            (text: string) => setPhoneNumber(text.replace(/[^\d+]/g, "")),
            "phoneNumber",
            { keyboardType: "phone-pad" },
          )}
          {renderInput(
            "Avatar Url (optional)",
            avatarUrl,
            (text: string) => setAvatarUrl(text),
            "avatarUrl",
            {
              autoCapitalize: "none",
              keyboardType: "url",
            },
          )}
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
            disabled={!isFormValid()}
            className={`rounded-lg h-12 justify-center items-center ${
              isFormValid() ? "bg-[#007BFF]" : "bg-gray-300"
            }`}
          >
            <Text className="text-white text-base font-bold">
              {loading ? "Registering..." : "Register"}
            </Text>
          </TouchableOpacity>

          <View className="flex flex-row mt-5">
            <Text>Have an account?</Text>
            <Link href="/login" className="text-blue-500 ml-1">
              Login here
            </Link>
          </View>
        </View>

        <TermsAndConditions
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          agreed={agreed}
          setAgreed={setAgreed}
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
