<p align="center">
 <h1 align="center">Back-End for Aktivio Application</h1>
</p>

# Aktivio Backend

Aktivio Backend is a NodeJS application that serves as the backend for the Aktivio platform. It provides RESTful APIs for handling various functionalities related to communities, activities, and user interactions.

## Table of Contents

- [Getting Started](#getting-started)
- [Dependencies](#dependencies)
- [Scripts](#scripts)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

## Getting Started

To get started with the Aktivio Backend, follow these steps:

1. Clone the repository: `git clone https://github.com/your-repo/aktivio-backend.git`
2. Install the dependencies: `npm install`
3. Set up the required environment variables (e.g., Firebase credentials, Algolia credentials)
4. Start the development server: `npm run dev`

## Dependencies

The Aktivio Backend relies on the following major dependencies:

- `@google-cloud/firestore`: For interacting with Google Firestore database
- `@google-cloud/storage`: For handling file uploads and storage
- `algoliasearch`: For full-text search functionality
- `express`: Web application framework for Node.js
- `firebase-admin`: For server-side Firebase administration
- `multer`: For handling file uploads
- `uuid`: For generating unique identifiers

## Scripts

The following scripts are available:

- `npm start`: Starts the production server
- `npm run test`: Runs the test suite
- `npm run dev`: Starts the development server with hot reloading
- `npm run index:communities`: Indexes communities in the search engine

## API Documentation

The API documentation for the Aktivio Backend is available at [Swagger Site](https://capstone-entsh122.github.io/swagger-api-doc/#/). It provides detailed information about the available endpoints, request/response formats, and authentication requirements.

## Contributing

Contributions to the Aktivio Backend are welcome! If you find any issues or have suggestions for improvements, please create a new issue or submit a pull request.

When contributing, please follow the established coding conventions and ensure that your changes are thoroughly tested.

## License

The Aktivio Backend is licensed under the [ISC License](LICENSE).

---

<p align="center">
   <a href="https://github.com/capstone-entsh122">© ENTS-H122 | Aktivio</a>
</p>
