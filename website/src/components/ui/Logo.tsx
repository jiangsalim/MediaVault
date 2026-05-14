import Link from "next/link";

interface LogoProps {
  className?: string;
}

export function Logo({ className = "" }: LogoProps) {
  return (
    <Link href="/" className={`flex items-center gap-3 ${className}`}>
      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-teal text-lg font-bold text-white">
        MV
      </div>
      <div className="hidden sm:block">
        <div className="text-lg font-bold leading-tight tracking-tight text-navy">MediaVault</div>
        <div className="text-[10px] font-light uppercase tracking-[3px] text-charcoal">Music Toolkit</div>
      </div>
    </Link>
  );
}
