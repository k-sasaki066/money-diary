import { ref, computed, watch } from 'vue';
import { getAuth, onAuthStateChanged, type User } from 'firebase/auth';
import { useNuxtApp } from '#app';

const firebaseUser = ref<User | null>(null);
const firebaseToken = ref<string | null>(null);
const isInitialized = ref(false);

export const initAuth = () => {
  if (isInitialized.value) return; // avoid double‑binding

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
  /* reactive shortcuts */
  const user = firebaseUser; // already ref
  const token = firebaseToken; // already ref
  const currentUser = computed(() => firebaseUser.value);
  const currentUid = computed(() => firebaseUser.value?.uid ?? null);

  return {
    user,
    token,
    currentUser,
    currentUid,
    isInitialized,
    /** helpers */
    initAuth,
    waitForAuthReady,
    refreshToken,
  } as const;
};
