// pages/[...slug].js
import { useRouter } from 'next/router';

export default function CatchAllPage() {
  const router = useRouter();
  const { slug } = router.query;

  // Example: Check if the page exists (e.g., from an API or database)
  const pageExists = false; // Replace with your logic

  if (!pageExists) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h1>404 - Page Not Found</h1>
        <p>The page "{slug ? slug.join('/') : 'this'}" does not exist.</p>
        <a href="/">Go back to the homepage</a>
      </div>
    );
  }

  return (
    <div>
      <h1>Dynamic Page</h1>
      <p>Slug: {slug ? slug.join('/') : 'No slug'}</p>
    </div>
  );
}