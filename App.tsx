import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { JournalScreen } from './src/screens/JournalScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { CareerScreen } from './src/screens/CareerScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { CameraScreen } from './src/screens/CameraScreen'; 

export type RootStackParamList = {
  MainTabs: undefined;
  CameraModal: undefined;
};
export type TabParamList = {
  Home: undefined;
  Journal: undefined;
  ScanTab: undefined;
  Career: undefined;
  Profile: undefined;
};
type AppNavigationProp = StackNavigationProp<RootStackParamList>;

const ScanButton = () => {
  const navigation = useNavigation<AppNavigationProp>();
  return (
    <TouchableOpacity
      style={styles.scanButtonContainer}
      onPress={() => navigation.navigate('CameraModal')}
    >
      <View style={styles.scanButtonInner} />
    </TouchableOpacity>
  );
};

const EmptyComponent = () => null;

const Tab = createBottomTabNavigator<TabParamList>();
const RootStack = createStackNavigator<RootStackParamList>();

function MainTabs() {
  const insets = useSafeAreaInsets();
  
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: [
          styles.tabBar,
          {
            bottom: insets.bottom + 5, 
          }
        ],
        tabBarInactiveTintColor: '#8e8e93',
        tabBarActiveTintColor: '#007AFF',
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarIcon: ({ color, size }) => (<Ionicons name="home-outline" size={size} color={color} />) }} />
      <Tab.Screen name="Journal" component={JournalScreen} options={{ tabBarIcon: ({ color, size }) => (<Ionicons name="journal-outline" size={size} color={color} />) }} />
      <Tab.Screen name="ScanTab" component={EmptyComponent} options={{ tabBarButton: ScanButton }} />
      <Tab.Screen name="Career" component={CareerScreen} options={{ tabBarIcon: ({ color, size }) => (<Ionicons name="briefcase-outline" size={size} color={color} />) }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarIcon: ({ color, size }) => (<Ionicons name="person-outline" size={size} color={color} />) }} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    'Poppins-Regular': require('./assets/fonts/Poppins-Regular.ttf'),
    'Poppins-Bold': require('./assets/fonts/Poppins-Bold.ttf'),
  });

  if (!fontsLoaded) {
    return null; 
  }

  return (
    <NavigationContainer>
      <RootStack.Navigator>
        <RootStack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
        <RootStack.Screen name="CameraModal" component={CameraScreen} options={{ headerShown: false, presentation: 'modal' }} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 15,
    left: 20,
    right: 20,
    elevation: 0,
    backgroundColor: '#ffffff',
    borderRadius: 15,
    height: 65,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
  },
  scanButtonContainer: { top: -30, justifyContent: 'center', alignItems: 'center', width: 70, height: 70, borderRadius: 35, backgroundColor: '#007AFF', elevation: 5, shadowColor: '#007AFF', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.25, shadowRadius: 10,},
  scanButtonInner: { width: 60, height: 60, borderRadius: 30, backgroundColor: 'white' }
});