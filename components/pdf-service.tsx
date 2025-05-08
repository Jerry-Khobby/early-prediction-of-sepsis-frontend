"use client"

import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"
import html2canvas from "html2canvas"

export interface PDFOptions {
  includeOptions: {
    summary: boolean
    riskAssessment: boolean
    modelExplanation: boolean
    recommendations: boolean
    patientData: boolean
  }
  patientData?: {
    id: string
    name: string
    age: number
    gender: string
    admissionDate: string
    department: string
  }
}

// Default patient data if none is provided
const defaultPatientData = {
  id: "P12345",
  name: "John Doe",
  age: 65,
  gender: "Male",
  admissionDate: "2024-05-08",
  department: "Emergency Medicine",
}

export const generatePDF = async (options: PDFOptions): Promise<Blob> => {
  const { includeOptions, patientData = defaultPatientData } = options

  // Create a new jsPDF instance
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  })

  // Set document properties
  doc.setProperties({
    title: `SepsisAI Report - ${patientData.name}`,
    subject: "Sepsis Prediction Report",
    author: "SepsisAI",
    creator: "SepsisAI Medical Dashboard",
  })

  // Add header
  addHeader(doc)

  // Current Y position tracker
  let yPos = 40

  // Add patient information if selected
  if (includeOptions.patientData) {
    yPos = addPatientInformation(doc, patientData, yPos)
  }

  // Add summary if selected
  if (includeOptions.summary) {
    yPos = addSummary(doc, yPos)
  }

  // Add risk assessment if selected
  if (includeOptions.riskAssessment) {
    yPos = addRiskAssessment(doc, yPos)
  }

  // Add model explanation if selected
  if (includeOptions.modelExplanation) {
    yPos = addModelExplanation(doc, yPos)
  }

  // Add recommendations if selected
  if (includeOptions.recommendations) {
    yPos = addRecommendations(doc, yPos)
  }

  // Add footer with page numbers
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(10)
    doc.setTextColor(100, 100, 100)
    doc.text(
      `Page ${i} of ${pageCount} | Generated: ${new Date().toLocaleDateString()}`,
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: "center" },
    )
  }

  // Add disclaimer on the last page
  doc.setPage(pageCount)
  addDisclaimer(doc)

  // Return the PDF as a blob
  return doc.output("blob")
}

// Helper function to add the header
function addHeader(doc: jsPDF): void {
  // Add logo/header background
  doc.setFillColor(21, 94, 99) // Teal color
  doc.rect(0, 0, doc.internal.pageSize.getWidth(), 25, "F")

  // Add title
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(18)
  doc.setFont("helvetica", "bold")
  doc.text("SepsisAI Report", 15, 15)

  // Add report ID and date
  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  doc.text(`Report ID: REP-${Math.floor(Math.random() * 10000)}`, doc.internal.pageSize.getWidth() - 15, 10, {
    align: "right",
  })
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, doc.internal.pageSize.getWidth() - 15, 15, {
    align: "right",
  })
}

// Helper function to add patient information
function addPatientInformation(doc: jsPDF, patientData: PDFOptions["patientData"], yPos: number): number {
  if (!patientData) return yPos

  doc.setTextColor(0, 0, 0)
  doc.setFontSize(14)
  doc.setFont("helvetica", "bold")
  doc.text("Patient Information", 15, yPos)

  yPos += 8

  // Create a table for patient information
  autoTable(doc, {
    startY: yPos,
    head: [["Patient ID", "Name", "Age", "Gender", "Admission Date", "Department"]],
    body: [
      [
        patientData.id,
        patientData.name,
        patientData.age.toString(),
        patientData.gender,
        patientData.admissionDate,
        patientData.department,
      ],
    ],
    theme: "grid",
    headStyles: {
      fillColor: [240, 240, 240],
      textColor: [50, 50, 50],
      fontStyle: "bold",
    },
    margin: { left: 15, right: 15 },
  })

  return doc.lastAutoTable?.finalY ? doc.lastAutoTable.finalY + 10 : yPos + 30
}

// Helper function to add summary
function addSummary(doc: jsPDF, yPos: number): number {
  // Check if we need to add a new page
  if (yPos > doc.internal.pageSize.getHeight() - 60) {
    doc.addPage()
    yPos = 20
  }

  doc.setTextColor(0, 0, 0)
  doc.setFontSize(14)
  doc.setFont("helvetica", "bold")
  doc.text("Summary", 15, yPos)

  yPos += 8

  doc.setFontSize(11)
  doc.setFont("helvetica", "normal")
  const summaryText =
    "The patient shows signs of early-stage sepsis, with elevated respiratory rate and low MAP over 4 hours. Based on the analysis of vital signs and laboratory results, the AI model predicts a high risk of sepsis development within the next 6 hours. Immediate intervention is recommended to prevent progression to septic shock."

  const textLines = doc.splitTextToSize(summaryText, doc.internal.pageSize.getWidth() - 30)
  doc.text(textLines, 15, yPos)

  return yPos + textLines.length * 6 + 10
}

// Helper function to add risk assessment
function addRiskAssessment(doc: jsPDF, yPos: number): number {
  // Check if we need to add a new page
  if (yPos > doc.internal.pageSize.getHeight() - 80) {
    doc.addPage()
    yPos = 20
  }

  doc.setTextColor(0, 0, 0)
  doc.setFontSize(14)
  doc.setFont("helvetica", "bold")
  doc.text("Risk Assessment", 15, yPos)

  yPos += 10

  // Risk score
  const riskScore = 0.78
  const riskLevel = riskScore >= 0.75 ? "High" : riskScore >= 0.5 ? "Moderate" : "Low"
  const riskColor = riskScore >= 0.75 ? [239, 68, 68] : riskScore >= 0.5 ? [245, 158, 11] : [16, 185, 129]

  doc.setFontSize(12)
  doc.setFont("helvetica", "normal")
  doc.text(`Risk Score: ${Math.round(riskScore * 100)}%`, 15, yPos)

  yPos += 6

  doc.setTextColor(riskColor[0], riskColor[1], riskColor[2])
  doc.setFont("helvetica", "bold")
  doc.text(`Risk Level: ${riskLevel}`, 15, yPos)

  yPos += 10

  // Key risk indicators
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(12)
  doc.setFont("helvetica", "bold")
  doc.text("Key Risk Indicators:", 15, yPos)

  yPos += 6

  doc.setFontSize(11)
  doc.setFont("helvetica", "normal")
  const indicators = [
    "Elevated respiratory rate (24 breaths/min)",
    "Low mean arterial pressure (65 mmHg)",
    "Elevated heart rate (110 bpm)",
    "Elevated temperature (38.5°C)",
  ]

  indicators.forEach((indicator) => {
    doc.text(`• ${indicator}`, 20, yPos)
    yPos += 6
  })

  return yPos + 10
}

// Helper function to add model explanation
function addModelExplanation(doc: jsPDF, yPos: number): number {
  // Check if we need to add a new page
  if (yPos > doc.internal.pageSize.getHeight() - 100) {
    doc.addPage()
    yPos = 20
  }

  doc.setTextColor(0, 0, 0)
  doc.setFontSize(14)
  doc.setFont("helvetica", "bold")
  doc.text("Model Explanation", 15, yPos)

  yPos += 10

  // Feature importance
  const features = [
    { name: "Respiratory Rate", value: 0.85 },
    { name: "Mean Arterial Pressure", value: 0.72 },
    { name: "Heart Rate", value: 0.65 },
    { name: "Temperature", value: 0.58 },
    { name: "O2 Saturation", value: 0.45 },
  ]

  features.forEach((feature) => {
    doc.setFontSize(11)
    doc.setFont("helvetica", "normal")
    doc.text(`${feature.name}: ${Math.round(feature.value * 100)}%`, 15, yPos)

    // Draw bar background
    doc.setFillColor(220, 220, 220)
    doc.rect(100, yPos - 4, 80, 5, "F")

    // Draw feature importance bar
    doc.setFillColor(21, 94, 99) // Teal color
    doc.rect(100, yPos - 4, 80 * feature.value, 5, "F")

    yPos += 8
  })

  yPos += 5

  doc.setFontSize(11)
  doc.setFont("helvetica", "normal")
  const explanationText =
    "The model identified elevated respiratory rate and decreased mean arterial pressure as the strongest indicators of sepsis risk. These vital signs showed significant deviation from normal ranges over the past 4 hours."

  const textLines = doc.splitTextToSize(explanationText, doc.internal.pageSize.getWidth() - 30)
  doc.text(textLines, 15, yPos)

  return yPos + textLines.length * 6 + 10
}

// Helper function to add recommendations
function addRecommendations(doc: jsPDF, yPos: number): number {
  // Check if we need to add a new page
  if (yPos > doc.internal.pageSize.getHeight() - 100) {
    doc.addPage()
    yPos = 20
  }

  doc.setTextColor(0, 0, 0)
  doc.setFontSize(14)
  doc.setFont("helvetica", "bold")
  doc.text("Recommendations", 15, yPos)

  yPos += 10

  // Suggested actions
  doc.setFontSize(12)
  doc.setFont("helvetica", "bold")
  doc.text("Suggested Actions:", 15, yPos)

  yPos += 6

  doc.setFontSize(11)
  doc.setFont("helvetica", "normal")
  const actions = ["Fluid resuscitation", "Monitor WBC trend", "Blood cultures", "Hourly vital sign monitoring"]

  actions.forEach((action) => {
    doc.text(`• ${action}`, 20, yPos)
    yPos += 6
  })

  yPos += 5

  // Possible medications
  doc.setFontSize(12)
  doc.setFont("helvetica", "bold")
  doc.text("Possible Medications:", 15, yPos)

  yPos += 6

  doc.setFontSize(11)
  doc.setFont("helvetica", "normal")
  const medications = [
    "Piperacillin-tazobactam",
    "Vancomycin (if MRSA risk)",
    "Consider vasopressors if MAP remains low after fluid resuscitation",
  ]

  medications.forEach((medication) => {
    doc.text(`• ${medication}`, 20, yPos)
    yPos += 6
  })

  return yPos + 10
}

// Helper function to add disclaimer
function addDisclaimer(doc: jsPDF): void {
  const yPos = doc.internal.pageSize.getHeight() - 40

  // Add disclaimer box
  doc.setFillColor(253, 242, 242) // Light red background
  doc.rect(15, yPos - 5, doc.internal.pageSize.getWidth() - 30, 25, "F")

  // Add disclaimer text
  doc.setTextColor(185, 28, 28) // Red text
  doc.setFontSize(12)
  doc.setFont("helvetica", "bold")
  doc.text("Medical Disclaimer", 20, yPos)

  doc.setTextColor(100, 100, 100)
  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  const disclaimerText =
    "This report is generated by an AI system and is intended for informational purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of a qualified healthcare provider with any questions regarding a medical condition."

  const textLines = doc.splitTextToSize(disclaimerText, doc.internal.pageSize.getWidth() - 40)
  doc.text(textLines, 20, yPos + 5)
}

// Function to capture a specific element as an image and add it to the PDF
export const captureElementForPDF = async (
  elementId: string,
  doc: jsPDF,
  x: number,
  y: number,
  width: number,
  height: number,
): Promise<void> => {
  const element = document.getElementById(elementId)
  if (!element) return

  const canvas = await html2canvas(element, {
    scale: 2, // Higher scale for better quality
    useCORS: true,
    logging: false,
  })

  const imgData = canvas.toDataURL("image/png")
  doc.addImage(imgData, "PNG", x, y, width, height)
}

// Function to download the PDF
export const downloadPDF = async (options: PDFOptions, filename = "sepsis-report.pdf"): Promise<void> => {
  try {
    const pdfBlob = await generatePDF(options)

    // Create a URL for the Blob
    const url = URL.createObjectURL(pdfBlob)

    // Create a link element
    const link = document.createElement("a")
    link.href = url
    link.download = filename

    // Append to the document
    document.body.appendChild(link)

    // Trigger the download
    link.click()

    // Clean up
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error("Error downloading PDF:", error)
    throw error
  }
}

// Function to email the PDF
export const emailPDF = async (options: PDFOptions, email: string): Promise<boolean> => {
  try {
    // Generate the PDF
    const pdfBlob = await generatePDF(options)

    // In a real application, you would upload this blob to your server
    // and send it as an attachment via email API or service

    // For now, we'll simulate a successful email send
    console.log(`PDF would be sent to ${email} in a real application`)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return true
  } catch (error) {
    console.error("Error emailing PDF:", error)
    throw error
  }
}
