import { createPool, Pool } from "mysql2/promise";
import { 
    CREATE_TABLE_USERS, 
    CREATE_TABLE_USER_DETAILS,
    CREATE_TABLE_ACTIVITIES,
    CREATE_TABLE_ACTIVITY_REACTIONS,
    CREATE_TABLE_ACTIVITY_COMMENTS,
    CREATE_TABLE_COLLABORATION_REQUESTS,
    CREATE_TABLE_PROJECT_CONTRIBUTORS
} from "./tables";

let pool: Pool;

const connectToDatabase = async () => {
    try {
        pool = createPool({
            port: +process!.env!.MYSQL_PORT!,
            host: process.env.MYSQL_HOST,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE,
        });
        await pool.getConnection();
        //  await pool.execute("");
        console.log("Database connected successfully");
        await pool.execute(CREATE_TABLE_USERS);
        await pool.execute(CREATE_TABLE_USER_DETAILS);
        console.log("Tables created/verified: users, user_details");

        // Create activity feed tables
        await pool.execute(CREATE_TABLE_ACTIVITIES);
        await pool.execute(CREATE_TABLE_ACTIVITY_REACTIONS);
        await pool.execute(CREATE_TABLE_ACTIVITY_COMMENTS);
        await pool.execute(CREATE_TABLE_COLLABORATION_REQUESTS);
        await pool.execute(CREATE_TABLE_PROJECT_CONTRIBUTORS);
        console.log("Activity feed tables created/verified");

        // Auto-migrate: ensure new columns exist for profile lists (compatible with older MySQL)
        const ensureColumn = async (table: string, column: string, preferredType: 'JSON' | 'TEXT' = 'JSON') => {
            const dbName = process.env.MYSQL_DATABASE as string;
            // Check if column already exists
            const [rows] = await pool.query(
                `SELECT COUNT(*) as cnt FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND COLUMN_NAME = ?`,
                [dbName, table, column]
            );
            const exists = Array.isArray(rows) && (rows as any)[0]?.cnt > 0;
            if (exists) return;

            // Try to add with preferred type first, then fallback to TEXT
            const typeOrder = preferredType === 'JSON' ? ['JSON', 'TEXT'] as const : ['TEXT'] as const;
            for (const t of typeOrder) {
                try {
                    await pool.execute(`ALTER TABLE ${table} ADD COLUMN ${column} ${t} NULL`);
                    console.log(`Added column ${table}.${column} as ${t}`);
                    return;
                } catch (err) {
                    console.warn(`Failed adding ${table}.${column} as ${t}:`, err);
                    // Try next type if available
                }
            }
            console.warn(`Could not add column ${table}.${column}. Please add it manually.`);
        };

        await ensureColumn('user_details', 'experiences', 'JSON');
        await ensureColumn('user_details', 'educations', 'JSON');
        await ensureColumn('user_details', 'certificates', 'JSON');
        await ensureColumn('user_details', 'projects', 'JSON');
    } catch (error) {
        console.error("Database connection failed:", error);
        throw error;
    }
}

export { connectToDatabase, pool };