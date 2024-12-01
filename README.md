# Happy Camper

A comprehensive web application for campsite booking and management.

## Features

### For Campers
- Browse and search available campsites
- View campsite details, amenities, and availability
- Make reservations and manage bookings
- Write reviews and ratings
- User profile management

### For Campsite Owners
- Register and manage campsites
- Update availability and pricing
- View and manage bookings
- Custom CMS interface
- Business profile management

## Technology Stack

### Backend
- Python 3.11+
- Django 5.1.3
- Django REST Framework
- Django AllAuth for authentication
- PostgreSQL (production) / SQLite (development)

### Frontend
- React 18
- Material-UI
- Vite
- React Router DOM
- Axios for API calls

## Setup Instructions

1. Clone the repository
2. Create a virtual environment:
   ```bash
   python -m venv venv
   ```

3. Activate the virtual environment:
   - Windows:
     ```bash
     venv\Scripts\activate
     ```
   - Unix/MacOS:
     ```bash
     source venv/bin/activate
     ```

4. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

5. Install Node.js and npm (if not already installed):
   - Download from: https://nodejs.org/
   - Verify installation:
     ```bash
     node --version
     npm --version
     ```

6. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

7. Apply migrations:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

8. Create a superuser:
   ```bash
   python manage.py createsuperuser
   ```

9. Start the development servers:
   - Backend:
     ```bash
     python manage.py runserver
     ```
   - Frontend (in a new terminal):
     ```bash
     cd frontend
     npm run dev
     ```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Admin Interface: http://localhost:8000/admin

## Project Structure

```
happy-camper/
├── happy_camper_project/  # Main project directory
├── users/                 # Custom user management
├── campsites/            # Campsite management
├── bookings/             # Booking and review system
├── static/               # Static files
├── media/                # User-uploaded files
├── templates/            # HTML templates
├── frontend/             # Frontend code
└── requirements.txt      # Project dependencies
```

## API Endpoints (To be implemented)

### Authentication
- POST /api/auth/register/
- POST /api/auth/login/
- POST /api/auth/logout/

### Campsites
- GET /api/campsites/
- GET /api/campsites/{id}/
- POST /api/campsites/ (owner only)
- PUT /api/campsites/{id}/ (owner only)
- DELETE /api/campsites/{id}/ (owner only)

### Bookings
- GET /api/bookings/
- POST /api/bookings/
- GET /api/bookings/{id}/
- PUT /api/bookings/{id}/
- DELETE /api/bookings/{id}/

### Reviews
- GET /api/reviews/
- POST /api/reviews/
- GET /api/reviews/{id}/
- PUT /api/reviews/{id}/
- DELETE /api/reviews/{id}/

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
