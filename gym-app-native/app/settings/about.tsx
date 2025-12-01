import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors } from '../../constants/colors';

export default function About() {
  const router = useRouter();

  const openLink = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>About GymApp</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* App Info Section */}
        <View style={styles.appInfoSection}>
          <View style={styles.appIconContainer}>
            <Ionicons name="barbell" size={64} color={colors.primary} />
          </View>
          <Text style={styles.appName}>GymApp</Text>
          <Text style={styles.appTagline}>Smart Workout Tracking</Text>
        </View>

        {/* Version Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Version</Text>
            <Text style={styles.infoValue}>1.0.0</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Build</Text>
            <Text style={styles.infoValue}>20241201</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Developer</Text>
            <Text style={styles.infoValue}>Kyle Shien</Text>
          </View>
        </View>

        {/* Features Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Features</Text>
          {[
            { icon: 'barbell' as const, text: 'Exercise Database with 40+ exercises' },
            { icon: 'trending-up' as const, text: 'Progress Tracking & Analytics' },
            { icon: 'bulb' as const, text: 'AI-Powered Workout Planning' },
            { icon: 'save' as const, text: 'Offline Data Storage' },
            { icon: 'layers' as const, text: 'Custom Workout Templates' },
          ].map((feature, idx) => (
            <View key={idx} style={styles.featureItem}>
              <Ionicons
                name={feature.icon}
                size={20}
                color={colors.primary}
                style={{ marginRight: 12 }}
              />
              <Text style={styles.featureText}>{feature.text}</Text>
            </View>
          ))}
        </View>

        {/* Credits Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Credits</Text>
          <View style={styles.creditItem}>
            <Text style={styles.creditLabel}>Built with</Text>
            <Text style={styles.creditValue}>React Native & Expo</Text>
          </View>
          <View style={styles.creditItem}>
            <Text style={styles.creditLabel}>Icons</Text>
            <Text style={styles.creditValue}>Ionicons by Ionic</Text>
          </View>
          <View style={styles.creditItem}>
            <Text style={styles.creditLabel}>Database</Text>
            <Text style={styles.creditValue}>AsyncStorage & File System</Text>
          </View>
        </View>

        {/* Links Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Links</Text>
          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => openLink('https://github.com/kyleshien26-ux/GymApp')}
          >
            <Ionicons name="logo-github" size={20} color={colors.primary} />
            <Text style={styles.linkText}>GitHub Repository</Text>
            <Ionicons name="open-outline" size={16} color={colors.muted} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.linkButton}
          >
            <Ionicons name="open-outline" size={16} color={colors.muted} />
          </TouchableOpacity>
        </View>

        {/* Legal Section */}
        <View style={styles.legalSection}>
          <Text style={styles.legalText}>
            GymApp is a free, open-source fitness tracking application designed to help you
            achieve your fitness goals with intelligent workout planning and progress tracking.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  appInfoSection: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  appIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  appName: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 4,
  },
  appTagline: {
    fontSize: 14,
    color: colors.muted,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: colors.card,
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  infoLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.muted,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: colors.card,
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  featureText: {
    fontSize: 13,
    color: colors.text,
  },
  creditItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: colors.card,
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  creditLabel: {
    fontSize: 12,
    color: colors.muted,
    marginBottom: 4,
  },
  creditValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: colors.card,
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12,
  },
  linkText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  legalSection: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  legalText: {
    fontSize: 12,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 18,
  },
});
