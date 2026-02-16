import { Html, Head, Body, Container, Section, Text, Link, Hr } from "@react-email/components";
import * as React from "react";

interface VerificationEmailProps {
  companyName: string;
  verificationUrl: string;
}

export function VerificationEmail({
  companyName,
  verificationUrl,
}: VerificationEmailProps) {
  return (
    <Html>
      <Head />
      <Body>
        <Container>
          <Section>
            <Text>Verify your business listing.</Text>
            <Text>
              Please verify that you are the owner of{" "}
              <strong>{companyName}</strong> by clicking the link below.
            </Text>
            <Link href={verificationUrl}>Verify Listing</Link>
            <Hr />
            <Text>Vector Directories</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
