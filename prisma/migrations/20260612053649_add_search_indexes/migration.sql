-- Full-text search indexes (GIN) for /api/search
CREATE INDEX IF NOT EXISTS package_search_idx ON "Package" USING GIN (to_tsvector('english', title || ' ' || COALESCE(description, '')));
CREATE INDEX IF NOT EXISTS destination_search_idx ON "Destination" USING GIN (to_tsvector('english', name || ' ' || country));
