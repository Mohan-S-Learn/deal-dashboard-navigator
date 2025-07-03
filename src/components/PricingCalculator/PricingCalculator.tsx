import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calculator, TrendingUp, DollarSign } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PricingData {
  baseRate: number;
  resources: number;
  duration: number;
  complexity: number;
  margin: number;
  overhead: number;
}

interface CalculatedPricing {
  baseCost: number;
  complexityMultiplier: number;
  overheadCost: number;
  totalCost: number;
  margin: number;
  finalPrice: number;
}

interface PricingCalculatorProps {
  onPricingChange: (pricing: CalculatedPricing) => void;
  parameters?: {
    duration: number;
    complexity: number;
    resources: number;
  };
}

export const PricingCalculator: React.FC<PricingCalculatorProps> = ({
  onPricingChange,
  parameters
}) => {
  const [pricing, setPricing] = useState<PricingData>({
    baseRate: 100,
    resources: parameters?.resources || 10,
    duration: parameters?.duration || 12,
    complexity: parameters?.complexity || 5,
    margin: 25,
    overhead: 15
  });

  const [calculated, setCalculated] = useState<CalculatedPricing>({
    baseCost: 0,
    complexityMultiplier: 1,
    overheadCost: 0,
    totalCost: 0,
    margin: 0,
    finalPrice: 0
  });

  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    if (parameters) {
      setPricing(prev => ({
        ...prev,
        resources: parameters.resources,
        duration: parameters.duration,
        complexity: parameters.complexity
      }));
    }
  }, [parameters]);

  useEffect(() => {
    calculatePricing();
  }, [pricing]);

  const calculatePricing = () => {
    const baseCost = pricing.baseRate * pricing.resources * pricing.duration * 160; // 160 hours per month
    const complexityMultiplier = 1 + (pricing.complexity - 1) * 0.1; // 10% increase per complexity point
    const adjustedCost = baseCost * complexityMultiplier;
    const overheadCost = adjustedCost * (pricing.overhead / 100);
    const totalCost = adjustedCost + overheadCost;
    const margin = totalCost * (pricing.margin / 100);
    const finalPrice = totalCost + margin;

    const newCalculated = {
      baseCost,
      complexityMultiplier,
      overheadCost,
      totalCost,
      margin,
      finalPrice
    };

    setCalculated(newCalculated);
    onPricingChange(newCalculated);
    setAnimationKey(prev => prev + 1);
  };

  const updatePricing = (key: keyof PricingData, value: number) => {
    setPricing(prev => ({ ...prev, [key]: value }));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const NumberCard = ({ label, value, icon: Icon, color = "primary" }: {
    label: string;
    value: number;
    icon: any;
    color?: string;
  }) => (
    <motion.div
      key={`${label}-${animationKey}`}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3, type: "spring" }}
      className={`p-4 rounded-lg bg-gradient-to-br from-${color}/10 to-${color}/5 border border-${color}/20`}
    >
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`h-4 w-4 text-${color}`} />
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
      </div>
      <motion.div
        key={value}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`text-2xl font-bold text-${color}`}
      >
        {formatCurrency(value)}
      </motion.div>
    </motion.div>
  );

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
            <Calculator className="h-5 w-5" />
            Real-time Pricing Calculator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          {/* Input Parameters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-2"
            >
              <Label htmlFor="baseRate">Base Rate ($/hour)</Label>
              <Input
                id="baseRate"
                type="number"
                value={pricing.baseRate}
                onChange={(e) => updatePricing('baseRate', Number(e.target.value))}
                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-2"
            >
              <Label htmlFor="margin">Margin (%)</Label>
              <Input
                id="margin"
                type="number"
                value={pricing.margin}
                onChange={(e) => updatePricing('margin', Number(e.target.value))}
                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-2"
            >
              <Label htmlFor="overhead">Overhead (%)</Label>
              <Input
                id="overhead"
                type="number"
                value={pricing.overhead}
                onChange={(e) => updatePricing('overhead', Number(e.target.value))}
                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              />
            </motion.div>
          </div>

          {/* Calculation Results */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <NumberCard
              label="Base Cost"
              value={calculated.baseCost}
              icon={DollarSign}
              color="blue"
            />
            <NumberCard
              label="Overhead Cost"
              value={calculated.overheadCost}
              icon={TrendingUp}
              color="orange"
            />
            <NumberCard
              label="Margin"
              value={calculated.margin}
              icon={TrendingUp}
              color="green"
            />
          </div>

          {/* Final Price */}
          <motion.div
            key={`final-${animationKey}`}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="text-center p-6 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg border border-primary/20"
          >
            <motion.div
              key={calculated.finalPrice}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, type: "spring" }}
            >
              <h3 className="text-lg font-semibold text-muted-foreground mb-2">Final Project Price</h3>
              <div className="text-4xl font-bold text-primary">
                {formatCurrency(calculated.finalPrice)}
              </div>
              <div className="text-sm text-muted-foreground mt-2">
                Complexity Multiplier: {calculated.complexityMultiplier.toFixed(1)}x
              </div>
            </motion.div>
          </motion.div>

          {/* Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-2 text-sm text-muted-foreground"
          >
            <div className="flex justify-between">
              <span>Resources × Duration × Rate:</span>
              <span>{pricing.resources} × {pricing.duration} months × ${pricing.baseRate}/hr</span>
            </div>
            <div className="flex justify-between">
              <span>Working hours per month:</span>
              <span>160 hours</span>
            </div>
            <div className="flex justify-between">
              <span>Complexity factor:</span>
              <span>{calculated.complexityMultiplier.toFixed(1)}x</span>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};