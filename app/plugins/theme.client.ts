export default defineNuxtPlugin(async () => {
  const { fetchTheme } = useTheme();
  await fetchTheme();
});
