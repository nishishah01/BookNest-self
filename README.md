# BookNest 📚

**BookNest** is a full-stack web application designed for book enthusiasts. It provides a comprehensive platform that bridges the gap between e-commerce and community by allowing users to not only buy and rent books but also engage in discussions, share reviews, and post fan art.

## 🌟 Features

- **Rent or Buy Books:** Browse a collection of books and choose whether you want to rent them for a specific duration or buy them outright.
- **Community Posts:** Connect with other readers! Create posts, share reviews, and upload fan art to dedicated discussion pages.
- **Responsive & Dynamic UI:** Built with custom Vanilla CSS and React, featuring engaging components like the `RollingGallery`.
- **Secure Authentication:** Token-based authentication ensuring that your transactions and community posts are secure.
- **Robust API:** A well-structured RESTful API serving data seamlessly to the frontend.

## 🛠️ Tech Stack

**Frontend:**
- React.js
- Vanilla CSS (for maximum design flexibility and custom animations)

**Backend:**
- Django
- Django REST Framework (DRF)
- SQLite (Development) / PostgreSQL (Production)

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites
- Node.js (v14 or higher)
- Python (3.8 or higher)
- Git

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/nishishah01/BookNest-self.git
   cd BookNest-self
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   # Create a virtual environment
   python -m venv venv
   # Activate the virtual environment
   # Windows:
   venv\Scripts\activate
   # macOS/Linux:
   source venv/bin/activate
   
   # Install dependencies
   pip install -r requirements.txt
   
   # Run migrations
   python manage.py migrate
   
   # Start the development server
   python manage.py runserver
   ```

3. **Frontend Setup:**
   Open a new terminal window/tab:
   ```bash
   cd BookNest
   # Install dependencies
   npm install
   # Start the React development server
   npm run dev
   ```

4. **View the app:**
   Open your browser and navigate to `http://localhost:5173` (or the port specified by Vite/Create React App) to see the application running.

## 💡 Architecture & Workflow

- **Frontend:** React handles state management (like tracking the rent vs. buy form data) and makes asynchronous API calls using `fetch`/`axios` within `useEffect` hooks. Loading and fallback states ensure a smooth user experience.
- **Backend:** DRF securely authenticates users and serializes complex data models. For instance, when a user creates a community post, the backend automatically associates the authenticated user token with the post author, ensuring data integrity without exposing sensitive IDs to the client.

## 🤝 Contributing

Contributions are welcome! If you'd like to improve BookNest, please fork the repository and use a feature branch. Pull requests are warmly welcome.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
