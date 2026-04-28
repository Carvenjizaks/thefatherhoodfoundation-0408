-- Update all existing "pending" payment statuses to "unpaid" for consistency
-- Also update any NULL payment_status values to "unpaid"

UPDATE table_talk_registrations
SET payment_status = 'unpaid'
WHERE payment_status = 'pending' OR payment_status IS NULL;

UPDATE event_registrations
SET payment_status = 'unpaid'
WHERE payment_status = 'pending' OR payment_status IS NULL;

UPDATE donations
SET payment_status = 'unpaid'
WHERE payment_status = 'pending' OR payment_status IS NULL;
