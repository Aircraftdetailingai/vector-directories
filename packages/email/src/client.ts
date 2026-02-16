import { Resend } from "resend";
import type { ReactElement } from "react";

export const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(options: {
  to: string | string[];
  subject: string;
  react: ReactElement;
  from?: string;
}) {
  return resend.emails.send({
    from: options.from ?? "Vector Directories <noreply@vectordirectories.com>",
    to: options.to,
    subject: options.subject,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    react: options.react as any,
  });
}
