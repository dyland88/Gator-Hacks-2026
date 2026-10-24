import "~/styles/globals.css";

import { TRPCReactProvider } from "~/trpc/react";

export const metadata = {
  title: "Gator Hacks 2026",
  description: "Gator Hack V project",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}
