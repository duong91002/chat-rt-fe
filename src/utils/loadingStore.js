export const loadingStore = async (action, set, key) => {
  try {
    set((state) => ({
      loading: { ...state.loading, [key]: true },
      error: null,
    }));
    const result = await action();
    set((state) => ({
      loading: { ...state.loading, [key]: false },
    }));
    return result.data;
  } catch (error) {
    set((state) => ({
      loading: { ...state.loading, [key]: false },
      error: error.response?.data?.error,
    }));
    throw error;
  }
};
