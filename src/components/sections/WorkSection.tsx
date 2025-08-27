import Section from "./Section";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase } from "lucide-react";
const experiences = [
	{
		role: "Founding AI Engineer",
		company: "Cupertino Labs (Vercel AI Accelerator S25)",
		period: "April 2025 — August 2025",
		href: "",
		location: "San Francisco",
		stack: [
			"CrewAI",
			"LangGraph",
			"MCP",
			"Manus",
			"tRPC",
			"Jenkins",
			"SonarQube",
			"SageMaker",
			"Airflow",
		],
		summary: "Built analytics and multi-agent workflows for telecom-grade scale.",
		impacts: [
			"Shipped the analytics engine used on 10 million+ smartphones worldwide, in contracts with AT&T and Airtel",
			"Replaced ETL on GCP clusters with a CrewAI + Manus multi-agent workflow, cutting KPI reporting latency by 90%",
			"Built DevSecOps Jenkins pipelines integrating SonarQube (coverage, SCA, quality gates), Fortify, and JFrog Xray",
		],
	},
	{
		role: "Data Engineer",
		company: "DataCurve (YC W24)",
		period: "October 2024 — December 2024",
		href: "https://datacurve.ai/",
		location: "San Francisco",
		stack: [
			"Elixir",
			"Ecto",
			"GraphQL",
			"TypeScript",
			"NextJS",
			"TablePlus",
			"Postman",
			"Clerk",
		],
		summary: "Delivered data ingestion and product features for LLM evaluation pipelines.",
		impacts: [
			"Managed a 7-figure contract to supply clean training data for Cohere's Chain-of-Thought LLM evaluation",
			"Applied Ecto Repos, queries, and schemas with Elixir resolvers to ingest 1000+ user submissions",
			"Added features for users to do real-time voice recordings to more accurately emulate human thought processes",
		],
	},
	{
		role: "Lead Developer (Gen AI)",
		company: "Arvo AI (Panache VC-backed)",
		period: "Aug 2024 — Dec 2024",
		href: "https://www.arvoai.ca/",
		location: "Montreal",
		stack: [
			"LangGraph",
			"React",
			"Ollama",
			"llama.cpp",
			"MLFlow",
			"Weaviate",
			"Docker",
			"Terraform",
		],
		summary: "Led design and development of a freight logistics scheduler with agentic workflows.",
		impacts: [
			"Led design + development of a freight logistics scheduler on a 6-figure contract using LangGraph and Ollama",
			"Made PoWs, DoDs, GANTT, RACI, and RAID logs and finished 150+ tickets on Linear in Agile Kanban sprints",
			"Delivered GNN-based freight optimizer and RAG pipeline with 90% precision, 95% recall, and 100 ms latency",
		],
	},
	{
		role: "Quantitative Developer",
		company: "TIW Capital ($200M+ AUM)",
		period: "April 2024 — August 2024",
		href: "https://tiwcg.com/",
		location: "Singapore",
		stack: [
			"Python",
			"C++",
			"Julia",
			"Redis",
			"Kafka",
			"QuantLib",
			"PostgreSQL",
			"GoRoutines",
		],
		summary: "Built systematic strategies and real-time signal pipelines for multi-asset trading.",
		impacts: [
			"Implemented dynamic risk optimization using variable position sizing and cross-sectional momentum; reduced drawdowns by 32% while maintaining alpha",
			"Engineered high-frequency adaptive trend following with multi-asset normalized signal processing",
			"Developed carry-enhanced, fast mean-reversion strategies for breakout detection based in deep diversification",
		],
	},
	{
		role: "Data Engineer",
		company: "iLoF",
		period: "January 2024 — April 2024",
		href: "https://ilof.tech/",
		location: "London, UK (Remote)",
		stack: [
			"Python",
			"FastAPI",
			"Redis",
			"Celery",
			"Docker",
			"Kubernetes",
			"PostgreSQL",
			"AWS Lambda",
		],
		summary: "Built high-performance data pipelines for photonics timeseries analysis with distributed computing.",
		impacts: [
			"Engineered data-intensive pipeline for photonics timeseries with sub-100ms latency using Redis caching",
			"Implemented distributed computing architecture with Celery and Docker with Probabilistic PCA",
			"Optimized model evaluation with PostgreSQL materialized views, reducing inference time by 76% using async workers",
			"Increased prediction accuracy by 82% using Random Forests and XGBoost",
		],
	},
	{
		role: "Graphics Developer",
		company: "MappedIn",
		period: "April 2023 — August 2023",
		href: "https://www.mappedin.com/",
		location: "Waterloo (Hybrid)",
		stack: [
			"TypeScript",
			"Python (Jupyter)",
			"ThreeJS",
			"WebGL2",
		],
		summary: "Worked across SDK and ML teams on 3D indoor maps used by 1000+ firms.",
		impacts: [
			"Worked on SDK and ML teams developing 3D indoor maps used by 1000+ firms like Apple, Dubai Mall, and NFL",
			"Applied rasterization, rendering, and projective geometry via SDK features and fixes using ThreeJS",
			"Researched and implemented EdgeGAN with GNNs to improve our cGAN-based Map Digitizer for Microsoft",
		],
	},
	{
		role: "Machine Learning Engineer",
		company: "Wat.AI",
		period: "April 2023 — August 2023",
		href: "https://watai.ca/",
		location: "Waterloo (In-Person)",
		stack: [
			"Google Colab",
			"PyTorch",
			"TensorFlow",
			"NumPy",
			"OpenAI",
			"AWS",
		],
		summary: "Applied Generative AI using CNNs and Transformers for image captioning and MLOps deployment.",
		impacts: [
			"Applied Generative AI using CNNs: ResNets and Inception, and Transformers for image captioning",
			"Applied OpenAI's Fine-Tuning for image-to-HTML/CSS, leveraging OCR, BERT, and image segmentation",
			"Directed MLOps, ensuring efficient deployment and dataset curation with AWS Lambda, EC2, and S3",
		],
	},
	{
		role: "Data Science Intern",
		company: "Sodexo",
		period: "November 2021 — April 2022",
		href: "https://www.sodexo.com/",
		location: "United States, Singapore (Remote)",
		stack: [
			"AWS",
			"TensorFlow",
			"PyTorch",
			"SQL",
			"MATLAB",
			"Tableau",
		],
		summary: "Built full-stack ML app for 5000+ students to reduce food waste and overconsumption.",
		impacts: [
			"Made a full-stack machine learning app for 5000+ students to reduce overconsumption and food waste",
			"Worked with Sodexo's AWS S3 architecture using PyTorch for Behavior Analytics and SQL for cleaning",
			"Produced Tableau visualizations for Sodexo management, preventing 30,000 pounds of annual food waste",
		],
	},
	{
		role: "Full-Stack Software Developer",
		company: "Altus Media",
		period: "June 2020 — January 2022",
		href: "https://www.blackconnect.org/",
		location: "United States, Singapore (Remote)",
		stack: [
			"MongoDB",
			"ExpressJS",
			"React + Redux",
			"Node.js (MERN)",
		],
		summary: "Developed social networking websites for NGOs with 200,000+ annual visitors using MERN stack.",
		impacts: [
			"Developed social networking websites for NGOs like BlackConnect with more than 200,000 annual visitors",
			"Communicated with NGO partners to integrate Amazon with React frontends for E-commerce websites",
			"Made microservices with Docker & Kubernetes, with CI/CD pipelines in Jenkins for scalable deployments",
		],
	},
	{
		role: "Virtual Reality Intern",
		company: "Silver Wings XR",
		period: "October 2020 — November 2020",
		href: "https://www.silverwingsxr.com/",
		location: "Singapore (In-Person)",
		stack: [
			"Unity3D",
			"Google VR (Street View)",
			"Blender (AR)",
		],
		summary: "Enhanced VR/AR graphics with Unity3D and Three.js for improved rendering performance.",
		impacts: [
			"Integrated Blender CAD models with Three.js, enhancing Google Street View rendering by 20%",
			"Utilized Unity3D and WebGL for SSAO, optimizing VR scene rendering by 15% for our client TripAdvisor",
			"Spearheaded integration of react-three-fiber in Unity3D for improved VR/AR graphics fidelity",
			"Collaborated on graphics pipelines with Typescript, facilitating bridges between XR, CAD, and rendering",
		],
	},
];

const WorkSection = () => {
	return (
		<Section
			id="work"
			title="Work"
			subtitle="A track record of shipping, learning, and measurable impact."
			showHeader={false}
			noTopPadding
		>
			<ol className="relative ml-4 border-l pl-6">
				{experiences.map((exp, idx) => (
					<li
						key={idx}
						className="mb-10 reveal"
						style={{ transitionDelay: `${idx * 90}ms` }}
					>
						<span className="absolute -left-2 mt-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary/15 ring-2 ring-primary shadow-[0_0_12px_rgba(34,211,238,0.35)]">
							<Briefcase className="h-3 w-3 text-primary" />
						</span>
						<a
							href={exp.href}
							target="_blank"
							rel="noreferrer"
							className="block"
							aria-label={`Open ${exp.company} website`}
							data-cursor-view="work"
						>
							<Card className="transition-shadow border border-cyan-400/10 bg-emerald-950/20 backdrop-blur-sm hover:border-cyan-300/30 hover:shadow-[0_0_24px_rgba(34,211,238,0.25)]">
								<CardHeader>
									<CardTitle className="text-xl text-[hsl(var(--primary))]">
										{exp.role} · {exp.company}
									</CardTitle>
									<CardDescription>
										{exp.period}
										{exp.location ? ` • ${exp.location}` : ""}
									</CardDescription>
								</CardHeader>
								<CardContent>
									<p className="mb-4 text-sm text-muted-foreground">
										{exp.summary}
									</p>
									{Array.isArray((exp as any).stack) && (exp as any).stack.length > 0 && (
										<div className="mb-4 flex flex-wrap gap-1.5">
											{(exp as any).stack.map((tech: string) => (
												<Badge key={tech} variant="secondary" className="text-[11px]">
													{tech}
												</Badge>
											))}
										</div>
									)}
									<ul className="list-disc space-y-2 pl-4 text-sm">
										{exp.impacts.map((i, j) => (
											<li key={j}>{i}</li>
										))}
									</ul>
								</CardContent>
							</Card>
						</a>
					</li>
				))}
			</ol>
		</Section>
	);
};

export default WorkSection;
