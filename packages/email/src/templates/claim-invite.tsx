import { Html, Head, Body, Container, Section, Text, Link, Hr } from "@react-email/components";

interface ClaimInviteEmailProps {
  companyName: string;
  inviterName: string;
  claimUrl: string;
}

export function ClaimInviteEmail({
  companyName,
  inviterName,
  claimUrl,
}: ClaimInviteEmailProps) {
  return (
    <Html>
      <Head />
      <Body>
        <Container>
          <Section>
            <Text>You've been invited to claim a business listing.</Text>
            <Text>
              <strong>{inviterName}</strong> has invited you to claim and manage
              the listing for <strong>{companyName}</strong> on Vector
              Directories.
            </Text>
            <Link href={claimUrl}>Claim Your Listing</Link>
            <Hr />
            <Text>Vector Directories</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
