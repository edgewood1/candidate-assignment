import { NextRequest, NextResponse } from "next/server";
import { faker } from '@faker-js/faker';

const SIMULATE_SLOW_NETWORK = false;

export const dynamic = 'force-dynamic'; 

faker.seed(42);
const ALL_ADVOCATES = Array.from({ length: 10000 }, (_, i) => ({
  id: i + 1,
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  city: faker.location.city(),
  degree: faker.helpers.arrayElement(['PhD', 'MD', 'PsyD', 'LMFT', 'LCSW', 'MS', 'MA']),
  specialties: faker.helpers.arrayElements(
    ['Anxiety', 'Depression', 'ADHD', 'Trauma', 'PTSD', 'Life Coaching', 'Relationships', 'Sleep', 'Stress', 
     'Grief', 'Couples Therapy', 'Family Therapy', 'Women\'s Issues'],
    { min: 1, max: 5 }
  ),
  yearsOfExperience: faker.number.int({ min: 1, max: 35 }),
  phoneNumber: parseInt(faker.string.numeric(10)),
}));

export async function GET(request: NextRequest) {
  
  // Extract query parameters
  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get("page") || "1");
  const pageSize = parseInt(searchParams.get("pageSize") || "10");
  const searchTerm = (searchParams.get("search") || "").toLowerCase();
  
  // Optional artificial delay to simulate network latency
  if (SIMULATE_SLOW_NETWORK) {
    await new Promise(resolve => setTimeout(resolve, 800));
  }
  
  // Generate advocates deterministically based on page number
  // This ensures we get the same data for the same page
  faker.seed(42); // Fixed seed for consistency
  
  // Filter by search term if provided
  let filteredAdvocates = ALL_ADVOCATES;
  if (searchTerm) {
    filteredAdvocates = ALL_ADVOCATES.filter(advocate => {
      return (
        advocate.firstName.toLowerCase().includes(searchTerm) ||
        advocate.lastName.toLowerCase().includes(searchTerm) ||
        advocate.city.toLowerCase().includes(searchTerm) ||
        advocate.degree.toLowerCase().includes(searchTerm) ||
        advocate.specialties.some(s => s.toLowerCase().includes(searchTerm)) ||
        advocate.yearsOfExperience.toString().includes(searchTerm) ||
        advocate.phoneNumber.toString().includes(searchTerm)    
      );
    });
  }
  
  // Calculate pagination
  const total = filteredAdvocates.length;
  const totalPages = Math.ceil(total / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, total);
  
  // Get the current page of data
  const paginatedAdvocates = filteredAdvocates.slice(startIndex, endIndex);

  const result = {
    data: paginatedAdvocates,
    meta: {
      page,
      pageSize,
      total,
      totalPages,
      hasMore: page < totalPages
    }
  };
  
  return NextResponse.json(result);
}