import { expect, describe, it, beforeEach, vi, afterEach } from "vitest";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { CheckInUseCase } from "./check-in";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { MaxNumberOfCheckInsError } from "./errors/max-number-of-check-ins-error";
import { MaxDistanceError } from "./errors/max-distance-error";

let checkInsRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: CheckInUseCase;

describe("Check-in Use Case", () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository();
    gymsRepository = new InMemoryGymsRepository();
    sut = new CheckInUseCase(checkInsRepository, gymsRepository);

    await gymsRepository.create({
      id: "gym-01",
      title: "Gym 01",
      description: "Gym 01 description",
      phone: "9999999",
      latitude: -27.228752,
      longitude: -49.6401092,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be able to check in", async () => {
    const { checkIn } = await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: -27.228752,
      userLongitude: -49.6401092,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("should not be able to check in twice in the same day", async () => {
    vi.setSystemTime(new Date(2022, 0, 10, 8, 0, 0));

    await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: -27.228752,
      userLongitude: -49.6401092,
    });

    await expect(() =>
      sut.execute({
        gymId: "gym-01",
        userId: "user-01",
        userLatitude: -27.228752,
        userLongitude: -49.6401092,
      })
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError);
  });

  it("should be able to check in twice but in different day", async () => {
    vi.setSystemTime(new Date(2022, 0, 10, 8, 0, 0));

    await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: -27.228752,
      userLongitude: -49.6401092,
    });

    vi.setSystemTime(new Date(2022, 0, 11, 8, 0, 0));

    const { checkIn } = await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: -27.228752,
      userLongitude: -49.6401092,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("should not be able to check in on distant gym", async () => {
    await gymsRepository.create({
      id: "gym-02",
      title: "Gym 02",
      description: "Gym 02 description",
      phone: "9999999",
      latitude: -28.0126574,
      longitude: -49.5877779,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    expect(async () => {
      await sut.execute({
        gymId: "gym-02",
        userId: "user-02",
        userLatitude: -27.228752,
        userLongitude: -49.6401092,
      });
    }).rejects.toBeInstanceOf(MaxDistanceError);
  });
});
