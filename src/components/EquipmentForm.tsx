import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";
import { Equipment } from "@/models/models";

interface EquipmentFormProps {
  equipment?: Equipment;
  onSave: (equipment: Omit<Equipment, "_id" | "seller" | "sellerId">) => void;
  onCancel: () => void;
}

export const EquipmentForm = ({ equipment, onSave, onCancel }: EquipmentFormProps) => {
  const [formData, setFormData] = useState({
    name: equipment?.name || "",
    image: equipment?.image || "",
    status: (equipment?.status as "unused" | "new" | "used") || "unused",
    price: equipment?.price || 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...formData }); // Send the updated form data to the parent component
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md shadow-medical">
        <CardHeader className="gradient-medical text-primary-foreground">
          <div className="flex items-center justify-between">
            <CardTitle>
              {equipment ? "Edit Equipment" : "Add New Equipment"}
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancel}
              className="text-primary-foreground hover:bg-primary-foreground/20"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Equipment Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Digital Blood Pressure Monitor"
                required
                className="transition-smooth"
              />
            </div>
            
            <div>
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                value={formData.image}
                onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                placeholder="https://example.com/image.jpg"
                required
                className="transition-smooth"
              />
            </div>
            
            <div>
              <Label htmlFor="status">Condition</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value: "unused" | "new" | "used") => 
                  setFormData(prev => ({ ...prev, status: value }))
                }
              >
                <SelectTrigger className="transition-smooth">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unused">Unused</SelectItem>
                  <SelectItem value="used">Used</SelectItem>
                  <SelectItem value="partial">Partially Used</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="price">Price (₹)</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                placeholder="0"
                min="0"
                required
                className="transition-smooth"
              />
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="flex-1 transition-smooth"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 gradient-medical shadow-button transition-bounce hover:scale-105"
              >
                {equipment ? "Update" : "Add"} Equipment
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};