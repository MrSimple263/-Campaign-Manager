import { describe, it, expect, beforeEach, vi } from "vitest";

import { campaignRepository } from "../src/modules/campaigns/campaign.repository";
import { campaignService } from "../src/modules/campaigns/campaign.service";
import { CAMPAIGN_STATUS } from "../src/shared/constants";
import { AppError } from "../src/shared/middleware";
import { Campaign } from "../src/shared/types";

const userId = "test-user-id";
const baseCampaign = {
  id: "cid",
  name: "Test Campaign",
  subject: "Test Subject",
  body: "Test Body",
  status: CAMPAIGN_STATUS.DRAFT,
  scheduled_at: null,
  created_by: userId,
  created_at: new Date(),
  updated_at: new Date(),
};
const recipients = [
  { id: "rid", email: "a@example.com", name: "A", created_at: new Date() },
];

describe("Campaign business rules (service, mock repo)", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should allow editing/deleting when status is draft", async () => {
    vi.spyOn(campaignRepository, "findByIdAndUser").mockResolvedValue({
      ...baseCampaign,
    });
    vi.spyOn(campaignRepository, "update").mockResolvedValue({
      ...baseCampaign,
      name: "Updated Name",
    });
    vi.spyOn(campaignRepository, "delete").mockResolvedValue();
    vi.spyOn(campaignRepository, "getRecipients").mockResolvedValue(recipients);

    // Edit
    const updated = (await campaignService.updateCampaign("cid", userId, {
      name: "Updated Name",
    })) as unknown as Campaign;
    expect(updated.name).toBe("Updated Name");

    // Delete
    await expect(
      campaignService.deleteCampaign("cid", userId),
    ).resolves.toBeUndefined();
  });

  it("should not allow editing/deleting when status is scheduled or sent", async () => {
    for (const status of [CAMPAIGN_STATUS.SCHEDULED, CAMPAIGN_STATUS.SENT]) {
      vi.spyOn(campaignRepository, "findByIdAndUser").mockResolvedValue({
        ...baseCampaign,
        status,
      });
      // Edit
      await expect(
        campaignService.updateCampaign("cid", userId, { name: "Should Fail" }),
      ).rejects.toThrow(AppError);
      // Delete
      await expect(
        campaignService.deleteCampaign("cid", userId),
      ).rejects.toThrow(AppError);
    }
  });

  it("should not allow scheduling with a past scheduled_at", async () => {
    vi.spyOn(campaignRepository, "findByIdAndUser").mockResolvedValue({
      ...baseCampaign,
    });
    const past = new Date(Date.now() - 3600_000).toISOString();
    // The Zod validation is enforced at the route/middleware layer, so here we expect the service to succeed.
    // If you want to enforce in service, add logic or test at API layer.
    // For now, just check that the service calls updateStatus.
    const updateStatus = vi
      .spyOn(campaignRepository, "updateStatus")
      .mockResolvedValue({
        ...baseCampaign,
        status: CAMPAIGN_STATUS.SCHEDULED,
        scheduled_at: new Date(past),
      });
    await expect(
      campaignService.scheduleCampaign("cid", userId, past),
    ).rejects.toThrow(AppError);
  });

  it("should allow scheduling with a future scheduled_at", async () => {
    vi.spyOn(campaignRepository, "findByIdAndUser").mockResolvedValue({
      ...baseCampaign,
    });
    const future = new Date(Date.now() + 3600_000).toISOString();
    const updateStatus = vi
      .spyOn(campaignRepository, "updateStatus")
      .mockResolvedValue({
        ...baseCampaign,
        status: CAMPAIGN_STATUS.SCHEDULED,
        scheduled_at: new Date(future),
      });
    const result = await campaignService.scheduleCampaign(
      "cid",
      userId,
      future,
    );
    expect(result.status).toBe(CAMPAIGN_STATUS.SCHEDULED);
    expect(updateStatus).toHaveBeenCalled();
  });

  it("should transition to sent and not allow further edits/deletes", async () => {
    vi.spyOn(campaignRepository, "findByIdAndUser").mockResolvedValue({
      ...baseCampaign,
    });
    vi.spyOn(campaignRepository, "updateStatus").mockResolvedValue({
      ...baseCampaign,
      status: CAMPAIGN_STATUS.SENT,
    });
    // Send
    const sent = await campaignService.sendCampaign("cid", userId);
    expect(sent.status).toBe(CAMPAIGN_STATUS.SENT);

    // Now status is sent
    vi.spyOn(campaignRepository, "findByIdAndUser").mockResolvedValue({
      ...baseCampaign,
      status: CAMPAIGN_STATUS.SENT,
    });
    await expect(
      campaignService.updateCampaign("cid", userId, { name: "Should Fail" }),
    ).rejects.toThrow(AppError);
    await expect(campaignService.deleteCampaign("cid", userId)).rejects.toThrow(
      AppError,
    );
  });

  it("should not allow reverting status from sent", async () => {
    vi.spyOn(campaignRepository, "findByIdAndUser").mockResolvedValue({
      ...baseCampaign,
      status: CAMPAIGN_STATUS.SENT,
    });
    await expect(
      campaignService.scheduleCampaign(
        "cid",
        userId,
        new Date(Date.now() + 3600_000).toISOString(),
      ),
    ).rejects.toThrow(AppError);
  });
});
