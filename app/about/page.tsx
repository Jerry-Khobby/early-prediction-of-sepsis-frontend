"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Database,
  FileBarChart,
  GitBranch,
  GraduationCap,
  BarChart3,
  Users,
  Layers,
  Download,
  ExternalLink,
} from "lucide-react";
import { motion } from "framer-motion";
import { ModelArchitecture } from "@/components/model-architecture";
import { ModelMetrics } from "@/components/model-metrics";
import { DatasetInfo } from "@/components/dataset-info";

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            About Sepsis Prediction System
          </h1>
          <p className="text-muted-foreground dark:text-gray-400 max-w-3xl">
            Learn about our LSTM-based sepsis prediction model and the PhysioNet
            2019 dataset.
          </p>
        </div>

        <Tabs
          defaultValue="overview"
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2 bg-muted/50 p-1 rounded-lg h-20 md:h-10">
            <TabsTrigger
              value="overview"
              className="flex items-center gap-2 data-[state=active]:bg-background"
            >
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger
              value="dataset"
              className="flex items-center gap-2 data-[state=active]:bg-background"
            >
              <Database className="h-4 w-4" />
              <span className="hidden sm:inline">Dataset</span>
            </TabsTrigger>
            <TabsTrigger
              value="model"
              className="flex items-center gap-2 data-[state=active]:bg-background"
            >
              <Layers className="h-4 w-4" />
              <span className="hidden sm:inline">Model</span>
            </TabsTrigger>
            <TabsTrigger
              value="team"
              className="flex items-center gap-2 data-[state=active]:bg-background"
            >
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Team</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300"
                    >
                      Research Project
                    </Badge>
                    <Badge
                      variant="outline"
                      className="bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                    >
                      v1.0.0
                    </Badge>
                  </div>

                  <h2 className="text-2xl font-bold">
                    Sepsis Prediction using Clinical Data
                  </h2>

                  <p className="text-muted-foreground dark:text-gray-300">
                    This project implements an LSTM-based sepsis prediction
                    model using data from the PhysioNet Computing in Cardiology
                    Challenge 2019. The model analyzes 10 hours of clinical data
                    to predict sepsis onset within the next hour, achieving an
                    AUC of 0.76 on the test set.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                    <div className="flex flex-col gap-1.5">
                      <span className="text-sm font-medium text-muted-foreground">
                        Model Type
                      </span>
                      <span className="font-medium">LSTM Neural Network</span>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <span className="text-sm font-medium text-muted-foreground">
                        Performance (AUC)
                      </span>
                      <span className="font-medium">0.76 (Test Set)</span>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <span className="text-sm font-medium text-muted-foreground">
                        Data Source
                      </span>
                      <span className="font-medium">PhysioNet 2019</span>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Key Features</h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 list-disc pl-5">
                      <li>10-hour sliding window analysis of clinical data</li>
                      <li>
                        Handles missing data with backfilling and median
                        imputation
                      </li>
                      <li>
                        Bidirectional LSTM architecture with 100-75 unit layers
                      </li>
                      <li>Custom masking layer for NaN value handling</li>
                      <li>
                        Addresses class imbalance with weighted loss function
                      </li>
                      <li>Early stopping and model checkpointing</li>
                    </ul>
                  </div>

                  <div className="flex flex-wrap gap-3 pt-4">
                    <Button
                      variant="outline"
                      className="gap-2 border-teal-600 text-teal-600 hover:bg-teal-50 dark:border-teal-400 dark:text-teal-400 dark:hover:bg-teal-950/50"
                      onClick={() =>
                        window.open(
                          "https://physionet.org/content/challenge-2019/1.0.0/",
                          "_blank"
                        )
                      }
                    >
                      <ExternalLink className="h-4 w-4" />
                      PhysioNet Dataset
                    </Button>
                    <Button
                      variant="outline"
                      className="gap-2 border-teal-600 text-teal-600 hover:bg-teal-50 dark:border-teal-400 dark:text-teal-400 dark:hover:bg-teal-950/50"
                    >
                      <GitBranch className="h-4 w-4" />
                      View Code
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">
                  Technical Implementation
                </h3>
                <div className="space-y-4">
                  <p className="text-muted-foreground dark:text-gray-300">
                    The model processes 40 clinical variables from the PhysioNet
                    dataset, including vital signs (HR, MAP, O2Sat) and
                    laboratory values (WBC, Creatinine). Time-series data is
                    processed through bidirectional LSTM layers, while sparse
                    features are handled with median imputation and masking.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                    <div className="bg-teal-50 dark:bg-teal-900/20 p-4 rounded-lg">
                      <div className="text-3xl font-bold text-teal-600 dark:text-teal-400 mb-1">
                        40
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Clinical variables analyzed
                      </div>
                    </div>
                    <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg">
                      <div className="text-3xl font-bold text-amber-600 dark:text-amber-400 mb-1">
                        10h
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Time window for prediction
                      </div>
                    </div>
                    <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg">
                      <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-1">
                        40k
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Patient records processed
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <h4 className="font-medium mb-2">
                      Data Processing Pipeline
                    </h4>
                    <ol className="list-decimal pl-5 space-y-2 text-sm text-gray-600 dark:text-gray-300">
                      <li>Load and merge PSV files into Pandas DataFrames</li>
                      <li>
                        Redefine sepsis labels for 1-hour prediction horizon
                      </li>
                      <li>Create 10-hour sliding windows with 1-hour stride</li>
                      <li>Backfill missing values for continuous variables</li>
                      <li>Calculate median values for sparse variables</li>
                      <li>
                        Standardize features using training set statistics
                      </li>
                    </ol>
                  </div>
                </div>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Dataset Tab */}
          <TabsContent value="dataset" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="p-6">
                <div className="flex items-start justify-between flex-wrap gap-4">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">
                      PhysioNet 2019 Dataset
                    </h2>
                    <p className="text-muted-foreground dark:text-gray-300 max-w-3xl">
                      The dataset consists of hourly clinical measurements from
                      ICU patients, stored in PSV files with 40 variables
                      including demographics, vital signs, and laboratory
                      values.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    className="gap-2 border-teal-600 text-teal-600 hover:bg-teal-50 dark:border-teal-400 dark:text-teal-400 dark:hover:bg-teal-950/50"
                    onClick={() =>
                      window.open(
                        "https://physionet.org/content/challenge-2019/1.0.0/",
                        "_blank"
                      )
                    }
                  >
                    <ExternalLink className="h-4 w-4" />
                    Access Dataset
                  </Button>
                </div>

                <Separator className="my-6" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">
                      Dataset Composition
                    </h3>
                    <DatasetInfo />

                    <div className="mt-6">
                      <h4 className="font-medium mb-2">Key Statistics</h4>
                      <ul className="space-y-2">
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">
                            Total patients:
                          </span>
                          <span className="font-medium">40,336</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">
                            Sepsis cases:
                          </span>
                          <span className="font-medium">2,932 (7.3%)</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">
                            Non-sepsis cases:
                          </span>
                          <span className="font-medium">37,404 (92.7%)</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">
                            Time resolution:
                          </span>
                          <span className="font-medium">
                            Hourly measurements
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">
                      Data Characteristics
                    </h3>
                    <p className="text-muted-foreground dark:text-gray-300">
                      The dataset exhibits significant sparsity in laboratory
                      measurements, while vital signs are more consistently
                      recorded. Missing data is handled differently based on
                      measurement frequency.
                    </p>

                    <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                      <h4 className="font-medium flex items-center gap-2 text-amber-700 dark:text-amber-400">
                        <FileBarChart className="h-4 w-4" />
                        Missing Data Handling
                      </h4>
                      <ul className="mt-2 space-y-1 text-sm text-gray-700 dark:text-gray-300">
                        <li>
                          • Continuous variables (HR, MAP, O2Sat, SBP, Resp):
                          Backfilled
                        </li>
                        <li>
                          • Sparse variables: Median of window (NaN if all
                          missing)
                        </li>
                        <li>• Demographic variables: No missing data</li>
                      </ul>
                    </div>

                    <div className="mt-4 p-4 bg-teal-50 dark:bg-teal-900/20 rounded-lg">
                      <h4 className="font-medium flex items-center gap-2 text-teal-700 dark:text-teal-400">
                        <BarChart3 className="h-4 w-4" />
                        Label Definition
                      </h4>
                      <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                        Original labels mark sepsis onset 6 hours in advance. We
                        modified this to predict sepsis 1 hour before onset by
                        setting the first six positive labels to 0 for each
                        patient.
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Model Tab */}
          <TabsContent value="model" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-2">Model Architecture</h2>
                <p className="text-muted-foreground dark:text-gray-300 max-w-3xl mb-6">
                  Our hybrid architecture combines LSTM networks for time-series
                  data with dense networks for static features, merged through
                  an additive layer.
                </p>

                <div className="mb-8">
                  <ModelArchitecture />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Model Components</h3>

                    <div className="space-y-4">
                      <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700">
                        <h4 className="font-medium mb-2">
                          Time-Series Pathway
                        </h4>
                        <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
                          <li>• Input shape: (10, n_time_series_features)</li>
                          <li>
                            • Bidirectional LSTM (100 units,
                            return_sequences=True)
                          </li>
                          <li>• Bidirectional LSTM (75 units)</li>
                          <li>
                            • Dense layers (35 and 15 units) with ReLU
                            activation
                          </li>
                          <li>• Batch normalization after each dense layer</li>
                          <li>• L2 regularization (λ=0.001) on all layers</li>
                        </ul>
                      </div>

                      <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700">
                        <h4 className="font-medium mb-2">
                          Static Features Pathway
                        </h4>
                        <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
                          <li>• Input shape: (n_static_features,)</li>
                          <li>
                            • Masking layer (mask_value=π) for NaN handling
                          </li>
                          <li>
                            • Dense layers (30 and 15 units) with ReLU
                            activation
                          </li>
                          <li>• Batch normalization after each dense layer</li>
                          <li>• L2 regularization (λ=0.001) on all layers</li>
                        </ul>
                      </div>

                      <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700">
                        <h4 className="font-medium mb-2">Output Layer</h4>
                        <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
                          <li>• Additive merge of both pathways</li>
                          <li>
                            • Final dense layer (2 units) with softmax
                            activation
                          </li>
                          <li>• Categorical cross-entropy loss</li>
                          <li>• Adam optimizer</li>
                          <li>
                            • Class weights to handle imbalance (1:53 ratio)
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Training Details</h3>
                    <ModelMetrics />

                    <div className="mt-6 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                      <h4 className="font-medium flex items-center gap-2 text-indigo-700 dark:text-indigo-400">
                        <GraduationCap className="h-4 w-4" />
                        Training Protocol
                      </h4>
                      <ul className="mt-2 space-y-1 text-sm text-gray-700 dark:text-gray-300">
                        <li>• Batch size: 64</li>
                        <li>• Maximum epochs: 50</li>
                        <li>• Early stopping (patience=5)</li>
                        <li>• Model checkpointing</li>
                        <li>• Validation split: 20% of training data</li>
                        <li>
                          • Class weights: Higher weight for minority class
                        </li>
                      </ul>
                    </div>

                    <div className="mt-4 p-4 bg-teal-50 dark:bg-teal-900/20 rounded-lg">
                      <h4 className="font-medium flex items-center gap-2 text-teal-700 dark:text-teal-400">
                        <BarChart3 className="h-4 w-4" />
                        Performance Metrics
                      </h4>
                      <ul className="mt-2 space-y-1 text-sm text-gray-700 dark:text-gray-300">
                        <li>• Test set AUC: 0.76</li>
                        <li>
                          • Validation performance matches test performance
                        </li>
                        <li>
                          • ROC curves show consistent performance across
                          datasets
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Team Tab */}
          <TabsContent value="team" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-6">Project Team</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    {
                      name: "Anku Jeremiah Coblah",
                      role: "Machine Learning Lead",
                      specialty: "ML and FullStack Development",
                      institution:
                        "Kwame Nkrumah University of Science and Technology (KNUST)",
                    },
                    {
                      name: "Ayinemi Anaamtome Thomas",
                      role: "Machine Learning Lead",
                      specialty: "Deep Learning",
                      institution:
                        "Kwame Nkrumah University of Science and Technology (KNUST)",
                    },
                    {
                      name: "Gyan Newman Charles Emmanuel",
                      role: "Clinical Advisor",
                      specialty: "Critical Care Medicine",
                      institution:
                        "Kwame Nkrumah University of Science and Technology (KNUST)",
                    },
                  ].map((member, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center text-center p-4 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700"
                    >
                      <div className="w-24 h-24 rounded-full overflow-hidden mb-4 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                        <Users className="h-12 w-12 text-gray-400" />
                      </div>
                      <h3 className="font-semibold text-lg">{member.name}</h3>
                      <p className="text-teal-600 dark:text-teal-400 font-medium text-sm">
                        {member.role}
                      </p>
                      <p className="text-muted-foreground text-sm mt-1">
                        {member.specialty}
                      </p>
                      <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                        {member.institution}
                      </p>
                    </div>
                  ))}
                </div>

                <Separator className="my-8" />

                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">
                    Acknowledgments
                  </h3>
                  <p className="text-muted-foreground dark:text-gray-300 text-sm">
                    We gratefully acknowledge the PhysioNet team for making the
                    dataset available, and all the clinicians and researchers
                    who contributed to this challenge.
                  </p>
                </div>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
