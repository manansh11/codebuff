Below is a concise technical spec for a **range compression service** that takes an image from a user, manipulates it (compression, resizing, etc.), and returns a compressed version. The layout and rationale follow the same core guidelines: clear structure, concise responsibilities, and easy maintainability.

---

## Project Overview
- **Purpose**: Accept an image input from users, apply compression algorithms, and output a reduced-file-size image.  
- **Primary Components**:  
  - **Server**: Handles upload, validates the file, performs compression, returns compressed image.  
  - **Client**: Sends the user’s image to the server and receives the compressed version.

---

## Proposed File Structure

```
compressor-root/
│  package.json
│  tsconfig.json
│  README.md
├─ server/
│  ├─ src/
│  │  ├─ index.ts
│  │  ├─ server.ts
│  │  ├─ config/
│  │  │  └─ env.ts
│  │  ├─ routes/
│  │  │  └─ compressionRoutes.ts
│  │  ├─ controllers/
│  │  │  └─ compressionController.ts
│  │  ├─ services/
│  │  │  └─ imageCompressor.ts
│  │  └─ validators/
│  │     └─ fileValidator.ts
│  └─ tests/
│     └─ server.test.ts
└─ client/
   ├─ src/
   │  ├─ index.ts
   │  ├─ services/
   │  │  └─ uploadService.ts
   │  └─ utils/
   │     └─ fileHandling.ts
   └─ tests/
      └─ client.test.ts
```

### Why This Structure?
- **Logical Separation**: Keeps compression logic (e.g., `imageCompressor.ts`) separate from controllers and routing.  
- **Scalability**: Clear routes for new features (e.g., advanced compression options).  
- **Testing**: Dedicated `tests` folders for each side.

---

## Server: Detailed Specification

### `index.ts`
- **Purpose**: Start the server by calling `startServer()` from `server.ts`.  
- **Behavior**:  
  1. Reads environment variables from `config/env.ts`.  
  2. Invokes `startServer(port: number)`.  
  3. Logs success or startup errors.  
- **Why**: Separates the server’s initialization from the main logic, easing test and script-based usage.

### `server.ts`
- **Purpose**: Configure and instantiate the server (Express-based).  
- **Behavior**:  
  1. Sets up global middleware (JSON/body parsers, file upload handling).  
  2. Mounts routes from `routes/compressionRoutes.ts`.  
  3. Exports `startServer()` for external calls (e.g., from `index.ts`).  
- **Why**: Keeps core server logic (middleware, routing) in a single place.

### `config/env.ts`
- **Purpose**: Defines environment variables for ports, compression settings, etc.  
- **Behavior**:  
  1. Exports typed constants (e.g., `PORT`, `DEFAULT_QUALITY`).  
  2. Can handle local dev vs. production defaults.  
- **Why**: Central location to manage environment-specific configuration.

### `routes/compressionRoutes.ts`
- **Purpose**: Declares the endpoints for image compression.  
- **Behavior**:  
  - `POST /api/compress` route that accepts file uploads (multipart or base64).  
  - Possibly `GET /api/compress/status` for checking if needed.  
- **Why**: Keeps route definitions separate from actual logic, ensuring clarity.

### `controllers/compressionController.ts`
- **Purpose**: The main orchestrator that processes the user’s file.  
- **Behavior**:  
  1. Validates input via `fileValidator.ts`.  
  2. Calls `imageCompressor.ts` to perform compression.  
  3. Returns compressed output in the response.  
- **Why**: Abstracts the request/response logic from the compression details, making the flow readable and testable.

### `services/imageCompressor.ts`
- **Purpose**: Houses the actual compression logic (e.g., using older stable libraries like `sharp` pre-2023).  
- **Behavior**:  
  - Exports a function `compressImage(buffer: Buffer, options: CompressionOptions): Promise<Buffer>` that returns compressed data.  
  - Options might include resolution, quality, etc.  
- **Why**: Keeps the compression implementation self-contained, enabling easier swaps or updates to the library.

### `validators/fileValidator.ts`
- **Purpose**: Ensure the uploaded file is valid for compression.  
- **Behavior**:  
  1. Checks MIME type or file extension to confirm it’s an image.  
  2. Enforces size limits.  
  3. Throws an error or returns success.  
- **Why**: Consistently handle invalid inputs so the compression logic can assume a valid image.

### `tests/server.test.ts`
- **Purpose**: Server-side tests, verifying routes and compression logic.  
- **Behavior**:  
  1. Uses mock file data to test `POST /api/compress`.  
  2. Checks correct handling of invalid inputs.  
  3. Verifies correct response (compressed image buffer).  
- **Why**: Confirms that the server flow (validation -> compression -> response) works end-to-end.

---

## Client: Detailed Specification

### `index.ts`
- **Purpose**: Entry point that prompts the user or otherwise selects a file to compress.  
- **Behavior**:  
  1. Calls `uploadService.ts` to send the file.  
  2. Prints or saves the compressed result.  
- **Why**: Demonstrates how the client interacts with the server, clarifies usage.

### `services/uploadService.ts`
- **Purpose**: Manages sending files to the server endpoint.  
- **Behavior**:  
  1. Has a function `uploadImage(file: File | Buffer)` that uses an HTTP library or fetch to POST the file.  
  2. Returns a promise of the compressed data.  
- **Why**: Central place for network requests, easy to mock/test.

### `utils/fileHandling.ts`
- **Purpose**: Optional helper for file-based operations, e.g., converting images to base64 or reading from disk.  
- **Behavior**:  
  1. If needed, read local files from disk to create Buffers.  
  2. Convert or transform data as required before upload.  
- **Why**: Keeps any specialized file manipulation logic separate from the “upload” logic.

### `tests/client.test.ts`
- **Purpose**: Tests that the client properly sends files and handles server responses.  
- **Behavior**:  
  1. Mocks out the server to confirm the client calls the correct endpoint.  
  2. Verifies error handling if the server responds with invalid data.  
- **Why**: Ensures changes to the client do not break its interaction with the server.

---

## Development & Testing Approach
1. **Incremental Feature Addition**  
   - Start with a basic image upload + naive compression.  
   - Add size-limiting, advanced settings (quality, resolution) step by step.  
   - Each new feature is either TDD or “bundled” in small, coherent increments.

2. **Refactoring & Comments**  
   - Maintain short, well-focused methods (e.g., separate “validate” vs. “compress”).  
   - Document non-obvious design choices (e.g., “We store compressed images in memory because X” or “We prefer base64 uploads for ease of transport”).  

3. **Result**  
   - A robust compression service where each piece is clearly delineated and tested, avoiding confusion or duplication.

---

## Summary
This spec outlines a **Range Compression Service** that’s simple but scalable. The server handles incoming images (via clearly defined routes and controllers), uses a dedicated **imageCompressor** to reduce file size, and returns the compressed data. The client focuses on sending the file and dealing with the server’s response. Clear separation of concerns, thorough validation, and incremental testing underscore each part of the system.