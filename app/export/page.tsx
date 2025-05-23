"use client";
import type React from "react";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Mail, FileText, Settings, Eye, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { PDFPreview } from "@/components/pdf-preview";
import { useAppSelector } from "@/lib/store/hook";
import { useRouter } from "next/navigation";
import { InlineAlert } from "@/components/ui/inline-alert";
import {
  downloadPDF,
  emailPDF,
  prepareReportData,
  type PDFOptions,
} from "@/components/pdf-service";
import { useToast } from "@/components/ui/use-toast";

export default function ExportPage() {
  const router = useRouter();
  const { csvResult, manualResult, predictionType } = useAppSelector(
    (state) => state.prediction
  );
  const [noResult, setNoResult] = useState(false);
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);
  const [isEmailing, setIsEmailing] = useState(false);
  const [includeOptions, setIncludeOptions] = useState({
    summary: true,
    riskAssessment: true,
    modelExplanation: true,
    recommendations: true,
    patientData: true,
  });

  useEffect(() => {
    if (!csvResult && !manualResult) {
      setNoResult(true);
    }
  }, [csvResult, manualResult]);

  if (noResult) {
    return (
      <main className="container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-screen text-center">
        <InlineAlert
          title="No Exports Found"
          description="It looks like you haven't uploaded any data or run a prediction yet."
        />
        <p className="mt-4 text-muted-foreground dark:text-gray-400 max-w-md">
          Please upload a file or enter patient details manually to get a
          prediction.
        </p>
        <button
          onClick={() => router.push("/upload")}
          className="mt-6 text-[#44bfb2] text-sm font-medium hover:underline transition"
        >
          Go to Upload Page
        </button>
      </main>
    );
  }

  const handleOptionChange = (option: keyof typeof includeOptions) => {
    setIncludeOptions((prev) => ({
      ...prev,
      [option]: !prev[option],
    }));
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter an email address to send the report.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsEmailing(true);

      // Prepare report data based on prediction type
      const reportData = prepareReportData(
        predictionType === "manual" ? manualResult : csvResult,
        "SepsisAI"
      );

      const options: PDFOptions = {
        reportType: "SepsisAI",
        includeOptions,
        style: {
          primaryColor: [21, 94, 99], // Teal color
        },
      };

      await emailPDF(reportData, options, email);

      toast({
        title: "Email Sent",
        description: `The report has been sent to ${email}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsEmailing(false);
    }
  };

  const handleDownload = async () => {
    try {
      setIsDownloading(true);

      // Prepare report data based on prediction type
      const reportData = prepareReportData(
        predictionType === "manual" ? manualResult : csvResult,
        "SepsisAI"
      );

      const options: PDFOptions = {
        reportType: "SepsisAI",
        includeOptions,
        style: {
          primaryColor: [21, 94, 99], // Teal color
        },
      };

      await downloadPDF(
        reportData,
        options,
        `sepsis-report-${new Date().toISOString().split("T")[0]}.pdf`
      );

      toast({
        title: "Download Complete",
        description: "Your PDF report has been downloaded successfully.",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description:
          "There was an error generating your PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrintPreview = () => {
    // Open a new window with just the PDF preview for printing
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      toast({
        title: "Print Failed",
        description:
          "Unable to open print preview. Please check your popup blocker settings.",
        variant: "destructive",
      });
      return;
    }

    // Get the PDF preview content
    const previewElement = document.getElementById("pdf-preview");
    if (!previewElement) return;

    // Write the content to the new window
    printWindow.document.write(`
      <html>
        <head>
          <title>SepsisAI Report - Print Preview</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
            @media print {
              body { padding: 0; }
            }
          </style>
        </head>
        <body>
          ${previewElement.outerHTML}
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);

    printWindow.document.close();
  };

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Export Report</h1>
          <p className="text-muted-foreground dark:text-gray-400 text-md">
            Preview, customize, and download the sepsis prediction report
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Settings className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                    Export Options
                  </h2>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="summary"
                        checked={includeOptions.summary}
                        onCheckedChange={() => handleOptionChange("summary")}
                      />
                      <Label htmlFor="summary">Include Summary</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="riskAssessment"
                        checked={includeOptions.riskAssessment}
                        onCheckedChange={() =>
                          handleOptionChange("riskAssessment")
                        }
                      />
                      <Label htmlFor="riskAssessment">
                        Include Risk Assessment
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="modelExplanation"
                        checked={includeOptions.modelExplanation}
                        onCheckedChange={() =>
                          handleOptionChange("modelExplanation")
                        }
                      />
                      <Label htmlFor="modelExplanation">
                        Include Model Explanation
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="recommendations"
                        checked={includeOptions.recommendations}
                        onCheckedChange={() =>
                          handleOptionChange("recommendations")
                        }
                      />
                      <Label htmlFor="recommendations">
                        Include Recommendations
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="patientData"
                        checked={includeOptions.patientData}
                        onCheckedChange={() =>
                          handleOptionChange("patientData")
                        }
                      />
                      <Label htmlFor="patientData">Include Patient Data</Label>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card>
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Mail className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                    Email Report
                  </h2>

                  <form onSubmit={handleEmailSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="doctor@hospital.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600"
                      disabled={isEmailing}
                    >
                      {isEmailing ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />{" "}
                          Sending...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Mail className="h-4 w-4" /> Send Report
                        </span>
                      )}
                    </Button>
                  </form>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col gap-4"
            >
              <Button
                onClick={handleDownload}
                size="lg"
                className="bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600"
                disabled={isDownloading}
              >
                {isDownloading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" /> Generating
                    PDF...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Download className="h-5 w-5" /> Download PDF
                  </span>
                )}
              </Button>

              <Button variant="outline" size="lg" onClick={handlePrintPreview}>
                <span className="flex items-center gap-2">
                  <Eye className="h-5 w-5" /> Print Preview
                </span>
              </Button>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-2"
          >
            <Card className="overflow-hidden h-full">
              <Tabs defaultValue="preview" className="h-full flex flex-col">
                <div className="px-6 pt-6">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger
                      value="preview"
                      className="flex items-center gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      Preview
                    </TabsTrigger>
                    <TabsTrigger
                      value="code"
                      className="flex items-center gap-2"
                    >
                      <FileText className="h-4 w-4" />
                      Raw Data
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent
                  value="preview"
                  className="flex-1 p-6 overflow-auto"
                >
                  <div id="pdf-preview">
                    <PDFPreview />
                  </div>
                </TabsContent>

                <TabsContent value="code" className="flex-1 p-6 overflow-auto">
                  <div className="rounded-md bg-slate-950 p-4 overflow-auto">
                    <pre className="text-sm text-gray-300 font-mono">
                      {JSON.stringify(
                        predictionType === "manual" ? manualResult : csvResult,
                        null,
                        2
                      )}
                    </pre>
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
