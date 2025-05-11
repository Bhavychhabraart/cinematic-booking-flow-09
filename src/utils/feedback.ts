
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

// Enhanced vibration patterns for different user interactions
export const vibrationPatterns = {
  buttonPress: 40,
  success: [100, 50, 100, 50, 100],
  error: [100, 30, 100, 30, 100, 30, 100],
  warning: [50, 25, 50],
  subtle: 20,
  navigation: [10, 10, 10],
  // New patterns
  selection: [20, 20, 20],
  addToCart: [40, 20, 60],
  confirm: [20, 10, 40, 10, 20],
  celebratory: [50, 30, 40, 30, 70, 30, 100],
  processing: [15, 15, 15, 15, 15],
};

/**
 * Play a sound with more robust error handling
 * @param soundUrl - URL to the sound file
 * @param volume - Optional volume level (0.0 to 1.0)
 * @returns Promise that resolves when sound is played or rejects with error
 */
export const playSound = (soundUrl: string, volume = 1.0) => {
  return new Promise((resolve, reject) => {
    try {
      const audio = new Audio(soundUrl);
      audio.volume = Math.max(0, Math.min(1, volume)); // Ensure volume is between 0 and 1
      
      audio.onended = () => resolve(true);
      audio.onerror = (error) => {
        console.warn("Sound couldn't be played:", error);
        reject(error);
      };
      
      audio.play()
        .then(resolve)
        .catch((error) => {
          console.warn("Sound playback error:", error);
          reject(error);
        });
    } catch (error) {
      console.warn("Sound creation error:", error);
      reject(error);
    }
  });
};

/**
 * Provides haptic and audio feedback simultaneously
 * @param vibrationType - The vibration pattern to use
 * @param soundUrl - Optional URL to the sound file
 * @param volume - Optional volume level (0.0 to 1.0)
 */
export const provideFeedback = (vibrationType: keyof typeof vibrationPatterns, soundUrl?: string, volume = 1.0) => {
  vibrate(vibrationPatterns[vibrationType]);
  
  if (soundUrl) {
    playSound(soundUrl, volume).catch(() => {
      // Silent catch - we've already logged in playSound
    });
  }
};

export const sounds = {
  victory: "/sounds/victory.mp3",
  tap: "/sounds/tap.mp3",
  notification: "/sounds/notification.mp3",
  // Additional sounds could be added here
  success: "/sounds/success.mp3",
  select: "/sounds/select.mp3",
  addCart: "/sounds/addcart.mp3",
};
