export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Bypass the root layout's Navbar/Footer and pt-16 by rendering auth pages full-bleed
    <div className="fixed inset-0 z-50 bg-(--color-navy) overflow-auto transition-colors duration-300">
      {children}
    </div>
  );
}
