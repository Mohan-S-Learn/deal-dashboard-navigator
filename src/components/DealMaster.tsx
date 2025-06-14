import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { CalendarIcon, ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface DealMasterProps {
  dealId: string;
  quoteName: string;
  onBack: () => void;
}

interface Market {
  id: number;
  name: string;
}

interface ResourceType {
  id: number;
  name: string;
}

interface Geography {
  id: number;
  country: string;
  city: string;
  region: string;
}

interface ServiceCategory {
  id: number;
  level: number;
  name: string;
  parent_id: number | null;
}

interface VolumeDiscountRange {
  id?: number;
  range_start: number;
  range_end: number | null;
  discount_percent: number;
}

interface QuoteData {
  knowledge_transition_start_date: Date | null;
  knowledge_transition_end_date: Date | null;
  steady_state_start_date: Date | null;
  steady_state_end_date: Date | null;
  overall_duration_months: number | null;
  market_id: number | null;
  deal_discount_amount: number | null;
  deal_discount_percent: number | null;
  travel_percent: number | null;
  training_percent: number | null;
  other_costs_percent: number | null;
  infrastructure_percent: number | null;
  compliance_percent: number | null;
  licenses_percent: number | null;
}

const DealMaster: React.FC<DealMasterProps> = ({ dealId, quoteName, onBack }) => {
  const [quoteData, setQuoteData] = useState<QuoteData>({
    knowledge_transition_start_date: null,
    knowledge_transition_end_date: null,
    steady_state_start_date: null,
    steady_state_end_date: null,
    overall_duration_months: null,
    market_id: null,
    deal_discount_amount: null,
    deal_discount_percent: null,
    travel_percent: null,
    training_percent: null,
    other_costs_percent: null,
    infrastructure_percent: null,
    compliance_percent: null,
    licenses_percent: null,
  });

  const [markets, setMarkets] = useState<Market[]>([]);
  const [resourceTypes, setResourceTypes] = useState<ResourceType[]>([]);
  const [geographies, setGeographies] = useState<Geography[]>([]);
  const [serviceCategories, setServiceCategories] = useState<ServiceCategory[]>([]);
  const [selectedResourceTypes, setSelectedResourceTypes] = useState<number[]>([]);
  const [selectedGeographies, setSelectedGeographies] = useState<number[]>([]);
  const [selectedCategories, setSelectedCategories] = useState({
    level1: null as number | null,
    level2: null as number | null,
    level3: null as number | null,
  });
  const [volumeDiscounts, setVolumeDiscounts] = useState<VolumeDiscountRange[]>([]);
  const [loading, setLoading] = useState(true);

  const { toast } = useToast();

  useEffect(() => {
    loadMasterData();
    loadQuoteData();
  }, [dealId, quoteName]);

  useEffect(() => {
    calculateDuration();
  }, [quoteData.knowledge_transition_start_date, quoteData.steady_state_end_date]);

  const loadMasterData = async () => {
    try {
      // Load markets
      const { data: marketsData } = await supabase.from('Market').select('*').order('name');
      setMarkets(marketsData || []);

      // Load resource types
      const { data: resourceTypesData } = await supabase.from('ResourceType').select('*').order('name');
      setResourceTypes(resourceTypesData || []);

      // Load geographies
      const { data: geographiesData } = await supabase.from('Geography').select('*').order('country, city');
      setGeographies(geographiesData || []);

      // Load service categories
      const { data: categoriesData } = await supabase.from('ServiceCategory').select('*').order('level, name');
      setServiceCategories(categoriesData || []);
    } catch (error) {
      console.error('Error loading master data:', error);
      toast({
        title: "Error",
        description: "Failed to load master data",
        variant: "destructive"
      });
    }
  };

  const loadQuoteData = async () => {
    try {
      setLoading(true);
      
      // Load quote data
      const { data: quote } = await supabase
        .from('Quotes')
        .select('*')
        .eq('Deal_Id', dealId)
        .eq('Quote_Name', quoteName)
        .single();

      if (quote) {
        setQuoteData({
          knowledge_transition_start_date: quote.knowledge_transition_start_date ? new Date(quote.knowledge_transition_start_date) : null,
          knowledge_transition_end_date: quote.knowledge_transition_end_date ? new Date(quote.knowledge_transition_end_date) : null,
          steady_state_start_date: quote.steady_state_start_date ? new Date(quote.steady_state_start_date) : null,
          steady_state_end_date: quote.steady_state_end_date ? new Date(quote.steady_state_end_date) : null,
          overall_duration_months: quote.overall_duration_months,
          market_id: quote.market_id,
          deal_discount_amount: quote.deal_discount_amount,
          deal_discount_percent: quote.deal_discount_percent,
          travel_percent: quote.travel_percent,
          training_percent: quote.training_percent,
          other_costs_percent: quote.other_costs_percent,
          infrastructure_percent: quote.infrastructure_percent,
          compliance_percent: quote.compliance_percent,
          licenses_percent: quote.licenses_percent,
        });
      }

      // Load selected resource types
      const { data: resourceTypeData } = await supabase
        .from('QuoteResourceType')
        .select('resource_type_id')
        .eq('Deal_Id', dealId)
        .eq('Quote_Name', quoteName);
      
      setSelectedResourceTypes(resourceTypeData?.map(rt => rt.resource_type_id) || []);

      // Load selected geographies
      const { data: geographyData } = await supabase
        .from('QuoteGeography')
        .select('geography_id')
        .eq('Deal_Id', dealId)
        .eq('Quote_Name', quoteName);
      
      setSelectedGeographies(geographyData?.map(g => g.geography_id) || []);

      // Load service categories
      const { data: categoryData } = await supabase
        .from('QuoteServiceCategory')
        .select('*')
        .eq('Deal_Id', dealId)
        .eq('Quote_Name', quoteName)
        .single();
      
      if (categoryData) {
        setSelectedCategories({
          level1: categoryData.category_level_1_id,
          level2: categoryData.category_level_2_id,
          level3: categoryData.category_level_3_id,
        });
      }

      // Load volume discounts
      const { data: volumeData } = await supabase
        .from('VolumeDiscount')
        .select('*')
        .eq('Deal_Id', dealId)
        .eq('Quote_Name', quoteName)
        .order('range_start');
      
      setVolumeDiscounts(volumeData || []);

    } catch (error) {
      console.error('Error loading quote data:', error);
      toast({
        title: "Error",
        description: "Failed to load quote data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateDuration = () => {
    if (quoteData.knowledge_transition_start_date && quoteData.steady_state_end_date) {
      const startDate = new Date(quoteData.knowledge_transition_start_date);
      const endDate = new Date(quoteData.steady_state_end_date);
      
      const months = (endDate.getFullYear() - startDate.getFullYear()) * 12 + 
                    (endDate.getMonth() - startDate.getMonth());
      
      setQuoteData(prev => ({ ...prev, overall_duration_months: months }));
    }
  };

  const handleDateChange = (field: keyof QuoteData, date: Date | undefined) => {
    setQuoteData(prev => ({ ...prev, [field]: date || null }));
  };

  const handleNumberChange = (field: keyof QuoteData, value: string) => {
    const numValue = value === '' ? null : parseFloat(value);
    setQuoteData(prev => ({ ...prev, [field]: numValue }));
  };

  const handleResourceTypeChange = (resourceTypeId: number, checked: boolean) => {
    setSelectedResourceTypes(prev => 
      checked 
        ? [...prev, resourceTypeId]
        : prev.filter(id => id !== resourceTypeId)
    );
  };

  const handleGeographyChange = (geographyId: number, checked: boolean) => {
    setSelectedGeographies(prev => 
      checked 
        ? [...prev, geographyId]
        : prev.filter(id => id !== geographyId)
    );
  };

  const addVolumeDiscount = () => {
    const lastRange = volumeDiscounts[volumeDiscounts.length - 1];
    const newStart = lastRange ? (lastRange.range_end || 0) + 1 : 0;
    
    setVolumeDiscounts(prev => [...prev, {
      range_start: newStart,
      range_end: null,
      discount_percent: 0
    }]);
  };

  const removeVolumeDiscount = (index: number) => {
    setVolumeDiscounts(prev => prev.filter((_, i) => i !== index));
  };

  const updateVolumeDiscount = (index: number, field: keyof VolumeDiscountRange, value: number) => {
    setVolumeDiscounts(prev => prev.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ));
  };

  const saveData = async () => {
    try {
      // Update quote data
      const { error: quoteError } = await supabase
        .from('Quotes')
        .update({
          knowledge_transition_start_date: quoteData.knowledge_transition_start_date?.toISOString().split('T')[0],
          knowledge_transition_end_date: quoteData.knowledge_transition_end_date?.toISOString().split('T')[0],
          steady_state_start_date: quoteData.steady_state_start_date?.toISOString().split('T')[0],
          steady_state_end_date: quoteData.steady_state_end_date?.toISOString().split('T')[0],
          overall_duration_months: quoteData.overall_duration_months,
          market_id: quoteData.market_id,
          deal_discount_amount: quoteData.deal_discount_amount,
          deal_discount_percent: quoteData.deal_discount_percent,
          travel_percent: quoteData.travel_percent,
          training_percent: quoteData.training_percent,
          other_costs_percent: quoteData.other_costs_percent,
          infrastructure_percent: quoteData.infrastructure_percent,
          compliance_percent: quoteData.compliance_percent,
          licenses_percent: quoteData.licenses_percent,
        })
        .eq('Deal_Id', dealId)
        .eq('Quote_Name', quoteName);

      if (quoteError) throw quoteError;

      // Save resource types
      await supabase.from('QuoteResourceType').delete().eq('Deal_Id', dealId).eq('Quote_Name', quoteName);
      if (selectedResourceTypes.length > 0) {
        const resourceTypeInserts = selectedResourceTypes.map(rtId => ({
          Deal_Id: dealId,
          Quote_Name: quoteName,
          resource_type_id: rtId
        }));
        await supabase.from('QuoteResourceType').insert(resourceTypeInserts);
      }

      // Save geographies
      await supabase.from('QuoteGeography').delete().eq('Deal_Id', dealId).eq('Quote_Name', quoteName);
      if (selectedGeographies.length > 0) {
        const geographyInserts = selectedGeographies.map(gId => ({
          Deal_Id: dealId,
          Quote_Name: quoteName,
          geography_id: gId
        }));
        await supabase.from('QuoteGeography').insert(geographyInserts);
      }

      // Save service categories
      await supabase.from('QuoteServiceCategory').delete().eq('Deal_Id', dealId).eq('Quote_Name', quoteName);
      if (selectedCategories.level1 || selectedCategories.level2 || selectedCategories.level3) {
        await supabase.from('QuoteServiceCategory').insert({
          Deal_Id: dealId,
          Quote_Name: quoteName,
          category_level_1_id: selectedCategories.level1,
          category_level_2_id: selectedCategories.level2,
          category_level_3_id: selectedCategories.level3,
        });
      }

      // Save volume discounts
      await supabase.from('VolumeDiscount').delete().eq('Deal_Id', dealId).eq('Quote_Name', quoteName);
      if (volumeDiscounts.length > 0) {
        const volumeInserts = volumeDiscounts.map(vd => ({
          Deal_Id: dealId,
          Quote_Name: quoteName,
          range_start: vd.range_start,
          range_end: vd.range_end,
          discount_percent: vd.discount_percent
        }));
        await supabase.from('VolumeDiscount').insert(volumeInserts);
      }

      toast({
        title: "Success",
        description: "Deal master data saved successfully",
      });

    } catch (error) {
      console.error('Error saving data:', error);
      toast({
        title: "Error",
        description: "Failed to save deal master data",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading deal master data...</p>
        </div>
      </div>
    );
  }

  const getFilteredCategories = (level: number, parentId?: number | null) => {
    return serviceCategories.filter(cat => 
      cat.level === level && 
      (level === 1 ? cat.parent_id === null : cat.parent_id === parentId)
    );
  };

  const parseDate = (dateString: string): Date | null => {
    if (!dateString) return null;
    
    // Check if it's in dd/mm/yyyy format
    const ddmmyyyyRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
    const match = dateString.match(ddmmyyyyRegex);
    
    if (match) {
      const day = parseInt(match[1], 10);
      const month = parseInt(match[2], 10) - 1; // Month is 0-indexed
      const year = parseInt(match[3], 10);
      
      const date = new Date(year, month, day);
      
      // Validate the date
      if (date.getDate() === day && date.getMonth() === month && date.getFullYear() === year) {
        return date;
      }
    }
    
    return null;
  };

  const formatDate = (date: Date | null): string => {
    if (!date) return '';
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleDateInputChange = (field: keyof QuoteData, value: string) => {
    const parsedDate = parseDate(value);
    setQuoteData(prev => ({ ...prev, [field]: parsedDate }));
  };

  const DatePicker = ({ value, onChange, placeholder }: { value: Date | null, onChange: (date: Date | undefined) => void, placeholder: string }) => {
    const [inputValue, setInputValue] = React.useState(formatDate(value));

    React.useEffect(() => {
      setInputValue(formatDate(value));
    }, [value]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setInputValue(newValue);
      
      const parsedDate = parseDate(newValue);
      if (parsedDate) {
        onChange(parsedDate);
      } else if (newValue === '') {
        onChange(undefined);
      }
    };

    const handleCalendarSelect = (date: Date | undefined) => {
      onChange(date);
      setInputValue(formatDate(date || null));
    };

    return (
      <Popover>
        <PopoverTrigger asChild>
          <div className="relative">
            <Input
              value={inputValue}
              onChange={handleInputChange}
              placeholder="dd/mm/yyyy"
              className="w-full pr-10"
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
              type="button"
            >
              <CalendarIcon className="h-4 w-4" />
            </Button>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar 
            mode="single" 
            selected={value || undefined} 
            onSelect={handleCalendarSelect} 
            initialFocus 
          />
        </PopoverContent>
      </Popover>
    );
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white/70 backdrop-blur-sm border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={onBack} className="flex items-center space-x-2">
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Scenarios</span>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Deal Master</h1>
                <p className="text-gray-500 font-medium">Deal ID: {dealId} | Quote: {quoteName}</p>
              </div>
            </div>
            <Button onClick={saveData} className="bg-blue-600 hover:bg-blue-700">
              Save Changes
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-8 space-y-8">
        {/* Timeline Section */}
        <Card>
          <CardHeader>
            <CardTitle>Project Timeline</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label>Knowledge Transition Start Date</Label>
              <DatePicker 
                value={quoteData.knowledge_transition_start_date} 
                onChange={(date) => handleDateChange('knowledge_transition_start_date', date)}
                placeholder="Select start date"
              />
            </div>
            <div className="space-y-2">
              <Label>Knowledge Transition End Date</Label>
              <DatePicker 
                value={quoteData.knowledge_transition_end_date} 
                onChange={(date) => handleDateChange('knowledge_transition_end_date', date)}
                placeholder="Select end date"
              />
            </div>
            <div className="space-y-2">
              <Label>Steady State Start Date</Label>
              <DatePicker 
                value={quoteData.steady_state_start_date} 
                onChange={(date) => handleDateChange('steady_state_start_date', date)}
                placeholder="Select start date"
              />
            </div>
            <div className="space-y-2">
              <Label>Steady State End Date</Label>
              <DatePicker 
                value={quoteData.steady_state_end_date} 
                onChange={(date) => handleDateChange('steady_state_end_date', date)}
                placeholder="Select end date"
              />
            </div>
            <div className="space-y-2">
              <Label>Overall Duration (Months)</Label>
              <Input 
                type="number" 
                value={quoteData.overall_duration_months || ''} 
                readOnly 
                className="bg-gray-50"
                placeholder="Auto-calculated"
              />
            </div>
          </CardContent>
        </Card>

        {/* Market and Resources Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Market & Resources</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Market</Label>
                <Select value={quoteData.market_id?.toString() || ''} onValueChange={(value) => setQuoteData(prev => ({ ...prev, market_id: parseInt(value) }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select market" />
                  </SelectTrigger>
                  <SelectContent>
                    {markets.map(market => (
                      <SelectItem key={market.id} value={market.id.toString()}>{market.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Resource Categories</Label>
                <div className="space-y-2">
                  {resourceTypes.map(rt => (
                    <div key={rt.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`resource-${rt.id}`}
                        checked={selectedResourceTypes.includes(rt.id)}
                        onCheckedChange={(checked) => handleResourceTypeChange(rt.id, checked as boolean)}
                      />
                      <Label htmlFor={`resource-${rt.id}`}>{rt.name}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Deal Discount</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Discount Amount ($)</Label>
                <Input 
                  type="number" 
                  value={quoteData.deal_discount_amount || ''} 
                  onChange={(e) => handleNumberChange('deal_discount_amount', e.target.value)}
                  placeholder="Enter discount amount"
                />
              </div>
              <div className="space-y-2">
                <Label>Discount Percent (%)</Label>
                <Input 
                  type="number" 
                  value={quoteData.deal_discount_percent || ''} 
                  onChange={(e) => handleNumberChange('deal_discount_percent', e.target.value)}
                  placeholder="Enter discount percentage"
                  max="100"
                  step="0.01"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Volume Discounts Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Volume Discounts</CardTitle>
              <Button onClick={addVolumeDiscount} size="sm" className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Add Range</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {volumeDiscounts.map((discount, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 border rounded-lg">
                  <div className="flex-1">
                    <Label>Range Start ($)</Label>
                    <Input 
                      type="number" 
                      value={discount.range_start} 
                      onChange={(e) => updateVolumeDiscount(index, 'range_start', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="flex-1">
                    <Label>Range End ($)</Label>
                    <Input 
                      type="number" 
                      value={discount.range_end || ''} 
                      onChange={(e) => updateVolumeDiscount(index, 'range_end', parseFloat(e.target.value) || 0)}
                      placeholder="Leave empty for unlimited"
                    />
                  </div>
                  <div className="flex-1">
                    <Label>Discount (%)</Label>
                    <Input 
                      type="number" 
                      value={discount.discount_percent} 
                      onChange={(e) => updateVolumeDiscount(index, 'discount_percent', parseFloat(e.target.value) || 0)}
                      max="100"
                      step="0.01"
                    />
                  </div>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={() => removeVolumeDiscount(index)}
                    className="mt-6"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {volumeDiscounts.length === 0 && (
                <p className="text-gray-500 text-center py-8">No volume discount ranges defined</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Cost Components Section */}
        <Card>
          <CardHeader>
            <CardTitle>Cost Components (% of Revenue)</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label>Travel (%)</Label>
              <Input 
                type="number" 
                value={quoteData.travel_percent || ''} 
                onChange={(e) => handleNumberChange('travel_percent', e.target.value)}
                placeholder="0.00"
                max="100"
                step="0.01"
              />
            </div>
            <div className="space-y-2">
              <Label>Training (%)</Label>
              <Input 
                type="number" 
                value={quoteData.training_percent || ''} 
                onChange={(e) => handleNumberChange('training_percent', e.target.value)}
                placeholder="0.00"
                max="100"
                step="0.01"
              />
            </div>
            <div className="space-y-2">
              <Label>Other Costs (%)</Label>
              <Input 
                type="number" 
                value={quoteData.other_costs_percent || ''} 
                onChange={(e) => handleNumberChange('other_costs_percent', e.target.value)}
                placeholder="0.00"
                max="100"
                step="0.01"
              />
            </div>
            <div className="space-y-2">
              <Label>Infrastructure (%)</Label>
              <Input 
                type="number" 
                value={quoteData.infrastructure_percent || ''} 
                onChange={(e) => handleNumberChange('infrastructure_percent', e.target.value)}
                placeholder="0.00"
                max="100"
                step="0.01"
              />
            </div>
            <div className="space-y-2">
              <Label>Compliance (%)</Label>
              <Input 
                type="number" 
                value={quoteData.compliance_percent || ''} 
                onChange={(e) => handleNumberChange('compliance_percent', e.target.value)}
                placeholder="0.00"
                max="100"
                step="0.01"
              />
            </div>
            <div className="space-y-2">
              <Label>Licenses (%)</Label>
              <Input 
                type="number" 
                value={quoteData.licenses_percent || ''} 
                onChange={(e) => handleNumberChange('licenses_percent', e.target.value)}
                placeholder="0.00"
                max="100"
                step="0.01"
              />
            </div>
          </CardContent>
        </Card>

        {/* Geography Section */}
        <Card>
          <CardHeader>
            <CardTitle>Geography & Service Locations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-60 overflow-y-auto">
              {geographies.map(geo => (
                <div key={geo.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`geo-${geo.id}`}
                    checked={selectedGeographies.includes(geo.id)}
                    onCheckedChange={(checked) => handleGeographyChange(geo.id, checked as boolean)}
                  />
                  <Label htmlFor={`geo-${geo.id}`} className="text-sm">
                    {geo.city}, {geo.country}
                  </Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Service Categories Section */}
        <Card>
          <CardHeader>
            <CardTitle>Service Categories</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label>Service Level 1</Label>
              <Select 
                value={selectedCategories.level1?.toString() || ''} 
                onValueChange={(value) => setSelectedCategories(prev => ({ ...prev, level1: parseInt(value), level2: null, level3: null }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select service category" />
                </SelectTrigger>
                <SelectContent>
                  {getFilteredCategories(1).map(cat => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Service Level 2</Label>
              <Select 
                value={selectedCategories.level2?.toString() || ''} 
                onValueChange={(value) => setSelectedCategories(prev => ({ ...prev, level2: parseInt(value), level3: null }))}
                disabled={!selectedCategories.level1}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select service subcategory" />
                </SelectTrigger>
                <SelectContent>
                  {getFilteredCategories(2, selectedCategories.level1).map(cat => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Service Level 3</Label>
              <Select 
                value={selectedCategories.level3?.toString() || ''} 
                onValueChange={(value) => setSelectedCategories(prev => ({ ...prev, level3: parseInt(value) }))}
                disabled={!selectedCategories.level2}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select specific service" />
                </SelectTrigger>
                <SelectContent>
                  {getFilteredCategories(3, selectedCategories.level2).map(cat => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default DealMaster;
