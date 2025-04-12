import { useEffect } from "react";
import { BackHandler } from "react-native";
import { useNavigationState } from "@react-navigation/native";

export const useBlockBackOnScreens = (blockedScreens: string[]) => {
  const routes = useNavigationState((state) => state.routes);
  const currentRoute = routes[routes.length - 1]?.name;

  useEffect(() => {
    if (!blockedScreens.includes(currentRoute)) return;

    const onBackPress = () => {
      return true; // block back
    };

    const sub = BackHandler.addEventListener("hardwareBackPress", onBackPress);
    return () => sub.remove();
  }, [currentRoute]);
};
