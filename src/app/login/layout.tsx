export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>; // ✅ This prevents the global layout from applying
}
