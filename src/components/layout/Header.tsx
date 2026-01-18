

import Link from "next/link";
import { Button } from "@/components/ui/button"
import { signOut } from "@/lib/supabase-auth/auth";
import { getSession } from "@/lib/supabase-auth/getSession";

//icon
import { LogIn } from "lucide-react";
import { LogOut } from "lucide-react";


export const Header: React.FC = async() => {

  const session = await getSession();

  return (
    <header className="sticky left-0 right-0 top-0 border-b">
      <div className="flex size-full p-4 items-center justify-between">
        <h1 className="text-3xl font-bold text-blue-700">
          <Link href="/">MedTrack</Link>
        </h1>

        {session ? (
          <div>
            {/* Server Action */}
            <form action={signOut}>
              <Button variant="outline" className="rounded-full" >
              <LogOut className="h-4 w-4" /> 
                ログアウト
              </Button>
            </form>
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
    </header>
  );
}


