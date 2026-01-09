import { Redirect } from "expo-router";

export default function Index() {
  // TODO: Later, we will check if the user has seen onboarding using AsyncStorage.
    // For now, let's force them to the Onboarding screen to build it.
    return Redirect({ href: "/(onboarding)/welcome" });
}