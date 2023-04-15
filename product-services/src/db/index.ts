import {
  DynamoDBClient,
  ScanCommand,
  PutItemCommand,
  QueryCommand,
} from "@aws-sdk/client-dynamodb";

import config from "./utils/config";

client = new DynamoDBClient(config);

export default function DB() {
  this.getAll = async (tableConfig) => {
    try {
      const command = new ScanCommand(tableConfig);
      return await client.send(command);
    } catch (error) {
      console.error(error)
      return error;
    }
  };
  this.getById = async (tableConfig) => {
    try {
      const command = new QueryCommand(tableConfig);
      return await client.send(command);
    } catch (error) {
      console.error(error)
      return error;
    }
  };
  this.create = async (tableConfig) => {
    try {
      const command = new PutItemCommand(tableConfig);
      return await client.send(command);
    } catch (error) {
      console.error(error)
      return error;
    }
  };
}
