import Section from "./Section";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase } from "lucide-react";

const experiences = [
	{
		role: "Lead Developer",
		company: "Arvo AI",
		period: "August 2024 — December 2024",
		href: "https://arvoai.ca/",
		summary:
			"Led development of shipment logistics chatbot with agentic workflows and ML optimization systems.",
		impacts: [
			"Led team of 3 developers deploying Langgraph agentic workflow for logistics chatbot",
			"Built custom GNN for freight optimization with quantized LLMs via Ollama/llama.cpp",
			"Managed 150+ tickets in Agile Kanban sprints with comprehensive project documentation",
			"Achieved 90% accuracy, 95% recall, and 100ms response time on RAG and tool-calling tasks",
		],
	},
	{
		role: "Quantitative Researcher",
		company: "TIW Private Equity ($200M+ AUM)",
		period: "April 2024 — August 2024",
		href: "https://tiwcg.com/",
		summary:
			"Developed dynamic risk optimization and high-frequency trading algorithms for quantitative strategies.",
		impacts: [
			"Implemented dynamic risk optimization reducing drawdowns by 32% while maintaining alpha",
			"Engineered high-frequency adaptive trend following with multi-asset signal processing",
			"Developed carry-enhanced strategies with LSTM-based deep diversification models",
			"Built breakout detection and mean-reversion systems with distributed Kafka streams",
		],
	},
	{
		role: "Data Engineer",
		company: "iLoF",
		period: "January 2024 — April 2024",
		href: "https://ilof.tech/",
		summary:
			"Built high-performance data pipelines for photonics timeseries analysis with distributed computing.",
		impacts: [
			"Engineered sub-100ms latency pipeline for photonics data with Redis caching",
			"Implemented distributed architecture with Celery, Docker, and Probabilistic PCA",
			"Optimized model evaluation reducing inference time by 76% using async workers",
			"Increased prediction accuracy by 82% using Random Forests and XGBoost",
		],
	},
	{
		role: "Full-Stack Developer",
		company: "MappedIn",
		period: "April 2023 — August 2023",
		href: "https://www.mappedin.com/",
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
		role: "Senior Machine Learning Engineer",
		company: "Wat.AI",
		period: "April 2023 — August 2023",
		href: "https://watai.ca/",
		summary:
			"Applied Generative AI using CNNs and Transformers for image captioning and MLOps deployment.",
		impacts: [
			"Applied Generative AI using CNNs: ResNets and Inception, and Transformers for image captioning",
			"Applied OpenAI's Fine-Tuning for image-to-HTML/CSS, leveraging OCR, BERT, and image segmentation",
			"Directed MLOps, ensuring efficient deployment and dataset curation with AWS Lambda, EC2, and S3",
		],
	},
	{
		role: "Data Science Developer Intern",
		company: "Sodexo",
		period: "November 2021 — April 2022",
		href: "https://www.sodexo.com/",
		summary:
			"Built full-stack ML app for 5000+ students to reduce food waste and overconsumption.",
		impacts: [
			"Made a full-stack machine learning app for 5000+ students to reduce overconsumption and food waste",
			"Worked with Sodexo's AWS Redshift architecture using PyTorch for Behavior Analytics and SQL for cleaning",
			"Produced Tableau visualizations for Sodexo management, preventing 30,000 pounds of annual food waste",
		],
	},
	{
		role: "Full-Stack Software Developer",
		company: "Altus Media",
		period: "June 2020 — January 2022",
		href: "https://www.blackconnect.org/",
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
									<CardDescription>{exp.period}</CardDescription>
								</CardHeader>
								<CardContent>
									<p className="mb-4 text-sm text-muted-foreground">
										{exp.summary}
									</p>
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
