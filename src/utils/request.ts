import { URLS } from "../urls";
import { getAuth } from "firebase/auth";

export enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
}

type SerializableTypes = string | number;
type QueryParams = Record<string, SerializableTypes | SerializableTypes[]>;

type InternalRequest = {
  method: HttpMethod;
  body?: Record<string, unknown>;
  queryParams?: QueryParams;
};

class InternalRequestError {
  constructor(
    public status: number,
    public message: string,
    public rootError?: unknown
  ) {}
}

interface InternalResponse {
  success: boolean;
  data?: string;
  message?: string;
}

function serializeValue(value: SerializableTypes): string {
  if (typeof value == "string") {
    return value;
  }
  return value.toString();
}

function isInternalResponse(value: any): value is InternalResponse {
  return !!value && "success" in value;
}

function genQueryParamStr(queryParams: QueryParams): string {
  const queryParamString = new URLSearchParams(
    Object.fromEntries(
      Object.entries(queryParams).map(([key, value]) => {
        if (!Array.isArray(value)) {
          return [key, serializeValue(value)];
        }
        return [key, value.map(serializeValue).join(",")];
      })
    )
  ).toString();
  return queryParamString.length == 0 ? "" : `?${queryParamString}`;
}

export async function execInternalReq<T>(
  path: string,
  { method, body, queryParams = {} }: InternalRequest
): Promise<T> {
  const headers: Record<string, string> = {};
  if (getAuth().currentUser) {
    headers[
      "Authorization"
    ] = `Bearer ${await getAuth().currentUser?.getIdToken()}`;
  }

  const result = await fetch(
    URLS.api.base + path + genQueryParamStr(queryParams),
    {
      method,
      body: JSON.stringify(body),
      headers,
    }
  );

  let resBody;
  try {
    resBody = await result.json();
  } catch (error) {
    throw new InternalRequestError(
      result.status,
      `unknown error trying to deserialize body: ${error}`,
      error
    );
  }

  if (!isInternalResponse(resBody)) {
    throw new InternalRequestError(
      result.status,
      `response body of unknown format: ${resBody}`
    );
  }

  if (!resBody.success) {
    throw new InternalRequestError(
      result.status,
      resBody.message ?? "result has no message"
    );
  }

  return resBody.data as unknown as T;
}
