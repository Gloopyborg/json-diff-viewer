import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ChevronDown, Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { availableFiles } from "@/data/availableFiles";

interface Diff2HtmlUI {
  diff2htmlUi: (config: any) => void;
}

declare global {
  interface Window extends Diff2HtmlUI { }
}

const Index = () => {
  const [selectedFile1, setSelectedFile1] = useState<string | null>(null);
  const [selectedFile2, setSelectedFile2] = useState<string | null>(null);
  const [file1Content, setFile1Content] = useState<string | null>(null);
  const [file2Content, setFile2Content] = useState<string | null>(null);
  const [diffOutput, setDiffOutput] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    if (selectedFile1 && selectedFile2) {
      handleCompareFiles();
    }
  }, [selectedFile1, selectedFile2]);

  const getFilteredFiles = () => {
    let filteredFiles = availableFiles;

    if (fileType !== 'all') {
      filteredFiles = filteredFiles.filter(file => {
        if (fileType === 'machine') {
          return file.label.toLowerCase().includes('machine');
        } else if (fileType === 'filament') {
          return file.label.toLowerCase().includes('filament');
        } else if (fileType === 'process') {
          return file.label.toLowerCase().includes('process');
        }
        return true;
      });
    }

    if (searchTerm) {
      filteredFiles = filteredFiles.filter(file =>
        file.label.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filteredFiles;
  };

  const filteredOptions = getFilteredFiles();

  const loadScript = () => {
    return new Promise((resolve, reject) => {
      if (window.diff2htmlUi) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/diff2html/bundles/js/diff2html-ui.min.js";
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => reject(false);
      document.head.appendChild(script);
    });
  };

  const fetchJsonFile = async (url: string) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.text();
      return data;
    } catch (error) {
      console.error("Could not fetch the file:", error);
      return null;
    }
  };

  const handleCompareFiles = async () => {
    if (!selectedFile1 || !selectedFile2) {
      alert("Please select two files to compare.");
      return;
    }

    const scriptLoaded = await loadScript();
    if (!scriptLoaded) {
      console.error("Failed to load diff2html-ui.min.js");
      return;
    }

    const content1 = await fetchJsonFile(selectedFile1);
    const content2 = await fetchJsonFile(selectedFile2);

    if (content1 === null || content2 === null) {
      alert("Failed to fetch one or both files.");
      return;
    }

    setFile1Content(content1);
    setFile2Content(content2);

    const diff2html = require('diff2html');
    const diffString = diff2html.Diff2Html.getJsonDiff(content1, content2, { inputFormat: 'json', outputFormat: 'line-by-line' });
    const diff2HtmlUi = diff2html.Diff2HtmlUI;

    const configuration = {
      container: document.getElementById("diffOutput"),
      outputFormat: 'side-by-side',
      matching: 'lines',
      showFiles: false,
    };

    diff2HtmlUi.diff2htmlUi(configuration);

    const diff2Html = require('diff2html');
    const diffHtml = diff2html.Diff2Html.html(diffString, {
      drawFileList: false,
      outputFormat: 'side-by-side',
      matching: 'lines',
    });

    setDiffOutput(diffHtml);

    const diffOutputElement = document.getElementById('diffOutput');
    if (diffOutputElement) {
      diffOutputElement.innerHTML = diffHtml;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-gray-800">
            Slicer Profile Diff Tool
          </h1>
          <p className="text-gray-600 mt-2">
            Compare slicer profiles and identify differences.
          </p>
        </div>

        <div className="mb-6">
          <RadioGroup defaultValue="all" className="flex items-center space-x-2" onValueChange={setFileType}>
            <RadioGroupItem value="all" id="all" className="peer sr-only" />
            <Label htmlFor="all" className="cursor-pointer rounded-md p-2 font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground">
              All
            </Label>
            <RadioGroupItem value="machine" id="machine" className="peer sr-only" />
            <Label htmlFor="machine" className="cursor-pointer rounded-md p-2 font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground">
              Machine
            </Label>
            <RadioGroupItem value="filament" id="filament" className="peer sr-only" />
            <Label htmlFor="filament" className="cursor-pointer rounded-md p-2 font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground">
              Filament
            </Label>
            <RadioGroupItem value="process" id="process" className="peer sr-only" />
            <Label htmlFor="process" className="cursor-pointer rounded-md p-2 font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground">
              Process
            </Label>
          </RadioGroup>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>File 1</CardTitle>
              <CardDescription>Select the first file to compare</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 relative">
                <Input
                  type="text"
                  placeholder="Search files..."
                  className="pr-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {selectedFile1 ? filteredOptions.find(option => option.value === selectedFile1)?.label : "Select File 1"}
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full">
                  {filteredOptions.map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      onSelect={() => setSelectedFile1(option.value)}
                    >
                      {option.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>File 2</CardTitle>
              <CardDescription>Select the second file to compare</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 relative">
                <Input
                  type="text"
                  placeholder="Search files..."
                  className="pr-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {selectedFile2 ? filteredOptions.find(option => option.value === selectedFile2)?.label : "Select File 2"}
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full">
                  {filteredOptions.map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      onSelect={() => setSelectedFile2(option.value)}
                    >
                      {option.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Diff Output
          </h2>
          <div id="diffOutput" className="diff-container" />
        </div>
      </div>
    </div>
  );
};

export default Index;
