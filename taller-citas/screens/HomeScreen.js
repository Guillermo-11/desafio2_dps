import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { Alert, Button, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen({ navigation }) {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadAppointments);
    return unsubscribe;
  }, [navigation]);

  const loadAppointments = async () => {
    try {
      const data = await AsyncStorage.getItem('appointments');
      if (data !== null) {
        setAppointments(JSON.parse(data));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteAppointment = (id) => {
    Alert.alert(
      "Confirmar eliminación",
      "¿Seguro que deseas eliminar esta cita?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar", 
          onPress: async () => {
            const updated = appointments.filter(item => item.id !== id);
            setAppointments(updated);
            await AsyncStorage.setItem('appointments', JSON.stringify(updated));
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Button title="Agregar Cita" onPress={() => navigation.navigate('Add')} />
      <FlatList
        data={appointments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.card} 
            onPress={() => navigation.navigate('Edit', { appointmentId: item.id })}
          >
            <Text style={styles.title}>{item.clientName} - {item.vehicle}</Text>
            <Text>{item.date} {item.time}</Text>
            <Button title="Eliminar" onPress={() => deleteAppointment(item.id)} />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f0f2f5', // fondo elegante gris claro
  },
  card: {
    padding: 20,
    marginVertical: 10,
    backgroundColor: '#ffffff', // blanco limpio
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  title: {
    fontWeight: '700',
    fontSize: 18,
    color: '#333333', // gris oscuro
  },
  text: {
    fontSize: 14,
    color: '#666666', // gris medio
    marginTop: 5,
  },
  addButton: {
    backgroundColor: '#1e88e5', // azul elegante
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#1e88e5',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  addButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 16,
  },
});
