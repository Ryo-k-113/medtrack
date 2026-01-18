"use server";

import "server-only";
import { createClient } from "@/lib/supabase/server";
import { cache } from "react";

export const getSession = cache(async () => {
  const supabase = await createClient();
  const { 
    data: { session }, 
  } = await supabase.auth.getSession();

  return session; 
});