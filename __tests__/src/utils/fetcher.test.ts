import fetcher from "../../../src/utils/fetcher";

// Mock global fetch
global.fetch = jest.fn();

describe("fetcher", () => {
  beforeEach(() => {
    // Limpiar todos los mocks antes de cada test
    jest.clearAllMocks();
  });

  afterEach(() => {
    // Restaurar fetch después de cada test
    (global.fetch as jest.Mock).mockRestore();
  });

  it("debe hacer fetch a la URL correcta", async () => {
    const mockResponse = { data: "test" };
    const mockJson = jest.fn().mockResolvedValue(mockResponse);

    (global.fetch as jest.Mock).mockResolvedValue({
      json: mockJson,
    });

    const url = "https://api.example.com/data";
    await fetcher(url);

    expect(global.fetch).toHaveBeenCalledWith(url);
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it("debe retornar el JSON parseado de la respuesta", async () => {
    const mockData = { id: 1, name: "Test Item" };
    const mockJson = jest.fn().mockResolvedValue(mockData);

    (global.fetch as jest.Mock).mockResolvedValue({
      json: mockJson,
    });

    const result = await fetcher("https://api.example.com/data");

    expect(result).toEqual(mockData);
    expect(mockJson).toHaveBeenCalledTimes(1);
  });

  it("debe manejar respuestas con datos primitivos", async () => {
    const mockData = "string response";
    const mockJson = jest.fn().mockResolvedValue(mockData);

    (global.fetch as jest.Mock).mockResolvedValue({
      json: mockJson,
    });

    const result = await fetcher("https://api.example.com/string");

    expect(result).toBe(mockData);
  });

  it("debe manejar respuestas con arrays", async () => {
    const mockData = [1, 2, 3, 4, 5];
    const mockJson = jest.fn().mockResolvedValue(mockData);

    (global.fetch as jest.Mock).mockResolvedValue({
      json: mockJson,
    });

    const result = await fetcher("https://api.example.com/array");

    expect(result).toEqual(mockData);
    expect(Array.isArray(result)).toBe(true);
  });

  it("debe manejar respuestas vacías", async () => {
    const mockData = null;
    const mockJson = jest.fn().mockResolvedValue(mockData);

    (global.fetch as jest.Mock).mockResolvedValue({
      json: mockJson,
    });

    const result = await fetcher("https://api.example.com/empty");

    expect(result).toBeNull();
  });

  it("debe propagar errores de fetch", async () => {
    const fetchError = new Error("Network error");
    (global.fetch as jest.Mock).mockRejectedValue(fetchError);

    await expect(fetcher("https://api.example.com/error")).rejects.toThrow(
      "Network error"
    );
  });

  it("debe propagar errores de JSON parsing", async () => {
    const jsonError = new Error("Invalid JSON");
    const mockJson = jest.fn().mockRejectedValue(jsonError);

    (global.fetch as jest.Mock).mockResolvedValue({
      json: mockJson,
    });

    await expect(
      fetcher("https://api.example.com/invalid-json")
    ).rejects.toThrow("Invalid JSON");
  });

  it("debe manejar URLs con parámetros de query", async () => {
    const mockResponse = { filtered: true };
    const mockJson = jest.fn().mockResolvedValue(mockResponse);

    (global.fetch as jest.Mock).mockResolvedValue({
      json: mockJson,
    });

    const url = "https://api.example.com/search?q=test&page=1";
    await fetcher(url);

    expect(global.fetch).toHaveBeenCalledWith(url);
  });

  it("debe manejar URLs con fragmentos", async () => {
    const mockResponse = { section: "header" };
    const mockJson = jest.fn().mockResolvedValue(mockResponse);

    (global.fetch as jest.Mock).mockResolvedValue({
      json: mockJson,
    });

    const url = "https://api.example.com/page#section";
    await fetcher(url);

    expect(global.fetch).toHaveBeenCalledWith(url);
  });

  it("debe manejar URLs relativas", async () => {
    const mockResponse = { relative: true };
    const mockJson = jest.fn().mockResolvedValue(mockResponse);

    (global.fetch as jest.Mock).mockResolvedValue({
      json: mockJson,
    });

    const url = "/api/data";
    await fetcher(url);

    expect(global.fetch).toHaveBeenCalledWith(url);
  });

  it("debe manejar múltiples llamadas consecutivas", async () => {
    const mockResponse1 = { id: 1 };
    const mockResponse2 = { id: 2 };
    const mockJson1 = jest.fn().mockResolvedValue(mockResponse1);
    const mockJson2 = jest.fn().mockResolvedValue(mockResponse2);

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({ json: mockJson1 })
      .mockResolvedValueOnce({ json: mockJson2 });

    const result1 = await fetcher("https://api.example.com/1");
    const result2 = await fetcher("https://api.example.com/2");

    expect(result1).toEqual(mockResponse1);
    expect(result2).toEqual(mockResponse2);
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  it("debe manejar respuestas con diferentes tipos de datos", async () => {
    const testCases = [
      { input: true, expected: true },
      { input: false, expected: false },
      { input: 0, expected: 0 },
      { input: 42, expected: 42 },
      { input: "", expected: "" },
      { input: "hello", expected: "hello" },
      { input: {}, expected: {} },
      {
        input: { nested: { value: "test" } },
        expected: { nested: { value: "test" } },
      },
    ];

    for (const testCase of testCases) {
      const mockJson = jest.fn().mockResolvedValue(testCase.input);
      (global.fetch as jest.Mock).mockResolvedValue({ json: mockJson });

      const result = await fetcher("https://api.example.com/test");
      expect(result).toEqual(testCase.expected);
    }
  });

  it("debe manejar respuestas con métodos HTTP personalizados", async () => {
    const mockResponse = { method: "POST" };
    const mockJson = jest.fn().mockResolvedValue(mockResponse);

    (global.fetch as jest.Mock).mockResolvedValue({
      json: mockJson,
    });

    // Aunque fetcher no acepta opciones, fetch global puede ser llamado con diferentes métodos
    // por otros componentes que usen esta función
    await fetcher("https://api.example.com/post");

    expect(global.fetch).toHaveBeenCalledWith("https://api.example.com/post");
  });
});
