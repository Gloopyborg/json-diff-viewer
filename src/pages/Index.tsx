import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, FileText, GitCompare, Search } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  const [file1Search, setFile1Search] = useState<string>('');
  const [file2Search, setFile2Search] = useState<string>('');
  const [file1DropdownOpen, setFile1DropdownOpen] = useState<boolean>(false);
  const [file2DropdownOpen, setFile2DropdownOpen] = useState<boolean>(false);

  // Sample JSON file URLs - in a real app, these would come from your server
  const availableFiles = [
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/machine/combined_bambu_lab_a1_0.2_nozzle.json', label: 'combined_bambu_lab_a1_0.2_nozzle.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/machine/combined_bambu_lab_a1_0.4_nozzle.json', label: 'combined_bambu_lab_a1_0.4_nozzle.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/machine/combined_bambu_lab_a1_0.6_nozzle.json', label: 'combined_bambu_lab_a1_0.6_nozzle.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/machine/combined_bambu_lab_a1_0.8_nozzle.json', label: 'combined_bambu_lab_a1_0.8_nozzle.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/machine/combined_bambu_lab_a1_mini_0.2_nozzle.json', label: 'combined_bambu_lab_a1_mini_0.2_nozzle.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/machine/combined_bambu_lab_a1_mini_0.4_nozzle.json', label: 'combined_bambu_lab_a1_mini_0.4_nozzle.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/machine/combined_bambu_lab_a1_mini_0.6_nozzle.json', label: 'combined_bambu_lab_a1_mini_0.6_nozzle.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/machine/combined_bambu_lab_a1_mini_0.8_nozzle.json', label: 'combined_bambu_lab_a1_mini_0.8_nozzle.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/machine/combined_bambu_lab_h2d_0.2_nozzle.json', label: 'combined_bambu_lab_h2d_0.2_nozzle.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/machine/combined_bambu_lab_h2d_0.4_nozzle.json', label: 'combined_bambu_lab_h2d_0.4_nozzle.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/machine/combined_bambu_lab_h2d_0.6_nozzle.json', label: 'combined_bambu_lab_h2d_0.6_nozzle.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/machine/combined_bambu_lab_h2d_0.8_nozzle.json', label: 'combined_bambu_lab_h2d_0.8_nozzle.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/machine/combined_bambu_lab_p1p_0.2_nozzle.json', label: 'combined_bambu_lab_p1p_0.2_nozzle.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/machine/combined_bambu_lab_p1p_0.4_nozzle.json', label: 'combined_bambu_lab_p1p_0.4_nozzle.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/machine/combined_bambu_lab_p1p_0.6_nozzle.json', label: 'combined_bambu_lab_p1p_0.6_nozzle.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/machine/combined_bambu_lab_p1p_0.8_nozzle.json', label: 'combined_bambu_lab_p1p_0.8_nozzle.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/machine/combined_bambu_lab_p1s_0.2_nozzle.json', label: 'combined_bambu_lab_p1s_0.2_nozzle.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/machine/combined_bambu_lab_p1s_0.4_nozzle.json', label: 'combined_bambu_lab_p1s_0.4_nozzle.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/machine/combined_bambu_lab_p1s_0.6_nozzle.json', label: 'combined_bambu_lab_p1s_0.6_nozzle.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/machine/combined_bambu_lab_p1s_0.8_nozzle.json', label: 'combined_bambu_lab_p1s_0.8_nozzle.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/machine/combined_bambu_lab_p1s_1.2_nozzle.json', label: 'combined_bambu_lab_p1s_1.2_nozzle.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/machine/combined_bambu_lab_x1_0.2_nozzle.json', label: 'combined_bambu_lab_x1_0.2_nozzle.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/machine/combined_bambu_lab_x1_0.4_nozzle.json', label: 'combined_bambu_lab_x1_0.4_nozzle.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/machine/combined_bambu_lab_x1_0.6_nozzle.json', label: 'combined_bambu_lab_x1_0.6_nozzle.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/machine/combined_bambu_lab_x1_0.8_nozzle.json', label: 'combined_bambu_lab_x1_0.8_nozzle.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/machine/combined_bambu_lab_x1_carbon_0.2_nozzle.json', label: 'combined_bambu_lab_x1_carbon_0.2_nozzle.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/machine/combined_bambu_lab_x1_carbon_0.4_nozzle.json', label: 'combined_bambu_lab_x1_carbon_0.4_nozzle.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/machine/combined_bambu_lab_x1_carbon_0.6_nozzle.json', label: 'combined_bambu_lab_x1_carbon_0.6_nozzle.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/machine/combined_bambu_lab_x1_carbon_0.8_nozzle.json', label: 'combined_bambu_lab_x1_carbon_0.8_nozzle.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/machine/combined_bambu_lab_x1e_0.2_nozzle.json', label: 'combined_bambu_lab_x1e_0.2_nozzle.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/machine/combined_bambu_lab_x1e_0.4_nozzle.json', label: 'combined_bambu_lab_x1e_0.4_nozzle.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/machine/combined_bambu_lab_x1e_0.6_nozzle.json', label: 'combined_bambu_lab_x1e_0.6_nozzle.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/machine/combined_bambu_lab_x1e_0.8_nozzle.json', label: 'combined_bambu_lab_x1e_0.8_nozzle.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/machine/combined_fdm_bbl_3dp_001_common.json', label: 'combined_fdm_bbl_3dp_001_common.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/machine/combined_fdm_bbl_3dp_002_common.json', label: 'combined_fdm_bbl_3dp_002_common.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.06mm_fine_@bbl_a1_0.2_nozzle.json', label: 'combined_0.06mm_fine_@bbl_a1_0.2_nozzle.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.06mm_fine_@bbl_a1m_0.2_nozzle.json', label: 'combined_0.06mm_fine_@bbl_a1m_0.2_nozzle.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.06mm_fine_@bbl_p1p_0.2_nozzle.json', label: 'combined_0.06mm_fine_@bbl_p1p_0.2_nozzle.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.06mm_high_quality_@bbl_a1_0.2_nozzle.json', label: 'combined_0.06mm_high_quality_@bbl_a1_0.2_nozzle.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.06mm_high_quality_@bbl_a1m_0.2_nozzle.json', label: 'combined_0.06mm_high_quality_@bbl_a1m_0.2_nozzle.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.06mm_high_quality_@bbl_p1p_0.2_nozzle.json', label: 'combined_0.06mm_high_quality_@bbl_p1p_0.2_nozzle.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.06mm_high_quality_@bbl_x1c_0.2_nozzle.json', label: 'combined_0.06mm_high_quality_@bbl_x1c_0.2_nozzle.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.06mm_standard_@bbl_x1c_0.2_nozzle.json', label: 'combined_0.06mm_standard_@bbl_x1c_0.2_nozzle.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.08mm_extra_fine_@bbl_a1.json', label: 'combined_0.08mm_extra_fine_@bbl_a1.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.08mm_extra_fine_@bbl_a1m.json', label: 'combined_0.08mm_extra_fine_@bbl_a1m.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.08mm_extra_fine_@bbl_h2d.json', label: 'combined_0.08mm_extra_fine_@bbl_h2d.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.08mm_extra_fine_@bbl_h2d_0.2_nozzle.json', label: 'combined_0.08mm_extra_fine_@bbl_h2d_0.2_nozzle.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.08mm_extra_fine_@bbl_p1p.json', label: 'combined_0.08mm_extra_fine_@bbl_p1p.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.08mm_extra_fine_@bbl_x1c.json', label: 'combined_0.08mm_extra_fine_@bbl_x1c.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.08mm_high_quality_@bbl_a1.json', label: 'combined_0.08mm_high_quality_@bbl_a1.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.08mm_high_quality_@bbl_a1_0.2_nozzle.json', label: 'combined_0.08mm_high_quality_@bbl_a1_0.2_nozzle.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.08mm_high_quality_@bbl_a1m.json', label: 'combined_0.08mm_high_quality_@bbl_a1m.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.08mm_high_quality_@bbl_a1m_0.2_nozzle.json', label: 'combined_0.08mm_high_quality_@bbl_a1m_0.2_nozzle.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.08mm_high_quality_@bbl_p1p.json', label: 'combined_0.08mm_high_quality_@bbl_p1p.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.08mm_high_quality_@bbl_p1p_0.2_nozzle.json', label: 'combined_0.08mm_high_quality_@bbl_p1p_0.2_nozzle.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.08mm_high_quality_@bbl_x1c.json', label: 'combined_0.08mm_high_quality_@bbl_x1c.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.08mm_high_quality_@bbl_x1c_0.2_nozzle.json', label: 'combined_0.08mm_high_quality_@bbl_x1c_0.2_nozzle.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.08mm_optimal_@bbl_a1_0.2_nozzle.json', label: 'combined_0.08mm_optimal_@bbl_a1_0.2_nozzle.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.08mm_optimal_@bbl_a1m_0.2_nozzle.json', label: 'combined_0.08mm_optimal_@bbl_a1m_0.2_nozzle.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.08mm_optimal_@bbl_p1p_0.2_nozzle.json', label: 'combined_0.08mm_optimal_@bbl_p1p_0.2_nozzle.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.08mm_standard_@bbl_x1c_0.2_nozzle.json', label: 'combined_0.08mm_standard_@bbl_x1c_0.2_nozzle.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.10mm_high_quality_@bbl_a1_0.2_nozzle.json', label: 'combined_0.10mm_high_quality_@bbl_a1_0.2_nozzle.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.10mm_high_quality_@bbl_a1m_0.2_nozzle.json', label: 'combined_0.10mm_high_quality_@bbl_a1m_0.2_nozzle.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.10mm_high_quality_@bbl_p1p_0.2_nozzle.json', label: 'combined_0.10mm_high_quality_@bbl_p1p_0.2_nozzle.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.10mm_high_quality_@bbl_x1c_0.2_nozzle.json', label: 'combined_0.10mm_high_quality_@bbl_x1c_0.2_nozzle.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.10mm_standard_@bbl_a1_0.2_nozzle.json', label: 'combined_0.10mm_standard_@bbl_a1_0.2_nozzle.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.10mm_standard_@bbl_a1m_0.2_nozzle.json', label: 'combined_0.10mm_standard_@bbl_a1m_0.2_nozzle.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.10mm_standard_@bbl_h2d_0.2_nozzle.json', label: 'combined_0.10mm_standard_@bbl_h2d_0.2_nozzle.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.10mm_standard_@bbl_p1p_0.2_nozzle.json', label: 'combined_0.10mm_standard_@bbl_p1p_0.2_nozzle.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.10mm_standard_@bbl_x1c_0.2_nozzle.json', label: 'combined_0.10mm_standard_@bbl_x1c_0.2_nozzle.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.12mm_balanced_quality_@bbl_h2d_0.2_nozzle.json', label: 'combined_0.12mm_balanced_quality_@bbl_h2d_0.2_nozzle.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.12mm_draft_@bbl_a1_0.2_nozzle.json', label: 'combined_0.12mm_draft_@bbl_a1_0.2_nozzle.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.12mm_draft_@bbl_a1m_0.2_nozzle.json', label: 'combined_0.12mm_draft_@bbl_a1m_0.2_nozzle.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.12mm_draft_@bbl_p1p_0.2_nozzle.json', label: 'combined_0.12mm_draft_@bbl_p1p_0.2_nozzle.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.12mm_fine_@bbl_a1.json', label: 'combined_0.12mm_fine_@bbl_a1.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.12mm_fine_@bbl_a1m.json', label: 'combined_0.12mm_fine_@bbl_a1m.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.12mm_fine_@bbl_h2d.json', label: 'combined_0.12mm_fine_@bbl_h2d.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.12mm_fine_@bbl_p1p.json', label: 'combined_0.12mm_fine_@bbl_p1p.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.12mm_fine_@bbl_x1c.json', label: 'combined_0.12mm_fine_@bbl_x1c.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.12mm_high_quality_@bbl_a1.json', label: 'combined_0.12mm_high_quality_@bbl_a1.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.12mm_high_quality_@bbl_a1m.json', label: 'combined_0.12mm_high_quality_@bbl_a1m.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.12mm_high_quality_@bbl_p1p.json', label: 'combined_0.12mm_high_quality_@bbl_p1p.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.12mm_high_quality_@bbl_x1c.json', label: 'combined_0.12mm_high_quality_@bbl_x1c.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.12mm_standard_@bbl_x1c_0.2_nozzle.json', label: 'combined_0.12mm_standard_@bbl_x1c_0.2_nozzle.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.14mm_extra_draft_@bbl_a1_0.2_nozzle.json', label: 'combined_0.14mm_extra_draft_@bbl_a1_0.2_nozzle.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.14mm_extra_draft_@bbl_a1m_0.2_nozzle.json', label: 'combined_0.14mm_extra_draft_@bbl_a1m_0.2_nozzle.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.14mm_extra_draft_@bbl_p1p_0.2_nozzle.json', label: 'combined_0.14mm_extra_draft_@bbl_p1p_0.2_nozzle.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.14mm_standard_@bbl_x1c_0.2_nozzle.json', label: 'combined_0.14mm_standard_@bbl_x1c_0.2_nozzle.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.16mm_balanced_quality_@bbl_h2d.json', label: 'combined_0.16mm_balanced_quality_@bbl_h2d.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.16mm_high_quality_@bbl_a1.json', label: 'combined_0.16mm_high_quality_@bbl_a1.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.16mm_high_quality_@bbl_a1m.json', label: 'combined_0.16mm_high_quality_@bbl_a1m.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.16mm_high_quality_@bbl_p1p.json', label: 'combined_0.16mm_high_quality_@bbl_p1p.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.16mm_high_quality_@bbl_x1c.json', label: 'combined_0.16mm_high_quality_@bbl_x1c.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.16mm_optimal_@bbl_a1.json', label: 'combined_0.16mm_optimal_@bbl_a1.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.16mm_optimal_@bbl_a1m.json', label: 'combined_0.16mm_optimal_@bbl_a1m.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.16mm_optimal_@bbl_p1p.json', label: 'combined_0.16mm_optimal_@bbl_p1p.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.16mm_optimal_@bbl_x1c.json', label: 'combined_0.16mm_optimal_@bbl_x1c.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.16mm_standard_@bbl_h2d.json', label: 'combined_0.16mm_standard_@bbl_h2d.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.18mm_balanced_quality_@bbl_h2d_0.6_nozzle.json', label: 'combined_0.18mm_balanced_quality_@bbl_h2d_0.6_nozzle.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.18mm_fine_@bbl_a1_0.6_nozzle.json', label: 'combined_0.18mm_fine_@bbl_a1_0.6_nozzle.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.18mm_fine_@bbl_a1m_0.6_nozzle.json', label: 'combined_0.18mm_fine_@bbl_a1m_0.6_nozzle.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.18mm_fine_@bbl_p1p_0.6_nozzle.json', label: 'combined_0.18mm_fine_@bbl_p1p_0.6_nozzle.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.18mm_standard_@bbl_x1c_0.6_nozzle.json', label: 'combined_0.18mm_standard_@bbl_x1c_0.6_nozzle.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.20mm_balanced_strength_@bbl_h2d.json', label: 'combined_0.20mm_balanced_strength_@bbl_h2d.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.20mm_bambu_support_w_@bbl_x1c.json', label: 'combined_0.20mm_bambu_support_w_@bbl_x1c.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.20mm_standard_@bbl_a1.json', label: 'combined_0.20mm_standard_@bbl_a1.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.20mm_standard_@bbl_a1m.json', label: 'combined_0.20mm_standard_@bbl_a1m.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.20mm_standard_@bbl_h2d.json', label: 'combined_0.20mm_standard_@bbl_h2d.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.20mm_standard_@bbl_p1p.json', label: 'combined_0.20mm_standard_@bbl_p1p.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.20mm_standard_@bbl_x1c.json', label: 'combined_0.20mm_standard_@bbl_x1c.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.20mm_strength_@bbl_a1.json', label: 'combined_0.20mm_strength_@bbl_a1.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.20mm_strength_@bbl_a1m.json', label: 'combined_0.20mm_strength_@bbl_a1m.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.20mm_strength_@bbl_p1p.json', label: 'combined_0.20mm_strength_@bbl_p1p.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.20mm_strength_@bbl_x1c.json', label: 'combined_0.20mm_strength_@bbl_x1c.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.24mm_balanced_quality_@bbl_h2d_0.8_nozzle.json', label: 'combined_0.24mm_balanced_quality_@bbl_h2d_0.8_nozzle.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.24mm_balanced_strength_@bbl_h2d_0.6_nozzle.json', label: 'combined_0.24mm_balanced_strength_@bbl_h2d_0.6_nozzle.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.24mm_draft_@bbl_a1.json', label: 'combined_0.24mm_draft_@bbl_a1.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.24mm_draft_@bbl_a1m.json', label: 'combined_0.24mm_draft_@bbl_a1m.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.24mm_draft_@bbl_p1p.json', label: 'combined_0.24mm_draft_@bbl_p1p.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.24mm_draft_@bbl_x1c.json', label: 'combined_0.24mm_draft_@bbl_x1c.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.24mm_fine_@bbl_a1_0.8_nozzle.json', label: 'combined_0.24mm_fine_@bbl_a1_0.8_nozzle.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.24mm_fine_@bbl_a1m_0.8_nozzle.json', label: 'combined_0.24mm_fine_@bbl_a1m_0.8_nozzle.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.24mm_fine_@bbl_p1p_0.8_nozzle.json', label: 'combined_0.24mm_fine_@bbl_p1p_0.8_nozzle.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.24mm_optimal_@bbl_a1_0.6_nozzle.json', label: 'combined_0.24mm_optimal_@bbl_a1_0.6_nozzle.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.24mm_optimal_@bbl_a1m_0.6_nozzle.json', label: 'combined_0.24mm_optimal_@bbl_a1m_0.6_nozzle.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.24mm_optimal_@bbl_p1p_0.6_nozzle.json', label: 'combined_0.24mm_optimal_@bbl_p1p_0.6_nozzle.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.24mm_standard_@bbl_h2d.json', label: 'combined_0.24mm_standard_@bbl_h2d.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.24mm_standard_@bbl_x1c_0.6_nozzle.json', label: 'combined_0.24mm_standard_@bbl_x1c_0.6_nozzle.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.24mm_standard_@bbl_x1c_0.8_nozzle.json', label: 'combined_0.24mm_standard_@bbl_x1c_0.8_nozzle.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.28mm_extra_draft_@bbl_a1.json', label: 'combined_0.28mm_extra_draft_@bbl_a1.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.28mm_extra_draft_@bbl_a1m.json', label: 'combined_0.28mm_extra_draft_@bbl_a1m.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.28mm_extra_draft_@bbl_p1p.json', label: 'combined_0.28mm_extra_draft_@bbl_p1p.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.28mm_extra_draft_@bbl_x1c.json', label: 'combined_0.28mm_extra_draft_@bbl_x1c.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.30mm_standard_@bbl_a1_0.6_nozzle.json', label: 'combined_0.30mm_standard_@bbl_a1_0.6_nozzle.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.30mm_standard_@bbl_a1m_0.6_nozzle.json', label: 'combined_0.30mm_standard_@bbl_a1m_0.6_nozzle.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.30mm_standard_@bbl_h2d_0.6_nozzle.json', label: 'combined_0.30mm_standard_@bbl_h2d_0.6_nozzle.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.30mm_standard_@bbl_p1p_0.6_nozzle.json', label: 'combined_0.30mm_standard_@bbl_p1p_0.6_nozzle.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.30mm_standard_@bbl_x1_0.6_nozzle.json', label: 'combined_0.30mm_standard_@bbl_x1_0.6_nozzle.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.30mm_standard_@bbl_x1c_0.6_nozzle.json', label: 'combined_0.30mm_standard_@bbl_x1c_0.6_nozzle.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.30mm_strength_@bbl_a1_0.6_nozzle.json', label: 'combined_0.30mm_strength_@bbl_a1_0.6_nozzle.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.30mm_strength_@bbl_a1m_0.6_nozzle.json', label: 'combined_0.30mm_strength_@bbl_a1m_0.6_nozzle.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.30mm_strength_@bbl_p1p_0.6_nozzle.json', label: 'combined_0.30mm_strength_@bbl_p1p_0.6_nozzle.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.30mm_strength_@bbl_x1c_0.6_nozzle.json', label: 'combined_0.30mm_strength_@bbl_x1c_0.6_nozzle.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.32mm_balanced_strength_@bbl_h2d_0.8_nozzle.json', label: 'combined_0.32mm_balanced_strength_@bbl_h2d_0.8_nozzle.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.32mm_optimal_@bbl_a1_0.8_nozzle.json', label: 'combined_0.32mm_optimal_@bbl_a1_0.8_nozzle.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.32mm_optimal_@bbl_a1m_0.8_nozzle.json', label: 'combined_0.32mm_optimal_@bbl_a1m_0.8_nozzle.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.32mm_optimal_@bbl_p1p_0.8_nozzle.json', label: 'combined_0.32mm_optimal_@bbl_p1p_0.8_nozzle.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.32mm_standard_@bbl_x1c_0.8_nozzle.json', label: 'combined_0.32mm_standard_@bbl_x1c_0.8_nozzle.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.36mm_draft_@bbl_a1_0.6_nozzle.json', label: 'combined_0.36mm_draft_@bbl_a1_0.6_nozzle.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.36mm_draft_@bbl_a1m_0.6_nozzle.json', label: 'combined_0.36mm_draft_@bbl_a1m_0.6_nozzle.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.36mm_draft_@bbl_p1p_0.6_nozzle.json', label: 'combined_0.36mm_draft_@bbl_p1p_0.6_nozzle.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.36mm_standard_@bbl_x1c_0.6_nozzle.json', label: 'combined_0.36mm_standard_@bbl_x1c_0.6_nozzle.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.40mm_standard_@bbl_a1_0.8_nozzle.json', label: 'combined_0.40mm_standard_@bbl_a1_0.8_nozzle.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.40mm_standard_@bbl_a1m_0.8_nozzle.json', label: 'combined_0.40mm_standard_@bbl_a1m_0.8_nozzle.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.40mm_standard_@bbl_h2d_0.8_nozzle.json', label: 'combined_0.40mm_standard_@bbl_h2d_0.8_nozzle.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.40mm_standard_@bbl_p1p_0.8_nozzle.json', label: 'combined_0.40mm_standard_@bbl_p1p_0.8_nozzle.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.40mm_standard_@bbl_x1_0.8_nozzle.json', label: 'combined_0.40mm_standard_@bbl_x1_0.8_nozzle.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.40mm_standard_@bbl_x1c_0.8_nozzle.json', label: 'combined_0.40mm_standard_@bbl_x1c_0.8_nozzle.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.42mm_extra_draft_@bbl_a1_0.6_nozzle.json', label: 'combined_0.42mm_extra_draft_@bbl_a1_0.6_nozzle.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.42mm_extra_draft_@bbl_a1m_0.6_nozzle.json', label: 'combined_0.42mm_extra_draft_@bbl_a1m_0.6_nozzle.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.42mm_extra_draft_@bbl_p1p_0.6_nozzle.json', label: 'combined_0.42mm_extra_draft_@bbl_p1p_0.6_nozzle.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.42mm_standard_@bbl_x1c_0.6_nozzle.json', label: 'combined_0.42mm_standard_@bbl_x1c_0.6_nozzle.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.48mm_draft_@bbl_a1_0.8_nozzle.json', label: 'combined_0.48mm_draft_@bbl_a1_0.8_nozzle.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.48mm_draft_@bbl_a1m_0.8_nozzle.json', label: 'combined_0.48mm_draft_@bbl_a1m_0.8_nozzle.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.48mm_draft_@bbl_p1p_0.8_nozzle.json', label: 'combined_0.48mm_draft_@bbl_p1p_0.8_nozzle.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.48mm_standard_@bbl_x1c_0.8_nozzle.json', label: 'combined_0.48mm_standard_@bbl_x1c_0.8_nozzle.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.56mm_extra_draft_@bbl_a1_0.8_nozzle.json', label: 'combined_0.56mm_extra_draft_@bbl_a1_0.8_nozzle.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.56mm_extra_draft_@bbl_a1m_0.8_nozzle.json', label: 'combined_0.56mm_extra_draft_@bbl_a1m_0.8_nozzle.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.56mm_extra_draft_@bbl_p1p_0.8_nozzle.json', label: 'combined_0.56mm_extra_draft_@bbl_p1p_0.8_nozzle.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.56mm_standard_@bbl_x1c_0.8_nozzle.json', label: 'combined_0.56mm_standard_@bbl_x1c_0.8_nozzle.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_0.60mm_standard_@bbl_x1c_1.2_nozzle.json', label: 'combined_0.60mm_standard_@bbl_x1c_1.2_nozzle.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_fdm_process_bbl_0.06_nozzle_0.2.json', label: 'combined_fdm_process_bbl_0.06_nozzle_0.2.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_fdm_process_bbl_0.08.json', label: 'combined_fdm_process_bbl_0.08.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_fdm_process_bbl_0.08_nozzle_0.2.json', label: 'combined_fdm_process_bbl_0.08_nozzle_0.2.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_fdm_process_bbl_0.10_nozzle_0.2.json', label: 'combined_fdm_process_bbl_0.10_nozzle_0.2.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_fdm_process_bbl_0.12.json', label: 'combined_fdm_process_bbl_0.12.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_fdm_process_bbl_0.12_nozzle_0.2.json', label: 'combined_fdm_process_bbl_0.12_nozzle_0.2.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_fdm_process_bbl_0.14_nozzle_0.2.json', label: 'combined_fdm_process_bbl_0.14_nozzle_0.2.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_fdm_process_bbl_0.16.json', label: 'combined_fdm_process_bbl_0.16.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_fdm_process_bbl_0.18_nozzle_0.6.json', label: 'combined_fdm_process_bbl_0.18_nozzle_0.6.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_fdm_process_bbl_0.20.json', label: 'combined_fdm_process_bbl_0.20.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_fdm_process_bbl_0.24.json', label: 'combined_fdm_process_bbl_0.24.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_fdm_process_bbl_0.24_nozzle_0.6.json', label: 'combined_fdm_process_bbl_0.24_nozzle_0.6.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_fdm_process_bbl_0.24_nozzle_0.8.json', label: 'combined_fdm_process_bbl_0.24_nozzle_0.8.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_fdm_process_bbl_0.28.json', label: 'combined_fdm_process_bbl_0.28.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_fdm_process_bbl_0.30_nozzle_0.6.json', label: 'combined_fdm_process_bbl_0.30_nozzle_0.6.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_fdm_process_bbl_0.32_nozzle_0.8.json', label: 'combined_fdm_process_bbl_0.32_nozzle_0.8.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_fdm_process_bbl_0.36_nozzle_0.6.json', label: 'combined_fdm_process_bbl_0.36_nozzle_0.6.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_fdm_process_bbl_0.40_nozzle_0.8.json', label: 'combined_fdm_process_bbl_0.40_nozzle_0.8.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_fdm_process_bbl_0.42_nozzle_0.6.json', label: 'combined_fdm_process_bbl_0.42_nozzle_0.6.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_fdm_process_bbl_0.48_nozzle_0.8.json', label: 'combined_fdm_process_bbl_0.48_nozzle_0.8.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_fdm_process_bbl_0.56_nozzle_0.8.json', label: 'combined_fdm_process_bbl_0.56_nozzle_0.8.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_fdm_process_bbl_common.json', label: 'combined_fdm_process_bbl_common.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_fdm_process_dual_0.06_nozzle_0.2.json', label: 'combined_fdm_process_dual_0.06_nozzle_0.2.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_fdm_process_dual_0.08_nozzle_0.2.json', label: 'combined_fdm_process_dual_0.08_nozzle_0.2.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_fdm_process_dual_0.08_nozzle_0.4.json', label: 'combined_fdm_process_dual_0.08_nozzle_0.4.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_fdm_process_dual_0.10_nozzle_0.2.json', label: 'combined_fdm_process_dual_0.10_nozzle_0.2.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_fdm_process_dual_0.12_nozzle_0.2.json', label: 'combined_fdm_process_dual_0.12_nozzle_0.2.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_fdm_process_dual_0.12_nozzle_0.4.json', label: 'combined_fdm_process_dual_0.12_nozzle_0.4.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_fdm_process_dual_0.14_nozzle_0.2.json', label: 'combined_fdm_process_dual_0.14_nozzle_0.2.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_fdm_process_dual_0.16_nozzle_0.4.json', label: 'combined_fdm_process_dual_0.16_nozzle_0.4.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_fdm_process_dual_0.18_nozzle_0.6.json', label: 'combined_fdm_process_dual_0.18_nozzle_0.6.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_fdm_process_dual_0.20_nozzle_0.4.json', label: 'combined_fdm_process_dual_0.20_nozzle_0.4.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_fdm_process_dual_0.24_nozzle_0.4.json', label: 'combined_fdm_process_dual_0.24_nozzle_0.4.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_fdm_process_dual_0.24_nozzle_0.6.json', label: 'combined_fdm_process_dual_0.24_nozzle_0.6.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_fdm_process_dual_0.24_nozzle_0.8.json', label: 'combined_fdm_process_dual_0.24_nozzle_0.8.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_fdm_process_dual_0.28_nozzle_0.4.json', label: 'combined_fdm_process_dual_0.28_nozzle_0.4.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_fdm_process_dual_0.30_nozzle_0.6.json', label: 'combined_fdm_process_dual_0.30_nozzle_0.6.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_fdm_process_dual_0.32_nozzle_0.8.json', label: 'combined_fdm_process_dual_0.32_nozzle_0.8.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_fdm_process_dual_0.36_nozzle_0.6.json', label: 'combined_fdm_process_dual_0.36_nozzle_0.6.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_fdm_process_dual_0.40_nozzle_0.8.json', label: 'combined_fdm_process_dual_0.40_nozzle_0.8.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_fdm_process_dual_0.42_nozzle_0.6.json', label: 'combined_fdm_process_dual_0.42_nozzle_0.6.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_fdm_process_dual_0.48_nozzle_0.8.json', label: 'combined_fdm_process_dual_0.48_nozzle_0.8.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_fdm_process_dual_0.56_nozzle_0.8.json', label: 'combined_fdm_process_dual_0.56_nozzle_0.8.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_fdm_process_dual_common.json', label: 'combined_fdm_process_dual_common.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_fdm_process_single_0.06_nozzle_0.2.json', label: 'combined_fdm_process_single_0.06_nozzle_0.2.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_fdm_process_single_0.08.json', label: 'combined_fdm_process_single_0.08.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_fdm_process_single_0.08_nozzle_0.2.json', label: 'combined_fdm_process_single_0.08_nozzle_0.2.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_fdm_process_single_0.10_nozzle_0.2.json', label: 'combined_fdm_process_single_0.10_nozzle_0.2.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_fdm_process_single_0.12.json', label: 'combined_fdm_process_single_0.12.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_fdm_process_single_0.12_nozzle_0.2.json', label: 'combined_fdm_process_single_0.12_nozzle_0.2.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_fdm_process_single_0.14_nozzle_0.2.json', label: 'combined_fdm_process_single_0.14_nozzle_0.2.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_fdm_process_single_0.16.json', label: 'combined_fdm_process_single_0.16.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_fdm_process_single_0.18_nozzle_0.6.json', label: 'combined_fdm_process_single_0.18_nozzle_0.6.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_fdm_process_single_0.20.json', label: 'combined_fdm_process_single_0.20.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_fdm_process_single_0.24.json', label: 'combined_fdm_process_single_0.24.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_fdm_process_single_0.24_nozzle_0.6.json', label: 'combined_fdm_process_single_0.24_nozzle_0.6.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_fdm_process_single_0.24_nozzle_0.8.json', label: 'combined_fdm_process_single_0.24_nozzle_0.8.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_fdm_process_single_0.28.json', label: 'combined_fdm_process_single_0.28.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_fdm_process_single_0.30_nozzle_0.6.json', label: 'combined_fdm_process_single_0.30_nozzle_0.6.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_fdm_process_single_0.32_nozzle_0.8.json', label: 'combined_fdm_process_single_0.32_nozzle_0.8.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_fdm_process_single_0.36_nozzle_0.6.json', label: 'combined_fdm_process_single_0.36_nozzle_0.6.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_fdm_process_single_0.40_nozzle_0.8.json', label: 'combined_fdm_process_single_0.40_nozzle_0.8.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_fdm_process_single_0.42_nozzle_0.6.json', label: 'combined_fdm_process_single_0.42_nozzle_0.6.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_fdm_process_single_0.48_nozzle_0.8.json', label: 'combined_fdm_process_single_0.48_nozzle_0.8.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_fdm_process_single_0.56_nozzle_0.8.json', label: 'combined_fdm_process_single_0.56_nozzle_0.8.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_fdm_process_single_0.60_nozzle_1.2.json', label: 'combined_fdm_process_single_0.60_nozzle_1.2.json' },
    { value: 'https://raw.githubusercontent.com/alexmi256/SlicerPrintProfiles/refs/heads/main/system/BBL/process/combined_fdm_process_single_common.json', label: 'combined_fdm_process_single_common.json' },
  ];

  const filteredFile1Options = availableFiles.filter(file =>
    file.label.toLowerCase().includes(file1Search.toLowerCase())
  );

  const filteredFile2Options = availableFiles.filter(file =>
    file.label.toLowerCase().includes(file2Search.toLowerCase())
  );

  const getSelectedFileLabel = (url: string) => {
    const file = availableFiles.find(f => f.value === url);
    return file ? file.label : 'Select file...';
  };

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
        diff2htmlScript.src = 'https://cdn.jsdelivr.net/npm/diff2html/bundles/js/diff2html.min.js';
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
          matching: 'lines',
          drawFileList: false,
          colorScheme: 'auto',
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
                <DropdownMenu open={file1DropdownOpen} onOpenChange={setFile1DropdownOpen}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full justify-between">
                      <span className="truncate">{getSelectedFileLabel(file1Url)}</span>
                      <Search className="ml-2 h-4 w-4 shrink-0" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full bg-white p-2 max-h-80 overflow-y-auto z-50">
                    <Input
                      placeholder="Search files..."
                      value={file1Search}
                      onChange={(e) => setFile1Search(e.target.value)}
                      className="mb-2"
                    />
                    <div className="max-h-64 overflow-y-auto">
                      {filteredFile1Options.map((file) => (
                        <DropdownMenuItem
                          key={file.value}
                          onClick={() => {
                            setFile1Url(file.value);
                            setFile1DropdownOpen(false);
                            setFile1Search('');
                          }}
                          className="cursor-pointer"
                        >
                          {file.label}
                        </DropdownMenuItem>
                      ))}
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
                {file1Content && (
                  <p className="text-sm text-green-600">✓ File loaded ({file1Content.split('\n').length} lines)</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Second JSON File</label>
                <DropdownMenu open={file2DropdownOpen} onOpenChange={setFile2DropdownOpen}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full justify-between">
                      <span className="truncate">{getSelectedFileLabel(file2Url)}</span>
                      <Search className="ml-2 h-4 w-4 shrink-0" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full bg-white p-2 max-h-80 overflow-y-auto z-50">
                    <Input
                      placeholder="Search files..."
                      value={file2Search}
                      onChange={(e) => setFile2Search(e.target.value)}
                      className="mb-2"
                    />
                    <div className="max-h-64 overflow-y-auto">
                      {filteredFile2Options.map((file) => (
                        <DropdownMenuItem
                          key={file.value}
                          onClick={() => {
                            setFile2Url(file.value);
                            setFile2DropdownOpen(false);
                            setFile2Search('');
                          }}
                          className="cursor-pointer"
                        >
                          {file.label}
                        </DropdownMenuItem>
                      ))}
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
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
