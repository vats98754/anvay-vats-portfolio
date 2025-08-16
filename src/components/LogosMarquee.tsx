import React from "react";

const defaultCompanies = [
	{ name: "UWaterloo", src: "/logos/uwaterloo.png" },
	{ name: "DataCurve", src: "/logos/datacurve.jpg" },
	{ name: "Y Combinator", src: "/logos/ycombinator.png" },
	{ name: "TIW Private Equity", src: "/logos/tiwcapital.png" },
	{ name: "MappedIn", src: "/logos/mappedin.png" },
	{ name: "iLof", src: "/logos/ilof.jpg" },
	{ name: "Arvo", src: "/logos/arvo.jpg" },
];

interface LogosMarqueeProps {
	companies?: { name: string; src: string }[];
	className?: string;
}

const LogosMarquee: React.FC<LogosMarqueeProps> = ({
	companies = defaultCompanies,
	className,
}) => {
	const track = [...companies, ...companies]; // duplicate for seamless scroll
	return (
		<aside
			aria-label="Companies I've worked with"
			className={`border-t border-b bg-accent/40 ${
				className ?? "py-10 md:py-12"
			}`}
		>
			<div className="marquee">
				<div className="marquee__track px-8 md:px-10">
					{track.map((c, i) => (
						<div
							key={`${c.name}-${i}`}
							className="flex items-center gap-4 md:gap-5 opacity-80 hover:opacity-100 transition-opacity"
						>
							<img
								src={c.src}
								alt={`${c.name} logo`}
								className="h-10 w-10 md:h-12 md:w-12 aspect-square object-contain rounded-sm p-1"
								loading="lazy"
							/>
							<span className="text-sm md:text-base text-muted-foreground">
								{c.name}
							</span>
						</div>
					))}
				</div>
			</div>
		</aside>
	);
};

export default LogosMarquee;
