"use client";

import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { BASE_API_URL } from "@/lib/constant";

// Define types for our report system
export type RiskAssessment = {
  score: number;
  level: string;
  interpretation: string;
  detailed_analysis: string;
  time_frame?: string;
};

export type RiskFactor = {
  feature: string;
  value: number;
  description?: string;
};

export type ClinicalGuidance = {
  monitoring?: string[];
  diagnostic_tests?: string[];
  treatment_options?: {
    immediate_medications?: string[];
    antibiotic_choices?: {
      community_acquired?: string[];
      hospital_acquired?: string[];
      penicillin_allergy?: string[];
    };
  };
  required_actions?: string[];
};

export type ReportData = {
  reportType: string;
  reportId: string;
  generatedDate: string;
  risk_assessment?: RiskAssessment;
  key_risk_factors?: RiskFactor[];
  clinical_guidance?: ClinicalGuidance;
  safety_alerts?: string[];
  patient_info?: Record<string, any>;
  custom_sections?: {
    title: string;
    content: string | string[];
    type: "text" | "list" | "keyValue";
  }[];
};

export interface PDFOptions {
  reportType: string;
  includeOptions: {
    summary?: boolean;
    riskAssessment?: boolean;
    modelExplanation?: boolean;
    recommendations?: boolean;
    patientData?: boolean;
    customSections?: string[]; // IDs of custom sections to include
  };
  style?: {
    primaryColor?: [number, number, number]; // RGB
    secondaryColor?: [number, number, number]; // RGB
    font?: "helvetica" | "times" | "courier";
  };
}

export const generatePDF = async (
  reportData: ReportData,
  options: PDFOptions
): Promise<Blob> => {
  const { includeOptions, style } = options;
  const primaryColor = style?.primaryColor || [21, 94, 99]; // Default teal
  const secondaryColor = style?.secondaryColor || [13, 71, 75]; // Darker teal
  const font = style?.font || "helvetica";

  // Create a new jsPDF instance
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // Set document properties
  doc.setProperties({
    title: `${reportData.reportType} Report`,
    subject: `${reportData.reportType} Analysis Report`,
    author: "MedicalAI",
    creator: "MedicalAI Dashboard",
  });

  // Add header with dynamic title
  addHeader(
    doc,
    reportData.reportType,
    reportData.reportId,
    reportData.generatedDate,
    primaryColor,
    secondaryColor,
    font
  );

  // Current Y position tracker
  let yPos = 40;

  // Add patient information if available and selected
  if (reportData.patient_info && includeOptions.patientData) {
    yPos = addPatientInfo(doc, reportData.patient_info, yPos, font);
  }

  // Add summary if selected and available
  if (includeOptions.summary && reportData.risk_assessment) {
    yPos = addSummary(doc, reportData.risk_assessment, yPos, font);
  }

  // Add risk assessment if selected and available
  if (
    includeOptions.riskAssessment &&
    reportData.risk_assessment &&
    reportData.key_risk_factors
  ) {
    yPos = addRiskAssessment(
      doc,
      reportData.risk_assessment,
      reportData.key_risk_factors,
      yPos,
      primaryColor,
      font
    );
  }

  // Add model explanation if selected and available
  if (includeOptions.modelExplanation && reportData.key_risk_factors) {
    yPos = addModelExplanation(
      doc,
      reportData.key_risk_factors,
      yPos,
      primaryColor,
      font
    );
  }

  // Add recommendations if selected and available
  if (includeOptions.recommendations && reportData.clinical_guidance) {
    yPos = addRecommendations(doc, reportData.clinical_guidance, yPos, font);
  }

  // Add safety alerts if available
  if (reportData.safety_alerts) {
    yPos = addSafetyAlerts(doc, reportData.safety_alerts, yPos, font);
  }

  // Add custom sections if specified
  if (includeOptions.customSections && reportData.custom_sections) {
    for (const sectionId of includeOptions.customSections) {
      const section = reportData.custom_sections.find(
        (s) => s.title === sectionId
      );
      if (section) {
        yPos = addCustomSection(doc, section, yPos, font);
      }
    }
  }

  // Add footer with page numbers
  addFooter(doc, reportData.generatedDate, font);

  // Add disclaimer on the last page
  addDisclaimer(doc, font);

  // Return the PDF as a blob
  return doc.output("blob");
};

// Helper function to add the header
function addHeader(
  doc: jsPDF,
  reportType: string,
  reportId: string,
  generatedDate: string,
  primaryColor: [number, number, number],
  secondaryColor: [number, number, number],
  font: string
): void {
  // Add header background
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, doc.internal.pageSize.getWidth(), 25, "F");

  // Add title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont(font, "bold");
  doc.text(`${reportType} Report`, 15, 15);

  // Add report ID and date
  doc.setFontSize(10);
  doc.setFont(font, "normal");
  doc.text(
    `Report ID: ${reportId}`,
    doc.internal.pageSize.getWidth() - 15,
    10,
    {
      align: "right",
    }
  );
  doc.text(
    `Generated: ${generatedDate}`,
    doc.internal.pageSize.getWidth() - 15,
    15,
    {
      align: "right",
    }
  );
}

// Helper function to add patient information
function addPatientInfo(
  doc: jsPDF,
  patientInfo: Record<string, any>,
  yPos: number,
  font: string
): number {
  if (yPos > doc.internal.pageSize.getHeight() - 60) {
    doc.addPage();
    yPos = 20;
  }

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(14);
  doc.setFont(font, "bold");
  doc.text("Patient Information", 15, yPos);

  yPos += 8;

  doc.setFontSize(11);
  doc.setFont(font, "normal");

  const patientData = Object.entries(patientInfo).map(([key, value]) => {
    const formattedKey = key
      .replace(/_/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());
    return `${formattedKey}: ${value}`;
  });

  patientData.forEach((info) => {
    doc.text(info, 15, yPos);
    yPos += 6;
  });

  return yPos + 10;
}

// Helper function to add summary
function addSummary(
  doc: jsPDF,
  riskAssessment: RiskAssessment,
  yPos: number,
  font: string
): number {
  if (yPos > doc.internal.pageSize.getHeight() - 60) {
    doc.addPage();
    yPos = 20;
  }

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(14);
  doc.setFont(font, "bold");
  doc.text("Summary", 15, yPos);

  yPos += 8;

  doc.setFontSize(11);
  doc.setFont(font, "normal");

  let summaryText = "";
  if (riskAssessment.interpretation) {
    summaryText += `${riskAssessment.interpretation}. `;
  }
  if (riskAssessment.detailed_analysis) {
    summaryText += `${riskAssessment.detailed_analysis} `;
  }
  if (riskAssessment.time_frame) {
    summaryText += `(Time frame: ${riskAssessment.time_frame})`;
  }

  if (!summaryText.trim()) {
    summaryText = "No summary available for this report.";
  }

  const textLines = doc.splitTextToSize(
    summaryText,
    doc.internal.pageSize.getWidth() - 30
  );
  doc.text(textLines, 15, yPos);

  return yPos + textLines.length * 6 + 10;
}

// Helper function to add risk assessment
function addRiskAssessment(
  doc: jsPDF,
  riskAssessment: RiskAssessment,
  riskFactors: RiskFactor[],
  yPos: number,
  primaryColor: [number, number, number],
  font: string
): number {
  if (yPos > doc.internal.pageSize.getHeight() - 80) {
    doc.addPage();
    yPos = 20;
  }

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(14);
  doc.setFont(font, "bold");
  doc.text("Risk Assessment", 15, yPos);

  yPos += 10;

  // Risk score visualization
  const riskScore = riskAssessment.score;
  const riskLevel =
    riskAssessment.level ||
    (riskScore >= 0.75 ? "High" : riskScore >= 0.5 ? "Moderate" : "Low");
  const riskColor =
    riskScore >= 0.75
      ? [239, 68, 68]
      : riskScore >= 0.5
      ? [245, 158, 11]
      : [16, 185, 129];

  doc.setFontSize(12);
  doc.setFont(font, "normal");
  doc.text(`Risk Score: ${Math.round(riskScore * 100)}%`, 15, yPos);

  yPos += 6;

  doc.setTextColor(riskColor[0], riskColor[1], riskColor[2]);
  doc.setFont(font, "bold");
  doc.text(`Risk Level: ${riskLevel}`, 15, yPos);

  yPos += 10;

  // Key risk indicators
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);
  doc.setFont(font, "bold");
  doc.text("Key Risk Indicators:", 15, yPos);

  yPos += 6;

  doc.setFontSize(11);
  doc.setFont(font, "normal");

  // Sort by absolute value to show most important factors first
  const sortedFactors = [...riskFactors].sort(
    (a, b) => Math.abs(b.value) - Math.abs(a.value)
  );

  sortedFactors.forEach((factor) => {
    const description = factor.description || factor.feature;
    doc.text(`• ${description}`, 20, yPos);
    yPos += 6;
  });

  return yPos + 10;
}

// Helper function to add model explanation
function addModelExplanation(
  doc: jsPDF,
  riskFactors: RiskFactor[],
  yPos: number,
  primaryColor: [number, number, number],
  font: string
): number {
  if (yPos > doc.internal.pageSize.getHeight() - 100) {
    doc.addPage();
    yPos = 20;
  }

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(14);
  doc.setFont(font, "bold");
  doc.text("Model Explanation", 15, yPos);

  yPos += 10;

  // Feature importance visualization
  const sortedFeatures = [...riskFactors]
    .sort((a, b) => Math.abs(b.value) - Math.abs(a.value))
    .slice(0, 10); // Limit to top 10 features

  if (sortedFeatures.length === 0) {
    doc.setFontSize(11);
    doc.setFont(font, "normal");
    doc.text("No feature importance data available.", 15, yPos);
    return yPos + 10;
  }

  const maxValue = Math.max(...sortedFeatures.map((f) => Math.abs(f.value)));

  sortedFeatures.forEach((feature, index) => {
    const percentage = Math.abs(feature.value) * 10;

    doc.setFontSize(11);
    doc.setFont(font, "normal");
    doc.text(`${feature.feature}: ${percentage.toFixed(1)}%`, 15, yPos);

    // Draw bar background
    doc.setFillColor(220, 220, 220);
    doc.rect(100, yPos - 4, 80, 5, "F");

    // Draw feature importance bar with primary color
    doc.setFillColor(...primaryColor);
    doc.rect(100, yPos - 4, 80 * (percentage / 100), 5, "F");

    yPos += 8;
  });

  return yPos + 10;
}

// Helper function to add recommendations
function addRecommendations(
  doc: jsPDF,
  clinicalGuidance: ClinicalGuidance,
  yPos: number,
  font: string
): number {
  if (yPos > doc.internal.pageSize.getHeight() - 100) {
    doc.addPage();
    yPos = 20;
  }

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(14);
  doc.setFont(font, "bold");
  doc.text("Clinical Guidance", 15, yPos);

  yPos += 10;

  // Monitoring recommendations
  if (clinicalGuidance.monitoring && clinicalGuidance.monitoring.length > 0) {
    doc.setFontSize(12);
    doc.setFont(font, "bold");
    doc.text("Monitoring:", 15, yPos);
    yPos += 6;

    doc.setFontSize(11);
    doc.setFont(font, "normal");
    clinicalGuidance.monitoring.forEach((item) => {
      doc.text(`• ${item}`, 20, yPos);
      yPos += 6;
    });
    yPos += 5;
  }

  // Diagnostic tests
  if (
    clinicalGuidance.diagnostic_tests &&
    clinicalGuidance.diagnostic_tests.length > 0
  ) {
    doc.setFontSize(12);
    doc.setFont(font, "bold");
    doc.text("Diagnostic Tests:", 15, yPos);
    yPos += 6;

    doc.setFontSize(11);
    doc.setFont(font, "normal");
    clinicalGuidance.diagnostic_tests.forEach((test) => {
      doc.text(`• ${test}`, 20, yPos);
      yPos += 6;
    });
    yPos += 5;
  }

  // Treatment options
  if (clinicalGuidance.treatment_options) {
    const { immediate_medications, antibiotic_choices } =
      clinicalGuidance.treatment_options;

    if (immediate_medications && immediate_medications.length > 0) {
      doc.setFontSize(12);
      doc.setFont(font, "bold");
      doc.text("Immediate Medications:", 15, yPos);
      yPos += 6;

      doc.setFontSize(11);
      doc.setFont(font, "normal");
      immediate_medications.forEach((med) => {
        doc.text(`• ${med}`, 20, yPos);
        yPos += 6;
      });
      yPos += 5;
    }

    if (antibiotic_choices) {
      doc.setFontSize(12);
      doc.setFont(font, "bold");
      doc.text("Antibiotic Choices:", 15, yPos);
      yPos += 8;

      doc.setFontSize(11);
      doc.setFont(font, "normal");

      if (
        antibiotic_choices.community_acquired &&
        antibiotic_choices.community_acquired.length > 0
      ) {
        doc.setFont(font, "bold");
        doc.text("Community Acquired:", 20, yPos);
        yPos += 6;

        doc.setFont(font, "normal");
        antibiotic_choices.community_acquired.forEach((abx) => {
          doc.text(`• ${abx}`, 25, yPos);
          yPos += 6;
        });
        yPos += 5;
      }

      if (
        antibiotic_choices.hospital_acquired &&
        antibiotic_choices.hospital_acquired.length > 0
      ) {
        doc.setFont(font, "bold");
        doc.text("Hospital Acquired:", 20, yPos);
        yPos += 6;

        doc.setFont(font, "normal");
        antibiotic_choices.hospital_acquired.forEach((abx) => {
          doc.text(`• ${abx}`, 25, yPos);
          yPos += 6;
        });
        yPos += 5;
      }

      if (
        antibiotic_choices.penicillin_allergy &&
        antibiotic_choices.penicillin_allergy.length > 0
      ) {
        doc.setFont(font, "bold");
        doc.text("Penicillin Allergy:", 20, yPos);
        yPos += 6;

        doc.setFont(font, "normal");
        antibiotic_choices.penicillin_allergy.forEach((abx) => {
          doc.text(`• ${abx}`, 25, yPos);
          yPos += 6;
        });
        yPos += 5;
      }
    }
  }

  // Required actions
  if (
    clinicalGuidance.required_actions &&
    clinicalGuidance.required_actions.length > 0
  ) {
    doc.setFontSize(12);
    doc.setFont(font, "bold");
    doc.text("Required Actions:", 15, yPos);
    yPos += 6;

    doc.setFontSize(11);
    doc.setFont(font, "normal");
    clinicalGuidance.required_actions.forEach((action) => {
      doc.text(`• ${action}`, 20, yPos);
      yPos += 6;
    });
  }

  return yPos + 10;
}

// Helper function to add safety alerts
function addSafetyAlerts(
  doc: jsPDF,
  safetyAlerts: string[],
  yPos: number,
  font: string
): number {
  if (yPos > doc.internal.pageSize.getHeight() - 60) {
    doc.addPage();
    yPos = 20;
  }

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(14);
  doc.setFont(font, "bold");
  doc.text("Safety Alerts", 15, yPos);

  yPos += 8;

  doc.setFontSize(11);
  doc.setFont(font, "normal");

  if (safetyAlerts.length === 0) {
    doc.text("No safety alerts identified.", 15, yPos);
    return yPos + 10;
  }

  safetyAlerts.forEach((alert, index) => {
    // Highlight important alerts with red color
    if (
      alert.toLowerCase().includes("critical") ||
      alert.toLowerCase().includes("urgent")
    ) {
      doc.setTextColor(239, 68, 68); // Red
    } else {
      doc.setTextColor(0, 0, 0); // Black
    }

    const alertText = index === 0 ? `• ${alert}` : `  ${alert}`;
    const textLines = doc.splitTextToSize(
      alertText,
      doc.internal.pageSize.getWidth() - 30
    );
    doc.text(textLines, 15, yPos);
    yPos += textLines.length * 6;
  });

  doc.setTextColor(0, 0, 0); // Reset to black
  return yPos + 10;
}

// Helper function to add custom sections
function addCustomSection(
  doc: jsPDF,
  section: {
    title: string;
    content: string | string[];
    type: "text" | "list" | "keyValue";
  },
  yPos: number,
  font: string
): number {
  if (yPos > doc.internal.pageSize.getHeight() - 60) {
    doc.addPage();
    yPos = 20;
  }

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(14);
  doc.setFont(font, "bold");
  doc.text(section.title, 15, yPos);

  yPos += 8;

  doc.setFontSize(11);
  doc.setFont(font, "normal");

  if (section.type === "text") {
    const content =
      typeof section.content === "string"
        ? section.content
        : section.content.join("\n");
    const textLines = doc.splitTextToSize(
      content,
      doc.internal.pageSize.getWidth() - 30
    );
    doc.text(textLines, 15, yPos);
    yPos += textLines.length * 6;
  } else if (section.type === "list") {
    const items =
      typeof section.content === "string" ? [section.content] : section.content;
    items.forEach((item) => {
      doc.text(`• ${item}`, 20, yPos);
      yPos += 6;
    });
  } else if (section.type === "keyValue") {
    const content =
      typeof section.content === "string" ? [section.content] : section.content;
    content.forEach((line) => {
      const [key, value] = line.split(":");
      if (key && value) {
        doc.setFont(font, "bold");
        doc.text(`${key}:`, 15, yPos);
        doc.setFont(font, "normal");
        doc.text(
          value.trim(),
          15 + doc.getStringUnitWidth(`${key}: `) * 4,
          yPos
        );
        yPos += 6;
      } else {
        doc.text(line, 15, yPos);
        yPos += 6;
      }
    });
  }

  return yPos + 10;
}

// Helper function to add footer
function addFooter(doc: jsPDF, generatedDate: string, font: string): void {
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(
      `Page ${i} of ${pageCount} | Generated: ${generatedDate}`,
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: "center" }
    );
  }
}

// Helper function to add disclaimer
function addDisclaimer(doc: jsPDF, font: string): void {
  doc.setPage(doc.getNumberOfPages());
  const yPos = doc.internal.pageSize.getHeight() - 40;

  // Add disclaimer box
  doc.setFillColor(253, 242, 242); // Light red background
  doc.rect(15, yPos - 5, doc.internal.pageSize.getWidth() - 30, 25, "F");

  // Add disclaimer text
  doc.setTextColor(185, 28, 28); // Red text
  doc.setFontSize(12);
  doc.setFont(font, "bold");
  doc.text("Medical Disclaimer", 20, yPos);

  doc.setTextColor(100, 100, 100);
  doc.setFontSize(10);
  doc.setFont(font, "normal");
  const disclaimerText =
    "This report is generated by an AI system and is intended for informational purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of a qualified healthcare provider with any questions regarding a medical condition.";

  const textLines = doc.splitTextToSize(
    disclaimerText,
    doc.internal.pageSize.getWidth() - 40
  );
  doc.text(textLines, 20, yPos + 5);
}

// Function to capture a specific element as an image and add it to the PDF
export const captureElementForPDF = async (
  elementId: string,
  doc: jsPDF,
  x: number,
  y: number,
  width: number,
  height: number
): Promise<void> => {
  const element = document.getElementById(elementId);
  if (!element) return;

  const canvas = await html2canvas(element, {
    scale: 2, // Higher scale for better quality
    useCORS: true,
    logging: false,
  });

  const imgData = canvas.toDataURL("image/png");
  doc.addImage(imgData, "PNG", x, y, width, height);
};

// Function to download the PDF
export const downloadPDF = async (
  reportData: ReportData,
  options: PDFOptions,
  filename = "medical-report.pdf"
): Promise<void> => {
  try {
    const pdfBlob = await generatePDF(reportData, options);
    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error downloading PDF:", error);
    throw error;
  }
};

// Function to email the PDF
export const emailPDF = async (
  reportData: ReportData,
  options: PDFOptions,
  email: string
): Promise<boolean> => {
  try {
    const pdfBlob = await generatePDF(reportData, options);
    const pdfBase64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(",")[1]; // ✅ extract actual base64
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(pdfBlob);
    });

    const response = await fetch(`${BASE_API_URL}/api/v1/send-report`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        pdf_base64: pdfBase64,
        report_name: reportData.reportType,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        typeof errorData.detail === "string"
          ? errorData.detail
          : JSON.stringify(errorData.detail) || "Failed to send email"
      );
    }
    return true;
  } catch (error) {
    console.error("Error emailing PDF:", error);
    throw error;
  }
};

// Utility function to prepare report data
export const prepareReportData = (
  data: any,
  reportType: string
): ReportData => {
  return {
    reportType,
    reportId: `REP-${Math.floor(Math.random() * 10000)}`,
    generatedDate: new Date().toLocaleDateString(),
    ...data,
  };
};
