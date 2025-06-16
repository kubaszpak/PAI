import { Request, Response } from "express";
import prisma from "../utils/prisma";
import { v4 as uuidv4 } from "uuid";

export const createEvent = async (req: Request, res: Response) => {
  const { name, description, createdBy, imageUrl, dates } = req.body;

  try {
    const eventId = uuidv4();
    const event = await prisma.event.create({
      data: {
        id: eventId,
        name,
        description,
        createdBy,
        imageUrl,
        dates: {
          create: dates.map((date: string) => ({
            id: uuidv4(),
            date: new Date(date),
          })),
        },
      },
    });

    res.status(201).json({ eventId: event.id });
  } catch (error) {
    res.status(500).json({ error: "Could not create event" });
  }
};

export const getEventById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        dates: {
          include: {
            votes: true,
          },
        },
      },
    });

    if (!event) {
      return void res.status(404).json({ error: "Event not found" });
    }

    res.json(event);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving event" });
  }
};
