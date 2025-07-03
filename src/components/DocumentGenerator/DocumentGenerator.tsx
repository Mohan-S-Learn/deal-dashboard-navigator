import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Download, Eye, Send, Printer } from 'lucide-react';
import { motion } from 'framer-motion';

interface DocumentData {
  templateType: string;
  clientName: string;
  projectTitle: string;
  projectDescription: string;
  deliverables: string;
  timeline: string;
  investment: number;
  terms: string;
  companyName: string;
  contactPerson: string;
}

interface DocumentGeneratorProps {
  dealData?: {
    scope: string;
    duration: number;
    resources: number;
    price: number;
    clientType: string;
    location: string;
  };
}

export const DocumentGenerator: React.FC<DocumentGeneratorProps> = ({ dealData }) => {
  const [documentData, setDocumentData] = useState<DocumentData>({
    templateType: 'proposal',
    clientName: '',
    projectTitle: dealData?.scope || '',
    projectDescription: '',
    deliverables: '',
    timeline: `${dealData?.duration || 12} months`,
    investment: dealData?.price || 0,
    terms: 'Net 30 payment terms',
    companyName: 'Your Company Name',
    contactPerson: 'Your Name'
  });

  const [generatedDocument, setGeneratedDocument] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  const templateTypes = [
    { value: 'proposal', label: 'Project Proposal' },
    { value: 'quote', label: 'Price Quote' },
    { value: 'sow', label: 'Statement of Work' },
    { value: 'contract', label: 'Service Contract' }
  ];

  const updateDocumentData = (key: keyof DocumentData, value: string | number) => {
    setDocumentData(prev => ({ ...prev, [key]: value }));
  };

  const generateDocument = () => {
    setIsGenerating(true);
    
    // Simulate document generation
    setTimeout(() => {
      const templates = {
        proposal: generateProposal(),
        quote: generateQuote(),
        sow: generateSOW(),
        contract: generateContract()
      };
      
      setGeneratedDocument(templates[documentData.templateType as keyof typeof templates]);
      setIsGenerating(false);
    }, 2000);
  };

  const generateProposal = () => {
    return `# PROJECT PROPOSAL

**To:** ${documentData.clientName}
**From:** ${documentData.companyName}
**Date:** ${new Date().toLocaleDateString()}
**Contact:** ${documentData.contactPerson}

---

## EXECUTIVE SUMMARY

We are pleased to present this proposal for **${documentData.projectTitle}**. Our team at ${documentData.companyName} has extensive experience in delivering high-quality solutions that drive business value and operational excellence.

## PROJECT OVERVIEW

**Project Description:**
${documentData.projectDescription}

**Key Deliverables:**
${documentData.deliverables}

**Project Timeline:** ${documentData.timeline}

## OUR APPROACH

Our proven methodology ensures successful project delivery through:

1. **Discovery & Analysis Phase**
   - Comprehensive requirements gathering
   - Stakeholder interviews and workshops
   - Current state assessment

2. **Design & Planning Phase**
   - Solution architecture design
   - Detailed project planning
   - Risk assessment and mitigation

3. **Implementation Phase**
   - Agile development methodology
   - Regular sprint reviews and demos
   - Continuous quality assurance

4. **Deployment & Support Phase**
   - Production deployment
   - User training and documentation
   - Ongoing support and maintenance

## INVESTMENT

**Total Investment:** $${documentData.investment.toLocaleString()}

This investment includes all development, testing, deployment, and initial support phases.

## TERMS & CONDITIONS

${documentData.terms}

## NEXT STEPS

We look forward to partnering with you on this exciting project. Please review this proposal and let us know if you have any questions or would like to schedule a meeting to discuss further.

---

*This proposal is valid for 30 days from the date above.*

**${documentData.contactPerson}**
${documentData.companyName}
`;
  };

  const generateQuote = () => {
    return `# PRICE QUOTATION

**Quote #:** QT-${Date.now().toString().slice(-6)}
**Date:** ${new Date().toLocaleDateString()}
**Valid Until:** ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}

---

**Bill To:**
${documentData.clientName}

**From:**
${documentData.companyName}
${documentData.contactPerson}

---

## PROJECT DETAILS

**Project:** ${documentData.projectTitle}
**Duration:** ${documentData.timeline}
**Description:** ${documentData.projectDescription}

## PRICING BREAKDOWN

| Item | Description | Amount |
|------|-------------|--------|
| Professional Services | ${documentData.projectTitle} | $${documentData.investment.toLocaleString()} |
| **TOTAL** | | **$${documentData.investment.toLocaleString()}** |

## PAYMENT TERMS

${documentData.terms}

## ACCEPTANCE

By signing below, you agree to the terms and pricing outlined in this quotation.

**Client Signature:** _________________________ **Date:** _________

**${documentData.companyName} Representative:** _________________________ **Date:** _________

---

*Thank you for considering ${documentData.companyName} for your project needs.*
`;
  };

  const generateSOW = () => {
    return `# STATEMENT OF WORK

**Project:** ${documentData.projectTitle}
**Client:** ${documentData.clientName}
**Service Provider:** ${documentData.companyName}
**Effective Date:** ${new Date().toLocaleDateString()}

---

## 1. PROJECT SCOPE

**Objective:**
${documentData.projectDescription}

**Deliverables:**
${documentData.deliverables}

## 2. PROJECT TIMELINE

**Duration:** ${documentData.timeline}

**Key Milestones:**
- Phase 1: Discovery & Planning (Month 1)
- Phase 2: Design & Development (Months 2-${Math.ceil((dealData?.duration || 12) * 0.7)})
- Phase 3: Testing & Deployment (Month ${dealData?.duration || 12})
- Phase 4: Training & Handover (Final month)

## 3. RESPONSIBILITIES

**Client Responsibilities:**
- Provide timely feedback and approvals
- Assign dedicated project stakeholders
- Provide necessary access and information

**Service Provider Responsibilities:**
- Deliver all specified deliverables
- Maintain project schedule and quality standards
- Provide regular status updates

## 4. PAYMENT TERMS

**Total Value:** $${documentData.investment.toLocaleString()}
**Payment Schedule:** ${documentData.terms}

## 5. CHANGE MANAGEMENT

Any changes to this SOW must be documented and approved by both parties in writing.

## 6. ACCEPTANCE CRITERIA

Each deliverable will be considered complete upon written acceptance by the client or 5 business days after delivery if no feedback is provided.

---

**Authorized Signatures:**

**Client:** _________________________ **Date:** _________

**Service Provider:** _________________________ **Date:** _________
`;
  };

  const generateContract = () => {
    return `# SERVICE CONTRACT

**Contract #:** SC-${Date.now().toString().slice(-6)}
**Effective Date:** ${new Date().toLocaleDateString()}

**PARTIES:**
- **Client:** ${documentData.clientName}
- **Service Provider:** ${documentData.companyName}

---

## 1. SERVICES

The Service Provider agrees to perform the following services:
- ${documentData.projectTitle}
- ${documentData.projectDescription}

## 2. TERM

This contract shall commence on the effective date and continue for ${documentData.timeline}.

## 3. COMPENSATION

**Total Contract Value:** $${documentData.investment.toLocaleString()}
**Payment Terms:** ${documentData.terms}

## 4. INTELLECTUAL PROPERTY

All work products and deliverables created under this contract shall become the property of the Client upon full payment.

## 5. CONFIDENTIALITY

Both parties agree to maintain confidentiality of all proprietary information shared during the project.

## 6. WARRANTIES

Service Provider warrants that all services will be performed in a professional manner consistent with industry standards.

## 7. LIMITATION OF LIABILITY

Service Provider's liability shall not exceed the total contract value.

## 8. TERMINATION

Either party may terminate this contract with 30 days written notice.

## 9. GOVERNING LAW

This contract shall be governed by the laws of [Your State/Country].

---

**SIGNATURES:**

**Client:** 
_________________________
${documentData.clientName}
Date: _________

**Service Provider:**
_________________________
${documentData.contactPerson}, ${documentData.companyName}
Date: _________
`;
  };

  const exportDocument = (format: 'pdf' | 'word') => {
    // In a real implementation, this would use a PDF/Word generation library
    const blob = new Blob([generatedDocument], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${documentData.templateType}-${documentData.clientName.replace(/\s+/g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <Card className="border-primary/20 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10">
          <CardTitle className="flex items-center gap-2 text-primary">
            <FileText className="h-5 w-5" />
            Professional Document Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Document Configuration */}
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-2"
              >
                <Label htmlFor="templateType">Document Type</Label>
                <Select value={documentData.templateType} onValueChange={(value) => updateDocumentData('templateType', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {templateTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-2"
              >
                <Label htmlFor="clientName">Client Name</Label>
                <Input
                  id="clientName"
                  value={documentData.clientName}
                  onChange={(e) => updateDocumentData('clientName', e.target.value)}
                  placeholder="Enter client name"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-2"
              >
                <Label htmlFor="projectTitle">Project Title</Label>
                <Input
                  id="projectTitle"
                  value={documentData.projectTitle}
                  onChange={(e) => updateDocumentData('projectTitle', e.target.value)}
                  placeholder="Enter project title"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-2"
              >
                <Label htmlFor="investment">Investment Amount ($)</Label>
                <Input
                  id="investment"
                  type="number"
                  value={documentData.investment}
                  onChange={(e) => updateDocumentData('investment', Number(e.target.value))}
                  placeholder="Enter total investment"
                />
              </motion.div>
            </div>

            {/* Additional Details */}
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-2"
              >
                <Label htmlFor="projectDescription">Project Description</Label>
                <Textarea
                  id="projectDescription"
                  value={documentData.projectDescription}
                  onChange={(e) => updateDocumentData('projectDescription', e.target.value)}
                  placeholder="Describe the project scope and objectives"
                  className="min-h-[80px]"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-2"
              >
                <Label htmlFor="deliverables">Key Deliverables</Label>
                <Textarea
                  id="deliverables"
                  value={documentData.deliverables}
                  onChange={(e) => updateDocumentData('deliverables', e.target.value)}
                  placeholder="List the main deliverables"
                  className="min-h-[80px]"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-2"
              >
                <Label htmlFor="terms">Terms & Conditions</Label>
                <Input
                  id="terms"
                  value={documentData.terms}
                  onChange={(e) => updateDocumentData('terms', e.target.value)}
                  placeholder="e.g., Net 30 payment terms"
                />
              </motion.div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex gap-3 pt-4 border-t"
          >
            <Button 
              onClick={generateDocument} 
              disabled={isGenerating || !documentData.clientName || !documentData.projectTitle}
              className="bg-gradient-to-r from-primary to-primary/80"
            >
              {isGenerating ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="h-4 w-4 mr-2"
                >
                  <FileText className="h-4 w-4" />
                </motion.div>
              ) : (
                <FileText className="h-4 w-4 mr-2" />
              )}
              {isGenerating ? 'Generating...' : 'Generate Document'}
            </Button>

            {generatedDocument && (
              <>
                <Button variant="outline" onClick={() => exportDocument('pdf')}>
                  <Download className="h-4 w-4 mr-2" />
                  Export PDF
                </Button>
                <Button variant="outline" onClick={() => exportDocument('word')}>
                  <Download className="h-4 w-4 mr-2" />
                  Export Word
                </Button>
              </>
            )}
          </motion.div>
        </CardContent>
      </Card>

      {/* Document Preview */}
      {generatedDocument && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-primary/20 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-primary" />
                Document Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-white p-6 border rounded-lg shadow-sm max-h-[600px] overflow-y-auto">
                <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                  {generatedDocument}
                </pre>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
};