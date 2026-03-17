import React, { useState, useEffect } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { colors } from '../../constants/colors';

interface PromptModalProps {
  visible: boolean;
  title: string;
  message?: string;
  defaultValue?: string;
  placeholder?: string;
  onCancel: () => void;
  onSubmit: (value: string) => void;
}

export function PromptModal({ visible, title, message, defaultValue, placeholder, onCancel, onSubmit }: PromptModalProps) {
  const [value, setValue] = useState(defaultValue || '');

  useEffect(() => {
    if (visible) setValue(defaultValue || '');
  }, [visible, defaultValue]);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.content}>
          <Text style={styles.title}>{title}</Text>
          {message && <Text style={styles.message}>{message}</Text>}
          
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={setValue}
            placeholder={placeholder}
            placeholderTextColor={colors.muted}
            autoFocus
          />

          <View style={styles.buttons}>
            <TouchableOpacity style={styles.btnCancel} onPress={onCancel}>
              <Text style={styles.textCancel}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnSubmit} onPress={() => onSubmit(value)}>
              <Text style={styles.textSubmit}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  content: { width: '80%', backgroundColor: colors.card, borderRadius: 16, padding: 20 },
  title: { fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 8, textAlign: 'center' },
  message: { fontSize: 14, color: colors.text, marginBottom: 16, textAlign: 'center' },
  input: { backgroundColor: colors.background, padding: 12, borderRadius: 8, borderWidth: 1, borderColor: colors.border, marginBottom: 20, color: colors.text },
  buttons: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12 },
  btnCancel: { padding: 10 },
  textCancel: { color: colors.primary, fontWeight: '600' },
  btnSubmit: { padding: 10, paddingHorizontal: 20, backgroundColor: colors.primary, borderRadius: 8 },
  textSubmit: { color: '#fff', fontWeight: '700' }
});
