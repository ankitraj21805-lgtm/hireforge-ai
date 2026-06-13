import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAnalyzeGithub, useListGithubAnalyses, getListGithubAnalysesQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Search, Github as GithubIcon, Star, GitCommit } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

const schema = z.object({
  username: z.string().min(1, "Username is required"),
});

export default function AnalyzeGithub() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: analyses, isLoading } = useListGithubAnalyses({ query: { queryKey: getListGithubAnalysesQueryKey() } });
  const analyzeMutation = useAnalyzeGithub();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { username: "" },
  });

  const onSubmit = (data: z.infer<typeof schema>) => {
    analyzeMutation.mutate({ data }, {
      onSuccess: () => {
        toast({ title: "Analysis complete", description: "Successfully analyzed GitHub profile." });
        queryClient.invalidateQueries({ queryKey: getListGithubAnalysesQueryKey() });
        form.reset();
      },
      onError: () => {
        toast({ title: "Analysis failed", description: "Could not analyze this profile.", variant: "destructive" });
      }
    });
  };

  return (
    <div className="p-8 space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <GithubIcon className="h-8 w-8" />
          GitHub Analyzer
        </h1>
        <p className="text-muted-foreground mt-1">Deep analysis of developer archetypes and code quality.</p>
      </div>

      <Card className="bg-card/50 border-primary/20 shadow-lg shadow-primary/5">
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Enter GitHub username (e.g. torvalds)" className="pl-10 h-12 text-lg" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" size="lg" className="h-12 px-8" disabled={analyzeMutation.isPending}>
                {analyzeMutation.isPending ? "Analyzing..." : "Analyze Profile"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Recent Analyses</h2>
        {isLoading ? (
          <div className="text-muted-foreground text-sm">Loading...</div>
        ) : (
          <div className="grid gap-4">
            {analyses?.map(analysis => (
              <Card key={analysis.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl font-bold flex items-center gap-2">
                        @{analysis.username}
                      </CardTitle>
                      <CardDescription>{new Date(analysis.analyzedAt).toLocaleDateString()}</CardDescription>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col items-end">
                        <span className="text-xs text-muted-foreground uppercase font-semibold">Overall Score</span>
                        <span className="text-2xl font-bold text-primary">{analysis.score}/100</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-muted-foreground">{analysis.summary}</p>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                        <Star className="h-4 w-4 text-primary" /> Key Strengths
                      </h4>
                      <ul className="space-y-1">
                        {analysis.strengths?.map((strength, i) => (
                          <li key={i} className="text-sm flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-primary inline-block" />
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                        <GitCommit className="h-4 w-4 text-primary" /> Tech Stack
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {analysis.topLanguages?.map((lang, i) => (
                          <Badge key={i} variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                            {lang}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {analyses?.length === 0 && (
              <p className="text-muted-foreground text-sm">No analyses found. Enter a username to get started.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
