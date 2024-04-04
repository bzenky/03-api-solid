import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { app } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import { prisma } from "@/lib/prisma";

describe("List Check-in History (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to get check-in history", async () => {
    const { token } = await createAndAuthenticateUser(app);

    const user = await prisma.user.findFirstOrThrow();

    const { id: gymId } = await prisma.gym.create({
      data: {
        title: "Xablau",
        description: "Test Gym",
        phone: "99999999",
        latitude: -27.228752,
        longitude: -49.6401092,
      },
    });

    await prisma.checkIn.createMany({
      data: [
        {
          gym_id: gymId,
          user_id: user.id,
        },
        {
          gym_id: gymId,
          user_id: user.id,
        },
      ],
    });

    const response = await request(app.server)
      .get("/check-ins/history")
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body.checkIns).toEqual([
      expect.objectContaining({
        gym_id: gymId,
        user_id: user.id,
      }),
      expect.objectContaining({
        gym_id: gymId,
        user_id: user.id,
      }),
    ]);
  });
});
