export type EmailMessage = {
  /** Display name shown as the sender in the inbox. */
  senderName: string;
  to: string;
  replyTo: string;
  subject: string;
  text: string;
  html: string;
};

export type EmailSender = (message: EmailMessage) => Promise<void>;
