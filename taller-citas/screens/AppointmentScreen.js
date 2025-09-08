import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';

export default function AppointmentScreen({ navigation, route }) {
  const editingAppointment = route.params?.appointment || null;

  const [clientName, setClientName] = useState(editingAppointment?.clientName || '');
  const [vehicle, setVehicle] = useState(editingAppointment?.vehicle || '');
  const [date, setDate] = useState(editingAppointment?.date || '');
  const [time, setTime] = useState(editingAppointment?.time || '');
  const [description, setDescription] = useState(editingAppointment?.description || '');

  const handleSave = async () => {
    if (clientName.trim().length < 3) {
      Alert.alert('Error', 'El nombre del cliente debe tener al menos 3 caracteres');
      return;
    }

    // Validación fecha y hora
    // Validación de fecha y hora
const now = new Date();

// Validar formato HH:MM
const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
if (!timeRegex.test(time)) {
  Alert.alert('Error', 'La hora debe estar en formato HH:MM (00:00 a 23:59)');
  return;
}
const dateRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
if (!dateRegex.test(date)) {
  Alert.alert('Error', 'La fecha debe estar en formato YYYY-MM-DD');
  return;
}

const selectedDate = new Date(`${date}T${time}`);
if (selectedDate < now) {
  Alert.alert('Error', 'La fecha y hora deben ser futuras');
  return;
}


    try {
      const stored = await AsyncStorage.getItem('appointments');
      const appointments = stored ? JSON.parse(stored) : [];

      if (editingAppointment) {
        // Editar
        const updated = appointments.map(a =>
          a.id === editingAppointment.id
            ? { ...a, clientName, vehicle, date, time, description }
            : a
        );
        await AsyncStorage.setItem('appointments', JSON.stringify(updated));
      } else {
        // Nuevo
        const newAppointment = {
          id: uuid.v4(),
          clientName,
          vehicle,
          date,
          time,
          description
        };
        appointments.push(newAppointment);
        await AsyncStorage.setItem('appointments', JSON.stringify(appointments));
      }

      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudo guardar la cita');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nombre del Cliente</Text>
      <TextInput style={styles.input} value={clientName} onChangeText={setClientName} />

      <Text style={styles.label}>Modelo del Vehículo</Text>
      <TextInput style={styles.input} value={vehicle} onChangeText={setVehicle} />

      <Text style={styles.label}>Fecha (YYYY-MM-DD)</Text>
      <TextInput style={styles.input} value={date} onChangeText={setDate} placeholder="2025-09-08" />

      <Text style={styles.label}>Hora (HH:MM)</Text>
      <TextInput style={styles.input} value={time} onChangeText={setTime} placeholder="14:30" />

      <Text style={styles.label}>Descripción (Opcional)</Text>
      <TextInput style={styles.input} value={description} onChangeText={setDescription} />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>{editingAppointment ? 'Guardar Cambios' : 'Agregar Cita'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f0f2f5' },
  label: { fontWeight: '600', fontSize: 14, color: '#555', marginTop: 15 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 10,
    marginTop: 5,
    backgroundColor: '#fff',
    fontSize: 14,
    color: '#333',
  },
  saveButton: {
    backgroundColor: '#1e88e5',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 25,
    shadowColor: '#1e88e5',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 4,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
