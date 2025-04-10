import React, { useRef } from "react";
import {
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Platform,
  useWindowDimensions,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { BlurView } from "expo-blur";

interface TermsAndConditionsProps {
  visible: boolean;
  onClose: () => void;
  onScrollEnd: () => void;
  hasScrolledToEnd: boolean;
  setHasScrolledToEnd: (value: boolean) => void;
}

const TermsAndConditions: React.FC<TermsAndConditionsProps> = ({
  visible,
  onClose,
  onScrollEnd,
  hasScrolledToEnd,
  setHasScrolledToEnd,
}) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const { height } = useWindowDimensions();

  const handleScroll = (event: any) => {
    const contentHeight = event.nativeEvent.contentSize.height;
    const scrollHeight = event.nativeEvent.layoutMeasurement.height;
    const scrollPosition = event.nativeEvent.contentOffset.y;

    if (scrollPosition + scrollHeight >= contentHeight) {
      setHasScrolledToEnd(true);
      onScrollEnd();
    }
  };

  const handleCheckboxPress = () => {
    if (!hasScrolledToEnd) {
      Alert.alert("Please read the Terms and Conditions before agreeing.");
    } else {
      Alert.alert("Thank you!", "You have agreed to the Terms.");
    }
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
        className="flex-1 items-center justify-center px-4"
      >
        <View
          className="w-full max-w-md bg-white  rounded-2xl px-5 py-6 p-6 shadow-lg"
          style={{ maxHeight: height * 0.5 }}
        >
          <Text className="text-xl font-bold mb-4 text-center">
            Terms and Conditions
          </Text>

          <ScrollView
            ref={scrollViewRef}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            className="mb-4 h-[60%]"
            showsVerticalScrollIndicator={false}
          >
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
              name={hasScrolledToEnd ? "check-square" : "square-o"}
              size={20}
              color={hasScrolledToEnd ? "#0061FF" : "#9CA3AF"}
            />
            <Text className="ml-2 text-sm text-gray-600">
              I have read and agree to the Terms *
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onClose}
            className="bg-blue-600 rounded-xl py-3 items-center"
          >
            <Text className="text-black font-semibold text-base">Close</Text>
          </TouchableOpacity>
        </View>
      </BlurView>
    </Modal>
  );
};

export default TermsAndConditions;
