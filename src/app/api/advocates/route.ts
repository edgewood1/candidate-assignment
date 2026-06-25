import { NextRequest, NextResponse } from "next/server";
import db from "../../../db";
import { advocates } from "../../../db/schema";
import { sql, count, like } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);
    const searchTerm = searchParams.get("search") || "";

    // Calculate offset for pagination
    const offset = (page - 1) * pageSize;

    // query is used to fetch paginated data;
    let query = db.select().from(advocates);

    // countQuery is used to get the total number of records that match your filters
    let countQuery = db.select({ count: count(advocates.id) }).from(advocates);

    // Apply search filter if searchTerm is provided
    if (searchTerm) {
      const searchFilter = sql`
    LOWER(${advocates.firstName}) LIKE ${`%${searchTerm}%`} OR
    LOWER(${advocates.lastName}) LIKE ${`%${searchTerm}%`} OR
    LOWER(${advocates.city}) LIKE ${`%${searchTerm}%`} OR
    LOWER(${advocates.degree}) LIKE ${`%${searchTerm}%`} OR
    ${advocates.specialties}::text LIKE ${`%${searchTerm}%`} OR
    ${advocates.yearsOfExperience}::text LIKE ${`%${searchTerm}%`} OR
    ${advocates.phoneNumber}::text LIKE ${`%${searchTerm}%`}
  `;

      query = query.where(searchFilter);
      countQuery = countQuery.where(searchFilter);
    }

    // Apply pagination
    query = query.limit(pageSize).offset(offset);

    // Execute both queries in parallel
    const [data, totalCount] = await Promise.all([query, countQuery]);

    // Return paginated data with metadata
    return NextResponse.json({
      data,
      meta: {
        page,
        pageSize,
        total: totalCount[0].count,
        totalPages: Math.ceil(totalCount[0].count / pageSize),
        hasMore: page * pageSize < totalCount[0].count,
      },
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Failed to fetch advocates" }, { status: 500 });
  }
}
