import React, { useState } from 'react';
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

type FAQItem = {
  id: string;
  question: string;
  answer: string;
};

const faqs: FAQItem[] = [
  {
    id: '1',
    question: 'How do I log a workout?',
    answer:
      'Tap the "Log Workout" button on the home screen. Select exercises from the database, enter your weight and reps, then save.',
  },
  {
    id: '2',
    question: 'How does the AI planner work?',
    answer:
      'The AI planner analyzes your workout history and creates personalized recommendations based on your goals, equipment, and available time.',
  },
  {
    id: '3',
    question: 'Can I create custom templates?',
    answer:
      'Yes! Go to Templates and tap "Create Template" to save your favorite workout routines for quick access later.',
  },
  {
    id: '4',
    question: 'How is my progress calculated?',
    answer:
      'Progress tracks volume (weight × reps), workout frequency, and streaks over weekly, monthly, and yearly timeframes.',
  },
  {
    id: '5',
    question: 'Is my data backed up?',
    answer:
      'Your workouts are saved locally on your device. We recommend regularly exporting your data for backup purposes.',
  },
  {
    id: '6',
    question: 'How do I delete a workout?',
    answer: 'Go to History, find the workout, swipe left and tap delete, or tap the trash icon.',
  },
];

export default function Help() {
  const router = useRouter();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleFAQ = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleEmail = () => {
    Linking.openURL('mailto:kyleshien26@gmail.com?subject=GymApp Support');
  };

  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Support</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Contact Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Us</Text>
          <TouchableOpacity style={styles.contactButton} onPress={handleEmail}>
            <Ionicons name="mail-outline" size={20} color={colors.primary} />
            <View style={styles.contactInfo}>
              <Text style={styles.contactLabel}>Email Support</Text>
              <Text style={styles.contactValue}>kyleshien26@gmail.com</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.muted} />
          </TouchableOpacity>

            <Ionicons name="chatbubbles-outline" size={20} color={colors.primary} />
            <View style={styles.contactInfo}>
              <Text style={styles.contactValue}>Join our community</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.muted} />
          </TouchableOpacity>
        </View>

        {/* FAQ Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          {faqs.map((faq) => (
            <TouchableOpacity
              key={faq.id}
              style={styles.faqItem}
              onPress={() => toggleFAQ(faq.id)}
            >
              <View style={styles.faqHeader}>
                <Text style={styles.faqQuestion}>{faq.question}</Text>
                <Ionicons
                  name={expandedId === faq.id ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color={colors.primary}
                />
              </View>
              {expandedId === faq.id && (
                <Text style={styles.faqAnswer}>{faq.answer}</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Additional Resources */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resources</Text>
          <TouchableOpacity style={styles.resourceLink}>
            <Ionicons name="document-outline" size={20} color={colors.primary} />
            <Text style={styles.resourceText}>Privacy Policy</Text>
            <Ionicons name="open-outline" size={16} color={colors.muted} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.resourceLink}>
            <Ionicons name="document-outline" size={20} color={colors.primary} />
            <Text style={styles.resourceText}>Terms of Service</Text>
            <Ionicons name="open-outline" size={16} color={colors.muted} />
          </TouchableOpacity>
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 10,
    gap: 12,
  },
  contactInfo: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  contactValue: {
    fontSize: 12,
    color: colors.muted,
    marginTop: 2,
  },
  faqItem: {
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 10,
    overflow: 'hidden',
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  faqQuestion: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginRight: 12,
  },
  faqAnswer: {
    fontSize: 13,
    color: colors.muted,
    paddingHorizontal: 14,
    paddingBottom: 12,
    lineHeight: 18,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
  },
  resourceLink: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 10,
    gap: 12,
  },
  resourceText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
});
