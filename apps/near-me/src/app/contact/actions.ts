"use server";

export async function submitContactForm(formData: FormData): Promise<void> {
  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();
  const subject = (formData.get("subject") as string)?.trim();
  const message = (formData.get("message") as string)?.trim();

  if (!name || !email || !subject || !message) return;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;

  try {
    const { createBrowserClient } = await import("@vector/db");
    const client = createBrowserClient();
    await client.from("contact_submissions").insert({
      site_key: "near-me",
      name,
      email,
      subject,
      message,
    });
  } catch (err) {
    console.error("[Contact] DB insert failed:", err);
    return;
  }

  try {
    const { sendEmail, ContactNotificationEmail } = await import(
      "@vector/email"
    );
    const React = await import("react");
    const contactEmail = process.env.CONTACT_EMAIL;
    if (contactEmail) {
      await sendEmail({
        to: contactEmail,
        subject: `[Aircraft Detailing Near Me] Contact: ${subject}`,
        react: React.createElement(ContactNotificationEmail, {
          siteName: "Aircraft Detailing Near Me",
          name,
          email,
          subject,
          message,
        }),
      });
    }
  } catch {
    console.error("[Contact] Email send failed");
  }
}
