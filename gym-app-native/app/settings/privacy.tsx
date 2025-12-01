import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors } from '../../constants/colors';

export default function PrivacyPolicy() {
  const router = useRouter();

  const sections = [
    {
      title: 'Data Collection',
      content: 'GymApp collects only the data you explicitly provide, including workout logs, personal measurements, and profile information. We do not collect any data automatically or track your usage patterns.',
    },
    {
      title: 'Data Storage',
      content: 'All your data is stored locally on your device using secure storage mechanisms. Your workout data never leaves your device unless you explicitly choose to export it.',
    },
    {
      title: 'Data Sharing',
      content: 'We do not share, sell, or transmit your personal data to any third parties. Your fitness data remains entirely private and under your control.',
    },
    {
      title: 'Data Export',
      content: 'You can export all your data at any time in JSON format. This allows you to backup your data or transfer it to another device.',
    },
    {
      title: 'Data Deletion',
      content: 'You have full control over your data. You can delete all stored workout data at any time through the Data Management settings. Once deleted, data cannot be recovered.',
    },
    {
      title: 'No Internet Required',
      content: 'GymApp functions entirely offline. No internet connection is required for any features, ensuring your data stays on your device.',
    },
    {
      title: 'No Analytics',
      content: 'We do not use any analytics services, tracking pixels, or third-party monitoring tools. Your privacy is our priority.',
    },
    {
      title: 'Contact',
      content: 'If you have any questions about this privacy policy, please contact us at kyleshien26@gmail.com',
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Privacy Policy</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.lastUpdated}>Last updated: December 2024</Text>
        
        <Text style={styles.intro}>
          GymApp is designed with your privacy as a top priority. This policy explains how we handle your data.
        </Text>

        {sections.map((section, index) => (
          <View key={index} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Text style={styles.sectionContent}>{section.content}</Text>
          </View>
        ))}

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            This privacy policy is effective as of December 2024 and will remain in effect except with respect to any changes in its provisions in the future.
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  lastUpdated: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  intro: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  sectionContent: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 21,
  },
  footer: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginBottom: 40,
  },
  footerText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontStyle: 'italic',
    lineHeight: 18,
  },
});
