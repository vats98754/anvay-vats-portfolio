import Section from "./Section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award } from "lucide-react";

const achievements = [
  {
    title: "Citadel Midwest Datathon 2023",
    period: "Feb 2023",
    description: "Participated in Citadel Securities' Midwest Datathon, a competitive data science and quantitative analytics competition focusing on financial markets and trading strategies.",
    link: "https://www.overleaf.com/read/xxmdrpskgtwv#9dd8ea",
  },
  {
    title: "Silver Medal in National Olympiad of Informatics (NOI) 2022",
    period: "Feb 2022",
    description: "Awarded Silver Medal in Singapore's prestigious National Olympiad in Informatics on February 19, 2022. Gold medalists are selected for Singapore's International Olympiad in Informatics (IOI) team. The contest is organized annually by professors at the National University of Singapore's School of Computing.",
    link: "https://noisg.comp.nus.edu.sg/noi/noiTwentyFifthResults.php",
  },
  {
    title: "A-Level CAIE Further Mathematics (9231) - Grade A*",
    period: "Jun 2021",
    description: "Self-studied this 2-year course (with A-Level Mathematics as prerequisite) within 4 months alongside IB Year 1 schoolwork. Completed using only a textbook, demonstrating exceptional time management and self-directed learning capabilities.",
    link: "#", // No specific link provided
  },
  {
    title: "SAT Subject Test: Math Level 2 - Perfect Score",
    period: "May 2021",
    description: "Achieved perfect score of 800/800 on SAT Subject Test in Mathematics Level 2. Took the test once and achieved maximum possible score.",
    link: "#", // No specific link provided
  },
  {
    title: "SAT Subject Test: Physics - Perfect Score",
    period: "May 2021",
    description: "Achieved perfect score of 800/800 on SAT Subject Test in Physics. Took the test once and achieved maximum possible score.",
    link: "#", // No specific link provided
  },
  {
    title: "CEMC Euclid 2021 - Top 2% Globally, International Honor Roll",
    period: "Apr 2021",
    description: "Achieved top 2% globally among 20,000+ test-takers as a Grade 11 student (exam intended for Grade 12). School Topper with medal, International Honor Roll (fewer than 500 recipients), and Distinction certificate.",
    link: "#", // No specific link provided
  },
  {
    title: "CEMC Fermat 2021 - Top 0.8% Globally, National Topper",
    period: "Feb 2021",
    description: "Achieved top 0.8% globally among 13,000 test-takers. National & School Topper with medal, International Honor Roll (fewer than 500 recipients), and Distinction certificate.",
    link: "#", // No specific link provided
  },
  {
    title: "SAT - Score 1570/1600",
    period: "Oct 2020",
    description: "Achieved 1570/1600 on SAT (Mathematics: 800/800, EBRW: 770/800, Essay: 19/24). Took the test once and achieved near-perfect score.",
    link: "#", // No specific link provided
  },
  {
    title: "CEMC CSMC 2020 - Top 2% Globally, National Topper",
    period: "Nov 2020",
    description: "Achieved top 2% globally among 10,000 test-takers as a Grade 11 student (exam intended for Grade 12). National & School Topper with medal, International Honor Roll (fewer than 500 recipients), and Distinction certificate.",
    link: "#", // No specific link provided
  },
  {
    title: "UKMT Senior Mathematical Challenge - Gold Certificate",
    period: "Jan 2019",
    description: "Awarded Gold Certificate in the UK Mathematics Trust Senior Mathematical Challenge, recognizing exceptional mathematical problem-solving abilities.",
    link: "#", // No specific link provided
  },
];

const AchievementsSection = () => {
  return (
    <Section id="achievements" title="Achievements" subtitle="Notable international/national accomplishments and recognitions." showHeader={false} noTopPadding>
      <ol className="relative ml-4 border-l pl-6">
        {achievements.map((achievement, idx) => (
          <li key={idx} className="mb-10">
            <span className="absolute -left-2 mt-2 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500/20 ring-2 ring-amber-500">
              <Award className="h-3 w-3 text-amber-500" />
            </span>
            <a href={achievement.link} target="_blank" rel="noopener noreferrer" className="block" aria-label={`View ${achievement.title} details`} data-cursor-view="achievement">
              <Card className="bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border-amber-500/30 hover:shadow-elevated transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl text-amber-400">{achievement.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{achievement.period}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {achievement.description}
                  </p>
                </CardContent>
              </Card>
            </a>
          </li>
        ))}
      </ol>
    </Section>
  );
};

export default AchievementsSection;
