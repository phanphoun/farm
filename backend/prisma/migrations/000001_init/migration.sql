-- 000001_init / MySQL-safe migration
-- Prisma will create the application tables from schema.prisma.
-- Below are reference index definitions for production use.
-- They are commented out by default so `prisma migrate deploy` stays idempotent across engines.

-- CREATE INDEX CONCURRENTLY IF NOT EXISTS farms_boundary_gix ON farms USING GIST (boundary);
-- CREATE INDEX CONCURRENTLY IF NOT EXISTS farms_centroid_gix ON farms USING GIST (centroid);
-- CREATE INDEX CONCURRENTLY IF NOT EXISTS farm_plots_boundary_gix ON farm_plots USING GIST (boundary);
-- CREATE INDEX CONCURRENTLY IF NOT EXISTS farm_plots_centroid_gix ON farm_plots USING GIST (centroid);
