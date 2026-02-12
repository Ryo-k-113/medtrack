"use client"

import Link from "next/link";
import React from "react";
import { createClient } from "@/lib/supabase/client";
import { useSupabaseSession } from "@/hooks/useSupabaseSession";
import { Button } from "@/components/ui/button"
import { toast } from "sonner";

//icon
import { LogIn } from "lucide-react";
import { LogOut } from "lucide-react";


export const Header: React.FC = () => {
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    toast.success("ログアウトしました。");
  };

  const { session, isLoading } = useSupabaseSession()

  return (
    <header className="sticky left-0 right-0 top-0 border-b">
      <div className="flex size-full p-4 items-center justify-between">
        <h1 className="text-3xl font-bold text-blue-700">
          <Link href="/">MedTrack</Link>
        </h1>
        {!isLoading && (
          <div>
          {session ? (
            <div>
              <Button 
              variant="outline" 
              className="rounded-full"
              onClick={handleLogout} 
              >
                <LogOut className="h-4 w-4" /> 
                ログアウト
              </Button>
            </div>
          ) : (
            <div>
              <Button 
              type="button" 
              className="font-bold bg-blue-700 rounded-full hover:bg-blue-500"
              >
                <LogIn className="h-4 w-4" /> 
                <Link href="/login">
                  ログイン
                </Link>
              </Button>
            </div>
          )}
          </div>
        )}
      </div>
    </header>
  );
}


