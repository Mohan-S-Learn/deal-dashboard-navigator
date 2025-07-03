import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, BarChart3, Target, Plus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Scenario {
  id: string;
  name: string;
  baseRate: number;
  margin: number;
  resources: number;
  duration: number;
  price: number;
  profit: number;
  color: string;
}

interface ScenarioAnalysisProps {
  baseScenario?: {
    baseRate: number;
    margin: number;
    resources: number;
    duration: number;
    price: number;
  };
}

export const ScenarioAnalysis: React.FC<ScenarioAnalysisProps> = ({ baseScenario }) => {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [newScenario, setNewScenario] = useState({
    name: '',
    baseRate: baseScenario?.baseRate || 100,
    margin: baseScenario?.margin || 25,
    resources: baseScenario?.resources || 10,
    duration: baseScenario?.duration || 12
  });

  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

  useEffect(() => {
    if (baseScenario) {
      const base: Scenario = {
        id: 'base',
        name: 'Base Scenario',
        ...baseScenario,
        profit: baseScenario.price * 0.2, // Simplified profit calculation
        color: colors[0]
      };
      setScenarios([base]);
    }
  }, [baseScenario]);

  const calculatePrice = (scenario: Omit<Scenario, 'id' | 'name' | 'price' | 'profit' | 'color'>) => {
    const baseCost = scenario.baseRate * scenario.resources * scenario.duration * 160;
    const price = baseCost * (1 + scenario.margin / 100);
    const profit = price - baseCost;
    return { price, profit };
  };

  const addScenario = () => {
    if (!newScenario.name.trim()) return;

    const { price, profit } = calculatePrice(newScenario);
    const scenario: Scenario = {
      id: Date.now().toString(),
      ...newScenario,
      price,
      profit,
      color: colors[scenarios.length % colors.length]
    };

    setScenarios(prev => [...prev, scenario]);
    setNewScenario({
      name: '',
      baseRate: baseScenario?.baseRate || 100,
      margin: baseScenario?.margin || 25,
      resources: baseScenario?.resources || 10,
      duration: baseScenario?.duration || 12
    });
  };

  const removeScenario = (id: string) => {
    if (id === 'base') return; // Don't remove base scenario
    setScenarios(prev => prev.filter(s => s.id !== id));
  };

  const chartData = scenarios.map(scenario => ({
    name: scenario.name,
    price: Math.round(scenario.price),
    profit: Math.round(scenario.profit),
    margin: scenario.margin,
    fill: scenario.color
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Add New Scenario */}
      <Card className="border-primary/20 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10">
          <CardTitle className="flex items-center gap-2 text-primary">
            <Target className="h-5 w-5" />
            What-If Scenario Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-2"
            >
              <Label htmlFor="scenarioName">Scenario Name</Label>
              <Input
                id="scenarioName"
                value={newScenario.name}
                onChange={(e) => setNewScenario(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Optimistic"
                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-2"
            >
              <Label htmlFor="rate">Rate ($/hr)</Label>
              <Input
                id="rate"
                type="number"
                value={newScenario.baseRate}
                onChange={(e) => setNewScenario(prev => ({ ...prev, baseRate: Number(e.target.value) }))}
                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-2"
            >
              <Label htmlFor="margin">Margin (%)</Label>
              <Input
                id="margin"
                type="number"
                value={newScenario.margin}
                onChange={(e) => setNewScenario(prev => ({ ...prev, margin: Number(e.target.value) }))}
                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-2"
            >
              <Label htmlFor="resources">Resources</Label>
              <Input
                id="resources"
                type="number"
                value={newScenario.resources}
                onChange={(e) => setNewScenario(prev => ({ ...prev, resources: Number(e.target.value) }))}
                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="flex items-end"
            >
              <Button onClick={addScenario} className="w-full bg-gradient-to-r from-primary to-primary/80">
                <Plus className="h-4 w-4 mr-2" />
                Add Scenario
              </Button>
            </motion.div>
          </div>
        </CardContent>
      </Card>

      {/* Scenarios List */}
      <AnimatePresence>
        {scenarios.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {scenarios.map((scenario, index) => (
              <motion.div
                key={scenario.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="relative hover:shadow-lg transition-all duration-200 border-l-4" style={{ borderLeftColor: scenario.color }}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{scenario.name}</CardTitle>
                      {scenario.id !== 'base' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeScenario(scenario.id)}
                          className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>Rate: ${scenario.baseRate}/hr</div>
                      <div>Margin: {scenario.margin}%</div>
                      <div>Resources: {scenario.resources}</div>
                      <div>Duration: {scenario.duration}m</div>
                    </div>
                    <div className="pt-2 border-t">
                      <div className="text-2xl font-bold" style={{ color: scenario.color }}>
                        ${Math.round(scenario.price).toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Profit: ${Math.round(scenario.profit).toLocaleString()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Charts */}
      {scenarios.length > 1 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="border-primary/20 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Price Comparison
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip 
                      formatter={(value: number) => [`$${value.toLocaleString()}`, 'Price']}
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="price" radius={4} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card className="border-primary/20 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Profit Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip 
                      formatter={(value: number) => [`$${value.toLocaleString()}`, 'Profit']}
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="profit" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: 'hsl(var(--primary))', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};