import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Bot, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AiConcierge() {
  return (
    <Card className="h-full flex flex-col bg-gradient-to-br from-primary/10 via-card to-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm font-medium">
          <Bot className="h-4 w-4 text-primary" />
          Beno's Briefing
        </CardTitle>
        <CardDescription className="text-xs">
          Your AI Chief of Staff
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-sm text-foreground/90 leading-relaxed">
          "Good morning. Your schedule is light today. Your cash flow is positive, but a large credit card bill is due soon. I suggest reviewing your subscriptions to optimize spending."
        </p>
      </CardContent>
       <CardFooter>
        <Button variant="ghost" size="sm" className="w-full justify-start p-0 h-auto text-primary hover:text-primary">
          <span>Expand Briefing</span>
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}

    