import { Suspense } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import Advocates from "@/components/Advocates";

export default  async function Home() {
  const initialData = await fetchInitialAdvocates();
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Advocates initialData={initialData} /> 
    </Suspense>
  );
}

async function fetchInitialAdvocates() {
  // const BASE_URL = '/api/advocates';
  const BASE_URL = '/api/mock-advocates';
  try {
    const fullUrl = new URL(BASE_URL, 'http://localhost:3000');
    fullUrl.searchParams.set('page', '1');
    fullUrl.searchParams.set('pageSize', '10');
    // This fetch happens on the server and is automatically cached by Next.js
    const response = await fetch(fullUrl, {
      next: { revalidate: 300 } // Cache for 5 minutes
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching initial advocates:", error);
    // Return empty initial data in case of error
    return {
      data: [],
      meta: {
        page: 1,
        pageSize: 10,
        total: 0,
        totalPages: 0,
        hasMore: false
      }
    };
  }
}