-- Additive only: attribution fields for the Deal->Coupon->GST pipeline.
-- dealId is a plain reference (no FK) so a Booking's historical Deal
-- attribution survives if the Deal row is later edited or removed.
-- dealDiscountAmount/couponDiscountAmount are nullable (not @default(0)):
-- existing rows get NULL, meaning "not attributed", not a fabricated zero.
ALTER TABLE "Booking" ADD COLUMN "dealId" TEXT;
ALTER TABLE "Booking" ADD COLUMN "dealDiscountAmount" DOUBLE PRECISION;
ALTER TABLE "Booking" ADD COLUMN "couponDiscountAmount" DOUBLE PRECISION;
