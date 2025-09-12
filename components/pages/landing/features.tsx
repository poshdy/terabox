import { Cloud, Shield, Zap, Users, Smartphone, Globe } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const features = [
  {
    icon: Cloud,
    title: "Instant Sync",
    description:
      "Your files are synchronized across all devices in real-time with our lightning-fast cloud infrastructure.",
  },
  {
    icon: Shield,
    title: "Military-Grade Security",
    description:
      "End-to-end encryption and advanced security protocols keep your data safe from any threats.",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description:
      "Share folders, collaborate on documents, and manage team permissions with ease.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Experience blazing-fast upload and download speeds with our global CDN network.",
  },
  {
    icon: Smartphone,
    title: "Mobile Ready",
    description:
      "Access your files from anywhere with our native mobile apps for iOS and Android.",
  },
  {
    icon: Globe,
    title: "Global Access",
    description:
      "Your files are accessible from anywhere in the world with 99.9% uptime guarantee.",
  },
];

const Features = () => {
  return (
    <section className="py-24 bg-feature-bg">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Everything you need for
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {" "}
              modern storage
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Powerful features designed to make file management effortless and
            secure for individuals and teams.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="feature-card border-0 shadow-lg"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
