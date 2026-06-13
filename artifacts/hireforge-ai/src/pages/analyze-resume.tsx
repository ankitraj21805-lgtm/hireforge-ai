import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAnalyzeResume, useListResumes, getListResumesQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { FileText, Wand2, Lightbulb, CheckCircle2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

const schema = z.object({
  fileName: z.string().min(1, "File name is required"),
  content: z.string().min(50, "Resume content must be at least 50 characters"),
});

export default function AnalyzeResume() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: resumes, isLoading } = useListResumes({ query: { queryKey: getListResumesQueryKey() } });
  const analyzeMutation = useAnalyzeResume();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { fileName: "", content: "" },
  });

  const onSubmit = (data: z.infer<typeof schema>) => {
    analyzeMutation.mutate({ data }, {
      onSuccess: () => {
        toast({ title: "Analysis complete", description: "Successfully analyzed resume." });
        queryClient.invalidateQueries({ queryKey: getListResumesQueryKey() });
        form.reset();
      },
      onError: () => {
        toast({ title: "Analysis failed", description: "Could not analyze this resume.", variant: "destructive" });
      }
    });
  };

  return (
    <div className="p-8 space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <FileText className="h-8 w-8" />
          Resume Analyzer
        </h1>
        <p className="text-muted-foreground mt-1">Extract structured signals and actionable improvements from raw text.</p>
      </div>

      <Card className="bg-card/50 border-primary/20 shadow-lg shadow-primary/5">
        <CardHeader>
          <CardTitle>New Analysis</CardTitle>
          <CardDescription>Paste the raw text of a candidate's resume</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="fileName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Candidate Name / Identifier</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Jane Doe - Senior Engineer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Resume Text</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Paste resume content here..." 
                        className="min-h-[200px] font-mono text-xs" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={analyzeMutation.isPending}>
                <Wand2 className="mr-2 h-4 w-4" />
                {analyzeMutation.isPending ? "Extracting Signals..." : "Analyze Resume"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Analyzed Resumes</h2>
        {isLoading ? (
          <div className="text-muted-foreground text-sm">Loading...</div>
        ) : (
          <div className="grid gap-6">
            {resumes?.map(resume => (
              <Card key={resume.id}>
                <CardHeader className="pb-2 border-b border-border/50 mb-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-lg font-bold">{resume.fileName}</CardTitle>
                      <CardDescription>{new Date(resume.analyzedAt).toLocaleDateString()}</CardDescription>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-xs text-muted-foreground uppercase font-semibold">Match Score</span>
                      <span className="text-2xl font-bold text-primary">{resume.score}/100</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" /> Executive Summary
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{resume.summary}</p>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary" /> Extracted Skills
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {resume.skills?.map((skill, i) => (
                          <Badge key={i} variant="outline" className="bg-background">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                        <Lightbulb className="h-4 w-4 text-orange-400" /> Improvement Areas
                      </h4>
                      <ul className="space-y-2">
                        {resume.improvements?.map((imp, i) => (
                          <li key={i} className="text-sm flex items-start gap-2 text-muted-foreground">
                            <span className="text-orange-400 font-bold">•</span>
                            {imp}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {resumes?.length === 0 && (
              <p className="text-muted-foreground text-sm">No resumes analyzed yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
