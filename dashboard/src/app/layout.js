import "./globals.css";

export const metadata = {
  title: "Doha Carpet — Admin",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="antialiased">
      <body className="min-h-full bg-white text-body">{children}</body>
    </html>
  );
}
