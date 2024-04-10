import { expect, describe, it, beforeEach } from "vitest";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { FetchNearbyGymsUseCase } from "./fetch-nearby-gyms";

let gymsRepository: InMemoryGymsRepository;
let sut: FetchNearbyGymsUseCase;

describe("Fetch Check-in  Use Case", () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new FetchNearbyGymsUseCase(gymsRepository);
  });

  it("should be able to fetch nearby gyms", async () => {
    await gymsRepository.create({
      title: "Near Gym",
      description: null,
      phone: null,
      latitude: -27.228752,
      longitude: -49.6401092,
    });

    await gymsRepository.create({
      title: "Far Gym",
      description: null,
      phone: null,
      latitude: 28.0044581,
      longitude: -49.606944,
    });

    const { gyms } = await sut.handle({
      latitude: -27.228752,
      longitude: -49.6401092,
    });

    expect(gyms).toHaveLength(1);
  });
});
