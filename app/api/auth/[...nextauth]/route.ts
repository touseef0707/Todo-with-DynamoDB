import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { DynamoDBClient, GetItemCommand, PutItemCommand } from "@aws-sdk/client-dynamodb";

const dynamoDB = new DynamoDBClient({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});


export const authOptions: AuthOptions = { // Explicitly define type
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;

        const user = await dynamoDB.send(
          new GetItemCommand({
            TableName: process.env.AWS_DYNAMO_USERS_TABLE!,
            Key: { id: { S: credentials.username } },
          })
        );

        if (user.Item) return { id: credentials.username, name: credentials.username };

        // If user does not exist, create it
        await dynamoDB.send(
          new PutItemCommand({
            TableName: process.env.AWS_DYNAMO_USERS_TABLE!,
            Item: { id: { S: credentials.username } },
          })
        );

        return { id: credentials.username, name: credentials.username };
      },
    }),
  ],
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET!,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
