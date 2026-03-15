import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Giới thiệu — AQTech',
  description: 'Thông tin giới thiệu về Công ty TNHH Công nghệ Anh Quân - AQTech.',
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
