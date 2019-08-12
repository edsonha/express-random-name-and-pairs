const app = require("../src/app");
const request = require("supertest");
const NameHelper = require("../src/name-helper");
jest.mock("../src/name-helper");

const originalNames = ["apple", "banana", "orange", "pear"];

describe("App", () => {
  beforeEach(() => {
    NameHelper.names = Array.from(originalNames);
    NameHelper.getRandomName.mockReturnValue(Array.from(originalNames));
  });

  describe("GET /name", () => {
    it("GET /name should return the first randomisedName", async () => {
      const response = await request(app).get("/name");

      expect(response.statusCode).toBe(200);
      expect(response.text).toBe("1. apple");
    });

    it("GET /name should regenerate the name when the name list is exhausted", async () => {
      expect((await request(app).get("/name")).text).toBe("2. banana");
      expect((await request(app).get("/name")).text).toBe("3. orange");
      expect((await request(app).get("/name")).text).toBe("4. pear");
      expect((await request(app).get("/name")).text).toBe("1. apple");
    });
  });

  describe("GET /pairs", () => {
    it("GET /pairs should return a array of pairs", async () => {
      const response = await request(app).get("/pairs");
      const pairs = response.body;

      expect(response.statusCode).toBe(200);
      expect(pairs).toHaveLength(2);
      expect(pairs).toEqual([
        { first: "apple", second: "banana" },
        { first: "orange", second: "pear" }
      ]);
    });
  });

  describe("GET /names", () => {
    it("GET /names should return the list of names ", async () => {
      const response = await request(app).get("/names");
      expect(response.body).toEqual(originalNames);
    });
  });

  describe("POST /names", () => {
    it("POST /names should return 422 if name already exist", async () => {
      const response = await request(app)
        .post("/names")
        .set("Content-Type", "application/json")
        .send({ name: "apple" });

      expect(response.statusCode).toBe(422);
    });

    it("POST /names should return 400 if name is not passed in", async () => {
      const response = await request(app)
        .post("/names")
        .set("Content-Type", "application/json")
        .send({});

      expect(response.statusCode).toBe(400);
    });

    it("POST /names should return array with additional new name if valid name is passed", async () => {
      const response = await request(app)
        .post("/names")
        .set("Content-Type", "application/json")
        .send({ name: "Guava" });

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(Array.from(originalNames).concat("Guava"));
    });
  });

  describe("DELETE /names", () => {
    it("DELETE /names should return 422 if name does not exist", async () => {
      const response = await request(app)
        .delete("/names")
        .set("Content-Type", "application/json")
        .send({ name: "guava" });

      expect(response.statusCode).toBe(422);
    });

    it("DELETE /names should return 400 if name is not passed in", async () => {
      const response = await request(app)
        .delete("/names")
        .set("Content-Type", "application/json")
        .send({});

      expect(response.statusCode).toBe(400);
    });

    it("DELETE /names should delete the name from the array if valid name is passed", async () => {
      const response = await request(app)
        .delete("/names")
        .set("Content-Type", "application/json")
        .send({ name: "banana" });

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(["apple", "orange", "pear"]);
      expect(response.body).toHaveLength(3);
      expect(response.body).not.toContain("banana");
    });
  });

  describe("PUT /names", () => {
    it("PUT /names should return 422 if the old name does not exist", async () => {
      const response = await request(app)
        .put("/names")
        .set("Content-Type", "application/json")
        .send({ oldName: "guava", newName: "grape" });

      expect(response.statusCode).toBe(422);
    });

    it("should return 422 if the new name already exist", async () => {
      const response = await request(app)
        .put("/names")
        .set("Content-Type", "application/json")
        .send({ oldName: "banana", newName: "apple" });

      expect(response.statusCode).toBe(422);
    });

    it("should return 400 if name is not passed in", async () => {
      const response = await request(app)
        .put("/names")
        .set("Content-Type", "application/json")
        .send({});

      expect(response.statusCode).toBe(400);
    });

    it("should replace the old name with the new name if both inputs are valid", async () => {
      const response = await request(app)
        .put("/names")
        .set("Content-Type", "application/json")
        .send({ oldName: "banana", newName: "guava" });

      expect(response.statusCode).toBe(200);
      expect(response.body).toContain("guava");
      expect(response.body).toHaveLength(4);
      expect(response.body).not.toContain("banana");
    });
  });
});
