import { Html, Head, Body, Container, Section, Text, Hr } from "@react-email/components";

interface ContactNotificationEmailProps {
  siteName: string;
  name: string;
  email: string;
  subject: string;
  message: string;
}

export function ContactNotificationEmail({
  siteName,
  name,
  email,
  subject,
  message,
}: ContactNotificationEmailProps) {
  return (
    <Html>
      <Head />
      <Body>
        <Container>
          <Section>
            <Text>New contact form submission from {siteName}.</Text>
            <Text>
              <strong>From:</strong> {name} ({email})
            </Text>
            <Text>
              <strong>Subject:</strong> {subject}
            </Text>
            <Text>
              <strong>Message:</strong>
            </Text>
            <Text>{message}</Text>
            <Hr />
            <Text>Vector Directories</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
