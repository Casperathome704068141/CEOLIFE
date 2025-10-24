"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Badge } from "@/components/ui/badge";
import { Article } from "@/lib/pulse/types";

const categories: Article["category"][] = ["world", "business", "tech", "sports", "entertainment"];

async function fetchNews(category: Article["category"]) {
  const response = await fetch(`/api/pulse/news?category=${category}`);
  const data = (await response.json()) as { articles: Article[] };
  return data.articles;
}

interface Props {
  onAddToBrief: (payload: { title: string; body: string }) => Promise<void>;
}

export function NewsCard({ onAddToBrief }: Props) {
  const [category, setCategory] = useState<Article["category"]>("world");
  const [preview, setPreview] = useState<Article | undefined>();
  const { data: articles = [], isLoading } = useQuery({
    queryKey: ["pulse", "news", category],
    queryFn: () => fetchNews(category),
    staleTime: 1000 * 60 * 5,
  });

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-base">
          <span>Headline radar</span>
          <Badge variant="outline">News</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs value={category} onValueChange={(value) => setCategory(value as Article["category"])}>
          <TabsList className="grid grid-cols-2 gap-2 md:grid-cols-5">
            {categories.map((cat) => (
              <TabsTrigger key={cat} value={cat} className="capitalize">
                {cat}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <ScrollArea className="h-56">
          <div className="space-y-3 pr-4">
            {isLoading ? (
              <p className="text-sm text-muted-foreground">Loading headlines...</p>
            ) : articles.length === 0 ? (
              <p className="text-sm text-muted-foreground">No news items available.</p>
            ) : (
              articles.map((article) => (
                <div key={article.id} className="space-y-2 rounded-xl border border-border/60 bg-background/80 p-3">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{article.source}</span>
                    <span>{new Date(article.publishedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                  </div>
                  <p className="text-sm font-semibold leading-5">{article.title}</p>
                  <p className="text-xs text-muted-foreground line-clamp-2">{article.summary}</p>
                  <Button variant="ghost" size="sm" className="text-primary" onClick={() => setPreview(article)}>
                    Read
                  </Button>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Pulse aggregates Reuters, AP, Bing and NewsAPI feeds.</span>
        <Button
          variant="ghost"
          size="sm"
          className="text-primary"
          onClick={() =>
            onAddToBrief({
              title: "Top headlines",
              body: `Share ${category} stories in the Beno briefing for quick review.`,
            })
          }
        >
          Add to Beno brief
        </Button>
      </CardFooter>
      <Dialog open={!!preview} onOpenChange={(open) => !open && setPreview(undefined)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{preview?.title}</DialogTitle>
            <DialogDescription>{preview?.source}</DialogDescription>
          </DialogHeader>
          <p className="text-sm leading-6 text-muted-foreground">{preview?.summary}</p>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
