import "./MemberCard.css";

export default function MemberCard({
  name,
  role,
  image,
  bio,
  socialLinks = [],
}) {
  return (
    <article className="member-card">
      <div className="member-card__image-wrapper">
        <img
          className="member-card__image"
          src={image}
          alt={`${name} - ${role}`}
        />
      </div>

      <div className="member-card__content">
        <h3 className="member-card__name">{name}</h3>

        <p className="member-card__role">{role}</p>

        {bio && <p className="member-card__bio">{bio}</p>}

        {socialLinks.length > 0 && (
          <div className="member-card__socials">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="member-card__social-link"
                aria-label={`${name}'s ${link.label}`}
              >
                {link.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
