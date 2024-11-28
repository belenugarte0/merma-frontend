export interface ISimpleRole {
  id: number;
  name: string;
  status: number;
  permissions: {
    id: number;
    name: string;
    grupo: string;
    permission_id: number;
    role_id: number;
  }[];
}
