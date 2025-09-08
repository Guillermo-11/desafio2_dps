import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AddAppointmentScreen from './screens/AddAppointmentScreen';
import EditAppointmentScreen from './screens/EditAppointmentScreen';
import HomeScreen from './screens/HomeScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Citas' }} />
        <Stack.Screen name="Add" component={AddAppointmentScreen} options={{ title: 'Agregar Cita' }} />
        <Stack.Screen name="Edit" component={EditAppointmentScreen} options={{ title: 'Editar Cita' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
