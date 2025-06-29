import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, FileText, GitCompare } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

declare global {
  interface Window {
    Diff: any;
    Diff2Html: any;
  }
}

const Index = () => {
  const [file1Url, setFile1Url] = useState<string>('');
  const [file2Url, setFile2Url] = useState<string>('');
  const [file1Content, setFile1Content] = useState<string>('');
  const [file2Content, setFile2Content] = useState<string>('');
  const [diffHtml, setDiffHtml] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [scriptsLoaded, setScriptsLoaded] = useState<boolean>(false);

  // Sample JSON file URLs - in a real app, these would come from your server
  const availableFiles = [
    { value: 'https://jsonplaceholder.typicode.com/posts/1', label: 'Sample Post 1' },
    { value: 'https://jsonplaceholder.typicode.com/posts/2', label: 'Sample Post 2' },
    { value: 'https://jsonplaceholder.typicode.com/users/1', label: 'Sample User 1' },
    { value: 'https://jsonplaceholder.typicode.com/users/2', label: 'Sample User 2' },
    { value: 'https://jsonplaceholder.typicode.com/todos/1', label: 'Sample Todo 1' },
    { value: 'https://jsonplaceholder.typicode.com/todos/2', label: 'Sample Todo 2' },
  ];

  useEffect(() => {
    const loadExternalScripts = () => {
      // Load diff2html CSS
      const cssLink = document.createElement('link');
      cssLink.rel = 'stylesheet';
      cssLink.href = 'https://cdn.jsdelivr.net/npm/diff2html/bundles/css/diff2html.min.css';
      document.head.appendChild(cssLink);

      // Load jsdiff
      const jsdiffScript = document.createElement('script');
      jsdiffScript.src = 'https://cdn.jsdelivr.net/npm/diff/dist/diff.min.js';
      jsdiffScript.onload = () => {
        console.log('jsdiff loaded');
        
        // Load diff2html after jsdiff
        const diff2htmlScript = document.createElement('script');
        diff2htmlScript.src = 'https://cdn.jsdelivr.net/npm/diff2html/bundles/js/diff2html-ui.min.js';
        diff2htmlScript.onload = () => {
          console.log('diff2html loaded');
          setScriptsLoaded(true);
        };
        diff2htmlScript.onerror = () => {
          setError('Failed to load diff2html library');
        };
        document.head.appendChild(diff2htmlScript);
      };
      jsdiffScript.onerror = () => {
        setError('Failed to load jsdiff library');
      };
      document.head.appendChild(jsdiffScript);
    };

    loadExternalScripts();

    return () => {
      // Cleanup scripts on unmount
      const scripts = document.querySelectorAll('script[src*="diff"]');
      const links = document.querySelectorAll('link[href*="diff2html"]');
      scripts.forEach(script => script.remove());
      links.forEach(link => link.remove());
    };
  }, []);

  const fetchJsonFile = async (url: string): Promise<string> => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
      }
      const data = await response.json();
      return JSON.stringify(data, null, 2);
    } catch (err) {
      throw new Error(`Error fetching ${url}: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const generateDiff = () => {
    if (!scriptsLoaded) {
      setError('External libraries are still loading. Please wait...');
      return;
    }

    if (!window.Diff) {
      setError('jsdiff library not loaded properly');
      return;
    }

    if (!file1Content || !file2Content) {
      setError('Both files must be loaded before generating diff');
      return;
    }

    try {
      // Create unified diff patch using jsdiff
      const diff = window.Diff.createTwoFilesPatch(
        file1Url.split('/').pop() || 'File 1',
        file2Url.split('/').pop() || 'File 2',
        file1Content,
        file2Content,
        undefined,
        undefined,
        { context: 3 }
      );

      console.log('Generated diff:', diff);

      // Parse and convert to HTML using diff2html
      let outputHtml = '';
      if (window.Diff2Html && window.Diff2Html.html) {
        const parsedDiff = window.Diff2Html.parse(diff);
        outputHtml = window.Diff2Html.html(parsedDiff, {
          inputFormat: 'diff',
          outputFormat: 'side-by-side',
          showFiles: false,
          matching: 'lines',
          drawFileList: false,
        });
      } else {
        // Fallback to basic diff display with debugging info
        console.log('Diff2Html fallback triggered:');
        console.log('window.Diff2Html:', window.Diff2Html);
        console.log('window.Diff2Html.html:', window.Diff2Html?.html);
        outputHtml = `<pre style="text-align: left; background: #f5f5f5; padding: 1rem; border-radius: 0.5rem; overflow-x: auto;">${diff}</pre>`;
      }

      setDiffHtml(outputHtml);
      setError('');
    } catch (err) {
      console.error('Error generating diff:', err);
      setError(`Error generating diff: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const loadFile = async (url: string, fileNumber: 1 | 2) => {
    if (!url) return;
    
    setLoading(true);
    setError('');
    
    try {
      const content = await fetchJsonFile(url);
      if (fileNumber === 1) {
        setFile1Content(content);
      } else {
        setFile2Content(content);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load file');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (file1Url) {
      loadFile(file1Url, 1);
    }
  }, [file1Url]);

  useEffect(() => {
    if (file2Url) {
      loadFile(file2Url, 2);
    }
  }, [file2Url]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <GitCompare className="h-8 w-8 text-indigo-600" />
            <h1 className="text-4xl font-bold text-gray-900">JSON Diff Viewer</h1>
          </div>
          <p className="text-xl text-gray-600">Compare JSON files side by side with visual differences</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Select Files to Compare
            </CardTitle>
            <CardDescription>
              Choose two JSON files from the available options to see their differences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">First JSON File</label>
                <Select value={file1Url} onValueChange={setFile1Url}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select first JSON file..." />
                  </SelectTrigger>
                  <SelectContent className="bg-white z-50">
                    {availableFiles.map((file) => (
                      <SelectItem key={file.value} value={file.value}>
                        {file.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {file1Content && (
                  <p className="text-sm text-green-600">✓ File loaded ({file1Content.split('\n').length} lines)</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Second JSON File</label>
                <Select value={file2Url} onValueChange={setFile2Url}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select second JSON file..." />
                  </SelectTrigger>
                  <SelectContent className="bg-white z-50">
                    {availableFiles.map((file) => (
                      <SelectItem key={file.value} value={file.value}>
                        {file.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {file2Content && (
                  <p className="text-sm text-green-600">✓ File loaded ({file2Content.split('\n').length} lines)</p>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <Button 
                onClick={generateDiff}
                disabled={!file1Content || !file2Content || loading || !scriptsLoaded}
                className="px-8 py-2"
              >
                {loading ? 'Loading...' : 'Generate Diff'}
              </Button>
            </div>

            {!scriptsLoaded && (
              <p className="text-sm text-blue-600 text-center mt-2">Loading external libraries...</p>
            )}
          </CardContent>
        </Card>

        {error && (
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {diffHtml && (
          <Card>
            <CardHeader>
              <CardTitle>Diff Results</CardTitle>
              <CardDescription>
                Visual comparison showing additions, deletions, and modifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div 
                className="diff-container w-full overflow-x-auto"
                dangerouslySetInnerHTML={{ __html: diffHtml }}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Index;
