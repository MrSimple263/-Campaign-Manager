## Plan: Campaign Business Rule Test Cases

This plan covers test cases for campaign business rules:

- Campaigns can only be edited or deleted when status is 'draft'.
- 'scheduled_at' must be a future timestamp.
- Sending transitions status to 'sent' and cannot be undone.

**Steps**

1. Test Editing/Deleting Campaigns
   - Attempt to edit/delete a campaign with status 'draft' (should succeed).
   - Attempt to edit/delete a campaign with status 'scheduled' or 'sent' (should fail with appropriate error).
2. Test Scheduling Campaigns
   - Attempt to schedule a campaign with 'scheduled_at' in the past (should fail validation).
   - Attempt to schedule a campaign with 'scheduled_at' in the future (should succeed).
3. Test Sending Campaigns
   - Send a campaign (should transition status to 'sent').
   - Attempt to edit/delete/schedule a campaign after sending (should fail).
   - Attempt to revert status from 'sent' to any other status (should not be possible).

**Relevant files**

- packages/backend/src/modules/campaigns/campaign.service.ts — Business logic for edit, delete, schedule, send
- packages/backend/src/validations/schemas.ts — Zod validation for 'scheduled_at'
- packages/backend/src/modules/campaigns/campaign.repository.ts — Status update logic
- packages/backend/src/modules/campaigns/campaign.routes.ts — Route/middleware wiring

**Verification**

1. Automated tests in packages/backend/tests/campaigns.test.ts:
   - Use test campaigns with various statuses to verify endpoint behavior.
   - Assert correct error messages and status codes for invalid operations.
   - Assert status transitions and immutability after sending.
2. Manual verification (optional):
   - Use API client to attempt forbidden operations and check responses.

**Decisions**

- Only 'draft' campaigns are mutable (edit/delete/schedule/send).
- 'scheduled_at' must be a future ISO timestamp (enforced by Zod schema).
- Once sent, campaign status is final and cannot be reverted.

**Further Considerations**

1. Should tests cover all possible invalid status transitions? (Recommended: yes)
2. Should error messages be asserted exactly or just error type/status? (Recommend: assert both for clarity)
