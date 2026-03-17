import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors } from '../../constants/colors';

export default function About() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>About</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.logoContainer}>
          <View style={styles.logoPlaceholder}>
            <Ionicons name="barbell" size={48} color="#fff" />
          </View>
          <Text style={styles.appName}>GymApp</Text>
          <Text style={styles.version}>Version 1.0.0</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Project Info</Text>
          <Text style={styles.text}>
            This application was developed as part of an International Baccalaureate (IB) Computer Science Internal Assessment.
          </Text>
          <Text style={styles.text}>
            It aims to solve the problem of unoptimized training volume and lack of progressive overload planning for intermediate lifters.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Tech Stack</Text>
          <View style={styles.techRow}><Text style={styles.bullet}>•</Text><Text style={styles.techText}>React Native (Expo)</Text></View>
          <View style={styles.techRow}><Text style={styles.bullet}>•</Text><Text style={styles.techText}>TypeScript</Text></View>
          <View style={styles.techRow}><Text style={styles.bullet}>•</Text><Text style={styles.techText}>AsyncStorage (Local Persistence)</Text></View>
          <View style={styles.techRow}><Text style={styles.bullet}>•</Text><Text style={styles.techText}>Custom Heuristic Algorithms</Text></View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2024 Kyle Shien</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 54,
    paddingBottom: 16,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: colors.text },
  content: { padding: 20 },
  logoContainer: { alignItems: 'center', marginBottom: 32, marginTop: 20 },
  logoPlaceholder: {
    width: 80,
    height: 80,
    backgroundColor: colors.primary,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  appName: { fontSize: 24, fontWeight: '800', color: colors.text },
  version: { fontSize: 14, color: colors.muted, marginTop: 4 },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTitle: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: 12 },
  text: { fontSize: 14, color: colors.text, lineHeight: 22, marginBottom: 10 },
  techRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  bullet: { color: colors.primary, marginRight: 8, fontSize: 18 },
  techText: { fontSize: 14, color: colors.text, fontWeight: '500' },
  footer: { marginTop: 20, alignItems: 'center' },
  footerText: { color: colors.muted, fontSize: 12 },
});