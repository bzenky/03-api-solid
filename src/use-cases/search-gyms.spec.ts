import { expect, describe, it, beforeEach } from "vitest";
import { SearchGymsUseCase } from "./search-gyms";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";

let gymsRepository: InMemoryGymsRepository;
let sut: SearchGymsUseCase;

describe("Fetch Check-in  Use Case", () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new SearchGymsUseCase(gymsRepository);
  });

  it("should be able to search a gym", async () => {
    await gymsRepository.create({
      title: "Xablau Gym",
      description: null,
      phone: null,
      latitude: -27.228752,
      longitude: -49.6401092,
    });

    await gymsRepository.create({
      title: "Javascripto Gym",
      description: null,
      phone: null,
      latitude: -27.228752,
      longitude: -49.6401092,
    });

    const { gyms } = await sut.handle({
      query: "Xablau",
      page: 1,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([expect.objectContaining({ title: "Xablau Gym" })]);
  });

  it("should be able to fetch paginate gym search", async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: `Xablau ${i}`,
        description: null,
        phone: null,
        latitude: -27.228752,
        longitude: -49.6401092,
      });
    }

    const { gyms } = await sut.handle({
      query: "Xablau",
      page: 2,
    });

    expect(gyms).toHaveLength(2);
    expect(gyms).toEqual([
      expect.objectContaining({ title: "Xablau 21" }),
      expect.objectContaining({ title: "Xablau 22" }),
    ]);
  });
});
