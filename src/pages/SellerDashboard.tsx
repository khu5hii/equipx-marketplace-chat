import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Activity, Package, CheckCircle, LogOut } from "lucide-react";
import { EquipmentCard, Equipment } from "@/components/EquipmentCard";
import { EquipmentForm } from "@/components/EquipmentForm";
import { ChatWindow } from "@/components/ChatWindow";
import bloodPressureImg from "@/assets/blood-pressure-monitor.jpg";
import pulseOximeterImg from "@/assets/pulse-oximeter.jpg";

interface User {
  name: string;
  email: string;
  role: "seller" | "buyer";
}

interface SellerDashboardProps {
  user: User;
  onLogout: () => void;
}

// Mock data for demo with generated images
const initialEquipment: Equipment[] = [
  {
    id: "1",
    name: "Digital Blood Pressure Monitor",
    image: bloodPressureImg,
    status: "unused",
    price: 250,
    seller: "Dr. Sarah Johnson",
    sellerId: "seller1",
  },
  {
    id: "2", 
    name: "Pulse Oximeter",
    image: pulseOximeterImg,
    status: "used",
    price: 85,
    seller: "Dr. Sarah Johnson", 
    sellerId: "seller1",
  },
];

export const SellerDashboard = ({ user, onLogout }: SellerDashboardProps) => {
  const [equipment, setEquipment] = useState<Equipment[]>(initialEquipment);
  const [showForm, setShowForm] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null);
  const [chatEquipment, setChatEquipment] = useState<Equipment | null>(null);

  const handleAddEquipment = (newEquipment: Omit<Equipment, "id" | "seller" | "sellerId">) => {
    const equipment: Equipment = {
      ...newEquipment,
      id: Date.now().toString(),
      seller: user.name,
      sellerId: "seller1",
    };
    setEquipment(prev => [equipment, ...prev]);
    setShowForm(false);
  };

  const handleEditEquipment = (updatedEquipment: Omit<Equipment, "id" | "seller" | "sellerId">) => {
    if (!editingEquipment) return;
    
    setEquipment(prev => prev.map(item => 
      item.id === editingEquipment.id 
        ? { ...item, ...updatedEquipment }
        : item
    ));
    setEditingEquipment(null);
  };

  const handleMarkSold = (equipmentId: string) => {
    setEquipment(prev => prev.filter(item => item.id !== equipmentId));
  };

  const activeListings = equipment.filter(item => item.sellerId === "seller1");
  const totalValue = activeListings.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Activity className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-primary">EquipX</h1>
                <p className="text-sm text-muted-foreground">Seller Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="font-semibold">{user.name}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
              <Button 
                variant="outline" 
                onClick={onLogout}
                className="transition-smooth hover:bg-accent"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Listings</p>
                  <p className="text-3xl font-bold text-foreground">{activeListings.length}</p>
                </div>
                <Package className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Value</p>
                  <p className="text-3xl font-bold text-foreground">${totalValue.toLocaleString()}</p>
                </div>
                <Activity className="w-8 h-8 text-secondary" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Items Redistributed</p>
                  <p className="text-3xl font-bold text-foreground">12</p>
                </div>
                <CheckCircle className="w-8 h-8 text-secondary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Equipment Management */}
        <Card className="shadow-medical">
          <CardHeader className="gradient-medical text-primary-foreground">
            <div className="flex items-center justify-between">
              <CardTitle>My Equipment Listings</CardTitle>
              <Button 
                onClick={() => setShowForm(true)}
                className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 shadow-button transition-bounce hover:scale-105"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Equipment
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="p-6">
            <Tabs defaultValue="active" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="active">Active ({activeListings.length})</TabsTrigger>
                <TabsTrigger value="sold">Sold (3)</TabsTrigger>
                <TabsTrigger value="archived">Archived (2)</TabsTrigger>
              </TabsList>
              
              <TabsContent value="active" className="mt-6">
                {activeListings.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {activeListings.map((item) => (
                      <div key={item.id} className="space-y-2">
                        <EquipmentCard 
                          equipment={item}
                          showActions="seller"
                          onEdit={(equipment) => setEditingEquipment(equipment)}
                        />
                        <Button
                          variant="outline" 
                          size="sm"
                          onClick={() => handleMarkSold(item.id)}
                          className="w-full text-secondary border-secondary hover:bg-secondary hover:text-secondary-foreground transition-smooth"
                        >
                          Mark as Sold
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      No active listings
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Start by adding your first equipment listing
                    </p>
                    <Button 
                      onClick={() => setShowForm(true)}
                      className="gradient-medical shadow-button transition-bounce hover:scale-105"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Your First Equipment
                    </Button>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="sold" className="mt-6">
                <div className="text-center py-12">
                  <CheckCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Sold equipment history will appear here</p>
                </div>
              </TabsContent>
              
              <TabsContent value="archived" className="mt-6">
                <div className="text-center py-12">
                  <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Archived listings will appear here</p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>

      {/* Equipment Form Modal */}
      {showForm && (
        <EquipmentForm
          onSave={handleAddEquipment}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Edit Equipment Modal */}
      {editingEquipment && (
        <EquipmentForm
          equipment={editingEquipment}
          onSave={handleEditEquipment}
          onCancel={() => setEditingEquipment(null)}
        />
      )}

      {/* Chat Window */}
      {chatEquipment && (
        <ChatWindow
          equipment={chatEquipment}
          onClose={() => setChatEquipment(null)}
          currentUser={user.name}
        />
      )}
    </div>
  );
};