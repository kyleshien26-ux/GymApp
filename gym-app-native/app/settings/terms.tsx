import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors } from '../../constants/colors';

export default function TermsOfService() {
  const router = useRouter();

  const sections = [
    {
      title: '1. Acceptance of Terms',
      content: 'By downloading, installing, or using GymApp, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the application.',
    },
    {
      title: '2. Description of Service',
      content: 'GymApp is a fitness tracking application designed to help users log workouts, track progress, and receive adaptive weight suggestions. The app is provided as-is for personal, non-commercial use.',
    },
    {
      title: '3. User Responsibilities',
      content: 'You are responsible for maintaining the accuracy of your workout data. You agree to use the app only for lawful purposes and in accordance with these terms. You should consult a healthcare professional before starting any new exercise program.',
    },
    {
      title: '4. Health Disclaimer',
      content: 'GymApp provides fitness tracking and suggestions for informational purposes only. The app does not provide medical advice. Always consult with a qualified healthcare provider before beginning any exercise program or making changes to your fitness routine.',
    },
    {
      title: '5. Data and Privacy',
      content: 'Your data is stored locally on your device. We do not collect, store, or transmit your personal information to external servers. Please refer to our Privacy Policy for more details.',
    },
    {
      title: '6. Intellectual Property',
      content: 'GymApp and its original content, features, and functionality are owned by the developer and are protected by international copyright laws. This app was developed as an IB Computer Science IA project.',
    },
    {
      title: '7. Limitation of Liability',
      content: 'GymApp is provided "as is" without warranties of any kind. The developer shall not be liable for any injuries, damages, or losses resulting from the use of this application or reliance on information provided within it.',
    },
    {
      title: '8. Modifications',
      content: 'We reserve the right to modify or discontinue the app at any time without notice. We may also update these terms from time to time. Continued use of the app after changes constitutes acceptance of the new terms.',
    },
    {
      title: '9. Termination',
      content: 'You may stop using GymApp at any time by uninstalling the application. Upon uninstallation, all locally stored data will be removed from your device.',
    },
    {
      title: '10. Contact',
      content: 'For questions about these Terms of Service, please contact: kyleshien26@gmail.com',
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Terms of Service</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.lastUpdated}>Effective Date: December 2024</Text>
        
        <Text style={styles.intro}>
          Please read these Terms of Service carefully before using GymApp.
        </Text>

        {sections.map((section, index) => (
          <View key={index} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Text style={styles.sectionContent}>{section.content}</Text>
          </View>
        ))}

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            By using GymApp, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
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
    fontWeight: '500',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 15,
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
    fontSize: 13,
    color: colors.text,
    fontWeight: '500',
    lineHeight: 20,
    textAlign: 'center',
  },
});
