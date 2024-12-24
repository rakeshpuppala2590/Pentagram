# AI Image Generator

This project is an AI-powered image generation application that allows users to create stunning images from text prompts using advanced generative AI models. Built with modern web technologies and a scalable backend, this application enables users to interact with generated images through search, likes, comments, and sharing features.

---

## Features

### Backend (Powered by Modal)
- **Text-to-Image Generation**: Leverages Stable Diffusion XL for generating high-quality images from user prompts.
- **FastAPI Integration**: Provides robust endpoints for generating images and checking service health.
- **Scheduled Keep-Alive Functionality**: Ensures the backend service remains active with periodic health checks.
- **GPU Acceleration**: Optimized for fast image generation with GPU support (A10G).

### Frontend (React and Next.js)
- **Search Functionality**: Search for images by prompt.
- **Image Interaction**: Like, comment, and share images.
- **Responsive Design**: Fully responsive and visually appealing UI built with modern design principles.
- **Real-Time Updates**: Seamlessly integrates with backend for dynamic content updates.

---

## Tech Stack

### Backend
- **Modal**: For scalable and serverless infrastructure.
- **FastAPI**: API development and service health management.
- **PyTorch & Diffusers**: For leveraging Stable Diffusion XL.
- **Scheduler**: Keep-alive functionality using Modal's cron jobs.

### Frontend
- **React & Next.js**: Framework for a dynamic, interactive, and responsive user interface.
- **TailwindCSS**: For clean and modern styling.
- **Lucide-React**: For scalable, customizable icons.

### Other
- **Docker**: Containerized development and deployment.
- **Modal Secrets**: Securely managing environment variables and API keys.

---

## Installation and Setup

### Prerequisites
- Node.js and npm
- Python 3.8+
- Docker (optional but recommended for local development)
- Modal account

### Backend Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/ai-image-generator.git
   cd ai-image-generator/backend
   ```

2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up Modal secrets**:
   ```bash
   modal secret create custom-secret
   ```
   Add the `CLIENT_XT_BAR_1` key with the appropriate value.

4. **Run the backend**:
   ```bash
   modal run app.py
   ```

### Frontend Setup

1. **Navigate to the frontend directory**:
   ```bash
   cd ai-image-generator/frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. Open the application in your browser at `http://localhost:3000`.

---

## API Endpoints

### 1. Generate Image
- **Endpoint**: `POST /generate`
- **Description**: Generates an image from a text prompt.
- **Headers**: 
  - `X-API-KEY`: Your API key
- **Query Parameters**:
  - `prompt`: Text prompt to generate an image.
- **Response**: JPEG image.

### 2. Health Check
- **Endpoint**: `GET /health`
- **Description**: Returns the health status of the service.
- **Response**:
  ```json
  {
    "status": "healthy",
    "timestamp": "2024-12-23T12:00:00Z"
  }
  ```

---

## Usage

1. Open the frontend application.
2. Enter a descriptive text prompt in the input field and click **Generate**.
3. View the generated image in the gallery.
4. Interact with the image by liking, commenting, or sharing.

---

## Folder Structure

```plaintext
├── backend
│   ├── app.py               # Modal app definition
│   ├── requirements.txt     # Backend dependencies
│   └── Dockerfile           # Optional Dockerfile for backend
├── frontend
│   ├── pages
│   │   ├── index.js         # Main application entry point
│   ├── components
│   │   └── ImageGenerator   # Component for generating and interacting with images
│   ├── actions
│   │   └── generateImage.js # API calls to backend endpoints
│   └── styles
│       └── globals.css      # Global styles
├── README.md                # Project documentation
└── .env.example             # Example environment variables
```

---

## Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a new branch.
3. Make your changes and commit them.
4. Submit a pull request.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Contact

For any inquiries or feedback, feel free to reach out:
- Email: your-email@example.com
- GitHub: [your-username](https://github.com/your-username)
