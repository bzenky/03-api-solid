import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { app } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";

describe("Nearby Gym (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to find nearby gym", async () => {
    const { token } = await createAndAuthenticateUser(app, true);

    await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Near Gym",
        description: null,
        phone: null,
        latitude: -27.228752,
        longitude: -49.6401092,
      });

    await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Far Gym",
        description: null,
        phone: null,
        latitude: 28.0044581,
        longitude: -49.606944,
      });

    const response = await request(app.server)
      .get("/gyms/nearby")
      .set("Authorization", `Bearer ${token}`)
      .query({
        latitude: -27.228752,
        longitude: -49.6401092,
      })
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body.gyms).toHaveLength(1);
    expect(response.body.gyms).toEqual([
      expect.objectContaining({ title: "Near Gym" }),
    ]);
  });
});
