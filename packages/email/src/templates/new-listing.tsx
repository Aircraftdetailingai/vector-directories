import { Html, Head, Body, Container, Section, Text, Link, Hr } from "@react-email/components";

interface NewListingEmailProps {
  companyName: string;
  listingTitle: string;
  listingUrl: string;
}

export function NewListingEmail({
  companyName,
  listingTitle,
  listingUrl,
}: NewListingEmailProps) {
  return (
    <Html>
      <Head />
      <Body>
        <Container>
          <Section>
            <Text>A new listing has been created.</Text>
            <Text>
              <strong>{companyName}</strong> just published{" "}
              <strong>{listingTitle}</strong>.
            </Text>
            <Link href={listingUrl}>View Listing</Link>
            <Hr />
            <Text>Vector Directories</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
