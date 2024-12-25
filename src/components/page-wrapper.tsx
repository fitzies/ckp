export default function PageWrapper({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <main className={`px-8 py-4 w-screen ${className}`}>{children}</main>;
}
