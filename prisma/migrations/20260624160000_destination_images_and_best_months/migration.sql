-- Add destination gallery images + replace bestTimeFrom/bestTimeTo range with bestMonths multi-select
ALTER TABLE "Destination" ADD COLUMN "images" TEXT[] NOT NULL DEFAULT '{}';
ALTER TABLE "Destination" ADD COLUMN "bestMonths" TEXT[] NOT NULL DEFAULT '{}';

WITH months(idx, name) AS (
  VALUES (1,'January'),(2,'February'),(3,'March'),(4,'April'),(5,'May'),(6,'June'),
         (7,'July'),(8,'August'),(9,'September'),(10,'October'),(11,'November'),(12,'December')
),
ranges AS (
  SELECT d.id AS dest_id, f.idx AS from_idx, t.idx AS to_idx
  FROM "Destination" d
  JOIN months f ON f.name = d."bestTimeFrom"
  JOIN months t ON t.name = d."bestTimeTo"
  WHERE d."bestTimeFrom" IS NOT NULL AND d."bestTimeTo" IS NOT NULL
)
UPDATE "Destination" d
SET "bestMonths" = (
  SELECT array_agg(m.name ORDER BY ((m.idx - r.from_idx + 12) % 12))
  FROM months m
  WHERE ((m.idx - r.from_idx + 12) % 12) <= ((r.to_idx - r.from_idx + 12) % 12)
)
FROM ranges r
WHERE d.id = r.dest_id;

ALTER TABLE "Destination" DROP COLUMN "bestTimeFrom";
ALTER TABLE "Destination" DROP COLUMN "bestTimeTo";
