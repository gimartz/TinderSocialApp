// types/navigation.ts
export type RootStackParamList = {
    Splash: undefined;
    MainApp: undefined;
    OnboardLogin: undefined;
  };
  
  export type OnboardStackParamList = {
    Login: undefined;
    Register: undefined;
    complete: undefined;
    ForgotPassword: undefined;
    ForgotPasswordComplete: undefined;
    test: undefined;
  };
  
  // Extend the root type to include nested navigation
  declare global {
    namespace ReactNavigation {
      interface RootParamList extends RootStackParamList {}
    }
  }