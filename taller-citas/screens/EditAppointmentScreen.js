import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function EditAppointmentScreen({ route, navigation }) {
  const { appointmentId } = route.params;

  const [clientName, setClientName] = useState('');
  const [vehicle, setVehicle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [appointments, setAppointments] = useState([]);

useEffect(() => {
  const loadAppointment = async () => {
    let storedAppointments = await AsyncStorage.getItem('appointments');
    storedAppointments = storedAppointments ? JSON.parse(storedAppointments) : [];
    setAppointments(storedAppointments);

    const appointment = storedAppointments.find(a => a.id === appointmentId);
    if (appointment) {
      setClientName(appointment.clientName || '');
      setVehicle(appointment.vehicle || '');
      setDescription(appointment.description || '');

      // Separar correctamente fecha y hora
      const [hours, minutes] = appointment.time.split(':');
      const [year, month, day] = appointment.date.split('-').map(Number);
      const appointmentDateTime = new Date(year, month - 1, day, parseInt(hours), parseInt(minutes));

      setDate(appointmentDateTime);
      setTime(appointmentDateTime);
    }
  };
  loadAppointment();
}, []);


  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const onChangeTime = (event, selectedTime) => {
    const currentTime = selectedTime || time;
    setShowTimePicker(Platform.OS === 'ios');
    setTime(currentTime);
  };

  const handleSave = async () => {
    if (clientName.trim().length < 3) {
      Alert.alert('Error', 'El nombre del cliente debe tener al menos 3 caracteres.');
      return;
    }

    const appointmentDateTime = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      time.getHours(),
      time.getMinutes()
    );

    if (appointmentDateTime <= new Date()) {
      Alert.alert('Error', 'La fecha y hora deben ser posteriores al momento actual.');
      return;
    }

    // Revisar duplicados (excepto la cita que estamos editando)
    const duplicate = appointments.find(
      (a) =>
        a.id !== appointmentId &&
        a.date === date.toISOString().split('T')[0] &&
        a.time === time.toTimeString().slice(0,5) &&
        a.vehicle === vehicle
    );
    if (duplicate) {
      Alert.alert('Error', 'Ya existe una cita para este vehículo en la misma fecha y hora.');
      return;
    }

    // Actualizar cita
    const updatedAppointments = appointments.map(a => {
      if (a.id === appointmentId) {
        return {
          ...a,
          clientName,
          vehicle,
          date: date.toISOString().split('T')[0],
          time: time.toTimeString().slice(0,5),
          description
        };
      }
      return a;
    });

    await AsyncStorage.setItem('appointments', JSON.stringify(updatedAppointments));
    navigation.goBack();
  };

  const handleDelete = () => {
    Alert.alert(
      'Confirmar eliminación',
      '¿Deseas eliminar esta cita?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            const filtered = appointments.filter(a => a.id !== appointmentId);
            await AsyncStorage.setItem('appointments', JSON.stringify(filtered));
            navigation.goBack();
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nomffbre del Cliente:</Text>
      <TextInput style={styles.input} value={clientName} onChangeText={setClientName} />

      <Text style={styles.label}>Modelo del Vehículo:</Text>
      <TextInput style={styles.input} value={vehicle} onChangeText={setVehicle} />

      <Text style={styles.label}>Fecha:</Text>
      <Button title={date.toDateString()} onPress={() => setShowDatePicker(true)} />
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          minimumDate={new Date()}
          onChange={onChangeDate}
        />
      )}

      <Text style={styles.label}>Hora:</Text>
      <Button title={time.toTimeString().slice(0,5)} onPress={() => setShowTimePicker(true)} />
      {showTimePicker && (
        <DateTimePicker
          value={time}
          mode="time"
          display="default"
          onChange={onChangeTime}
        />
      )}

      <Text style={styles.label}>Descripción (opcional):</Text>
      <TextInput
        style={[styles.input, {height: 80}]}
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <Button title="Guardar Cambios" onPress={handleSave} />
      <View style={{ marginTop: 10 }}>
        <Button title="Eliminar Cita" color="red" onPress={handleDelete} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  saveButton: {
    backgroundColor: '#43a047', // verde elegante
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 25,
    shadowColor: '#43a047',
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
  deleteButton: {
    backgroundColor: '#e53935', // rojo intenso
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 15,
    shadowColor: '#e53935',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 4,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
    backgroundColor: '#fff',
    fontSize: 14,
    color: '#333',
  },
  label: {
    fontWeight: '600',
    fontSize: 14,
    color: '#555',
    marginTop: 15,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f2f5',
  },
});

