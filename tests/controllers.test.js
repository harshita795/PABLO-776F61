const request = require("supertest");
let { app } = require("../index.js");
const axiosInstance = require("../lib/axios.lib.js");

const { user, searchHistory, photo, Sequelize } = require("../models");

const { searchImages } = require("../controllers/searchImages.js");
const { searchPhotosByTag } = require("../controllers/searchPhotosByTag.js");
const {
  displaySearchHistory,
} = require("../controllers/displaySearchHistory.js");
const { saveImages } = require("../controllers/saveImages.js");
const createNewUser = require("../controllers/createNewUser.js");
const { addTagsByPhotoId } = require("../controllers/addTagsByPhotoId.js");

jest.mock("../lib/axios.lib.js", () => ({
  get: jest.fn(),
}));

jest.mock("../models", () => ({
  sequelize: {
    authenticate: jest.fn(() => Promise.resolve()),
    sync: jest.fn(() => Promise.resolve()),
    close: jest.fn(() => Promise.resolve()),
  },
  searchHistory: {
    create: jest.fn(),
    findAll: jest.fn(),
  },
  user: {
    create: jest.fn(),
    findOne: jest.fn(),
  },
  photo: {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    findByPk: jest.fn(),
    save: jest.fn(),
  },
  Sequelize: {
    Op: {
      contains: jest.fn(),
    },
  },
}));

describe("Controllers Tests ( Unit Testing )", () => {
  test("should create the new user", async () => {
    const mockResponse = {
      username: "newUser",
      email: "newuser@example.com",
    };

    user.create.mockResolvedValue(mockResponse);

    const req = { body: { username: "newUser", email: "newuser@example.com" } };
    const res = { json: jest.fn(), status: jest.fn(() => res) };

    await createNewUser(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "User Created",
      user: mockResponse,
    });
  });

  test("should search the images", async () => {
    const mockResponse = {
      data: {
        results: [
          {
            urls: { regular: "https://images.unsplash.com/photo-1" },
            description: "A beautiful landscape",
            alt_description: "Mountain view",
          },
        ],
      },
    };

    axiosInstance.get.mockResolvedValue(mockResponse);

    const req = { query: { query: "nature" } };
    const res = { json: jest.fn(), status: jest.fn(() => res) };

    await searchImages(req, res);

    expect(axiosInstance.get).toHaveBeenCalledWith(
      `/search/photos?query=nature`
    );
    expect(res.json).toHaveBeenCalledWith({
      photos: [
        {
          imageUrl: "https://images.unsplash.com/photo-1",
          description: "A beautiful landscape",
          altDescription: "Mountain view",
        },
      ],
    });
  });

  test("should save the images into collection", async () => {
    const mockResponse = {
      imageUrl: "<https://images.unsplash.com/photo->...",
      description: "Beautiful landscape",
      altDescription: "Mountain view",
      tags: ["nature", "mountain"],
      userId: 1,
    };

    photo.create.mockResolvedValue(mockResponse);

    const req = {
      body: {
        imageUrl: "<https://images.unsplash.com/photo->...",
        description: "Beautiful landscape",
        altDescription: "Mountain view",
        tags: ["nature", "mountain"],
        userId: 1,
      },
    };
    const res = { json: jest.fn(), status: jest.fn(() => res) };

    await saveImages(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "Photo saved successfully",
      Images: mockResponse,
    });
  });

  test("should add tags to photos", async () => {
    const mockResponse = { tags: ["nature", "mountain"], save: jest.fn() };
    photo.findByPk.mockResolvedValue(mockResponse);

    const req = {
      params: { photoId: "1" },
      body: { tags: ["sunset", "beach"] },
    };
    const res = {
      json: jest.fn(),
      status: jest.fn(() => res),
    };

    await addTagsByPhotoId(req, res);

    expect(mockResponse.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "Tags added successfully.",
      Tags: ["nature", "mountain", "sunset", "beach"],
    });
  });

  test("should return all photos based on query", async () => {
    const mockFindOneResponse = {
      imageUrl: "https://images.unsplash.com/photo-1",
      description: "Mountain view",
      dateSaved: "2024-01-01T12:00:00Z",
      tags: ["nature", "mountain"],
    };

    const mockFindAllResponse = [
      {
        imageUrl: "https://images.unsplash.com/photo-1",
        description: "Mountain view",
        dateSaved: "2024-01-01T12:00:00Z",
        tags: ["nature", "mountain"],
      },
    ];

    photo.findOne.mockResolvedValue(mockFindOneResponse);
    photo.findAll.mockResolvedValue(mockFindAllResponse);

    const req = { query: { tags: "mountain", sort: "ASC", userId: "1" } };
    const res = { json: jest.fn(), status: jest.fn(() => res) };

    await searchPhotosByTag(req, res);

    expect(photo.findOne).toHaveBeenCalledWith({
      where: {
        tags: { [Sequelize.Op.contains]: ["mountain"] },
      },
    });

    expect(photo.findAll).toHaveBeenCalledWith({
      where: {
        tags: { [Sequelize.Op.contains]: ["mountain"] },
      },
      order: [["dateSaved", "ASC"]],
    });

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      allPhotos: mockFindAllResponse.map((photo) => ({
        imageUrl: photo.imageUrl,
        description: photo.description,
        dateSaved: photo.dateSaved,
        tags: photo.tags,
      })),
    });
  });

  test("should display the serach history", async () => {
    const mockResponse = [
      {
        query: "mountains",
        timestamp: "2024-01-01T12:00:00Z",
      },

      {
        query: "nature",
        timestamp: "2024-01-05T08:00:00Z",
      },
    ];

    searchHistory.findAll.mockResolvedValue(mockResponse);

    const req = { query: { userId: "1" } };
    const res = { json: jest.fn(), status: jest.fn(() => res) };

    await displaySearchHistory(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ searchHistory: mockResponse });
  });
});

describe("Endpoints Tests (Integration Testing )", () => {
  test("POST /api/users/ should create new customer", async () => {
    const mockResponse = {
      username: "newUser",
      email: "newuser@example.com",
    };

    user.create.mockResolvedValue(mockResponse);

    const response = await request(app).post("/api/users/").send({
      username: "newUser",
      email: "newuser@example.com",
    });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      message: "User Created",
      user: mockResponse,
    });
  });

  test("GET /api/search/photos/ should search the images", async () => {
    const mockResponse = {
      data: {
        results: [
          {
            urls: { regular: "https://images.unsplash.com/photo-1" },
            description: "A beautiful landscape",
            alt_description: "Mountain view",
          },
        ],
      },
    };

    axiosInstance.get.mockResolvedValue(mockResponse);

    const response = await request(app)
      .get("/api/search/photos")
      .query({ query: "nature" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      photos: [
        {
          imageUrl: "https://images.unsplash.com/photo-1",
          description: "A beautiful landscape",
          altDescription: "Mountain view",
        },
      ],
    });
  });

  test("POST /api/photos/ should save the images into the collection", async () => {
    const mockResponse = {
      imageUrl: "<https://images.unsplash.com/photo->...",
      description: "Beautiful landscape",
      altDescription: "Mountain view",
      tags: ["nature", "mountain"],
      userId: 1,
    };

    photo.create.mockResolvedValue(mockResponse);

    const response = await request(app)
      .post("/api/photos")
      .send({
        imageUrl: "<https://images.unsplash.com/photo->...",
        description: "Beautiful landscape",
        altDescription: "Mountain view",
        tags: ["nature", "mountain"],
        userId: 1,
      });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      message: "Photo saved successfully",
      Images: mockResponse,
    });
  });

  test("POST /api/photos/:photoId/tags/ should add tags to photos", async () => {
    const mockResponse = { tags: ["nature", "mountain"], save: jest.fn() };

    photo.findByPk.mockResolvedValue(mockResponse);

    const response = await request(app)
      .post("/api/photos/1/tags")
      .send({
        tags: ["sunset", "beach"],
      });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      message: "Tags added successfully.",
      Tags: ["nature", "mountain", "sunset", "beach"],
    });
  });

  test("GET /api/photos/tag/search/ should return all photos based on query", async () => {
    const mockFindOneResponse = {
      imageUrl: "https://images.unsplash.com/photo-1",
      description: "Mountain view",
      dateSaved: "2024-01-01T12:00:00Z",
      tags: ["nature", "mountain"],
    };

    const mockFindAllResponse = [
      {
        imageUrl: "https://images.unsplash.com/photo-1",
        description: "Mountain view",
        dateSaved: "2024-01-01T12:00:00Z",
        tags: ["nature", "mountain"],
      },
    ];

    photo.findOne.mockResolvedValue(mockFindOneResponse);
    photo.findAll.mockResolvedValue(mockFindAllResponse);

    const response = await request(app)
      .get("/api/photos/tag/search")
      .query({ tags: "mountain", sort: "ASC", userId: "1" });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      allPhotos: mockFindAllResponse.map((photo) => ({
        imageUrl: photo.imageUrl,
        description: photo.description,
        dateSaved: photo.dateSaved,
        tags: photo.tags,
      })),
    });
  });

  test("GET /api/search-history/ should display the serach history", async () => {
    const mockResponse = [
      {
        query: "mountains",
        timestamp: "2024-01-01T12:00:00Z",
      },

      {
        query: "nature",
        timestamp: "2024-01-05T08:00:00Z",
      },
    ];

    searchHistory.findAll.mockResolvedValue(mockResponse);

    const response = await request(app)
      .get("/api/search-history")
      .query({ userId: "1" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ searchHistory: mockResponse });
  });
});
