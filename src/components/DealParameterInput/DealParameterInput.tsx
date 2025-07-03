import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Save, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

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

interface DealParameterInputProps {
  onParametersChange: (params: DealParameters) => void;
  onSave: (params: DealParameters) => void;
}

export const DealParameterInput: React.FC<DealParameterInputProps> = ({
  onParametersChange,
  onSave
}) => {
  const [parameters, setParameters] = useState<DealParameters>({
    scope: '',
    duration: 12,
    location: '',
    clientType: '',
    projectSize: 'medium',
    complexity: 5,
    resources: 10,
    description: ''
  });

  const updateParameter = (key: keyof DealParameters, value: any) => {
    const updated = { ...parameters, [key]: value };
    setParameters(updated);
    onParametersChange(updated);
  };

  const handleSave = () => {
    onSave(parameters);
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
            <Calendar className="h-5 w-5" />
            Deal Parameter Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Scope */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-2"
            >
              <Label htmlFor="scope" className="text-sm font-medium">Project Scope</Label>
              <Input
                id="scope"
                value={parameters.scope}
                onChange={(e) => updateParameter('scope', e.target.value)}
                placeholder="e.g., Enterprise Cloud Migration"
                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              />
            </motion.div>

            {/* Client Type */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-2"
            >
              <Label htmlFor="clientType" className="text-sm font-medium">Client Type</Label>
              <Select value={parameters.clientType} onValueChange={(value) => updateParameter('clientType', value)}>
                <SelectTrigger className="transition-all duration-200">
                  <SelectValue placeholder="Select client type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                  <SelectItem value="startup">Startup</SelectItem>
                  <SelectItem value="government">Government</SelectItem>
                  <SelectItem value="nonprofit">Non-profit</SelectItem>
                </SelectContent>
              </Select>
            </motion.div>

            {/* Location */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-2"
            >
              <Label htmlFor="location" className="text-sm font-medium">Primary Location</Label>
              <Input
                id="location"
                value={parameters.location}
                onChange={(e) => updateParameter('location', e.target.value)}
                placeholder="e.g., New York, USA"
                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              />
            </motion.div>

            {/* Project Size */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-2"
            >
              <Label htmlFor="projectSize" className="text-sm font-medium">Project Size</Label>
              <Select value={parameters.projectSize} onValueChange={(value) => updateParameter('projectSize', value)}>
                <SelectTrigger className="transition-all duration-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small (< $100K)</SelectItem>
                  <SelectItem value="medium">Medium ($100K - $500K)</SelectItem>
                  <SelectItem value="large">Large ($500K - $1M)</SelectItem>
                  <SelectItem value="enterprise">Enterprise (> $1M)</SelectItem>
                </SelectContent>
              </Select>
            </motion.div>
          </div>

          {/* Sliders */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-3"
            >
              <Label className="text-sm font-medium">Duration (months): {parameters.duration}</Label>
              <Slider
                value={[parameters.duration]}
                onValueChange={([value]) => updateParameter('duration', value)}
                max={36}
                min={1}
                step={1}
                className="w-full"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="space-y-3"
            >
              <Label className="text-sm font-medium">Project Complexity (1-10): {parameters.complexity}</Label>
              <Slider
                value={[parameters.complexity]}
                onValueChange={([value]) => updateParameter('complexity', value)}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="space-y-3"
            >
              <Label className="text-sm font-medium">Required Resources: {parameters.resources}</Label>
              <Slider
                value={[parameters.resources]}
                onValueChange={([value]) => updateParameter('resources', value)}
                max={100}
                min={1}
                step={1}
                className="w-full"
              />
            </motion.div>
          </div>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="space-y-2"
          >
            <Label htmlFor="description" className="text-sm font-medium">Project Description</Label>
            <Textarea
              id="description"
              value={parameters.description}
              onChange={(e) => updateParameter('description', e.target.value)}
              placeholder="Describe the project requirements, objectives, and key deliverables..."
              className="min-h-[100px] transition-all duration-200 focus:ring-2 focus:ring-primary/20"
            />
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="flex gap-3 pt-4 border-t"
          >
            <Button onClick={handleSave} className="flex-1 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
              <Save className="h-4 w-4 mr-2" />
              Save Parameters
            </Button>
            <Button variant="outline" onClick={() => setParameters({
              scope: '',
              duration: 12,
              location: '',
              clientType: '',
              projectSize: 'medium',
              complexity: 5,
              resources: 10,
              description: ''
            })}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};