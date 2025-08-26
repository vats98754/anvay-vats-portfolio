import Section from "./Section";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase } from "lucide-react";

const experiences = [
	{
		role: "Founding Engineer",
		company: "Cupertino Labs (Vercel AI Accelerator S25)",
		period: "April 2025 — August 2025",
		href: "https://www.unrepped.co/",
		location: "San Francisco",
		stack: [
			"CrewAI",
			"LangGraph",
			"MCP",
			"Manus",
			"tRPC",
			"Jenkins",
			"SonarQube",
			"DuckDB",
			"SageMaker",
		],
		summary:
			"Shipped analytics and agentic workflows powering products at massive scale.",
		impacts: [
			"Shipped product used on 1 in 4 (2 billion) smartphones worldwide",
			"Built analytics enabling ML model creation for churn data",
			"Developed voice- and image-enabled agentic workflow to automate customer claims processing",
		],
	},
	{
		role: "Full-Stack Developer",
		company: "DataCurve (YC W24)",
		period: "October 2024 — December 2024",
		href: "https://datacurve.ai/",
		location: "San Francisco",
		stack: [
			"Elixir",
			"TypeScript",
			"Next.js",
			"GraphQL",
			"TablePlus",
			"Clerk",
			"Docker",
		],
		summary:
			"Delivered data and ML infrastructure and product features for enterprise training-data pipelines.",
		impacts: [
			"Managed a 7-figure contract with Cohere to supply training data for chain-of-thought and reasoning LLMs",
			"Implemented custom GNN for freight optimization, running quantized LLMs on CPU via Ollama/llama.cpp",
			"1 in 4 (2 billion) smartphones in the world use this analytics software",
		],
	},
	{
		role: "Project Manager (Gen AI)",
		company: "Arvo AI (Panache VC-backed)",
		period: "August 2024 — December 2024",
		href: "https://www.arvoai.ca/",
		location: "Montreal",
		stack: [
			"LangGraph",
			"React",
			"Ollama",
			"llama.cpp",
			"MLflow",
			"Weaviate",
			"Docker",
			"Airflow",
		],
		summary:
			"Led a team building an agentic logistics chatbot with robust MLOps and evaluation.",
		impacts: [
			"Lead developer of a team of 3 for a shipment logistics chatbot, deploying an agentic workflow in LangGraph",
			"Implemented custom GNN for freight optimization, running quantized LLMs on CPU via Ollama/llama.cpp",
			"Maintained PoWs, DoDs, GANTT, RACI, and RAID charts and closed 150+ tickets on Linear in Agile Kanban sprints",
			"Dockerized modules and set up CI/CD with GitHub Actions (jobs, runners)",
			"Achieved 90% accuracy, 95% recall, and ~100 ms response time on RAG, chart-generation, and tool-calling",
		],
	},
	{
		role: "Quantitative Researcher",
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
			"Go Routines",
		],
		summary:
			"Designed and deployed systematic strategies and real-time signal pipelines.",
		impacts: [
			"Implemented dynamic risk optimization with variable position sizing and cross-sectional momentum, reducing drawdowns by 32% while maintaining alpha",
			"Engineered high-frequency adaptive trend following algorithms with multi-asset normalized signal processing",
			"Developed carry‑enhanced strategies with deep diversification models using LSTM networks",
			"Deployed breakout detection and mean‑reversion systems with distributed Kafka streams for real-time signals",
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
		summary:
			"Built high-performance data pipelines for photonics timeseries analysis with distributed computing.",
		impacts: [
			"Engineered data-intensive pipeline for photonics timeseries with sub-100ms latency using Redis caching",
			"Implemented distributed computing architecture with Celery and Docker with Probabilistic PCA",
			"Optimized model evaluation with PostgreSQL materialized views, reducing inference time by 76% using async workers",
			"Increased prediction accuracy by 82% using Random Forests and XGBoost",
		],
	},
	{
		role: "SDK Developer",
		company: "MappedIn",
		period: "April 2023 — August 2023",
		href: "https://www.mappedin.com/",
		location: "Waterloo, ON (Hybrid)",
		stack: [
			"TypeScript",
			"Python (Jupyter)",
			"ThreeJS",
			"WebGL2",
		],
		summary:
			"Developed 3D indoor mapping SDK used by 1000+ firms including Apple and Dubai Mall.",
		impacts: [
			"Built core SDK features for major clients using TypeScript and ThreeJS",
			"Applied Linear Algebra and Projective Geometry to optimize rendering performance",
			"Implemented EdgeGAN with GNNs to enhance cGAN-based Map Digitizer",
			"Contributed to SDK team serving 1000+ enterprise clients globally",
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
		summary:
			"Applied Generative AI using CNNs and Transformers for image captioning and MLOps deployment.",
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
		summary:
			"Built full-stack ML app for 5000+ students to reduce food waste and overconsumption.",
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
		summary:
			"Developed social networking websites for NGOs with 200,000+ annual visitors using MERN stack.",
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
		summary:
			"Enhanced VR/AR graphics with Unity3D and Three.js for improved rendering performance.",
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
						<span className="absolute -left-2 mt-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary/10 ring-2 ring-primary">
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
							<Card className="hover:shadow-elevated transition-shadow">
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
