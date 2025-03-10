import { Request, Response } from 'express';
export async function notFoundRoute(
  req: Request,
  res: Response
): Promise<void> {
  res.status(404).send('API route not found');
}
