import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export const useSupabaseClient = (): SupabaseClient => {
    const nuxtApp = useNuxtApp() as ReturnType<typeof useNuxtApp> & {
        _supabaseClient?: SupabaseClient;
    };

    if (!nuxtApp._supabaseClient) {
        const config = useRuntimeConfig();
        nuxtApp._supabaseClient = createClient(
            config.public.supabaseUrl as string,
            config.public.supabasePublishableKey as string,
        );
    }

    return nuxtApp._supabaseClient;
};
