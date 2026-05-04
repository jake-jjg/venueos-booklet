interface BookletModule {
  id: string;
  venue_id: string;
  title: string;
  icon: string;
  description: string;
  created_at: string;
  module_position: number;
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

  //Make a call to supabase to get the booklet modules
  const getbooklet_modules = async () => {
    const { data } = await supabase
      .from("booklet_modules")
      .select()
      .eq("venue_id", config.public.venueId)
      .order("module_position", { ascending: true });

    booklet_modules.value = data ?? [];
  };

  // Persist a new module order by updating each row's module_position
  const updateModulePositions = async (modules: BookletModule[]) => {
    const updates = modules.map((m, i) => ({
      id: m.id,
      module_position: i + 1,
    }));
    const { error } = await supabase
      .from("booklet_modules")
      .upsert(updates, { onConflict: "id" });
    return { error };
  };

  //Get venue information from supabase
  const getVenue_info = async () => {
    const { data } = await supabase
      .from("venues")
      .select()
      .eq("id", config.public.venueId);

    venue_info.value = data ?? [];
  };

  //Fetch all data
  const fetchVenueData = async () => {
    await Promise.all([getbooklet_modules(), getVenue_info()]);
  };

  return {
    booklet_modules,
    venue_info,
    getbooklet_modules,
    getVenue_info,
    fetchVenueData,
    updateModulePositions,
  };
};
