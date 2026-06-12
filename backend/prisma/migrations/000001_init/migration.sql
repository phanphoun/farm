CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS btree_gist;

-- Prisma manages table creation. These spatial indexes are kept here as a
-- reference for production migrations after the initial Prisma migration exists.
-- CREATE INDEX CONCURRENTLY IF NOT EXISTS farms_boundary_gix ON farms USING GIST (boundary);
-- CREATE INDEX CONCURRENTLY IF NOT EXISTS farms_centroid_gix ON farms USING GIST (centroid);
-- CREATE INDEX CONCURRENTLY IF NOT EXISTS farm_plots_boundary_gix ON farm_plots USING GIST (boundary);
-- CREATE INDEX CONCURRENTLY IF NOT EXISTS farm_plots_centroid_gix ON farm_plots USING GIST (centroid);
