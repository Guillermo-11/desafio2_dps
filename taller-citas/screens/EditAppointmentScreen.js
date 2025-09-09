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

    if (!vehicle.trim()) {
      Alert.alert('Error', 'Debe ingresar el modelo del vehículo.');
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
    Alert.alert('Éxito', 'Cita actualizada correctamente.');
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

      <View style={{ marginTop: 20 }}>
        <Button title="Guardar Cambios" color="#1e88e5" onPress={handleSave} />
      </View>

      <View style={{ marginTop: 15 }}>
        <Button title="Eliminar Cita" color="#e53935" onPress={handleDelete} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f0f2f5' },
  label: { fontWeight: 'bold', fontSize: 14, color: '#333', marginTop: 15 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 8, marginTop: 5, backgroundColor: '#fff', fontSize: 14 },
});
