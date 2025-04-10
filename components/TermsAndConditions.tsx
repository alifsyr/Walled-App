import React from "react";
import {
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Platform,
  useWindowDimensions,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { BlurView } from "expo-blur";

interface TermsAndConditionsProps {
  visible: boolean;
  onClose: () => void;
  agreed: boolean;
  setAgreed: (value: boolean) => void;
}

const TermsAndConditions: React.FC<TermsAndConditionsProps> = ({
  visible,
  onClose,
  agreed,
  setAgreed,
}) => {
  const { height } = useWindowDimensions();

  const handleCheckboxPress = () => {
    setAgreed(!agreed);
  };

  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <BlurView
        intensity={60}
        tint={Platform.OS === "ios" ? "light" : "default"}
        experimentalBlurMethod="dimezisBlurView"
        className="flex-1 items-center justify-center px-4"
        style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
      >
        <View
          className="w-full max-w-md bg-white rounded-2xl px-5 py-6 shadow-lg"
          style={{ maxHeight: height * 0.4 }}
        >
          <Text className="text-xl font-bold mb-4 text-center">
            Terms and Conditions
          </Text>

          <ScrollView className="mb-4" showsVerticalScrollIndicator={false}>
            <Text className="text-gray-700 text-base leading-relaxed">
              By using this application, you agree to the following terms:
              {"\n\n"}
              <Text className="font-bold">1. Acceptance of Terms:</Text> By
              accessing and using this application, you accept and agree to be
              bound by these terms.
              {"\n\n"}
              <Text className="font-bold">2. User Responsibilities:</Text> You
              are responsible for keeping your account and password secure.
              {"\n\n"}
              <Text className="font-bold">3. Data Privacy:</Text> We are
              committed to protecting your personal data. Please read our
              Privacy Policy.
              {"\n\n"}
              <Text className="font-bold">4. Limitation of Liability:</Text> We
              are not liable for any damages from the use of this application.
              {"\n\n"}
              <Text className="font-bold">5. Changes to Terms:</Text> Terms may
              change over time. Continued use indicates your agreement.
            </Text>
          </ScrollView>

          <TouchableOpacity
            onPress={handleCheckboxPress}
            className="flex-row items-center mb-4"
          >
            <FontAwesome
              name={agreed ? "check-square" : "square-o"}
              size={20}
              color={agreed ? "#0061FF" : "#9CA3AF"}
            />
            <Text className="ml-2 text-sm text-gray-600">
              I have read and agree to the Terms *
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onClose}
            className="bg-blue-600 rounded-xl py-3 items-center"
          >
            <Text className="text-gray-600 font-semibold text-base">Close</Text>
          </TouchableOpacity>
        </View>
      </BlurView>
    </Modal>
  );
};

export default TermsAndConditions;
