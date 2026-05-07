import { google } from "googleapis";
import { prisma } from "./prisma";

export async function getGmailClient(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user?.accessToken) {
    throw new Error("No access token found for user");
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );

  oauth2Client.setCredentials({
    access_token: user.accessToken,
    refresh_token: user.refreshToken,
  });

  oauth2Client.on("tokens", async (tokens) => {
    if (tokens.access_token) {
      await prisma.user.update({
        where: { id: userId },
        data: { accessToken: tokens.access_token },
      });
    }
  });

  return google.gmail({ version: "v1", auth: oauth2Client });
}

export interface EmailMeta {
  id: string;
  threadId: string;
  subject: string;
  from: string;
  snippet: string;
  date: string;
  isRead: boolean;
}

export async function listInboxEmails(
  userId: string,
  maxResults = 20
): Promise<EmailMeta[]> {
  const gmail = await getGmailClient(userId);

  const response = await gmail.users.messages.list({
    userId: "me",
    labelIds: ["INBOX"],
    maxResults,
  });

  const messages = response.data.messages || [];
  const emails: EmailMeta[] = [];

  for (const msg of messages) {
    const detail = await gmail.users.messages.get({
      userId: "me",
      id: msg.id!,
      format: "metadata",
      metadataHeaders: ["From", "Subject", "Date"],
    });

    const headers = detail.data.payload?.headers || [];
    const getHeader = (name: string) =>
      headers.find((h) => h.name?.toLowerCase() === name.toLowerCase())
        ?.value || "";

    emails.push({
      id: detail.data.id || "",
      threadId: detail.data.threadId || "",
      subject: getHeader("Subject") || "(No Subject)",
      from: getHeader("From"),
      snippet: detail.data.snippet || "",
      date: getHeader("Date"),
      isRead: !detail.data.labelIds?.includes("UNREAD"),
    });
  }

  return emails;
}

export interface ThreadMessage {
  id: string;
  from: string;
  to: string;
  date: string;
  body: string;
}

export async function getThread(
  userId: string,
  threadId: string
): Promise<{ messages: ThreadMessage[] }> {
  const gmail = await getGmailClient(userId);

  const thread = await gmail.users.threads.get({
    userId: "me",
    id: threadId,
    format: "full",
  });

  const messages: ThreadMessage[] = (thread.data.messages || []).map((msg) => {
    const headers = msg.payload?.headers || [];
    const getHeader = (name: string) =>
      headers.find((h) => h.name?.toLowerCase() === name.toLowerCase())
        ?.value || "";

    let body = "";
    if (msg.payload?.body?.data) {
      body = Buffer.from(msg.payload.body.data, "base64").toString("utf-8");
    } else if (msg.payload?.parts) {
      const textPart = msg.payload.parts.find(
        (p) => p.mimeType === "text/plain"
      );
      if (textPart?.body?.data) {
        body = Buffer.from(textPart.body.data, "base64").toString("utf-8");
      } else {
        const htmlPart = msg.payload.parts.find(
          (p) => p.mimeType === "text/html"
        );
        if (htmlPart?.body?.data) {
          body = Buffer.from(htmlPart.body.data, "base64").toString("utf-8");
          body = body.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
        }
      }
    }

    return {
      id: msg.id || "",
      from: getHeader("From"),
      to: getHeader("To"),
      date: getHeader("Date"),
      body,
    };
  });

  return { messages };
}

export async function sendEmail(
  userId: string,
  to: string,
  subject: string,
  body: string,
  threadId?: string
) {
  const gmail = await getGmailClient(userId);

  const user = await prisma.user.findUnique({ where: { id: userId } });
  const fromEmail = user?.email || "me";

  const emailLines = [
    `From: ${fromEmail}`,
    `To: ${to}`,
    `Subject: ${subject}`,
    "Content-Type: text/plain; charset=utf-8",
    "",
    body,
  ];

  const raw = Buffer.from(emailLines.join("\r\n"))
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  const result = await gmail.users.messages.send({
    userId: "me",
    requestBody: {
      raw,
      threadId,
    },
  });

  return result.data;
}
