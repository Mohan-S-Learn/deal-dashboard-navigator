import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DealParameterInput } from '../components/DealParameterInput/DealParameterInput';
import { PricingCalculator } from '../components/PricingCalculator/PricingCalculator';
import { ScenarioAnalysis } from '../components/ScenarioAnalysis/ScenarioAnalysis';
import { AIAssistant } from '../components/AIAssistant/AIAssistant';
import { DocumentGenerator } from '../components/DocumentGenerator/DocumentGenerator';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calculator, Target, Bot, FileText, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

interface AdvancedPricingPortalProps {
  onBack: () => void;
}

interface DealParameters {
  scope: string;
  duration: number;
  location: string;
  clientType: string;
  projectSize: string;
  complexity: number;
  resources: number;
  description: string;
}

interface CalculatedPricing {
  baseCost: number;
  complexityMultiplier: number;
  overheadCost: number;
  totalCost: number;
  margin: number;
  finalPrice: number;
}

export const AdvancedPricingPortal: React.FC<AdvancedPricingPortalProps> = ({ onBack }) => {
  const [dealParameters, setDealParameters] = useState<DealParameters>({
    scope: '',
    duration: 12,
    location: '',
    clientType: '',
    projectSize: 'medium',
    complexity: 5,
    resources: 10,
    description: ''
  });

  const [calculatedPricing, setCalculatedPricing] = useState<CalculatedPricing>({
    baseCost: 0,
    complexityMultiplier: 1,
    overheadCost: 0,
    totalCost: 0,
    margin: 0,
    finalPrice: 0
  });

  const handleParametersChange = (params: DealParameters) => {
    setDealParameters(params);
  };

  const handlePricingChange = (pricing: CalculatedPricing) => {
    setCalculatedPricing(pricing);
  };

  const handleSaveParameters = (params: DealParameters) => {
    console.log('Saving deal parameters:', params);
    // In a real implementation, this would save to Supabase
  };

  const tabVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={onBack} className="flex items-center space-x-2">
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Dashboard</span>
              </Button>
              <div className="h-6 w-px bg-border" />
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Advanced Pricing Portal
                </h1>
                <p className="text-sm text-muted-foreground">AI-Powered Deal Configuration & Pricing</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Tabs defaultValue="parameters" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5 bg-white/60 backdrop-blur-sm border border-primary/20">
              <TabsTrigger value="parameters" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Parameters
              </TabsTrigger>
              <TabsTrigger value="pricing" className="flex items-center gap-2">
                <Calculator className="h-4 w-4" />
                Pricing
              </TabsTrigger>
              <TabsTrigger value="scenarios" className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                Scenarios
              </TabsTrigger>
              <TabsTrigger value="ai-assistant" className="flex items-center gap-2">
                <Bot className="h-4 w-4" />
                AI Assistant
              </TabsTrigger>
              <TabsTrigger value="documents" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Documents
              </TabsTrigger>
            </TabsList>

            <motion.div variants={tabVariants} initial="hidden" animate="visible">
              <TabsContent value="parameters" className="space-y-6">
                <DealParameterInput
                  onParametersChange={handleParametersChange}
                  onSave={handleSaveParameters}
                />
              </TabsContent>

              <TabsContent value="pricing" className="space-y-6">
                <PricingCalculator
                  onPricingChange={handlePricingChange}
                  parameters={{
                    duration: dealParameters.duration,
                    complexity: dealParameters.complexity,
                    resources: dealParameters.resources
                  }}
                />
              </TabsContent>

              <TabsContent value="scenarios" className="space-y-6">
                <ScenarioAnalysis
                  baseScenario={{
                    baseRate: 100,
                    margin: 25,
                    resources: dealParameters.resources,
                    duration: dealParameters.duration,
                    price: calculatedPricing.finalPrice
                  }}
                />
              </TabsContent>

              <TabsContent value="ai-assistant" className="space-y-6">
                <AIAssistant
                  dealData={{
                    scope: dealParameters.scope,
                    duration: dealParameters.duration,
                    resources: dealParameters.resources,
                    complexity: dealParameters.complexity,
                    price: calculatedPricing.finalPrice
                  }}
                />
              </TabsContent>

              <TabsContent value="documents" className="space-y-6">
                <DocumentGenerator
                  dealData={{
                    scope: dealParameters.scope,
                    duration: dealParameters.duration,
                    resources: dealParameters.resources,
                    price: calculatedPricing.finalPrice,
                    clientType: dealParameters.clientType,
                    location: dealParameters.location
                  }}
                />
              </TabsContent>
            </motion.div>
          </Tabs>
        </motion.div>

        {/* Summary Card */}
        {(dealParameters.scope || calculatedPricing.finalPrice > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8"
          >
            <Card className="border-primary/20 shadow-lg bg-gradient-to-r from-primary/5 to-secondary/5">
              <CardHeader>
                <CardTitle className="text-primary">Current Deal Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-muted-foreground">Project:</span>
                    <p className="mt-1">{dealParameters.scope || 'Not specified'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">Duration:</span>
                    <p className="mt-1">{dealParameters.duration} months</p>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">Resources:</span>
                    <p className="mt-1">{dealParameters.resources} team members</p>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">Investment:</span>
                    <p className="mt-1 text-2xl font-bold text-primary">
                      ${Math.round(calculatedPricing.finalPrice).toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};