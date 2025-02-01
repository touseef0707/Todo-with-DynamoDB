import { NextRequest, NextResponse } from "next/server";
import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";
import { Redis } from "@upstash/redis";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

// Initialize DynamoDB client
const dynamoDB = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

// Initialize Redis client
const redis = new Redis({
  url: process.env.REDIS_URL!,
  token: process.env.REDIS_TOKEN!,
});

/** 🟢 GET - Fetch Specific Note */
export async function GET(req: NextRequest, { params }: any) {
  const { noteId } = params; // Get noteId from URL params
  const session = await getServerSession(authOptions);
  console.log("fetching a single note from redis or dynamo")
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = session.user!.name!;

  // 🟢 Try fetching note from Redis cache first
  let note = await redis.get(`note:${userId}:${noteId}`);

  if (!note) {
    console.log("Note not found in Redis, fetching from DynamoDB...");

    // Fetch note from DynamoDB if not in Redis cache
    const result = await dynamoDB.send(
      new GetItemCommand({
        TableName: process.env.AWS_DYNAMO_NOTES_TABLE!,
        Key: {
          noteId: { S: noteId },
          userId: { S: userId },
        },
      })
    );
    console.log("result", result)
    if (!result.Item) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    note = {
      noteId: result.Item.noteId.S,
      content: result.Item.content.S,
    };

    // 🟢 Cache the note in Redis for 60 seconds
    await redis.set(`note:${userId}:${noteId}`, JSON.stringify(note), { ex: 60 });
  } else {
    console.log("Serving note from Redis cache...");
  }

  return NextResponse.json(note);
}
