import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Link,
  Hr,
  Heading,
} from "@react-email/components";

interface OutreachEmailProps {
  companyName: string;
  claimUrl: string;
  siteUrl: string;
}

export function OutreachEmail({
  companyName,
  claimUrl,
  siteUrl,
}: OutreachEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={{ fontFamily: "sans-serif", color: "#1a1a1a" }}>
        <Container>
          <Section>
            <Heading as="h1" style={{ fontSize: "24px" }}>
              Your business is listed on Aircraft Detailing Directory
            </Heading>

            <Text>
              <strong>{companyName}</strong> now has a free listing on the
              Aircraft Detailing Directory. Your listing already includes:
            </Text>

            <Text>
              &bull; Your company name and description
              <br />
              &bull; Phone number and contact info
              <br />
              &bull; Address and map placement
              <br />
              &bull; Visibility in search results
            </Text>

            <Text>
              <strong>Claim your listing</strong> to take control of your
              profile and unlock even more:
            </Text>

            <Text>
              &bull; Photo gallery to showcase your work
              <br />
              &bull; Analytics dashboard with visitor stats
              <br />
              &bull; Lead capture forms from potential customers
              <br />
              &bull; Priority placement in search results
              <br />
              &bull; Custom branding and certifications
            </Text>

            <Link
              href={claimUrl}
              style={{
                display: "inline-block",
                padding: "12px 24px",
                backgroundColor: "#1B4332",
                color: "#ffffff",
                borderRadius: "6px",
                textDecoration: "none",
                fontWeight: "bold",
              }}
            >
              Claim Your Free Listing
            </Link>

            <Hr style={{ margin: "32px 0 16px" }} />

            <Text style={{ fontSize: "12px", color: "#666666" }}>
              <Link href={siteUrl} style={{ color: "#666666" }}>
                Aircraft Detailing Directory
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
