import { Knex } from "knex";

import { generateUuidV7, hashPassword } from "../shared/utils/index";

export async function seed(knex: Knex): Promise<void> {
  // Clean existing data (in reverse order of dependencies)
  await knex("campaign_recipients").del();
  await knex("campaigns").del();
  await knex("recipients").del();
  await knex("users").del();

  // Create demo user
  const demoUserId = "019d9cba-0df9-7f66-8147-f4e0c58bb866";
  const passwordHash = await hashPassword("password123");

  await knex("users").insert({
    id: demoUserId,
    email: "demo@example.com",
    name: "Demo User",
    password_hash: passwordHash,
  });

  console.log("Created demo user: demo@example.com / password123");

  // Create sample recipients
  const recipients = [
    { id: generateUuidV7(), email: "john.doe@example.com", name: "John Doe" },
    {
      id: generateUuidV7(),
      email: "jane.smith@example.com",
      name: "Jane Smith",
    },
    {
      id: generateUuidV7(),
      email: "bob.wilson@example.com",
      name: "Bob Wilson",
    },
    {
      id: generateUuidV7(),
      email: "alice.johnson@example.com",
      name: "Alice Johnson",
    },
    {
      id: generateUuidV7(),
      email: "charlie.brown@example.com",
      name: "Charlie Brown",
    },
    {
      id: generateUuidV7(),
      email: "diana.prince@example.com",
      name: "Diana Prince",
    },
    {
      id: generateUuidV7(),
      email: "edward.norton@example.com",
      name: "Edward Norton",
    },
    {
      id: generateUuidV7(),
      email: "fiona.green@example.com",
      name: "Fiona Green",
    },
    {
      id: generateUuidV7(),
      email: "george.harris@example.com",
      name: "George Harris",
    },
    {
      id: generateUuidV7(),
      email: "hannah.white@example.com",
      name: "Hannah White",
    },
  ];

  await knex("recipients").insert(recipients);
  console.log(`Created ${recipients.length} sample recipients`);

  // Create 50 campaigns (mix of draft, scheduled, sent)
  const campaigns = Array.from({ length: 50 }).map((_, i) => {
    const status = i % 3 === 0 ? "sent" : i % 3 === 1 ? "scheduled" : "draft";
    const scheduled_at =
      status === "scheduled"
        ? new Date(Date.now() + (i + 1) * 24 * 60 * 60 * 1000)
        : undefined;
    return {
      id: generateUuidV7(),
      name: `Campaign ${i + 1}`,
      subject: `Subject for Campaign ${i + 1}`,
      body: `Body for Campaign ${i + 1}`,
      status,
      scheduled_at,
      created_by: demoUserId,
    };
  });

  await knex("campaigns").insert(campaigns);
  console.log(`Created ${campaigns.length} sample campaigns`);

  // Attach all recipients to every campaign
  let allCampaignRecipients: Array<{
    campaign_id: string;
    recipient_id: string;
    status: string;
    sent_at?: Date | null;
    opened_at?: Date | null;
  }> = [];
  for (const campaign of campaigns) {
    const status = campaign.status;
    const campaignRecipients = recipients.map((r) => {
      if (status === "sent") {
        return {
          campaign_id: campaign.id,
          recipient_id: r.id,
          status: Math.random() < 0.9 ? "sent" : "failed",
          sent_at: Math.random() < 0.9 ? new Date() : null,
          opened_at: Math.random() < 0.3 ? new Date() : null,
        };
      } else {
        return {
          campaign_id: campaign.id,
          recipient_id: r.id,
          status: status === "scheduled" ? "pending" : "pending",
        };
      }
    });
    allCampaignRecipients = allCampaignRecipients.concat(campaignRecipients);
  }
  await knex("campaign_recipients").insert(allCampaignRecipients);
  console.log("Created campaign-recipient associations");
  console.log("Seed completed successfully!");
}
