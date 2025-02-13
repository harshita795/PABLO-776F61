# PABLO

## Overview

PABLO is a JavaScript project designed to manage user data and images. It provides functionalities for creating new users, searching for images, saving images, adding tags to images, and displaying search history.

## Features

- **Create New User**: Allows for the creation of a new user with a username and email.
- **Search Images**: Enables users to search for images.
- **Save Images**: Allows users to save images.
- **Add Tags to Images**: Users can add tags to specific images.
- **Search Images by Tags**: Enables searching for images based on tags.
- **Display Search History**: Displays the search history of users.

## Getting Started

### Prerequisites

Before you begin, ensure you have met the following requirements:
- Node.js and npm are installed.
- Your operating system is Windows, Linux, or Mac.

### Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/harshita795/PABLO-776F61.git
    ```
2. Navigate to the project directory:
    ```sh
    cd PABLO-776F61
    ```
3. Install the dependencies:

    ```sh
    npm install
    ```

## Usage

To use this project, follow these steps:

1. Start the server:

    ```sh
    npm start
    ```
2. Use the following API endpoints:
    - `POST /api/users`: Create a new user
    - `GET /api/search/photos`: Search for images
    - `POST /api/photos`: Save images
    - `POST /api/photos/:photoId/tags`: Add tags to images
    - `GET /api/photos/tag/search`: Search images by tags
    - `GET /api/search-history`: Display search history

Example Command:
```sh
curl -X POST http://localhost:3000/api/users -d '{"username": "user1", "email": "user1@example.com"}'
