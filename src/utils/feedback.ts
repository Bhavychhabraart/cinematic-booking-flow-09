
/**
 * Utility functions for providing haptic and audio feedback
 */

// Check if vibration API is available
const canVibrate = () => {
  return 'vibrate' in navigator;
};

/**
 * Trigger device vibration with a specific pattern
 * @param pattern - Vibration pattern in milliseconds (on-off pairs)
 */
export const vibrate = (pattern: number | number[]) => {
  if (canVibrate()) {
    navigator.vibrate(pattern);
  }
};

// Vibration patterns
export const vibrationPatterns = {
  buttonPress: 40,
  success: [100, 50, 100, 50, 100],
  error: [100, 30, 100, 30, 100, 30, 100],
  warning: [50, 25, 50],
  subtle: 20,
  navigation: [10, 10, 10]
};

// Audio feedback
export const playSound = (soundUrl: string) => {
  try {
    const audio = new Audio(soundUrl);
    audio.play().catch(error => {
      console.log("Sound couldn't be played:", error);
    });
  } catch (error) {
    console.log("Sound playback error:", error);
  }
};

export const sounds = {
  victory: "/sounds/victory.mp3",
  tap: "/sounds/tap.mp3",
  notification: "/sounds/notification.mp3"
};
