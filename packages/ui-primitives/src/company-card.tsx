export interface CompanyCardProps {
  name: string;
  slug: string;
  description?: string | null;
  trustScore?: number | null;
  tier: string;
  isClaimed: boolean;
  logoUrl?: string | null;
  className?: string;
  href?: string;
}

export function CompanyCard({
  name,
  description,
  trustScore,
  tier,
  isClaimed,
  logoUrl,
  className,
  href,
}: CompanyCardProps) {
  const Wrapper = href ? "a" : "div";
  const wrapperProps = href ? { href } : {};

  return (
    <Wrapper {...wrapperProps} className={className} role="article" aria-label={name}>
      {logoUrl && <img src={logoUrl} alt={`${name} logo`} />}
      <div>
        <h3>{name}</h3>
        {description && <p>{description}</p>}
        <div>
          {trustScore !== null && trustScore !== undefined && (
            <span aria-label={`Trust score: ${trustScore}`}>
              {trustScore}
            </span>
          )}
          <span>{tier}</span>
          {isClaimed && <span aria-label="Verified">Claimed</span>}
        </div>
      </div>
    </Wrapper>
  );
}
