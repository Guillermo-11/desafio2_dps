import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, useWindowDimensions, StatusBar } from 'react-native';
import Platillos from '../Platillos.json';

export default function HomeScreen({ navigation }) {
  const { width, height } = useWindowDimensions();
  const isHorizontal = width > height;

  const renderPlatillo = ({ item }) => (
    <View
      key={item.id}
      style={[
        styles.card,
        isHorizontal && styles.cardHorizontal,
      ]}
    >
      <Image source={{ uri: item.foto }} style={[styles.image, isHorizontal && styles.imageHorizontal]} resizeMode="cover" />
      <View style={styles.info}>
        <Text style={styles.titlePlatillo}>{item.nombre}</Text>
        <Text style={styles.description}>{item.descripcion}</Text>
        <Text style={styles.price}>${item.precio.toFixed(2)}</Text>
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Detalles", { platillo: item })}
      >
        <Text style={styles.buttonText}>Ver Detalles</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f8f8" />
      <View style={[
        styles.header,
        isHorizontal && styles.headerHorizontal
      ]}>
        <Text style={[
          styles.pageTitle,
          isHorizontal && styles.pageTitleHorizontal
        ]}>
          Platillos Típicos
        </Text>
      </View>
      <FlatList
        data={Platillos}
        renderItem={renderPlatillo}
        keyExtractor={(item) => item.id}
        numColumns={isHorizontal ? 2 : 1}
        key={isHorizontal ? 'h' : 'v'}
        contentContainerStyle={[
          styles.listContent,
          isHorizontal && { ...styles.listContentHorizontal, width: Math.min(width, 900) }
        ]}
        columnWrapperStyle={isHorizontal ? { gap: 24, justifyContent: 'center' } : null}
        showsVerticalScrollIndicator={false}
        style={isHorizontal ? { alignSelf: 'center', width: '100%' } : null}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  header: {
    paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + 20 : 40,
    paddingBottom: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8f8f8",
  },
  headerHorizontal: {
    paddingTop: 30,
    paddingBottom: 20,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#3498db",
    letterSpacing: 1,
    textShadowColor: "#bbb",
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 3,
    textAlign: "center",
  },
  pageTitleHorizontal: {
    fontSize: 32,
  },
  listContent: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  listContentHorizontal: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 0,
    // El ancho se ajusta dinámicamente en el FlatList
  },
  cardHorizontal: {
    maxWidth: 420,
    minWidth: 320,
    marginVertical: 12,
    alignSelf: 'center',
    height: 360,
  },
  card: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginHorizontal: 4,
    maxWidth: '100%',
  },
  image: {
    width: "100%",
    height: 180,
    borderRadius: 12,
    marginBottom: 10,
  },
  imageHorizontal: {
    height: 120,
  },
  info: {
    marginBottom: 10,
  },
  titlePlatillo: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: "#555",
    marginBottom: 5,
  },
  price: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2c7",
  },
  button: {
    backgroundColor: "#3498db",
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});