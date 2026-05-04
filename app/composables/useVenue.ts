interface BookletModule {
  id: string;
  venue_id: string;
  title: string;
  icon: string;
  description: string;
  created_at: string;
}

interface Venue {
  id: string;
  name: string;
}

export const useVenue = () => {
  const config = useRuntimeConfig();
  const supabase = useSupabaseClient();

  const booklet_modules = useState<BookletModule[]>(
    "booklet_modules",
    () => [],
  );
  const venue_info = useState<Venue[]>("venue_info", () => []);
  const info_loading = useState("info_loading", () => true);
  const module_loading = useState("module_loading", () => true);

  //Make a call to supabase to get the booklet modules
  const getbooklet_modules = async () => {
    const { data } = await supabase
      .from("booklet_modules")
      .select()
      .eq("venue_id", config.public.venueId);

    booklet_modules.value = data ?? [];
    module_loading.value = false;
  };

  //Get venue information from supabase
  const getVenue_info = async () => {
    const { data } = await supabase
      .from("venues")
      .select()
      .eq("id", config.public.venueId);

    venue_info.value = data ?? [];
    info_loading.value = false;
  };

  //Fetch all data
  const fetchVenueData = async () => {
    await Promise.all([getbooklet_modules(), getVenue_info()]);
  };

  return {
    booklet_modules,
    venue_info,
    info_loading,
    module_loading,
    getbooklet_modules,
    getVenue_info,
    fetchVenueData,
  };
};
