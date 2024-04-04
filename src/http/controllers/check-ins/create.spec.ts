import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { app } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import { prisma } from "@/lib/prisma";

describe("Create Check-in (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to create a check-in", async () => {
    const { token } = await createAndAuthenticateUser(app);

    const { id: gymId } = await prisma.gym.create({
      data: {
        title: "Xablau",
        description: "Test Gym",
        phone: "99999999",
        latitude: -27.228752,
        longitude: -49.6401092,
      },
    });

    const response = await request(app.server)
      .post(`/gyms/${gymId}/check-ins`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        latitude: -27.228752,
        longitude: -49.6401092,
      });

    expect(response.statusCode).toEqual(201);
  });
});
