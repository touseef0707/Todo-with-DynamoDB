import { NextRequest, NextResponse } from "next/server";
import { DynamoDBClient, PutItemCommand, GetItemCommand, DeleteItemCommand, UpdateItemCommand, QueryCommand } from "@aws-sdk/client-dynamodb";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { randomUUID } from "crypto";

// Initialize DynamoDB client
const dynamoDB = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

/** 🔵 POST - Create a New Todo */
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { content } = await req.json();
  if (!content) return NextResponse.json({ error: "Content is required" }, { status: 400 });

  const todoId = randomUUID();
  const userId = session.user!.name!;

  // Save todo to DynamoDB
  await dynamoDB.send(
    new PutItemCommand({
      TableName: process.env.AWS_DYNAMO_TODOS_TABLE!,
      Item: {
        todoId: { S: todoId },
        userId: { S: userId },
        content: { S: content },
      },
    })
  );

  return NextResponse.json({ message: "Todo saved", todoId });
}

/** 🟢 GET - Fetch Todos */
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = session.user!.name!;

  // Query todos from DynamoDB
  const response = await dynamoDB.send(
    new QueryCommand({
      TableName: process.env.AWS_DYNAMO_TODOS_TABLE!,
      IndexName: "userId-index", // GSI for querying todos by user
      KeyConditionExpression: "userId = :userId",
      ExpressionAttributeValues: {
        ":userId": { S: userId },
      },
      ProjectionExpression: "todoId, content", // Return only required fields
    })
  );

  const todos = response.Items?.map((item) => ({
    todoId: item.todoId.S,
    content: item.content.S,
  }));

  return NextResponse.json(todos);
}

/** 🟡 PUT - Update a Todo */
export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { todoId, content } = await req.json();
  if (!todoId || !content) return NextResponse.json({ error: "Todo ID and content are required" }, { status: 400 });

  // Update todo in DynamoDB
  await dynamoDB.send(
    new UpdateItemCommand({
      TableName: process.env.AWS_DYNAMO_TODOS_TABLE!,
      Key: { todoId: { S: todoId } },
      UpdateExpression: "SET content = :content",
      ExpressionAttributeValues: { ":content": { S: content } },
    })
  );

  return NextResponse.json({ message: "Todo updated successfully" });
}

/** DELETE - Delete a Todo */
export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { todoId } = await req.json();
  if (!todoId) return NextResponse.json({ error: "Todo ID is required" }, { status: 400 });

  // Delete todo from DynamoDB
  await dynamoDB.send(
    new DeleteItemCommand({
      TableName: process.env.AWS_DYNAMO_TODOS_TABLE!,
      Key: { todoId: { S: todoId } },
    })
  );

  return NextResponse.json({ message: "Todo deleted successfully" });
}
