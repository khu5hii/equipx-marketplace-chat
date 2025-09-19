import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Activity, Package, CheckCircle, LogOut } from "lucide-react";
import { EquipmentCard } from "@/components/EquipmentCard";
import { EquipmentForm } from "@/components/EquipmentForm";
import { ChatWindow } from "@/components/ChatWindow";
import { createProduct, updateProduct, deleteProduct, fetchProductsBySeller, markAsSold, markAsArchived } from "@/services/product.service";
import { Equipment, User } from "@/models/models";
import { useNavigate } from "react-router-dom";

interface SellerDashboardProps {
  user: User;
  onLogout: () => void;
}

export const SellerDashboard = ({ user, onLogout }: SellerDashboardProps) => {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null);
  const [chatEquipment, setChatEquipment] = useState<Equipment | null>(null); // State for ChatWindow
  const navigate = useNavigate();

  useEffect(() => {
    const loadEquipment = async () => {
      try {
        const products = await fetchProductsBySeller(user._id);
        setEquipment(products); // Ensure state is updated with fetched products
      } catch (error) {
        console.error("Failed to fetch equipment:", error);
      }
    };
    loadEquipment();
  }, [user._id]);

  const handleAddEquipment = async (newEquipment: Omit<Equipment, "_id" | "seller" | "sellerId">) => {
    try {
      const createdEquipment = await createProduct({ ...newEquipment, seller: user.name, sellerId: user._id });
      setEquipment(prev => [createdEquipment, ...prev]);
      setShowForm(false);
    } catch (error) {
      console.error("Failed to add equipment:", error);
    }
  };

  const handleEditEquipment = async (updatedEquipment: Omit<Equipment, "_id" | "seller" | "sellerId">) => {
    if (!editingEquipment) return;
    try {
      const updated = await updateProduct(editingEquipment._id, updatedEquipment);
      setEquipment(prev => prev.map(item => (item._id === editingEquipment._id ? updated : item)));
      setEditingEquipment(null); // Close the form after successful update
    } catch (error) {
      console.error("Failed to update equipment:", error);
    }
  };

  const handleMarkSold = async (equipmentId: string) => {
    try {
      await markAsSold(equipmentId);
      setEquipment(prev => prev.filter(item => item._id !== equipmentId));
    } catch (error) {
      console.error("Failed to mark equipment as sold:", error);
    }
  };

  const handleMarkArchived = async (equipmentId: string) => {
    try {
        await markAsArchived(equipmentId);
        setEquipment(prev => prev.filter(item => item._id !== equipmentId));
    } catch (error) {
        console.error("Failed to mark equipment as archived:", error);
    }
};

  const handleOpenChat = (equipment: Equipment) => {
    console.log("Opening chat for equipment:", equipment); // Debugging log
    setChatEquipment(equipment); // Set the equipment for the chat window
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear the token
    navigate("/login", { replace: true }); // Redirect to login page
  };

  const activeListings = equipment.filter(item => item.saleStatus === 'active');
  const soldListings = equipment.filter(item => item.saleStatus === 'sold');
  const archivedListings = equipment.filter(item => item.saleStatus === 'archived');
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
                onClick={handleLogout}
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
                  <p className="text-3xl font-bold text-foreground">{soldListings.length + archivedListings.length}</p>
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
                <TabsTrigger value="sold">Sold ({soldListings.length})</TabsTrigger>
                <TabsTrigger value="archived">Archived ({archivedListings.length})</TabsTrigger>
              </TabsList>
              
              <TabsContent value="active" className="mt-6">
                {activeListings.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {activeListings.map((item) => (
                      <div key={item._id} className="space-y-2">
                        <EquipmentCard
                          equipment={item}
                          showActions="seller"
                          onEdit={(equipment) => setEditingEquipment(equipment)}
                          onContact={() => handleOpenChat(item)} // Pass handleOpenChat to onContact
                        />
                        <Button
                          variant="outline" 
                          size="sm"
                          onClick={() => handleMarkSold(item._id)}
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
                {soldListings.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {soldListings.map((item) => (
                      <div key={item._id} className="space-y-2">
                        <EquipmentCard equipment={item} showActions="seller" />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleMarkArchived(item._id)}
                          className="w-full text-secondary border-secondary hover:bg-secondary hover:text-secondary-foreground transition-smooth"
                        >
                          Archive
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <CheckCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No sold equipment</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="archived" className="mt-6">
                {archivedListings.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {archivedListings.map((item) => (
                      <EquipmentCard key={item._id} equipment={item} showActions="seller" />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No archived equipment</p>
                  </div>
                )}
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
          currentUserId={user._id} // Ensure currentUserId is the seller's ID
        />
      )}
    </div>
  );
};