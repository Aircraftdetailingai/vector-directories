import { Html, Head, Body, Container, Section, Text, Link, Hr } from "@react-email/components";

interface ScoreChangeEmailProps {
  companyName: string;
  oldScore: number;
  newScore: number;
  dashboardUrl: string;
}

export function ScoreChangeEmail({
  companyName,
  oldScore,
  newScore,
  dashboardUrl,
}: ScoreChangeEmailProps) {
  const direction = newScore > oldScore ? "increased" : "decreased";

  return (
    <Html>
      <Head />
      <Body>
        <Container>
          <Section>
            <Text>Trust score update for {companyName}.</Text>
            <Text>
              The trust score for <strong>{companyName}</strong> has {direction}{" "}
              from <strong>{oldScore}</strong> to <strong>{newScore}</strong>.
            </Text>
            <Link href={dashboardUrl}>View Dashboard</Link>
            <Hr />
            <Text>Vector Directories</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
