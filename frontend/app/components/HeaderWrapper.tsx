import { getCurrentUser } from '../lib/user';
import Header from './Header';

export default async function HeaderWrapper() {
  // Fetch current user on the server (uses httpOnly cookies)
  const userData = await getCurrentUser();
  
  return <Header user={userData?.user || null} />;
}
