import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Edit } from "lucide-react";
import { Equipment } from "@/models/models";

interface EquipmentCardProps {
  equipment: Equipment;
  showActions?: "buyer" | "seller" | "none";
  onContact?: (equipment: Equipment) => void;
  onEdit?: (equipment: Equipment) => void;
}

const statusMap = {
  unused: { label: "Unused", class: "status-unused" },
  used: { label: "Used", class: "status-used" },
  partial: { label: "Partially Used", class: "status-partial" },
};

export const EquipmentCard = ({ 
  equipment, 
  showActions = "none", 
  onContact, 
  onEdit 
}: EquipmentCardProps) => {
  return (
    <Card className="shadow-card transition-smooth hover:shadow-medical group overflow-hidden">
      <div className="aspect-video overflow-hidden">
        <img 
          src={equipment.image} 
          alt={equipment.name}
          className="w-full h-full object-cover transition-smooth group-hover:scale-105"
        />
      </div>
      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-lg text-foreground">{equipment.name}</h3>
            <p className="text-sm text-muted-foreground">by {equipment.seller}</p>
          </div>
          
          <div className="flex items-center justify-between">
            <Badge className={statusMap[equipment.status].class}>
              {statusMap[equipment.status].label}
            </Badge>
            <span className="text-xl font-bold text-primary">
              ${equipment.price.toLocaleString()}
            </span>
          </div>
          
          {showActions === "buyer" && (
            <Button 
              onClick={() => onContact?.(equipment)}
              className="w-full gradient-medical text-primary-foreground shadow-button transition-bounce hover:scale-105"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Contact Seller
            </Button>
          )}
          
          {showActions === "seller" && (
            <Button 
              onClick={() => onEdit?.(equipment)}
              variant="outline"
              className="w-full transition-smooth hover:bg-accent"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Listing
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};