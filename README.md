# EquipX - Medical Equipment Marketplace

A modern React-based marketplace for second-hand medical equipment that connects healthcare providers to redistribute unused and gently used equipment, reducing waste while improving healthcare accessibility.

## 🏥 Features

### Two User Types
- **Sellers (Donors)**: Healthcare providers who can list medical equipment
- **Buyers (Receivers)**: Healthcare facilities looking for equipment

### Core Functionality
- **User Registration & Authentication**: Role-based registration system
- **Equipment Listing Management**: Add, edit, and manage equipment listings
- **Advanced Search & Filtering**: Search by name, filter by condition, sort by price
- **Real-time Chat**: Direct communication between buyers and sellers
- **Responsive Design**: Mobile-first design using Tailwind CSS
- **Professional UI**: Medical-themed design with trust-building elements

### Equipment Management
- Detailed equipment information (name, image, condition, price)
- Condition tracking (Unused, Used, Partially Used)
- Seller dashboard with statistics and listing management
- Equipment status management (Active, Sold, Archived)

## 🚀 Getting Started

1. **Registration**: Choose your role (Donor/Seller or Receiver/Buyer)
2. **For Sellers**: Access your dashboard to add and manage equipment listings
3. **For Buyers**: Browse available equipment and contact sellers directly
4. **Communication**: Use the built-in chat system to negotiate and coordinate

## 🎨 Design System

- **Medical Color Palette**: Professional blues (#0EA5E9) and greens (#10B981)
- **Clean Typography**: Modern, accessible fonts
- **Medical Equipment Icons**: Healthcare-specific iconography
- **Trust Elements**: Professional medical aesthetic
- **Responsive Cards**: Mobile-optimized equipment display

## 🛠️ Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: shadcn/ui component library
- **State Management**: React hooks for local state
- **Icons**: Lucide React icon library
- **Build Tool**: Vite for fast development

## 🏗️ Architecture

### Components
- `EquipmentCard`: Reusable equipment display component
- `ChatWindow`: Real-time chat interface
- `EquipmentForm`: Add/edit equipment modal
- `Landing`: Authentication and role selection
- `SellerDashboard`: Equipment management interface
- `UserView`: Equipment browsing interface

### Design System
- Custom CSS variables in `src/index.css`
- Tailwind configuration in `tailwind.config.ts`
- Medical-themed color palette and gradients
- Professional shadows and animations

## 🎯 Key User Flows

### Seller Journey
1. Register as a Donor
2. Access seller dashboard
3. Add equipment listings with details
4. Manage active listings
5. Communicate with interested buyers
6. Mark items as sold

### Buyer Journey
1. Register as a Receiver
2. Browse equipment marketplace
3. Use search and filters to find equipment
4. Contact sellers through chat
5. Negotiate and coordinate purchase

## 🔄 Future Enhancements

This is a fully functional prototype. To add backend functionality:

- **Database Integration**: Connect to Supabase for data persistence
- **Real Authentication**: Implement secure user authentication
- **Live Chat**: Real-time messaging with WebSocket support
- **Payment Integration**: Secure transaction processing
- **Image Upload**: Equipment photo upload functionality
- **Advanced Analytics**: Dashboard metrics and insights

## 💡 Development Notes

- Built with mobile-first responsive design
- Uses semantic HTML for accessibility
- Implements SEO best practices
- Professional medical equipment imagery
- Clean, maintainable React component architecture
- Type-safe TypeScript implementation

---

**EquipX** - Extending the life of medical equipment through sustainable redistribution.
