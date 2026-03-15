import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Liên hệ — AQTech',
  description: 'Thông tin liên hệ Công ty TNHH Công nghệ Anh Quân - AQTech.',
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
