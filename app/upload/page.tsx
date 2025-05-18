"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, FileUp, Table, ArrowRight } from "lucide-react";
import UploadCsv from "@/components/upload-csv";
import UploadManual from "@/components/upload-manual";

export default function UploadPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Patient Data Input</h1>
          <p className="text-muted-foreground dark:text-gray-400">
            Upload patient data or enter vitals manually to get sepsis risk
            prediction
          </p>
        </div>

        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <FileUp className="h-4 w-4" />
              Upload Data
            </TabsTrigger>
            <TabsTrigger value="manual" className="flex items-center gap-2">
              <Table className="h-4 w-4" />
              Manual Entry
            </TabsTrigger>
          </TabsList>
          <UploadCsv />
          <UploadManual />
        </Tabs>
      </div>
    </main>
  );
}
