import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function InterviewPracticeLayout({
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