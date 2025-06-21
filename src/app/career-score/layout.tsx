import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function CareerScoreLayout({
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