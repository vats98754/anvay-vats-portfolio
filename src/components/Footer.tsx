import { Button } from "@/components/ui/button";
import { Mail, Linkedin, Github } from "lucide-react";
import LogosMarquee from "@/components/LogosMarquee";

const Footer = () => {
  return (
    <footer className="bg-background/50 backdrop-blur-sm">
      <LogosMarquee className="py-6 md:py-8" />
      <div className="container-prose py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground">
            Personal Website by Anvay
          </div>
          <div className="flex items-center gap-3">
            <a 
              href="mailto:a7vats@uwaterloo.ca" 
              aria-label="Email me"
              className="hover-scale"
              data-cursor-view="email"
            >
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                <Mail className="h-4 w-4 mr-2" />
                Email
              </Button>
            </a>
            <a 
              href="https://www.linkedin.com/in/anvay-vats/" 
              target="_blank" 
              rel="noreferrer"
              aria-label="Visit my LinkedIn"
              className="hover-scale"
              data-cursor-view="linkedin"
            >
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                <Linkedin className="h-4 w-4 mr-2" />
                LinkedIn
              </Button>
            </a>
            <a 
              href="https://github.com/vats98754" 
              target="_blank" 
              rel="noreferrer"
              aria-label="Visit my GitHub"
              className="hover-scale"
              data-cursor-view="github"
            >
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                <Github className="h-4 w-4 mr-2" />
                GitHub
              </Button>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
