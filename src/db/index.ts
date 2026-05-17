import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import * as schema from "./schema";  

// Define the return type
type DB = PostgresJsDatabase<typeof schema>;

const setup = (): DB => {
    if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is not set");
    // Return a simplified mock with only what's actually used
    return {
      select: () => ({
        from: () => ({
          where: () => ({
            limit: () => ({
              offset: () => Promise.resolve([]),
            }),
          }),
          limit: () => ({
            offset: () => Promise.resolve([]),
          }),
        }),
      }),
      insert: () => ({
        values: () => ({
          returning: () => Promise.resolve([]),
        }),
      }),
    } as unknown as DB;
  }

  // for query purposes
  const queryClient = postgres(process.env.DATABASE_URL);
  const db = drizzle(queryClient, { schema });
  return db;
};

export default setup();
