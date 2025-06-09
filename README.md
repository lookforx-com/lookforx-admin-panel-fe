# LookforX Admin Panel

This is the admin panel frontend for the LookforX platform, built with Next.js.

## Features

- User authentication (login, signup, password reset)
- Multi-language support (English, Turkish)
- Responsive design with Chakra UI
- Role-based access control
- Dashboard analytics
- User management
- Content management

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/)
- **UI Library**: [Chakra UI](https://chakra-ui.com/)
- **State Management**: React Context API
- **Authentication**: JWT
- **Internationalization**: Custom i18n implementation
- **API Client**: Axios
- **Icons**: React Icons

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/lookforx-admin-panel-fe.git
cd lookforx-admin-panel-fe
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory and add the following environment variables:

```
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
```

### Development

Start the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Build for Production

```bash
npm run build
# or
yarn build
```

### Start Production Server

```bash
npm run start
# or
yarn start
```

## Project Structure

```
├── app/                  # Next.js App Router
│   ├── [locale]/         # Locale-specific routes
│   ├── api/              # API routes
│   ├── dashboard/        # Dashboard pages
│   ├── login/            # Login page
│   ├── signup/           # Signup page
│   └── layout.tsx        # Root layout
├── components/           # Reusable components
├── context/              # React Context providers
├── lib/                  # Utility functions and libraries
├── locales/              # Translation files
│   ├── en.json           # English translations
│   └── tr.json           # Turkish translations
├── public/               # Static assets
└── styles/               # Global styles
```

## Internationalization

The application supports multiple languages. Currently, English and Turkish are implemented. To add a new language:

1. Create a new JSON file in the `locales` directory (e.g., `fr.json`)
2. Copy the structure from an existing language file and translate the values
3. Add the new language to the `LanguageSwitcher` component

## API Integration

The admin panel communicates with the LookforX backend services through a REST API. The base URL is configured in the `.env.local` file.

## Authentication

Authentication is handled using JWT tokens. The tokens are stored in cookies and automatically included in API requests.

## Deployment

The application can be deployed to Vercel or any other hosting platform that supports Next.js.

### Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is proprietary and confidential. Unauthorized copying, distribution, or use is strictly prohibited.

## Contact

For any questions or support, please contact the LookforX team.
