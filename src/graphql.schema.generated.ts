/** ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export class LoginInput {
  email: string;
  password: string;
}

export class MonitoredEndpointInput {
  name: string;
  url: string;
  monitoredInterval: number;
  disabled?: boolean;
}

export class SignUpInput {
  username: string;
  email: string;
  password: string;
}

export class UpdateMonitoredEndpointInput {
  id: string;
  name?: string;
  url?: string;
  monitoredInterval?: number;
  disabled?: boolean;
}

export class AuthPayload {
  id: string;
  username: string;
  email: string;
  jwt: string;
}

export class MonitoredEndpoint {
  id: string;
  name: string;
  url: string;
  monitoredInterval: number;
  disabled: boolean;
  owner: User;
  monitoringResult: MonitoringResult[];
  createdAt: DateTime;
  updatedAt: DateTime;
  checkedAt?: DateTime;
}

export class MonitoringResult {
  id: string;
  statusCode: number;
  payload: string;
  monitoredEndpoint: MonitoredEndpoint;
  createdAt: DateTime;
  updatedAt: DateTime;
}

export abstract class IMutation {
  abstract signup(
    signUpInput?: SignUpInput,
  ): AuthPayload | Promise<AuthPayload>;

  abstract login(loginInput?: LoginInput): AuthPayload | Promise<AuthPayload>;

  abstract createMonitoredEndpoint(
    monitoredEndpointInput?: MonitoredEndpointInput,
  ): MonitoredEndpoint | Promise<MonitoredEndpoint>;

  abstract updateMonitoredEndpoint(
    updateMonitoredEndpointInput?: UpdateMonitoredEndpointInput,
  ): MonitoredEndpoint | Promise<MonitoredEndpoint>;
}

export abstract class IQuery {
  abstract monitoredEndpoint(
    id: string,
  ): MonitoredEndpoint | Promise<MonitoredEndpoint>;

  abstract monitoredEndpoints():
    | MonitoredEndpoint[]
    | Promise<MonitoredEndpoint[]>;

  abstract findMonitoredEndpoints(
    url: string,
  ): MonitoredEndpoint[] | Promise<MonitoredEndpoint[]>;
}

export class User {
  id: string;
  username: string;
  monitoredEndpoint: MonitoredEndpoint[];
}

export type DateTime = any;
