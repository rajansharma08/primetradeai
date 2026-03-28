import { Link } from "react-router-dom";

function AuthLayout({ title, subtitle, children, alternateText, alternateLink, alternateLabel }) {
  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div>
          <span className="eyebrow">E-Library</span>
          <h1>{title}</h1>
          <p className="muted">{subtitle}</p>
        </div>
        {children}
        <p className="switch-link">
          {alternateText} <Link to={alternateLink}>{alternateLabel}</Link>
        </p>
      </div>
    </div>
  );
}

export default AuthLayout;
