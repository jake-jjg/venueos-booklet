export function usePageHeader() {
  const title = useState<string>("pageHeader:title", () => "");
  const description = useState<string>("pageHeader:description", () => "");

  function setPageHeader(t: string | Ref<string>, d?: string | Ref<string>) {
    if (isRef(t)) {
      watch(t, (val) => { title.value = val }, { immediate: true });
    } else {
      title.value = t;
    }

    if (d !== undefined) {
      if (isRef(d)) {
        watch(d, (val) => { description.value = val }, { immediate: true });
      } else {
        description.value = d;
      }
    }
  }

  return { title, description, setPageHeader };
}
