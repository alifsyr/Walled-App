import React, { useState, useEffect, useCallback } from "react";
import { View, ViewStyle, TextStyle, Text, DimensionValue } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { Feather } from "@expo/vector-icons";

interface InlineDropdownItem {
  label: string;
  value: string;
}

interface InlineDropdownProps {
  data: (string | InlineDropdownItem)[];
  onSelect: (selectedValue: string | null) => void;
  placeholder?: string;
  fontSize?: number;
  fontColor?: string;
  containerColor?: string;
  containerStyle?: ViewStyle;
  containerSize?: DimensionValue;
  label?: string;
}

const InlineDropdown: React.FC<InlineDropdownProps> = ({
  data,
  onSelect,
  placeholder = "Select an option",
  fontSize = 16,
  fontColor = "#000",
  containerColor = "#fff",
  containerStyle,
  containerSize = "100%",
  label,
}) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string | null>(null);
  const [items, setItems] = useState<InlineDropdownItem[]>([]);

  useEffect(() => {
    const mapped = data.map((item) =>
      typeof item === "string" ? { label: item, value: item } : item,
    );
    setItems(mapped);
  }, [data]);

  const handleChangeValue = useCallback(
    (selectedValue: string | null) => {
      setValue(selectedValue);
      onSelect(selectedValue);
    },
    [onSelect],
  );

  const dynamicTextStyle: TextStyle = {
    fontSize,
    color: fontColor,
  };

  const dynamicPlaceholderStyle: TextStyle = {
    fontSize,
    color: fontColor || "#999",
  };

  return (
    <View className="z-10 w-full flex-row items-center" style={containerStyle}>
      {label && (
        <Text
          className="font-semibold ml-3 mb-1"
          style={{ fontSize, color: fontColor }}
        >
          {label}:
        </Text>
      )}

      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        placeholder={placeholder}
        onChangeValue={handleChangeValue}
        style={{
          backgroundColor: containerColor,
          borderColor: containerColor,
          borderWidth: 2,
          borderRadius: 12,
          height: 50,
          width: containerSize,
        }}
        dropDownContainerStyle={{
          backgroundColor: containerColor,
          borderColor: containerColor,
          borderWidth: 2,
          borderTopWidth: 0,
          borderRadius: 12,
          width: containerSize,
        }}
        textStyle={dynamicTextStyle}
        placeholderStyle={dynamicPlaceholderStyle}
        listMode="SCROLLVIEW"
        ArrowDownIconComponent={() => (
          <Feather name="chevron-down" size={24} color={fontColor} />
        )}
        ArrowUpIconComponent={() => (
          <Feather name="chevron-up" size={24} color={fontColor} />
        )}
      />
    </View>
  );
};

export default InlineDropdown;
