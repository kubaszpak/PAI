import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { v4 as uuidv4 } from 'uuid';

export const submitVote = async (req: Request, res: Response) => {
  const { eventId, voterName, votes } = req.body;

  try {
    for (const vote of votes) {
      const dateEntry = await prisma.eventDate.findFirst({
        where: {
          eventId,
          date: new Date(vote.date),
        },
      });

      if (dateEntry) {
        await prisma.vote.create({
          data: {
            id: uuidv4(),
            voterName,
            response: vote.response,
            eventDateId: dateEntry.id,
          },
        });
      }
    }

    res.status(201).json({ message: 'Votes recorded' });
  } catch (error) {
    res.status(500).json({ error: 'Error saving votes' });
  }
};