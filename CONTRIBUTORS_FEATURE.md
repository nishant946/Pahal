# Contributors Feature

This document outlines the Contributors feature implementation in the Pahal application.

## Overview

The Contributors feature allows administrators to manage and showcase team members, volunteers, and contributors who have helped build and maintain the Pahal platform. The feature includes both public-facing pages and admin management capabilities.

## Features

### 🔧 Admin Features
- **Add Contributors**: Create new contributor profiles with detailed information
- **Edit Contributors**: Update existing contributor information
- **Delete Contributors**: Remove contributors from the system
- **Toggle Status**: Activate/deactivate contributors without deleting
- **Order Management**: Set display order for contributors
- **Rich Profiles**: Support for images, social links, and detailed descriptions

### 👥 Public Features
- **Public Gallery**: View all active contributors in a beautiful card layout
- **Founder Highlighting**: Special sections for founders and initiators
- **Social Integration**: Links to LinkedIn, GitHub, personal websites, and email
- **Responsive Design**: Optimized for all device sizes
- **Loading States**: Smooth loading experience with proper error handling

## API Endpoints

### Public Endpoints
- `GET /api/v1/contributors` - Get all active contributors

### Admin Endpoints (Require Authentication)
- `GET /api/v1/contributors/admin/all` - Get all contributors (including inactive)
- `POST /api/v1/contributors` - Create new contributor
- `PUT /api/v1/contributors/:id` - Update contributor
- `DELETE /api/v1/contributors/:id` - Delete contributor
- `PATCH /api/v1/contributors/:id/toggle-status` - Toggle active status

## Data Model

### Contributor Schema
```javascript
{
  name: String (required),
  role: String (required),
  description: String (required),
  image: String (optional),
  linkedinUrl: String (optional),
  githubUrl: String (optional),
  websiteUrl: String (optional),
  email: String (optional),
  order: Number (default: 0),
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

## File Structure

### Frontend
```
client/src/
├── pages/
│   ├── contributors/
│   │   └── contributors.tsx          # Public contributors page
│   └── admin/
│       └── AdminContributors.tsx     # Admin management interface
└── services/
    └── contributorService.ts         # API service layer
```

### Backend
```
server/
├── models/
│   └── contributorModel.js          # MongoDB schema
├── controllers/
│   └── contributorController.js     # Business logic
├── routes/v1/
│   └── contributorRoutes.js         # API routes
└── scripts/
    ├── createSampleContributors.js  # Sample data creation
    └── testContributorsAPI.sh       # API testing script
```

## Usage

### For Administrators

1. **Access Admin Panel**: Navigate to `/admin/contributors`
2. **Add Contributors**: Click "Add Contributor" and fill in the form
3. **Manage Existing**: Use edit/delete buttons on contributor cards
4. **Toggle Status**: Use the Active/Inactive toggle to control visibility

### For Users

1. **View Contributors**: Navigate to `/contributors`
2. **Explore Profiles**: Click on social links to connect with contributors
3. **Learn About Team**: Read contributor descriptions and roles

## Setup Instructions

### 1. Database Setup
Run the sample data script to populate initial contributors:
```bash
cd server
node scripts/createSampleContributors.js
```

### 2. Test API Endpoints
Use the test script to verify API functionality:
```bash
cd server
chmod +x scripts/testContributorsAPI.sh
./scripts/testContributorsAPI.sh
```

### 3. Access the Feature
- Public page: `http://localhost:3000/contributors`
- Admin page: `http://localhost:3000/admin/contributors` (requires admin login)

## Security

- All admin endpoints require authentication
- Input validation on both frontend and backend
- XSS protection through proper HTML encoding
- CORS headers configured appropriately

## Customization

### Adding New Fields
1. Update the MongoDB schema in `contributorModel.js`
2. Update TypeScript interfaces in `contributorService.ts`
3. Add form fields in `AdminContributors.tsx`
4. Update display in `contributors.tsx`

### Styling
- Uses Tailwind CSS classes
- Responsive design patterns
- Consistent with overall Pahal design system
- Easy to customize colors and layouts

## Troubleshooting

### Common Issues

1. **Contributors not displaying**: Check if they are marked as active
2. **API errors**: Verify server is running and database is connected
3. **Permission errors**: Ensure user has admin privileges for management features
4. **Images not loading**: Verify image URLs are accessible and valid

### Debug Steps

1. Check browser console for JavaScript errors
2. Verify API responses in Network tab
3. Check server logs for backend errors
4. Validate database documents in MongoDB

## Future Enhancements

- Image upload functionality
- Bulk import/export
- Advanced filtering and search
- Contributor statistics and analytics
- Email notifications for new contributors
- Integration with external profile services