export async function GET() {
  return Response.json({ 
    hasDbUrl: !!process.env.DATABASE_URL,
    dbUrl: process.env.DATABASE_URL?.substring(0, 10) + "..." // Show first 10 chars for safety
  });
}