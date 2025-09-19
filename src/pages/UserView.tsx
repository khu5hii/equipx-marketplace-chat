import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Activity, LogOut, Heart } from "lucide-react";
import { EquipmentCard } from "@/components/EquipmentCard";
import { ChatWindow } from "@/components/ChatWindow";
import { fetchProducts } from "@/services/product.service";
import { Equipment, User } from "@/models/models";
import bloodPressureImg from "@/assets/blood-pressure-monitor.jpg";
import pulseOximeterImg from "@/assets/pulse-oximeter.jpg";
import stethoscopeImg from "@/assets/stethoscope.jpg";
import { useNavigate } from "react-router-dom";

interface UserViewProps {
  user: User;
  onLogout: () => void;
}

// Mock data for demo - expanded marketplace with generated images
const allEquipment: Equipment[] = [
  {
    _id: "1",
    name: "Digital Blood Pressure Monitor",
    image: bloodPressureImg,
    status: "unused",
    price: 250,
    seller: "Dr. Sarah Johnson",
    sellerId: "seller1",
  },
  {
    _id: "2", 
    name: "Pulse Oximeter",
    image: pulseOximeterImg,
    status: "used",
    price: 85,
    seller: "Dr. Sarah Johnson",
    sellerId: "seller1",
  },
  {
    _id: "3",
    name: "Stethoscope - Cardiology Grade",
    image: stethoscopeImg,
    status: "unused",
    price: 180,
    seller: "Metro General Hospital",
    sellerId: "seller2",
  },
  {
    _id: "4",
    name: "Digital Thermometer Set",
    image: bloodPressureImg,
    status: "unused",
    price: 45,
    seller: "City Medical Center",
    sellerId: "seller3",
  },
  {
    _id: "5",
    name: "Wheelchair - Manual",
    image: stethoscopeImg,
    status: "used",
    price: 320,
    seller: "Riverside Clinic",
    sellerId: "seller4",
  },
  {
    _id: "6",
    name: "Nebulizer Machine",
    image: pulseOximeterImg,
    status: "unused",
    price: 150,
    seller: "Dr. Michael Chen",
    sellerId: "seller5",
  },
];

export const UserView = ({ user, onLogout }: UserViewProps) => {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [filteredEquipment, setFilteredEquipment] = useState<Equipment[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priceSort, setPriceSort] = useState<string>("none");
  const [chatEquipment, setChatEquipment] = useState<Equipment | null>(null);
  const navigate = useNavigate();

  // Fetch equipment data
  useEffect(() => {
    const loadEquipment = async () => {
      try {
        const products = await fetchProducts();
        setEquipment(products);
        setFilteredEquipment(products);
      } catch (error) {
        console.error("Failed to fetch equipment:", error);
      }
    };
    loadEquipment();
  }, []);

  // Apply filters
  const applyFilters = () => {
    let filtered = equipment;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.seller.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(item => item.status === statusFilter);
    }

    // Price sorting
    if (priceSort === "low-high") {
      filtered = [...filtered].sort((a, b) => a.price - b.price);
    } else if (priceSort === "high-low") {
      filtered = [...filtered].sort((a, b) => b.price - a.price);
    }

    setFilteredEquipment(filtered);
  };

  // Apply filters when dependencies change
  useEffect(() => {
    applyFilters();
  }, [searchTerm, statusFilter, priceSort]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    applyFilters();
  };

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
    applyFilters();
  };

  const handlePriceSort = (value: string) => {
    setPriceSort(value);
    applyFilters();
  };

  const handleContactSeller = (equipment: Equipment) => {
    setChatEquipment(equipment);
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear the token
    navigate("/login", { replace: true }); // Redirect to login page
  };

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
                <p className="text-sm text-muted-foreground">Medical Equipment Marketplace</p>
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
        {/* Welcome Banner */}
        <Card className="shadow-card gradient-hero mb-8">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Heart className="w-12 h-12 text-primary" />
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Welcome to EquipX Marketplace
                </h2>
                <p className="text-muted-foreground">
                  Discover quality medical equipment from trusted healthcare providers. 
                  Every purchase helps reduce waste and improve healthcare accessibility.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card className="shadow-card mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-primary" />
              Search & Filter Equipment
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search equipment or seller..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10 transition-smooth"
                  />
                </div>
              </div>
              
              <Select value={statusFilter} onValueChange={handleStatusFilter}>
                <SelectTrigger className="transition-smooth">
                  <SelectValue placeholder="Condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Conditions</SelectItem>
                  <SelectItem value="unused">Unused</SelectItem>
                  <SelectItem value="used">Used</SelectItem>
                  <SelectItem value="partial">Partially Used</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={priceSort} onValueChange={handlePriceSort}>
                <SelectTrigger className="transition-smooth">
                  <SelectValue placeholder="Sort by Price" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Sorting</SelectItem>
                  <SelectItem value="low-high">Price: Low to High</SelectItem>
                  <SelectItem value="high-low">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Equipment Grid */}
        <Card className="shadow-medical">
          <CardHeader className="gradient-medical text-primary-foreground">
            <CardTitle>Available Equipment ({filteredEquipment.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {filteredEquipment.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEquipment.map((item) => (
                  <EquipmentCard
                    key={item._id}
                    equipment={item}
                    showActions="buyer"
                    onContact={handleContactSeller}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No equipment found
                </h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

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