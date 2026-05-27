export default defineNuxtPlugin(() => {
  const { fetchTheme } = useTheme();
  fetchTheme();
});
