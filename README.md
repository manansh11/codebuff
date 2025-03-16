# Image Compression Service

A modern web application for compressing images right in your browser. Built with TypeScript, Express, and Vite.

## Features

- 🖼️ Support for JPEG, PNG, and WebP formats
- 🎚️ Adjustable compression quality (1-100)
- 📊 Real-time compression statistics
- ⚡ Live preview of compressed images
- 💾 One-click download of compressed images
- 🔄 Hot reload development environment

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/manansh11/codebuff.git
   cd codebuff
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

For development (with hot reload):
```bash
npm run dev
```

This will start:
- Client at http://localhost:5173 (or another available port)
- Server at http://localhost:3001

For production:
```bash
npm run build
npm run start:server
```

## Usage

1. Click the "Pick Image" button to select an image
2. Adjust compression settings:
   - Quality (1-100)
   - Output format (JPEG, PNG, or WebP)
3. View the compression results in real-time
4. Click "Download Compressed Image" to save the result

## Project Structure

```
codebuff/
├── client/
│   └── src/
│       ├── index.html
│       ├── index.ts
│       ├── services/
│       │   └── uploadService.ts
│       └── utils/
│           └── fileHandling.ts
└── server/
    └── src/
        ├── config/
        │   └── env.ts
        ├── controllers/
        │   └── compressionController.ts
        ├── routes/
        │   └── compressionRoutes.ts
        ├── services/
        │   └── imageCompressor.ts
        └── validators/
            └── fileValidator.ts
```

## Technical Details

### Client
- Built with TypeScript and Vite
- Uses native Fetch API for uploads
- Handles binary data with Uint8Array
- Real-time image preview and stats

### Server
- Express.js with TypeScript
- Sharp.js for image processing
- CORS enabled for local development
- File validation and error handling
- Configurable compression options

## Development

The project uses several development tools:
- `nodemon` for server auto-reload
- `vite` for client hot module replacement
- `typescript` for type safety
- `concurrently` to run multiple processes

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is open source and available under the MIT License.
