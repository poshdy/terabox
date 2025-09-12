import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { TRPCError } from "@trpc/server";

class SupabaseService {
  private supabaseClient: SupabaseClient;
  constructor() {
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;

    if (!SUPABASE_URL || !SUPABASE_KEY) {
      throw new Error("Cannot initlize supabase client without access keys");
    }
    this.supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);
  }

  async getSignedUrl(objectPath: string, expiration: number) {
    const { data, error } = await this.supabaseClient.storage
      .from("terabox")
      .createSignedUrl(objectPath, expiration);

    if (error) {
      throw new TRPCError({ code: "BAD_REQUEST", message: error.message });
    }

    return data.signedUrl;
  }
}

export const supabaseService = new SupabaseService();
