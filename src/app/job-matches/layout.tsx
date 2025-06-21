import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function JobMatchesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      {children}
    </ProtectedRoute>
  );
}