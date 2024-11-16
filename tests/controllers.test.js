const { searchImages } = require("../controllers/searchImages.js");
const { searchPhotosByTag } = require("../controllers/searchPhotosByTag.js");
const axiosInstance = require("../lib/axios.lib.js");
const { photo, Sequelize } = require("../models");

jest.mock("../lib/axios.lib.js", () => ({
  get: jest.fn(),
}));

jest.mock("../models", () => ({
  searchHistory: {
    create: jest.fn(),
  },
  photo: {
    findAll: jest.fn(),
    findOne: jest.fn(),
  },
  Sequelize: {
    Op: {
      contains: jest.fn(),
    },
  },
}));

describe("Controllers Tests", () => {
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

    req = { query: { query: "nature" } };
    res = { json: jest.fn(), status: jest.fn(() => res) };

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
});
