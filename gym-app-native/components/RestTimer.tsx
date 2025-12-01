import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Vibration } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';

interface RestTimerProps {
  visible: boolean;
  initialSeconds?: number;
  onComplete?: () => void;
  onDismiss?: () => void;
}

export const RestTimer: React.FC<RestTimerProps> = ({
  visible,
  initialSeconds = 90,
  onComplete,
  onDismiss,
}) => {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    setSecondsLeft(initialSeconds);
    setIsRunning(false);
  }, [visible, initialSeconds]);

  useEffect(() => {
    if (!visible || !isRunning) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          Vibration.vibrate([100, 100, 100]);
          onComplete?.();
          return initialSeconds;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [visible, isRunning, initialSeconds, onComplete]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAddTime = () => {
    setSecondsLeft((prev) => prev + 15);
  };

  const handleSubtractTime = () => {
    setSecondsLeft((prev) => Math.max(0, prev - 15));
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const handleDismiss = () => {
    setIsRunning(false);
    setSecondsLeft(initialSeconds);
    onDismiss?.();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleDismiss}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Rest Timer</Text>
            <TouchableOpacity onPress={handleDismiss}>
              <Ionicons name="close" size={28} color={colors.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.timerDisplay}>
            <Text style={styles.timeText}>{formatTime(secondsLeft)}</Text>
            <Text style={styles.label}>Time Remaining</Text>
          </View>

          <View style={styles.controls}>
            <TouchableOpacity
              style={styles.controlButton}
              onPress={handleSubtractTime}
              disabled={!isRunning && secondsLeft === initialSeconds}
            >
              <Ionicons name="remove-circle-outline" size={32} color={colors.primary} />
              <Text style={styles.controlLabel}>-15s</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.playButton, isRunning && styles.playButtonActive]}
              onPress={toggleTimer}
            >
              <Ionicons
                name={isRunning ? 'pause-circle' : 'play-circle'}
                size={64}
                color={isRunning ? '#ef4444' : colors.primary}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.controlButton}
              onPress={handleAddTime}
            >
              <Ionicons name="add-circle-outline" size={32} color={colors.primary} />
              <Text style={styles.controlLabel}>+15s</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.quickButtons}>
            <TouchableOpacity
              style={styles.quickButton}
              onPress={() => {
                setSecondsLeft(30);
                setIsRunning(false);
              }}
            >
              <Text style={styles.quickButtonText}>30s</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.quickButton}
              onPress={() => {
                setSecondsLeft(60);
                setIsRunning(false);
              }}
            >
              <Text style={styles.quickButtonText}>1m</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.quickButton}
              onPress={() => {
                setSecondsLeft(90);
                setIsRunning(false);
              }}
            >
              <Text style={styles.quickButtonText}>90s</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.quickButton}
              onPress={() => {
                setSecondsLeft(120);
                setIsRunning(false);
              }}
            >
              <Text style={styles.quickButtonText}>2m</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.dismissButton} onPress={handleDismiss}>
            <Text style={styles.dismissText}>Dismiss</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 24,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  timerDisplay: {
    alignItems: 'center',
    marginBottom: 40,
    paddingVertical: 32,
    backgroundColor: colors.background,
    borderRadius: 16,
  },
  timeText: {
    fontSize: 72,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 2,
  },
  label: {
    fontSize: 14,
    color: colors.muted,
    marginTop: 12,
    fontWeight: '600',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
    gap: 12,
  },
  controlButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  controlLabel: {
    fontSize: 12,
    color: colors.muted,
    marginTop: 8,
    fontWeight: '600',
  },
  playButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  playButtonActive: {
    opacity: 0.8,
  },
  quickButtons: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },
  quickButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: colors.primary,
    borderRadius: 12,
    alignItems: 'center',
  },
  quickButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  dismissButton: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    backgroundColor: colors.background,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  dismissText: {
    color: colors.text,
    fontWeight: '700',
    fontSize: 16,
  },
});
