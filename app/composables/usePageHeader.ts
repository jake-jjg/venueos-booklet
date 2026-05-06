export function usePageHeader() {
  const title = useState<string>("pageHeader:title", () => "");
  const description = useState<string>("pageHeader:description", () => "");

  // Track active watchers so they can be stopped before creating new ones
  let stopTitleWatch: (() => void) | null = null;
  let stopDescWatch: (() => void) | null = null;

  function setPageHeader(t: string | Ref<string>, d?: string | Ref<string>) {
    // Stop any previous watcher before creating a new one
    stopTitleWatch?.();
    stopDescWatch?.();
    stopTitleWatch = null;
    stopDescWatch = null;

    if (isRef(t)) {
      stopTitleWatch = watch(
        t,
        (val) => {
          title.value = val;
        },
        { immediate: true },
      );
    } else {
      title.value = t;
    }

    // Always update description — clear it if not provided
    if (d === undefined) {
      description.value = "";
    } else if (isRef(d)) {
      stopDescWatch = watch(
        d,
        (val) => {
          description.value = val;
        },
        { immediate: true },
      );
    } else {
      description.value = d;
    }
  }

  // Reset state and stop watchers when the calling component unmounts
  onScopeDispose(() => {
    stopTitleWatch?.();
    stopDescWatch?.();
    title.value = "";
    description.value = "";
  });

  return { title, description, setPageHeader };
}
