import { Link } from "@tanstack/react-router";

export function YardMark({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className={`yard-logo${compact ? " yard-logo--compact" : ""}`} aria-label="YARD home">
      {compact ? <span className="yard-logo__emblem" aria-hidden="true"><i />Y</span> : <span className="yard-logo__type">Yard<span>®</span></span>}
    </Link>
  );
}
