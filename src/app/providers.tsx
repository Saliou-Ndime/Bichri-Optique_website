"use client";

import { HeroUIProvider } from "@heroui/react";
import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <HeroUIProvider navigate={router.push}>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "#ffffff",
                border: "1px solid #ede5ff",
                color: "#1a1a2e",
              },
            }}
          />
        </HeroUIProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}
