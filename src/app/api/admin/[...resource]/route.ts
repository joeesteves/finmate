export async function GET(
  request: Request,
  { params: { resource } }: { params: { resource: string } },
) {
  return Response.json([
    { id: "1", name: "Alice", resource },
    { id: "2", name: "John", resource },
  ]);
}
