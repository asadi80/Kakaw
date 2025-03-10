import { useEffect } from "react";
import { useRouter } from "next/router";

export default function requireAuth(Component) {
  return function ProtectedRoute(props) {
    const router = useRouter();

    useEffect(() => {
      const token = localStorage.getItem("authToken");

      // If no token, redirect to login and store the current page for redirection after login
      if (!token) {
        const currentPath = router.asPath; // Get the current path
        router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
      }
    }, []); // Empty dependency array ensures this runs only once on mount

    // Render the component if authenticated
    return <Component {...props} />;
  };
}