import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import uuid from 'react-native-uuid';

export default function AddAppointmentScreen({ navigation }) {
  const [clientName, setClientName] = useState('');
  const [vehicle, setVehicle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

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
    // Validaciones
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

    // Revisar duplicados
    let storedAppointments = await AsyncStorage.getItem('appointments');
    storedAppointments = storedAppointments ? JSON.parse(storedAppointments) : [];
    const duplicate = storedAppointments.find(
      (a) => a.date === date.toISOString().split('T')[0] && a.time === time.toTimeString().slice(0,5) && a.vehicle === vehicle
    );
    if (duplicate) {
      Alert.alert('Error', 'Ya existe una cita para este vehículo en la misma fecha y hora.');
      return;
    }

    // Crear nueva cita
    const newAppointment = {
      id: uuid.v4(),
      clientName,
      vehicle,
      date: date.toISOString().split('T')[0],
      time: time.toTimeString().slice(0,5),
      description
    };

    // Guardar en AsyncStorage
    storedAppointments.push(newAppointment);
    await AsyncStorage.setItem('appointments', JSON.stringify(storedAppointments));

    // Volver a HomeScreen
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nombre del Cliente:</Text>
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

      <Button title="Guardar Cita" onPress={handleSave} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  },
  label: {
    fontWeight: 'bold',
    marginTop: 10
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginTop: 5,
    borderRadius: 5
  }
});
