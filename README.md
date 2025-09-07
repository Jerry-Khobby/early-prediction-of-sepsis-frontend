# Early Sepsis Prediction System

A modern, AI-powered web application for early detection of sepsis using patient vital signs and laboratory results. This frontend application is built with Next.js and provides an intuitive interface for healthcare professionals to input patient data and receive sepsis risk predictions.

## Features

- **Dual Input Methods**
  - Upload patient data via CSV files
  - Manual entry of patient vitals and lab results
  
- **Real-time Predictions**
  - Instant sepsis risk assessment
  - Visual representation of risk factors
  
- **Data Management**
  - Export prediction results
  - View historical predictions
  - Responsive design for all device types

- **Comprehensive Visualization**
  - Interactive charts and graphs
  - Clear presentation of risk factors
  - Model performance metrics

## Technologies Used

- **Frontend Framework**: Next.js 13+ (React)
- **UI Components**: Radix UI with custom styling
- **State Management**: React Hooks and Context API
- **Form Handling**: React Hook Form with Zod validation
- **Styling**: Tailwind CSS with dark mode support
- **Visualization**: Recharts
- **Icons**: Lucide React Icons

## Getting Started

### Prerequisites

- Node.js 16.8 or later
- npm or pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone [repository-url]
   cd final-project-frontend
   ```

2. Install dependencies:
   ```bash
   # Using pnpm (recommended)
   pnpm install
   
   # Or using npm
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory with the following variables:
   ```
   NEXT_PUBLIC_API_URL=your_api_url_here
   ```

### Running the Application

1. Start the development server:
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

2. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
final-project-frontend/
├── app/                    # App router pages
│   ├── about/              # About page
│   ├── export/             # Export functionality
│   ├── results/            # Results display
│   └── upload/             # Data upload and entry
├── components/             # Reusable components
│   ├── ui/                 # UI components
│   ├── csv-export.tsx      # CSV export functionality
│   ├── csv-result.tsx      # CSV result display
│   └── ...                 # Other components
├── lib/                    # Utility functions and hooks
│   ├── store/              # State management
│   ├── constant.ts         # Application constants
│   └── ...                 # Other utilities
└── public/                 # Static assets
```

## Usage

1. **Upload Data**
   - Navigate to the upload page
   - Choose between CSV upload or manual entry
   - Fill in the required patient information
   - Submit the form to get predictions

2. **View Results**
   - Review the sepsis risk prediction
   - Analyze the contributing factors
   - Export results if needed

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch for your feature
3. Commit your changes
4. Push to the branch
5. Create a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For any questions or feedback, please contact [your-email@example.com](mailto:your-email@example.com)

---

Built with ❤️ for better healthcare outcomes
