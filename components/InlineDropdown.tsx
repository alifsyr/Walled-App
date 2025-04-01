import React, { useState, useEffect, useCallback } from "react";
import { View, StyleSheet } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

interface InlineDropdownProps {
  data: string[];
  onSelect: (selectedValue: string | null) => void;
  placeholder?: string;
}

const InlineDropdown: React.FC<InlineDropdownProps> = ({
  data,
  onSelect,
  placeholder = "Select an option",
}) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string | null>(null);
  const [items, setItems] = useState(
    data.map((item) => ({ label: item, value: item }))
  );

  useEffect(() => {
    setItems(data.map((item) => ({ label: item, value: item })));
  }, [data]);

  const handleChangeValue = useCallback(
    (selectedValue: string | null) => {
      setValue(selectedValue);
      onSelect(selectedValue);
    },
    [onSelect]
  );

  return (
    <View className="z-10">
      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        placeholder={placeholder}
        onChangeValue={handleChangeValue}
        style={styles.dropdownPicker}
        dropDownContainerStyle={styles.dropdownContainer}
        textStyle={styles.dropdownText}
        placeholderStyle={styles.placeholderText}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  dropdownPicker: {
    borderWidth: 0,
    borderColor: "transparent",
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 2,
  },
  dropdownContainer: {
    borderWidth: 0,
    borderColor: "transparent",
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 2,
  },
  dropdownText: {
    fontSize: 20,
    color: "#333",
  },
  placeholderText: {
    fontSize: 20,
    color: "#999",
  },
});

export default InlineDropdown;
