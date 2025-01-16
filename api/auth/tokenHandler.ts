
export type Usuario= {
  sub: string;
  realm_access: {
    roles: string[];
  };
  phone: string;
  name: string;
  given_name: string;
  family_name: string;
  email: string;
}

let usuario:Usuario|undefined = undefined;
