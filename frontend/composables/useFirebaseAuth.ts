import { ref, computed, watch } from 'vue';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { useNuxtApp } from '#app';

const firebaseUser = ref<User | null>(null);
const firebaseToken = ref<string | null>(null);
const isInitialized = ref(false);

export const initAuth = () => {
  if (isInitialized.value) return;

  const { $auth } = useNuxtApp();
  onAuthStateChanged($auth, async (user) => {
    firebaseUser.value = user;
    firebaseToken.value = user ? await user.getIdToken() : null;
    isInitialized.value = true;
  });
};

export const waitForAuthReady = () =>
  new Promise<void>((resolve) => {
    if (isInitialized.value) return resolve();

    const stop = watch(
      isInitialized,
      (val) => {
        if (val) {
          stop();
          resolve();
        }
      },
      { immediate: true }
    );
  });

export const refreshToken = async () => {
  if (firebaseUser.value) {
    firebaseToken.value = await firebaseUser.value.getIdToken(true);
  }
};

export const useFirebaseAuth = () => {
  return {
    user: firebaseUser,
    token: firebaseToken,
    currentUser: computed(() => firebaseUser.value),
    currentUid: computed(() => firebaseUser.value?.uid ?? null),
    isInitialized,
    initAuth,
    waitForAuthReady,
    refreshToken,
  } as const;
};