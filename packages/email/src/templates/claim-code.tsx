import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Hr,
} from "@react-email/components";

interface ClaimCodeEmailProps {
  companyName: string;
  code: string;
}

export function ClaimCodeEmail({ companyName, code }: ClaimCodeEmailProps) {
  return (
    <Html>
      <Head />
      <Body>
        <Container>
          <Section>
            <Text>Verify your business listing claim.</Text>
            <Text>
              Use the code below to verify ownership of{" "}
              <strong>{companyName}</strong> on Vector Directories.
            </Text>
            <Text
              style={{
                fontSize: "32px",
                fontWeight: "bold",
                letterSpacing: "4px",
                textAlign: "center" as const,
                padding: "16px",
              }}
            >
              {code}
            </Text>
            <Text>This code expires in 10 minutes.</Text>
            <Text>
              If you did not request this code, you can safely ignore this
              email.
            </Text>
            <Hr />
            <Text>Vector Directories</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
