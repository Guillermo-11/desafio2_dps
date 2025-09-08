import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, useWindowDimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function DetailsScreen ({ route, navigation }) {
  const data = route?.params?.platillo;
  const { width, height } = useWindowDimensions();
  const isHorizontal = width > height;

  if (!data) return null;

  return (
    <View style={[styles.container, isHorizontal && styles.containerHorizontal]}>
      <TouchableOpacity style={[styles.backButton, isHorizontal && { top: 20, left: 20 }]} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={28} color="#333" />
      </TouchableOpacity>

      {isHorizontal ? (
        // Diseño en dos columnas
        <>
          <View style={styles.imageColumn}>
            <Image
              source={{ uri: data.foto }}
              style={styles.imageHorizontal}
              resizeMode="cover"
            />
          </View>
          <ScrollView
            contentContainerStyle={styles.infoColumn}
            style={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
          >
            <Text style={[styles.title, styles.textLeft]}>{data.nombre}</Text>
            <Text style={[styles.region, styles.textLeft]}>Región: {data.region}</Text>
            <Text style={[styles.description, styles.textLeft]}>{data.descripcion}</Text>

            <Text style={[styles.sectionTitle, styles.textLeft]}>Ingredientes</Text>
            <View style={{ alignItems: 'flex-start', width: '100%' }}>
              {data.ingredientes.map((ingrediente, index) => (
                <Text key={index} style={[styles.ingredient, styles.textLeft]}>
                  • {ingrediente}
                </Text>
              ))}
            </View>
            
            <View style={styles.footerH}>
              <Text style={[styles.price, styles.spaceH]}>Precio: ${data.precio}</Text>
              <Text style={[styles.category, styles.catH, styles.spaceH]}>Categoría: {data.categoria}</Text>
            </View>
          </ScrollView>
        </>
      ) : (
        // Diseño vertical tradicional
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Image
            source={{ uri: data.foto }}
            style={styles.image}
            resizeMode="cover"
          />

          <Text style={styles.title}>{data.nombre}</Text>
          <Text style={styles.region}>Región: {data.region}</Text>
          <Text style={styles.description}>{data.descripcion}</Text>

          <Text style={styles.sectionTitle}>Ingredientes</Text>
          {data.ingredientes.map((ingrediente, index) => (
            <Text key={index} style={styles.ingredient}>
              • {ingrediente}
            </Text>
          ))}

          <Text style={styles.price}>Precio: ${data.precio}</Text>
          <Text style={styles.category}>Categoría: {data.categoria}</Text>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
    position: "relative",
  },
  containerHorizontal: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 10,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  // Vertical
  scrollContent: {
    padding: 20,
    paddingTop: 80,
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 220,
    borderRadius: 12,
    marginBottom: 20,
    alignSelf: "center",
  },
  // Horizontal
  imageColumn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingRight: 20,
    marginLeft: 200,
  },
  imageHorizontal: {
    width: 300,
    height: 200,
    borderRadius: 12,
    marginVertical: 20,
    alignSelf: "center",
  },
  infoColumn: {
    flex: 1.5,
    maxWidth: 500,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    paddingVertical: 20,
    marginLeft: 200
  },
  footerH: {
    flexDirection: 'row',
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  region: {
    fontSize: 16,
    fontStyle: "italic",
    color: "#666",
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 20,
    color: "#444",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#2E7D32",
  },
  ingredient: {
    fontSize: 16,
    marginBottom: 5,
    color: "#555",
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    color: "#E64A19",
  },
  category: {
    fontSize: 16,
    marginTop: 20,
    color: "#00796B",
  },
  catH: {
    marginLeft: 60,
  },
  spaceH: {
    marginTop: 10,
  },
  textCenter: {
    textAlign: "center",
  },
  textLeft: {
    textAlign: "left",
    width: "100%",
  },
});